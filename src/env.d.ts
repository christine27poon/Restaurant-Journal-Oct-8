/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL. If this or the key is missing, the app uses the local mock data. */
  readonly VITE_SUPABASE_URL?: string
  /** Supabase publishable (anon) key. Safe to expose: access is enforced by row-level security. */
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
