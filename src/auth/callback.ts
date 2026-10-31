import type { SupabaseClient } from '@supabase/supabase-js';

export type CallbackDestination = '/reset-password' | '/consent';
const LINK_ERROR = 'This sign-in link could not be verified. It may have expired or already been used. Please request a fresh link in this browser.';

/** Explicit exchange: an unrelated existing session must never rescue a bad link. */
export async function exchangeCallback(client: SupabaseClient, href: string): Promise<CallbackDestination> {
  const url = new URL(href);
  const query = url.searchParams;
  const hash = new URLSearchParams(url.hash.slice(1));
  if (query.has('error') || hash.has('error')) throw new Error(LINK_ERROR);
  const code = query.get('code');
  let recovery = false;
  if (code) {
    // The SDK reads the recovery type from its stored PKCE verifier, not a URL flag.
    const { data: listener } = client.auth.onAuthStateChange(event => {
      if (event === 'PASSWORD_RECOVERY') recovery = true;
    });
    try {
      const { data, error } = await client.auth.exchangeCodeForSession(code, {
        flowId: query.get('sb_flow_id') ?? undefined,
      });
      if (error || !data.session || !data.user) throw new Error(LINK_ERROR);
    } finally { listener.subscription.unsubscribe(); }
  } else {
    // Compatibility for existing implicit links. Query tokens are deliberately rejected.
    const access = hash.get('access_token');
    const refresh = hash.get('refresh_token');
    if (!access || !refresh) throw new Error(LINK_ERROR);
    const { data, error } = await client.auth.setSession({ access_token: access, refresh_token: refresh });
    if (error || !data.session) throw new Error(LINK_ERROR);
    recovery = hash.get('type') === 'recovery';
  }
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new Error(LINK_ERROR);
  return recovery ? '/reset-password' : '/consent';
}

/** React StrictMode remounts must share the one-time code exchange. No token is persisted. */
export function createCallbackCompleter() {
  let lastHref = '';
  let pending: Promise<CallbackDestination> | undefined;
  return (client: SupabaseClient, href: string) => {
    if (!pending || lastHref !== href) {
      lastHref = href;
      pending = exchangeCallback(client, href);
    }
    return pending;
  };
}

export const completeAuthCallback = createCallbackCompleter();
