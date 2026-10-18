import type { Session, SupabaseClient } from '@supabase/supabase-js';

/**
 * Authentication adapter — Supabase Auth, email one-time codes.
 *
 * Chosen because it is the only zero-cost provider that issues a genuine
 * six-digit *code* over email. Firebase's passwordless web flow is a magic
 * link rather than a code, and both Firebase's and Supabase's SMS channels
 * require a paid provider (Firebase needs a Cloud Billing account for SMS;
 * Supabase needs Twilio/MessageBird/Vonage/Textlocal). See README.md.
 *
 * Three outcomes, and the pages must be able to tell them apart:
 *
 *   configured + ok       — a real request was accepted by the provider
 *   configured + failure  — a real request failed, with a reason
 *   not configured        — nothing is called, and the sign-in page keeps its
 *                           honest "preview only" behaviour instead of
 *                           pretending a code was sent
 *
 * Configuration comes from Vite environment variables at build time:
 *
 *   VITE_SUPABASE_URL       https://<project-ref>.supabase.co
 *   VITE_SUPABASE_ANON_KEY  the project's publishable (anon) key
 *   VITE_AUTH_PHONE_ENABLED "true" only once a paid SMS provider is set up
 *
 * The URL and anon key are public by design — the anon key is protected by
 * row-level security and is expected to ship in a browser bundle. Secrets,
 * service-role keys and .env files are never committed.
 *
 * The SDK is imported dynamically, so a deployment that has not configured
 * authentication never downloads it.
 */

export type AuthErrorCode =
  | 'invalid-code'
  | 'rate-limited'
  | 'not-enabled'
  | 'network'
  | 'unknown';

export type AuthResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; code: AuthErrorCode; message: string };

export type AuthSession = {
  userId: string;
  email: string | null;
  phone: string | null;
};

export type AuthConfig = {
  url: string;
  anonKey: string;
};

/* -------------------------------------------------------------------------
   Configuration
   ------------------------------------------------------------------------- */

export function getAuthConfig(): AuthConfig | null {
  const url = String(import.meta.env.VITE_SUPABASE_URL ?? '').trim();
  const anonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim();

  if (!url || !anonKey || !/^https?:\/\//i.test(url)) return null;

  return { url: url.replace(/\/+$/, ''), anonKey };
}

/** True when a real provider is configured for this build. */
export function isAuthConfigured(): boolean {
  return getAuthConfig() !== null;
}

/**
 * Phone sign-in is off unless it is switched on explicitly, because it cannot
 * work without a paid SMS provider. The switch exists so the channel can be
 * enabled later without touching any component.
 */
export function isPhoneAuthEnabled(): boolean {
  return isAuthConfigured() && import.meta.env.VITE_AUTH_PHONE_ENABLED === 'true';
}

/* -------------------------------------------------------------------------
   Client
   ------------------------------------------------------------------------- */

let clientPromise: Promise<SupabaseClient> | null = null;

async function getClient(): Promise<SupabaseClient | null> {
  const config = getAuthConfig();
  if (!config) return null;

  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          // Sign-in uses a typed code, not a link, so there is nothing to
          // recover from the URL.
          detectSessionInUrl: false,
        },
      }),
    );
  }

  return clientPromise;
}

function notConfigured(): { ok: false; code: AuthErrorCode; message: string } {
  return {
    ok: false,
    code: 'not-enabled',
    message: 'Sign-in is not connected for this deployment yet.',
  };
}

function toSession(session: Session): AuthSession {
  return {
    userId: session.user.id,
    email: session.user.email ?? null,
    phone: session.user.phone ?? null,
  };
}

/**
 * Turns provider errors into short, honest sentences.
 *
 * Supabase reports a wrong code and an expired code the same way
 * (`otp_expired`), so both get one message rather than a guess about which
 * mistake the learner made.
 */
function toAuthError(error: unknown): { ok: false; code: AuthErrorCode; message: string } {
  const raw = (error ?? {}) as { code?: string; status?: number; message?: string };
  const code = raw.code ?? '';
  const message = raw.message ?? '';

  if (code === 'otp_expired' || code === 'otp_disabled' || /invalid|incorrect|expired/i.test(message)) {
    return {
      ok: false,
      code: 'invalid-code',
      message: 'That code was not accepted. Check the six digits, or request a new code.',
    };
  }

  if (raw.status === 429 || /rate limit|too many|security purposes/i.test(message)) {
    return {
      ok: false,
      code: 'rate-limited',
      message: 'Too many attempts in a short time. Please wait a moment and try again.',
    };
  }

  if (error instanceof TypeError || /failed to fetch|network|load failed/i.test(message)) {
    return {
      ok: false,
      code: 'network',
      message: 'We could not reach the sign-in service. Check your connection and try again.',
    };
  }

  return {
    ok: false,
    code: 'unknown',
    message: 'Something went wrong while signing in. Please try again in a moment.',
  };
}

/* -------------------------------------------------------------------------
   Operations
   ------------------------------------------------------------------------- */

/** Sends a six-digit code to the address, creating the account on first use. */
export async function sendEmailCode(email: string): Promise<AuthResult> {
  const client = await getClient();
  if (!client) return notConfigured();

  try {
    const { error } = await client.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });

    if (error) return toAuthError(error);
    return { ok: true, data: undefined };
  } catch (error) {
    return toAuthError(error);
  }
}

/** Verifies the six digits. Only the provider can decide that this is correct. */
export async function verifyEmailCode(email: string, token: string): Promise<AuthResult> {
  const client = await getClient();
  if (!client) return notConfigured();

  try {
    const { error } = await client.auth.verifyOtp({ email, token, type: 'email' });
    if (error) return toAuthError(error);
    return { ok: true, data: undefined };
  } catch (error) {
    return toAuthError(error);
  }
}

export async function getCurrentSession(): Promise<AuthSession | null> {
  const client = await getClient();
  if (!client) return null;

  const { data } = await client.auth.getSession();
  return data.session ? toSession(data.session) : null;
}

export async function signOut(): Promise<AuthResult> {
  const client = await getClient();
  if (!client) return notConfigured();

  try {
    const { error } = await client.auth.signOut();
    if (error) return toAuthError(error);
    return { ok: true, data: undefined };
  } catch (error) {
    return toAuthError(error);
  }
}

/**
 * Subscribes to session changes. Resolves to an unsubscribe function, so the
 * caller can clean up even if it unmounts before the SDK has loaded.
 */
export async function subscribeToAuth(
  onChange: (session: AuthSession | null) => void,
): Promise<() => void> {
  const client = await getClient();
  if (!client) return () => {};

  const { data } = client.auth.onAuthStateChange((_event, session) => {
    onChange(session ? toSession(session) : null);
  });

  return () => data.subscription.unsubscribe();
}
