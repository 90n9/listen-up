/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_PUSH_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
