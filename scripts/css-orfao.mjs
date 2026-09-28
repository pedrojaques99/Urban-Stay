// Acha (e com --fix remove) regras de CSS cujas classes nao aparecem em nenhum .tsx/.ts/.html.
//
//   node scripts/css-orfao.mjs              lista, todos os .css de src/
//   node scripts/css-orfao.mjs --fix        remove as regras orfas e @media que ficarem vazias
//   node scripts/css-orfao.mjs src/x.css    so um arquivo
//
// Uma regra so morre quando TODOS os seletores da lista estao orfaos. Classe montada em
// runtime (`mark--${v}`) aparece como orfa: por isso o --fix respeita SAFELIST.
// Parse via postcss (dependencia do proprio Vite), nao regex.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import postcss from 'postcss'

/** classes montadas em template string, que a busca literal nao ve */
const SAFELIST = ['mark--pulso', 'is-loading']

const args = process.argv.slice(2)
const fix = args.includes('--fix')
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)])
const code = [...walk('src'), ...readdirSync('.').filter((f) => f.endsWith('.html'))]
  .filter((f) => /\.(tsx?|html)$/.test(f)).map((f) => readFileSync(f, 'utf8')).join('\n')
const used = (c) => SAFELIST.includes(c) ||
  new RegExp(`(^|[^\\w-])${c.replace(/-/g, '\\-')}($|[^\\w-])`).test(code)
const orphan = (selector) => selector.split(',').every((part) =>
  (part.match(/\.[\w-]+/g) ?? []).some((c) => !used(c.slice(1))))

const files = args.filter((a) => a.endsWith('.css'))
const targets = files.length ? files : walk('src').filter((f) => f.endsWith('.css'))
let total = 0
for (const f of targets) {
  const root = postcss.parse(readFileSync(f, 'utf8'), { from: f })
  const dead = []
  root.walkRules((rule) => {
    if (!rule.selector.includes('.') || !orphan(rule.selector)) return
    dead.push(rule.selector.replace(/\s+/g, ' '))
    if (fix) rule.remove()
  })
  if (fix) root.walkAtRules((at) => { if (at.nodes && at.nodes.length === 0) at.remove() })
  if (!dead.length) continue
  total += dead.length
  console.log(`\n${f}  (${dead.length})`)
  dead.forEach((s) => console.log('  ' + s))
  if (fix) writeFileSync(f, root.toString())
}
console.log(`\n${total} regra(s) orfa(s)${fix ? ' removida(s)' : ''}`)
