/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_PORT: string;
  readonly VITE_UPLOAD_FILE: string;
  readonly VITE_API_URL: string;
  readonly VITE_API_URL_PROXY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
