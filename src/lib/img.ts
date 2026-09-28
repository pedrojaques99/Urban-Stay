import manifest from '../img-manifest.json'

const WIDTHS = manifest as Record<string, number[]>

/**
 * Props de <img> para uma foto de public/img: a versao WebP no tamanho da
 * tela (gerada por `npm run img`) em vez do PNG exportado do Figma.
 *
 * `sizes` diz quanto da largura da janela a foto ocupa; sem ele o navegador
 * assume 100vw e baixa a maior versao. Foto fora do manifesto (SVG, icone)
 * volta como veio.
 */
export function imgProps(src: string, sizes = '100vw') {
  const widths = WIDTHS[src]
  if (!widths) return { src }
  const name = src.replace(/^\/img\//, '').replace(/\.\w+$/, '')
  const url = (w: number) => `/img/opt/${name}-${w}.webp`
  return {
    src: url(widths[Math.min(1, widths.length - 1)]),
    srcSet: widths.map((w) => `${url(w)} ${w}w`).join(', '),
    sizes,
  }
}
