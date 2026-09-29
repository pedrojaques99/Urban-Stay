import { Fragment, useEffect, useLayoutEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CARDS, HERO, SECTION, SITE } from '../design'
import { DEG, clamp01, easeInOutCubic, easeOutCubic, lerp, range } from '../lib/math'
import { DUR, ENTER_DELAY, riseIn, sequence, wordRise, words } from '../lib/motion'
import { imgProps } from '../lib/img'

gsap.registerPlugin(ScrollTrigger)

/**
 * Abertura do celular (< 1024px) — direcao "A · show curto" (PLANO.md).
 *
 * O desktop tem 820svh de roda + esteira. No polegar isso eram 8 telas
 * paradas para ler 6 frases de 8px. Aqui o show dura UMA tela de rolagem:
 *
 *   entrada (tempo, ao sair o loader)  as 6 fotos nascem no centro e abrem
 *                                      em anel, girando: a roda do desktop
 *   0.00 → 0.25  (scroll)              o anel continua girando
 *   0.25 → 0.80  (scroll)              o anel fecha no TRIO de molduras:
 *                                      3 fotos viram a Moldura Urbana, as
 *                                      outras 3 recolhem para tras
 *
 * O titulo do hero fica parado embaixo desde o primeiro quadro (e o LCP).
 * Mesma regra do `Stage`: um ScrollTrigger, um `draw(p)`, nenhum tween por
 * card. O unico tween e o da entrada, e ele so move o numero `intro`.
 */

/** altura do trecho fixado; 200svh = 100 de palco + 1 tela de rolagem */
const TRACK_SVH = 200

const RING_TURN = 50      // graus que o anel ainda gira com o scroll
const INTRO_TURN = -110   // graus que ele gira ao nascer
const CLOSE_FROM = 0.25
const CLOSE_TO = 0.8

/** proporcao das fotos do Figma (344.524 x 496.611) */
const PORTRAIT = 496.611 / 344.524

/**
 * O trio: indice em CARDS e posicao final, em fracao da largura (x, w) e da
 * altura do palco (y). A do meio e maior e mais alta, como nos mockups.
 */
const TRIO: Record<number, { x: number; y: number; w: number }> = {
  1: { x: -0.32, y: -0.05, w: 0.3 },   // cama
  5: { x: 0, y: -0.11, w: 0.38 },      // janela
  2: { x: 0.32, y: -0.05, w: 0.3 },    // roupao
}

/** Moldura Urbana e retangulo com os MESMOS 6 pontos: o clip-path interpola */
const HEX = [[50, 0], [100, 13], [100, 87], [50, 100], [0, 87], [0, 13]]
const RECT = [[50, 0], [100, 0], [100, 100], [50, 100], [0, 100], [0, 0]]
const polygon = (t: number) =>
  `polygon(${RECT.map(([x, y], i) => `${lerp(x, HEX[i][0], t)}% ${lerp(y, HEX[i][1], t)}%`).join(', ')})`

const HERO_WORDS = words(HERO.title)
const heroTitle = sequence(0.075, ENTER_DELAY + 0.1)
const heroWord = wordRise()
const heroRest = riseIn(1, ENTER_DELAY + 0.1 + 0.075 * HERO_WORDS.length + 0.3)

export function MobileStage({ ready }: { ready: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const state = useRef({ intro: 0, p: 0, draw: () => {} })

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return
    const s = state.current

    const draw = () => {
      const { intro, p } = s
      const vw = document.documentElement.clientWidth
      const vh = track.firstElementChild!.clientHeight
      // centro do anel: um pouco acima do meio, o titulo mora embaixo
      const cy = -vh * 0.08
      const ringR = Math.min(vw * 0.34, vh * 0.2)
      const baseW = vw * 0.38 // largura real do card; os outros escalam
      const e = easeOutCubic(intro)
      const close = easeInOutCubic(range(p, CLOSE_FROM, CLOSE_TO))
      const spin = (1 - e) * INTRO_TURN + p * RING_TURN

      CARDS.forEach((_, j) => {
        const el = cardRefs.current[j]
        if (!el) return
        const a = (j * 60 - 90 + spin) * DEG
        const ringX = Math.cos(a) * ringR * lerp(0.15, 1, e)
        const ringY = cy + Math.sin(a) * ringR * lerp(0.15, 1, e)
        const ringS = lerp(0.1, 0.55, e)
        const tilt = (1 - e) * 40 + Math.sin(a) * 6

        const trio = TRIO[j]
        let x = ringX, y = ringY, scale = ringS, rot = tilt, opacity = clamp01(intro * 3), shape = 0
        if (trio) {
          x = lerp(ringX, trio.x * vw, close)
          y = lerp(ringY, trio.y * vh, close)
          scale = lerp(ringS, trio.w / 0.38, close)
          rot = lerp(tilt, 0, close)
          shape = close
        } else {
          // recolhe para tras do trio e some
          x = lerp(ringX, 0, close)
          y = lerp(ringY, cy, close)
          scale = lerp(ringS, ringS * 0.6, close)
          opacity *= 1 - close
        }
        el.style.width = `${baseW}px`
        el.style.height = `${baseW * PORTRAIT}px`
        el.style.opacity = String(opacity)
        el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg) scale(${scale})`
        el.style.clipPath = polygon(shape)
        // raio de 4 do Figma, compensado pela escala; some quando vira moldura
        el.style.borderRadius = `${(4 * (1 - shape)) / Math.max(scale, 0.01)}px`
        el.style.zIndex = trio ? '3' : '1'
      })
    }
    s.draw = draw

    const st = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      invalidateOnRefresh: true,
      onRefresh: (self) => { s.p = self.progress; draw() },
      onUpdate: (self) => { s.p = self.progress; draw() },
    })
    s.p = st.progress
    draw()
    return () => st.kill()
  }, [])

  // a entrada roda quando o loader sai; com movimento reduzido, corte seco
  useEffect(() => {
    if (!ready) return
    const s = state.current
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      s.intro = 1
      s.draw()
      return
    }
    const tween = gsap.to(s, { intro: 1, duration: DUR.intro, ease: 'expo.out', delay: 0.15, onUpdate: () => s.draw() })
    return () => { tween.kill() }
  }, [ready])

  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <div className="m-track" ref={trackRef} style={{ height: `${TRACK_SVH}svh` }} id={SECTION.top}>
      <div className="m-stage">
        <div className="m-ring" aria-hidden="true">
          {CARDS.map((card, j) => (
            <div key={card.photo.id} className="m-card" ref={(el) => { cardRefs.current[j] = el }}>
              <img
                {...imgProps(card.photo.src, '40vw', 1 / PORTRAIT)}
                alt=""
                loading={TRIO[j] ? 'eager' : 'lazy'}
                decoding="async"
                style={{ objectPosition: card.photo.fit }}
              />
            </div>
          ))}
        </div>

        <div className="m-hero">
          <motion.h1 className="m-hero__title" variants={heroTitle} initial="hidden" animate="show">
            {HERO_WORDS.map((word, i) => (
              <Fragment key={`${word}-${i}`}>
                <span className="reveal-word"><motion.span variants={heroWord}>{word}</motion.span></span>
                {i < HERO_WORDS.length - 1 ? ' ' : null}
              </Fragment>
            ))}
          </motion.h1>
          <motion.div className="m-hero__rest" variants={heroRest} initial="hidden" animate="show">
            <p className="m-hero__lead">{HERO.lead}</p>
            <a className="btn btn--cta btn--lg" href={`#${SECTION.lista}`} data-cta>{SITE.cta}</a>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
