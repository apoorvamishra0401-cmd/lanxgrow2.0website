/// <reference types="vite/client" />

/**
 * Environment variables this project reads at build time.
 *
 * All of them are optional: with none set, the site runs exactly as it does
 * today (an honest, unconnected sign-in preview). See `.env.example`.
 */
interface ImportMetaEnv {
  /** Supabase project URL, e.g. `https://<project-ref>.supabase.co`. */
  readonly VITE_SUPABASE_URL?: string;
  /** Supabase publishable (anon) key. Public by design — protected by RLS. */
  readonly VITE_SUPABASE_ANON_KEY?: string;
  /** Set to `"true"` only when a paid SMS provider is configured. */
  readonly VITE_AUTH_PHONE_ENABLED?: string;
  /**
   * Optional HTTPS endpoint that accepts a JSON POST of an enquiry.
   * While this is empty the contact form keeps its honest "preview" behaviour.
   */
  readonly VITE_CONTACT_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
