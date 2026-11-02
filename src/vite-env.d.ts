/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_CONNECTED_PRACTICE?: string;
  readonly VITE_AUTH_VERIFICATION?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}
interface ImportMeta { readonly env: ImportMetaEnv; }
