/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_NOMBRE?: string
  readonly VITE_DOMINIO_INSTITUCIONAL?: string
  readonly VITE_ZONA_HORARIA?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
