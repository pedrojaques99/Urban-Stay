import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import mark from '../../public/img/logo-areia.svg?raw'
import { DUR } from '../lib/motion'

/**
 * A marca grande do rodape, viva (28/09).
 *
 * - Entrada: cada grupo de letras sobe por dentro do proprio SVG (que recorta)
 *   e o simbolo gira como uma persiana que se abre. Uma vez so.
 * - Ponteiro: as letras perto do cursor sobem um fio, como tecla que ele
 *   roca, e o simbolo acompanha o x do cursor. Ao sair, tudo assenta.
 *
 * O SVG e o mesmo arquivo do /img (importado cru), entao a marca nunca
 * diverge do original. Sem hover (toque) fica so a entrada; com movimento
 * reduzido nada anima.
 */

/* indices dos <path> no logo-areia.svg, agrupados como se leem */
const SYMBOL = [0, 1]
const GROUPS = [[2], [4], [5], [3], [7], [6, 8, 9]] // U · R · BAN · ST · A · Y®

/** quanto uma letra sobe no ponto do cursor, em unidades do viewBox (altura 20) */
const LIFT = 1.1
/** raio de influencia do cursor, em fracao da largura da marca */
const REACH = 0.16

export function FooterMark({ label }: { label: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const host = ref.current
    if (!host) return
    // o SVG entra aqui, e nao por dangerouslySetInnerHTML: o React regravava
    // o innerHTML depois do efeito e o GSAP ficava animando nos soltos
    // (medido 28/09). Num <span> sem filhos declarados o React nunca mexe.
    if (!host.firstElementChild) host.innerHTML = mark
    const svg = host.querySelector('svg')
    if (!svg) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const paths = [...svg.querySelectorAll('path')]
    const pick = (ids: number[]) => ids.map((i) => paths[i]).filter(Boolean)
    const symbol = pick(SYMBOL)
    const groups = GROUPS.map(pick)
    const letters = groups.flat()

    gsap.set(symbol, { svgOrigin: '10.11 10.11' })
    gsap.set(letters, { y: 22 })
    gsap.set(symbol, { rotation: -90, opacity: 0 })

    const intro = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
    intro
      .to(symbol, { rotation: 0, opacity: 1, duration: DUR.intro }, 0)
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
    const lift = groups.map((g) => gsap.quickTo(g, 'y', { duration: 0.6, ease: 'power3.out' }))
    const turn = gsap.quickTo(symbol, 'rotation', { duration: 0.9, ease: 'power3.out' })

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
