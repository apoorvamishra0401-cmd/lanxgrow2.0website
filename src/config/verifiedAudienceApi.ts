import { isLearnerAudience } from './audienceCapabilities';
import type { LearnerAudience } from './audienceCapabilities';

/**
 * This is not an authorization mechanism. It reads the authenticated,
 * consent-gated learner assignment from the development Career API.
 * The server, not the URL or browser storage, decides the learner audience.
 */
export type VerifiedAudienceResult =
  | { status: 'assigned'; audience: LearnerAudience }
  | { status: 'unassigned' }
  | { status: 'consent-required' }
  | { status: 'sign-in-required' }
  | { status: 'unavailable' };

const DEV_CAREER_HOST = 'kzjvvwuyigiclryoqpkv.supabase.co';

export function parseVerifiedAudience(response: unknown): VerifiedAudienceResult {
  if (!response || typeof response !== 'object' || Array.isArray(response))
    return { status: 'unavailable' };
  const payload = response as Record<string, unknown>;
  if (payload.assigned === false && payload.audience == null && payload.role == null)
    return { status: 'unassigned' };
  if (payload.assigned === true && payload.role === 'learner' && isLearnerAudience(payload.audience))
    return { status: 'assigned', audience: payload.audience };
  return { status: 'unavailable' };
}

export function developmentCareerAudienceUrl(authUrl: string | null | undefined): string | null {
  if (!authUrl) return null;
  try {
    const url = new URL(authUrl);
    if (url.protocol !== 'https:' || url.hostname !== DEV_CAREER_HOST || url.username || url.password ||
        url.port || (url.pathname !== '/' && url.pathname !== ''))
      return null;
    return new URL('/functions/v1/career/audience', url.origin).toString();
  } catch { return null; }
}

export async function requestVerifiedAudience(
  config: { url: string; anonKey: string } | null,
  getToken: () => Promise<string | null>,
  options: { signal?: AbortSignal; fetcher?: typeof fetch } = {},
): Promise<VerifiedAudienceResult> {
  const url = developmentCareerAudienceUrl(config?.url);
  if (!url || !config?.anonKey) return { status: 'unavailable' };
  let token: string | null;
  try { token = await getToken(); } catch { return { status: 'sign-in-required' }; }
  if (!token) return { status: 'sign-in-required' };
  try {
    const response = await (options.fetcher ?? fetch)(url, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        apikey: config.anonKey,
      },
      cache: 'no-store',
      credentials: 'omit',
      signal: options.signal,
    });
    if (response.status === 401) return { status: 'sign-in-required' };
    if (response.status === 403) return { status: 'consent-required' };
    if (!response.ok) return { status: 'unavailable' };
    return parseVerifiedAudience(await response.json());
  } catch { return { status: 'unavailable' }; }
}
