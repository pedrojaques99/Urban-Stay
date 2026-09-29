/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** destino da lista de abertura (POST JSON). Vazio = prototipo, nada e enviado */
  readonly VITE_WAITLIST_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
