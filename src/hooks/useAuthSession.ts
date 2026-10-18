import { useCallback, useEffect, useState } from 'react';
import {
  getCurrentSession,
  isAuthConfigured,
  signOut as signOutOfProvider,
  subscribeToAuth,
  type AuthResult,
  type AuthSession,
} from '@/lib/auth';

/**
 * Current sign-in state.
 *
 * Returns `configured: false` — with no session and no loading — when no
 * provider is configured, so consumers can render their honest "not connected"
 * state without waiting for anything or implying that a session might appear.
 */
export function useAuthSession() {
  const configured = isAuthConfigured();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(configured);

  useEffect(() => {
    if (!configured) return;

    let active = true;
    let unsubscribe: (() => void) | undefined;

    void (async () => {
      const stop = await subscribeToAuth((next) => {
        if (!active) return;
        setSession(next);
        setLoading(false);
      });

      if (!active) {
        stop();
        return;
      }

      unsubscribe = stop;

      const current = await getCurrentSession();
      if (!active) return;
      setSession(current);
      setLoading(false);
    })();

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [configured]);

  const signOut = useCallback(async (): Promise<AuthResult> => {
    const result = await signOutOfProvider();
    if (result.ok) setSession(null);
    return result;
  }, []);

  return { configured, loading, session, signOut };
}
