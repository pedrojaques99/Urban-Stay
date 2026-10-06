// Gera as versoes de tela das fotos: public/img/*.png|jpg -> public/img/opt/<nome>-<w>.webp
// e grava src/img-manifest.json com larguras e proporcao de cada uma (lido por src/lib/img.ts).
//
// Os PNG exportados do Figma continuam intactos em public/img: sao a fonte.
// Rode depois de trocar ou acrescentar foto:  npm run img
import sharp from 'sharp'
import { readdir, mkdir, writeFile, stat } from 'node:fs/promises'
import { join, parse } from 'node:path'

const SRC = 'public/img'
const OUT = join(SRC, 'opt')
/** 480 cobre o celular em 1x, 960 o celular em 2x, 1440 o celular em 3x e o card do desktop, 1920 a foto larga */
const WIDTHS = [480, 960, 1440, 1920]
/** original abaixo disto borra num celular 3x: o script avisa (fotos baixas, 05/10) */
const LOW = 1200
/** abaixo disto a foto nao vira versao: e icone ou avatar */
const MIN_WIDTH = 300
const QUALITY = 72
/** arquivos em public/img que nao viram versao de tela */
const SKIP = new Set()

await mkdir(OUT, { recursive: true })
const manifest = {}
let before = 0
let after = 0
const low = []

for (const file of (await readdir(SRC)).sort()) {
  if (!/\.(png|jpe?g)$/i.test(file) || SKIP.has(file)) continue
  const input = join(SRC, file)
  const { width, height } = await sharp(input).metadata()
  if (!width || width < MIN_WIDTH) continue

  const name = parse(file).name
  if (Math.max(width, height) < LOW) low.push(`${file} (${width}x${height})`)
  // nunca amplia: a maior versao e a largura original
  const widths = [...new Set(WIDTHS.map((w) => Math.min(w, width)))]
  before += (await stat(input)).size
  for (const w of widths) {
    const out = join(OUT, `${name}-${w}.webp`)
    const info = await sharp(input).resize({ width: w }).webp({ quality: QUALITY }).toFile(out)
    after += info.size
  }
  // ratio (w/h) deixa o imgProps compensar o recorte `cover` numa caixa de outra proporcao
  manifest[`/img/${file}`] = { widths, ratio: +(width / height).toFixed(4) }
  console.log(`${file.padEnd(24)} ${width}px -> ${widths.join(', ')}`)
}

await writeFile('src/img-manifest.json', JSON.stringify(manifest, null, 2) + '\n')
console.log(`\n${Object.keys(manifest).length} fotos · originais ${(before / 1e6).toFixed(1)}MB · versoes ${(after / 1e6).toFixed(1)}MB (todas as larguras somadas)`)
if (low.length) console.warn(`\nATENCAO: original menor que ${LOW}px no lado maior (borra no celular):\n  ${low.join('\n  ')}`)
