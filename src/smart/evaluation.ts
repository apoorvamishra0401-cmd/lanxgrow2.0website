/** LANX-03 evaluation boundary for development integration.
 * Does not import secrets, call an API, persist content or assign simulated scores.
 * A trusted server must resolve task/version and authorize the provider separately.
 */
export type EvaluationKind = 'writing' | 'guest_introduction' | 'interview_10m' | 'assessment_20m';
export type EvaluationRequest = {
  submissionId: string;
  kind: EvaluationKind;
  answer: string;
  context: { taskId: string; promptVersion: string; question: string };
};
export type Score = { value: number; max: number; rubric: string; source: 'verified_provider'; model: string; promptVersion: string };
export type EvaluationResult =
  | { status: 'evaluated'; submissionId: string; evidence: 'provider'; feedback: string[]; score: Score | null }
  | { status: 'insufficient' | 'invalid' | 'unavailable' | 'timeout' | 'failed'; submissionId: string; evidence: 'none'; feedback: string[]; score: null };
export type ProviderClient = (text: string, context: EvaluationRequest['context']) => Promise<unknown>;
const kinds: readonly string[] = ['writing', 'guest_introduction', 'interview_10m', 'assessment_20m'];
const safeId = (s: unknown): s is string => typeof s === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,119}$/.test(s);
const safeText = (s: unknown, max: number): s is string => typeof s === 'string' && s.length <= max && !/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u.test(s);
export function validateEvaluationRequest(value: unknown): value is EvaluationRequest {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  if (!safeId(v.submissionId) || !kinds.includes(String(v.kind)) || !safeText(v.answer, 16000)) return false;
  if (!v.context || typeof v.context !== 'object' || Array.isArray(v.context)) return false;
  const c = v.context as Record<string, unknown>;
  return safeId(c.taskId) && safeId(c.promptVersion) && safeText(c.question, 2000) && Boolean(c.question.trim());
}
function outcome(status: Exclude<EvaluationResult['status'], 'evaluated'>, id: string, message: string): EvaluationResult {
  return { status, submissionId: id, evidence: 'none', feedback: [message], score: null };
}
function parseProviderResponse(raw: unknown, id: string, promptVersion: string): EvaluationResult {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('invalid_provider_response');
  const value = raw as Record<string, unknown>;
  if (value.status !== 'evaluated' || !Array.isArray(value.feedback) || value.feedback.length < 1 || value.feedback.length > 8 ||
      !value.feedback.every(x => safeText(x, 500) && x.trim())) throw new Error('invalid_provider_response');
  let score: Score | null = null;
  if (value.score !== undefined && value.score !== null) {
    const s = value.score as Record<string, unknown>;
    if (!s || typeof s !== 'object' || Array.isArray(s) || typeof s.value !== 'number' || typeof s.max !== 'number' ||
      !Number.isFinite(s.value) || !Number.isFinite(s.max) || s.max <= 0 || s.value < 0 || s.value > s.max ||
      !safeId(s.rubric) || s.source !== 'verified_provider' || !safeId(s.model) || s.promptVersion !== promptVersion) {
      throw new Error('invalid_provider_score');
    }
    score = { value: s.value, max: s.max, rubric: s.rubric, source: 'verified_provider', model: s.model, promptVersion };
  }
  return { status: 'evaluated', submissionId: id, evidence: 'provider', feedback: value.feedback as string[], score };
}
/** Preserves the pinned callable shape: provider(text, context). No implicit second provider. */
export async function evaluateSubmission(
  value: unknown,
  provider?: ProviderClient,
  options: { timeoutMs?: number; signal?: AbortSignal } = {},
): Promise<EvaluationResult> {
  const id = value && typeof value === 'object' && safeId((value as Record<string, unknown>).submissionId)
    ? (value as { submissionId: string }).submissionId : 'invalid';
  if (!validateEvaluationRequest(value)) return outcome('invalid', id, 'Submission details are invalid. Please review and try again.');
  if (value.answer.trim().split(/\s+/u).filter(Boolean).length < 10) {
    return outcome('insufficient', id, 'Add more detail and an example before requesting evaluation.');
  }
  if (!provider) return outcome('unavailable', id, 'AI evaluation is not connected in this development preview.');
  const timeoutMs = options.timeoutMs ?? 12000;
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0 || timeoutMs > 60000) return outcome('invalid', id, 'Evaluation timeout configuration is invalid.');
  if (options.signal?.aborted) return outcome('failed', id, 'Evaluation was cancelled.');
  let timer: ReturnType<typeof setTimeout> | undefined;
  let abortListener: (() => void) | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('evaluation_timeout')), timeoutMs);
    if (options.signal) {
      abortListener = () => reject(new Error('evaluation_cancelled'));
      options.signal.addEventListener('abort', abortListener, { once: true });
    }
  });
  try {
    // Rejected/cancelled provider requests may still complete remotely: no readback or score is fabricated.
    const raw = await Promise.race([Promise.resolve().then(() => provider(value.answer, value.context)), timeout]);
    return parseProviderResponse(raw, id, value.context.promptVersion);
  } catch (error) {
    if (error instanceof Error && error.message === 'evaluation_timeout') return outcome('timeout', id, 'Evaluation timed out. No score was generated.');
    if (error instanceof Error && error.message === 'evaluation_cancelled') return outcome('failed', id, 'Evaluation was cancelled.');
    return outcome('failed', id, 'Evaluation could not be completed. No score was generated.');
  } finally {
    if (timer) clearTimeout(timer);
    if (options.signal && abortListener) options.signal.removeEventListener('abort', abortListener);
  }
}
/** Maps verified responses to report data; never turns demo milestones into AI scores. */
export function toEvaluationReport(result: EvaluationResult) {
  return { submissionId: result.submissionId, status: result.status, feedback: result.feedback,
    score: result.status === 'evaluated' ? result.score : null,
    provenance: result.status === 'evaluated' ? 'provider' as const : 'none' as const,
    durable: false as const };
}
