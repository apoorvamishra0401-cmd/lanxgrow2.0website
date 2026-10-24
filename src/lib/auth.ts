import type { Session, SupabaseClient, User } from '@supabase/supabase-js';

/**
 * Authentication adapter — Supabase Auth, email + password.
 *
 * Three outcomes, and the pages must be able to tell them apart:
 *
 *   configured + ok       — a real request was accepted by the provider
 *   configured + failure  — a real request failed, with a reason
 *   not configured        — nothing is called, and the sign-in page keeps its
 *                           honest "preview only" behaviour instead of
 *                           pretending sign-in is available
 *
 * Configuration comes from Vite environment variables at build time:
 *
 *   VITE_SUPABASE_URL       https://<project-ref>.supabase.co
 *   VITE_SUPABASE_ANON_KEY  the project's publishable (anon) key
 *
 * The URL and anon key are public by design — the anon key is protected by
 * row-level security and is expected to ship in a browser bundle. Secrets,
 * service-role keys and .env files are never committed.
 *
 * The SDK is imported dynamically, so a deployment that has not configured
 * authentication never downloads it.
 */

export type AuthErrorCode =
  | 'invalid-credentials'
  | 'email-exists'
  | 'weak-password'
  | 'email-unverified'
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
          flowType: 'pkce',
          detectSessionInUrl: true,
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

  if (
    code === 'invalid_credentials' ||
    code === 'email_not_confirmed' ||
    /invalid login|wrong email|incorrect password|email not confirmed/i.test(message)
  ) {
    if (/email not confirmed|unverified/i.test(message)) {
      return {
        ok: false,
        code: 'email-unverified',
        message: 'Please verify your email address before signing in. Check your inbox for the verification link.',
      };
    }
    return {
      ok: false,
      code: 'invalid-credentials',
      message: 'The login details are incorrect. Please try again.',
    };
  }

  if (
    code === 'signup_allowed_but_email_exists' ||
    code === 'user_already_exists' ||
    /user already exists|email exists|registered/i.test(message)
  ) {
    return {
      ok: false,
      code: 'email-exists',
      message: 'An account with this email address already exists. Please sign in instead.',
    };
  }

  if (/weak password|password should|too short/i.test(message)) {
    return {
      ok: false,
      code: 'weak-password',
      message: 'Please choose a stronger password. It should be at least 6 characters.',
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
    message: 'Something went wrong. Please try again in a moment.',
  };
}

/* -------------------------------------------------------------------------
   Operations
   ------------------------------------------------------------------------- */

/** Creates a new account with email and password. */
export async function signUp(
  email: string,
  password: string,
  meta?: { full_name?: string; policy_version?: string },
): Promise<AuthResult<{ userId: string; email: string | null | undefined }>> {
  const client = await getClient();
  if (!client) return notConfigured();

  try {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: meta,
        emailRedirectTo: `${window.location.origin}/auth-callback`,
      },
    });

    if (error) return toAuthError(error);
    if (!data.user) {
      return {
        ok: false,
        code: 'unknown',
        message: 'Account creation was not confirmed. Please try again.',
      };
    }
    return { ok: true, data: { userId: data.user.id, email: data.user.email ?? null } };
  } catch (error) {
    return toAuthError(error);
  }
}

/** Signs in with email and password. */
export async function signInWithPassword(
  email: string,
  password: string,
): Promise<AuthResult<{ userId: string; email: string | null | undefined }>> {
  const client = await getClient();
  if (!client) return notConfigured();

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return toAuthError(error);
    if (!data.session || !data.user) {
      return {
        ok: false,
        code: 'unknown',
        message: 'Sign-in was not confirmed. Please try again.',
      };
    }
    return { ok: true, data: { userId: data.user.id, email: data.user.email ?? null } };
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

/** Sends a password reset link to the given email address. */
export async function resetPasswordForEmail(email: string): Promise<AuthResult> {
  const client = await getClient();
  if (!client) return notConfigured();

  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: origin + '/reset-password',
    });

    if (error) return toAuthError(error);
    return { ok: true, data: undefined };
  } catch (error) {
    return toAuthError(error);
  }
}

/** Updates the password for the currently authenticated user. */
export async function updatePassword(newPassword: string): Promise<AuthResult> {
  const client = await getClient();
  if (!client) return notConfigured();

  try {
    const { error } = await client.auth.updateUser({ password: newPassword });

    if (error) return toAuthError(error);
    return { ok: true, data: undefined };
  } catch (error) {
    return toAuthError(error);
  }
}

/**
 * Returns the currently authenticated user, or null if no session exists.
 */
export async function getCurrentUser(): Promise<User | null> {
  const client = await getClient();
  if (!client) return null;

  const { data } = await client.auth.getUser();
  return data.user ?? null;
}

export type LoginMethods = { email: boolean; google: boolean; phone: boolean };

/** Read public provider availability; never exposes admin credentials. */
export async function getLoginMethods(): Promise<LoginMethods | null> {
  const config = getAuthConfig();
  if (!config) return null;
  try {
    const response = await fetch(`${config.url}/auth/v1/settings`, { headers: { apikey: config.anonKey }, signal: AbortSignal.timeout(10000) });
    if (!response.ok) return null;
    const settings = await response.json() as { external?: Record<string, boolean> };
    return { email: settings.external?.email === true, google: settings.external?.google === true, phone: settings.external?.phone === true };
  } catch { return null; }
}

export async function signInWithPhonePassword(phone: string, password: string): Promise<AuthResult<{ userId: string }>> {
  try {
    const client = await getClient();
    if (!client) return notConfigured();
    const { data, error } = await client.auth.signInWithPassword({ phone, password });
    if (error) return toAuthError(error);
    if (!data.session || !data.user) return { ok: false, code: 'unknown', message: 'Sign-in was not confirmed. Please try again.' };
    return { ok: true, data: { userId: data.user.id } };
  } catch (error) { return toAuthError(error); }
}

export async function signInWithGoogle(): Promise<AuthResult> {
  try {
    const client = await getClient();
    if (!client) return notConfigured();
    const { data, error } = await client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth-callback`, skipBrowserRedirect: true, queryParams: { prompt: 'select_account' } } });
    if (error) return toAuthError(error);
    if (!data.url) return { ok: false, code: 'unknown', message: 'Google sign-in could not start. Please try again.' };
    window.location.assign(data.url);
    return { ok: true, data: undefined };
  } catch (error) { return toAuthError(error); }
}

/** Both policy documents are versioned together; accepted_at is database-generated. */
export const POLICY_VERSION = '2026-10-24.1';
export async function hasCurrentConsent(): Promise<AuthResult<boolean>> {
  try {
    const client = await getClient();
    if (!client) return notConfigured();
    const { data: { user }, error: userError } = await client.auth.getUser();
    if (userError || !user) return { ok: false, code: 'invalid-credentials', message: 'Please sign in to continue.' };
    const { data, error } = await client.from('legal_consents').select('policy_version').eq('user_id', user.id).eq('policy_version', POLICY_VERSION).maybeSingle();
    if (error) return toAuthError(error);
    return { ok: true, data: Boolean(data) };
  } catch (error) { return toAuthError(error); }
}
export async function acceptCurrentPolicies(): Promise<AuthResult> {
  try {
    const client = await getClient();
    if (!client) return notConfigured();
    const { data: { user }, error: userError } = await client.auth.getUser();
    if (userError || !user) return { ok: false, code: 'invalid-credentials', message: 'Please sign in to continue.' };
    const { error } = await client.from('legal_consents').insert({ user_id: user.id, policy_version: POLICY_VERSION });
    if (error && error.code !== '23505') return toAuthError(error);
    return { ok: true, data: undefined };
  } catch (error) { return toAuthError(error); }
}
export async function signUpWithPhone(phone: string, password: string): Promise<AuthResult> {
  try {
    const client = await getClient();
    if (!client) return notConfigured();
    const { error } = await client.auth.signUp({ phone, password, options: { data: { policy_version: POLICY_VERSION } } });
    if (error) return toAuthError(error);
    return { ok: true, data: undefined };
  } catch (error) { return toAuthError(error); }
}
export async function verifyPhoneRegistration(phone: string, token: string): Promise<AuthResult> {
  try {
    const client = await getClient();
    if (!client) return notConfigured();
    const { data, error } = await client.auth.verifyOtp({ phone, token, type: 'sms' });
    if (error) return toAuthError(error);
    if (!data.session) return { ok: false, code: 'unknown', message: 'Verification was not completed. Please try again.' };
    return { ok: true, data: undefined };
  } catch (error) { return toAuthError(error); }
}
