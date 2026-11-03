export const audiences = ['Student', 'Fresher', 'Working Professional'] as const;
export type Audience = typeof audiences[number];
const audienceKey = 'lanxgrow.entry.audience.v1';

export function isAudience(value: unknown): value is Audience {
  return audiences.some(audience => audience === value);
}

// A navigation preference only. Authentication and report ownership are checked separately.
export function readAudience(): Audience | null {
  try {
    const value = sessionStorage.getItem(audienceKey);
    return isAudience(value) ? value : null;
  } catch {
    return null;
  }
}

export function rememberAudience(audience: Audience) {
  try {
    sessionStorage.setItem(audienceKey, audience);
  } catch {
    // The destination URL still works when browser storage is unavailable.
  }
}

export function audienceDestination(audience: Audience): string {
  return audience === 'Student' ? '/signin' : '/interview?audience=' + encodeURIComponent(audience);
}

export function accountDestination(): string {
  const audience = readAudience();
  if (!audience || audience === 'Student') return '/app-preview?begin=1';
  let accountWindow = false;
  try { accountWindow = sessionStorage.getItem('lanxgrow.interview.account-window.v1') === 'true'; } catch { /* Navigation still works without storage. */ }
  return audienceDestination(audience) + (accountWindow ? '&account=connected' : '');
}

export function prepareInterviewAccountWindow(search: string) {
  const audience = new URLSearchParams(search).get('interview');
  if (!isAudience(audience) || audience === 'Student') return;
  rememberAudience(audience);
  try { sessionStorage.setItem('lanxgrow.interview.account-window.v1', 'true'); } catch { /* Optional navigation hint. */ }
}
