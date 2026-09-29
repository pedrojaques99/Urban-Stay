import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import mark from '../../public/img/logo-areia.svg?raw'
import { DUR } from '../lib/motion'

/**
 * A marca grande do rodape, viva (28/09).
 *
 * - Entrada: cada grupo de letras sobe por dentro do proprio SVG (que recorta)
 *   e o simbolo abre em persiana, igual ao loader: as sete cordas giram no
 *   proprio eixo, do centro para as pontas, e param juntas. Uma vez so.
 * - Ponteiro: as letras perto do cursor sobem um fio, como tecla que ele
 *   roca, e o simbolo acompanha o x do cursor. Ao sair, tudo assenta.
 *
 * O SVG e o mesmo arquivo do /img (importado cru), entao a marca nunca
 * diverge do original. Sem hover (toque) fica so a entrada; com movimento
 * reduzido nada anima.
 */

/* indices dos <path> no logo-areia.svg: 0 sao as cordas do simbolo, 1 o ® dele */
const SYMBOL = [0, 1]
/* letras, agrupadas como se leem, contadas DEPOIS do simbolo (indice - 2) */
const GROUPS = [[0], [2], [3], [1], [5], [4, 6, 7]] // U · R · BAN · ST · A · Y®

/** centro do simbolo no viewBox do logo (x e y) */
const SYMBOL_CENTER = 10.11
/** atraso da persiana por passo do centro ate a ponta, como no loader (s) */
const SLAT_STEP = 0.16

/** quanto uma letra sobe no ponto do cursor, em unidades do viewBox (altura 20) */
const LIFT = 1.1
/** raio de influencia do cursor, em fracao da largura da marca */
const REACH = 0.16

/**
 * Troca os paths do simbolo por um <g data-symbol> de cordas soltas: cada
 * subpath do arquivo vira uma corda, e a persiana gira cada uma no proprio
 * eixo. Roda uma vez, junto com a injecao do SVG: no StrictMode o efeito
 * roda duas vezes e os indices das letras nao podem mudar entre elas.
 */
function splitSymbol(host: HTMLElement) {
  const paths = [...host.querySelectorAll('path')]
  const symbolPaths = SYMBOL.map((i) => paths[i]).filter(Boolean)
  if (!symbolPaths.length) return
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  group.dataset.symbol = ''
  symbolPaths[0].before(group)
  const [slats, ...rest] = symbolPaths
  for (const part of (slats.getAttribute('d') ?? '').split('Z').filter((d) => d.trim())) {
    const slat = slats.cloneNode() as SVGPathElement
    slat.setAttribute('d', `${part}Z`)
    slat.dataset.slat = ''
    group.append(slat)
  }
  slats.remove()
  // o ® fica inteiro: so acende, e gira junto com o simbolo
  for (const path of rest) {
    path.dataset.symbolPart = ''
    group.append(path)
  }
}

export function FooterMark({ label }: { label: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const host = ref.current
    if (!host) return
    // o SVG entra aqui, e nao por dangerouslySetInnerHTML: o React regravava
    // o innerHTML depois do efeito e o GSAP ficava animando nos soltos
    // (medido 28/09). Num <span> sem filhos declarados o React nunca mexe.
    if (!host.firstElementChild) {
      host.innerHTML = mark
      splitSymbol(host)
    }
    const svg = host.querySelector('svg')
    const group = svg?.querySelector<SVGGElement>('[data-symbol]')
    if (!svg || !group) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const paths = [...svg.querySelectorAll<SVGPathElement>('path:not([data-slat]):not([data-symbol-part])')]
    const groups = GROUPS.map((ids) => ids.map((i) => paths[i]).filter(Boolean))
    const letters = groups.flat()
    const slats = [...group.querySelectorAll<SVGPathElement>('[data-slat]')]
    const parts = [...group.querySelectorAll('[data-symbol-part]')]
    const reach = slats.map((slat) => {
      const b = slat.getBBox()
      return Math.abs(b.x + b.width / 2 - SYMBOL_CENTER) / SYMBOL_CENTER
    })
    const symbol = [group]

    gsap.set(symbol, { svgOrigin: `${SYMBOL_CENTER} ${SYMBOL_CENTER}` })
    gsap.set(letters, { y: 22 })
    gsap.set(slats, { scaleX: 0, transformOrigin: '50% 50%' })
    gsap.set(parts, { opacity: 0 })

    const intro = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
    intro
      .to(slats, {
        scaleX: 1,
        duration: DUR.reveal,
        ease: 'power3.inOut',
        // 0 no centro, 1 na ponta: tres passos, como as cordas do loader
        delay: (i: number) => Math.round(reach[i] * 3) * SLAT_STEP,
      }, 0)
      .to(parts, { opacity: 1, duration: DUR.reveal }, 3 * SLAT_STEP)
      .to(groups, { y: 0, duration: DUR.reveal, stagger: 0.07 }, 0.12)

    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        intro.play()
        seen.disconnect()
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    seen.observe(host)

    // ponteiro fino so: no toque nao ha hover para responder
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return () => { seen.disconnect(); intro.kill() }
    }

    const centers = groups.map((g) => {
      const boxes = g.map((p) => p.getBBox())
      const left = Math.min(...boxes.map((b) => b.x))
      const right = Math.max(...boxes.map((b) => b.x + b.width))
      return (left + right) / 2 / 202.251
    })
    const lift = groups.map((g) => gsap.quickTo(g, 'y', { duration: DUR.follow, ease: 'power3.out' }))
    const turn = gsap.quickTo(symbol, 'rotation', { duration: DUR.follow * 1.5, ease: 'power3.out' })

    const move = (e: PointerEvent) => {
      if (intro.progress() < 1) return
      const r = host.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      centers.forEach((c, i) => {
        const d = Math.abs(x - c) / REACH
        lift[i](d >= 1 ? 0 : -LIFT * (1 - d * d))
      })
      turn((x - 0.5) * 40)
    }
    const leave = () => {
      lift.forEach((to) => to(0))
      turn(0)
    }

    host.addEventListener('pointermove', move)
    host.addEventListener('pointerleave', leave)
    return () => {
      seen.disconnect()
      intro.kill()
      host.removeEventListener('pointermove', move)
      host.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <span
      ref={ref}
      className="site-footer__mark"
      role="img"
      aria-label={label}
    />
  )
}
