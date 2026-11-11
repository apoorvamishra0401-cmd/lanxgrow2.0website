import type { Attempt, CareerTransport, JourneyKind, Receipt, VerifiedCareerAccess } from './lifecycle';

export type CareerHttpConfig = {
  /** Trusted, explicitly configured backend; never silently default to the live site. */
  baseUrl: string;
  /** LANX-00 provides the existing authenticated session access token. */
  getAccessToken: () => Promise<string | null>;
  fetchImpl?: typeof fetch;
};

/**
 * Proposed LANX-02 HTTP adapter; routes must be approved/implemented by LANX-00.
 * No schema, auth policy or evaluator implementation is bundled here.
 */
export function createHttpCareerTransport(config: CareerHttpConfig): CareerTransport {
  const base = new URL(config.baseUrl);
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(base.hostname);
  if (base.protocol !== 'https:' && !(local && base.protocol === 'http:')) {
    throw new Error('Career backend must use HTTPS (or explicit localhost development).');
  }
  const prefix = base.pathname.endsWith('/') ? base.pathname : base.pathname + '/';
  const fetcher = config.fetchImpl ?? fetch;
  async function call<T>(method: string, endpoint: string, body?: unknown, key?: string): Promise<T> {
    const token = await config.getAccessToken();
    if (!token) throw new Error('Authenticated session token missing');
    const url = new URL(prefix + 'career/' + endpoint, base);
    const multipart = typeof FormData !== 'undefined' && body instanceof FormData;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    };
    if (body !== undefined && !multipart) headers['Content-Type'] = 'application/json';
    if (key) headers['Idempotency-Key'] = key;
    const response = await fetcher(url.toString(), {
      method,
      headers,
      body: body === undefined ? undefined : multipart ? body as FormData : JSON.stringify(body),
      credentials: 'omit',
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) throw new Error('Career service denied this session or attempt');
      throw new Error(`Career service HTTP ${response.status}`);
    }
    return await response.json() as T;
  }
  const path = (value: string): string => {
    if (!/^[a-zA-Z0-9_-]{8,128}$/.test(value)) throw new Error('Invalid resource identifier');
    return encodeURIComponent(value);
  };
  return {
    authorize: () => call<VerifiedCareerAccess>('GET', 'access'),
    start: (kind: JourneyKind, key: string) => call<Attempt>('POST', 'attempts', { kind }, key),
    recover: (attemptId: string) => call<Attempt>('GET', `attempts/${path(attemptId)}`),
    saveAnswer: (attemptId: string, questionId: string, value: string) =>
      call<Attempt>('PUT', `attempts/${path(attemptId)}/answers/${path(questionId)}`, {value}),
    submit: (attemptId: string, key: string, video?: Blob) => {
      const body = new FormData();
      body.set('attemptId', attemptId);
      if (video) {
        const extension = video.type.includes('mp4') ? 'mp4' : 'webm';
        body.set('recording', video, `interview.${extension}`);
      }
      return call<Receipt>('POST', `attempts/${path(attemptId)}/submission`, body, key);
    },
    readReceipt: (receiptId: string) => call<Receipt>('GET', `receipts/${path(receiptId)}`),
  };
}
