import { Fragment, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { CARDS, SECTION, SITE } from '../design'
import { DUR, EASE_MASK, EASE_OUT, riseIn, sequence, wordRise, words } from '../lib/motion'
import { imgProps } from '../lib/img'

/**
 * Os 6 beneficios no celular, em rolagem nativa (PLANO.md, fase 4).
 *
 * Cada um: foto 4:5 que ABRE da Moldura Urbana para o retangulo ao entrar
 * na tela (o gesto da marca, uma vez por foto), parallax curto dentro da
 * caixa, titulo em mascara por palavra, lead depois. O contador `01 / 06`
 * fica preso no topo enquanto a secao passa.
 *
 * Tudo em clip-path, transform e opacity. Com movimento reduzido a foto
 * ja nasce retangulo e o texto so aparece.
 */

const HEX = 'polygon(50% 0%, 100% 13%, 100% 87%, 50% 100%, 0% 87%, 0% 13%)'
const RECT = 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%, 0% 0%)'
const pad = (n: number) => String(n).padStart(2, '0')

const titleSeq = sequence(0.06, 0.15)
const titleWord = wordRise('110%')
const lead = riseIn(0.8, 0.45)

function Benefit({ card, index, onActive }: { card: (typeof CARDS)[number]; index: number; onActive: (i: number) => void }) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-7%', '7%'])

  // quem cruza o meio da tela e o beneficio da vez
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && onActive(index), {
      rootMargin: '-50% 0px -50% 0px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [index, onActive])

  return (
    <article className="story__item" ref={ref} aria-label={SITE.story.counter(index + 1, CARDS.length)}>
      <motion.div
        className="story__photo"
        initial={reduced ? false : { clipPath: HEX, scale: 0.94 }}
        whileInView={{ clipPath: RECT, scale: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: DUR.reveal, ease: EASE_MASK }}
      >
        <motion.img
          {...imgProps(card.photo.src, '(max-width: 1023px) 92vw, 40vw', 4 / 5)}
          alt={card.photo.alt}
          loading="lazy"
          decoding="async"
          style={{ y: reduced ? 0 : y, objectPosition: card.photo.fit }}
        />
      </motion.div>
      <motion.h2 className="story__title" variants={titleSeq} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }}>
        {words(card.benefit.title).map((word, n, all) => (
          <Fragment key={`${word}-${n}`}>
            <span className="reveal-mask"><motion.span variants={titleWord}>{word}</motion.span></span>
            {n < all.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </motion.h2>
      <motion.p className="story__lead" variants={lead} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }}>
        {card.benefit.lead}
      </motion.p>
    </article>
  )
}

export function Story() {
  const [active, setActive] = useState(0)
  return (
    <section className="story" id={SECTION.casa} aria-label={SITE.story.label}>
      <div className="story__counter" aria-hidden="true">
        <span>{SITE.story.label}</span>
        <span className="story__count">
          <span className="reveal-mask">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={active}
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                exit={{ y: '-100%' }}
                transition={{ duration: DUR.count, ease: EASE_OUT }}
              >
                {pad(active + 1)}
              </motion.span>
            </AnimatePresence>
          </span>
          <span aria-hidden="true">/</span>
          <span>{pad(CARDS.length)}</span>
        </span>
      </div>
      <div className="story__list">
        {CARDS.map((card, i) => (
          <Benefit key={card.photo.id} card={card} index={i} onActive={setActive} />
        ))}
      </div>
    </section>
  )
}
