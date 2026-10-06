import manifest from '../img-manifest.json'

const PHOTOS = manifest as Record<string, { widths: number[]; ratio: number }>

/**
 * Props de <img> para uma foto de public/img: a versao WebP no tamanho da
 * tela (gerada por `npm run img`) em vez do PNG exportado do Figma.
 *
 * `sizes` diz quanto da largura da janela a CAIXA ocupa. `box` e a proporcao
 * (largura / altura) da caixa: com `object-fit: cover`, uma foto paisagem
 * numa caixa retrato mostra so o miolo, e precisa ser baixada maior na
 * mesma razao. Sem essa compensacao a janela (2560x1440) num card 4:5
 * baixava a versao de 480 e saia borrada. (medido 28/09)
 *
 * Foto fora do manifesto (SVG, icone) volta como veio.
 */
export function imgProps(src: string, sizes = '100vw', box?: number) {
  const photo = PHOTOS[src]
  if (!photo) return { src }
  const { widths, ratio } = photo
  const name = src.replace(/^\/img\//, '').replace(/\.\w+$/, '')
  const url = (w: number) => `/img/opt/${name}-${w}.webp`
  const crop = box && ratio > box ? ratio / box : 1
  return {
    src: url(widths[Math.min(1, widths.length - 1)]),
    srcSet: widths.map((w) => `${url(w)} ${w}w`).join(', '),
    sizes: crop === 1 ? sizes : scaleSizes(sizes, crop),
  }
}

/** multiplica o comprimento de cada entrada de `sizes`: "(x) 60vw, 36vw" */
function scaleSizes(sizes: string, factor: number) {
  return sizes
    .split(',')
    .map((entry) => {
      const parts = entry.trim().split(/\s+(?=[^\s]+$)/)
      const length = parts.pop()!
      return [...parts, `calc(${length} * ${factor.toFixed(3)})`].join(' ')
    })
    .join(', ')
}
