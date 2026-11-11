/** LANX-02 client/server boundary; server decides identity, audience and entitlements. */
export type CareerAudience = 'fresher' | 'professional';
export type JourneyKind = 'video-interview' | 'skills-assessment';
export type Question = { id: string; prompt: string; format: 'video' | 'text' | 'choice'; choices?: string[] };
export type Receipt = { id: string; status: 'queued' | 'processing' | 'complete' | 'failed'; reportId?: string; error?: string };
export type Attempt = {
  id: string;
  ownerId: string;
  kind: JourneyKind;
  audience: CareerAudience;
  startedAt: string;
  deadlineAt: string;
  questions: Question[];
  answers: Record<string, string>;
  status: 'active' | 'submitted' | 'expired';
  receipt?: Receipt;
};
export type VerifiedCareerReport = {
  id: string;
  status: 'complete';
  feedback: unknown;
  updatedAt: string;
};
export type VerifiedCareerAccess = { userId: string; audience: CareerAudience; allowed: boolean };
/** Methods must call authenticated trusted endpoints; no local-only implementation is accepted. */
export interface CareerTransport {
  authorize(): Promise<VerifiedCareerAccess>;
  start(kind: JourneyKind, idempotencyKey: string): Promise<Attempt>;
  recover(attemptId: string): Promise<Attempt>;
  saveAnswer(attemptId: string, questionId: string, value: string): Promise<Attempt>;
  submit(attemptId: string, idempotencyKey: string, video?: Blob): Promise<Receipt>;
  readReceipt(receiptId: string): Promise<Receipt>;
  readReport?(reportId: string): Promise<VerifiedCareerReport>;
}
export const DURATION_MS: Record<JourneyKind, number> = {
  'video-interview': 10 * 60_000,
  'skills-assessment': 20 * 60_000,
};
export function remainingMs(deadlineAt: string, now: number = Date.now()): number {
  const end = Date.parse(deadlineAt);
  if (!Number.isFinite(end)) throw new Error('Invalid server deadline');
  return Math.max(0, end - now);
}
export function formatRemaining(milliseconds: number): string {
  const s = Math.ceil(Math.max(0, milliseconds) / 1000);
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
}
export function assertAttempt(access: VerifiedCareerAccess, attempt: Attempt, expectedKind: JourneyKind): void {
  if (!access.allowed || access.audience === undefined || !access.userId) throw new Error('Career access denied');
  if (attempt.ownerId !== access.userId || attempt.audience !== access.audience || attempt.kind !== expectedKind) {
    throw new Error('Attempt does not belong to this authenticated career journey');
  }
  if (!attempt.id || !Number.isFinite(Date.parse(attempt.startedAt))) throw new Error('Invalid attempt');
  const duration = Date.parse(attempt.deadlineAt) - Date.parse(attempt.startedAt);
  if (!Number.isFinite(duration) || duration <= 0 || duration > DURATION_MS[expectedKind]) {
    throw new Error('Invalid attempt time window');
  }
  if (!Array.isArray(attempt.questions) || attempt.questions.length === 0) throw new Error('No assigned questions');
  if (!attempt.answers || typeof attempt.answers !== 'object') throw new Error('Invalid answer payload');
}
export function completionState(attempt: Attempt, now: number): 'active' | 'expired' | 'submitted' {
  if (attempt.status === 'submitted' || attempt.receipt) return 'submitted';
  return remainingMs(attempt.deadlineAt, now) === 0 ? 'expired' : 'active';
}
/** Stable across refreshes; server must independently deduplicate keys per authenticated owner. */
export function submissionKey(attemptId: string): string {
  if (!/^[\w-]{8,128}$/.test(attemptId)) throw new Error('Invalid attempt identifier');
  return `lanx02-submit:${attemptId}`;
}
/** Metadata only: never persist sensitive interview answers or raw media in localStorage. */
export function resumeKey(ownerId: string, kind: JourneyKind): string {
  if (!/^[\w-]{8,128}$/.test(ownerId)) throw new Error('Invalid owner identifier');
  return `lanx02-attempt:${ownerId}:${kind}`;
}
