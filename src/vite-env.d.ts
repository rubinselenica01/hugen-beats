/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL for the FastAPI backend (no trailing slash). Omit in dev when using Vite `/admin` proxy. */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
