import { readFileSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/** injeta src/theme-boot.js inline no <head> de todas as paginas: tema certo na 1a pintura */
const themeBoot = (): Plugin => ({
  name: 'theme-boot',
  transformIndexHtml: () => [
    { tag: 'script', children: readFileSync('src/theme-boot.js', 'utf8'), injectTo: 'head-prepend' },
  ],
})

export default defineConfig({
  plugins: [react(), themeBoot()],
  build: {
    rollupOptions: {
      input: ['index.html', 'empresa.html', 'atuacao.html', 'destino.html', 'contato.html', 'privacidade.html', 'cookies.html', 'termos-de-uso.html'],
    },
  },
  server: { port: 5173, open: false },
})
