import { Fragment } from 'react'
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { DUR, EASE_MASK, riseIn, sequence, wordRise, words } from '../lib/motion'
import { imgProps } from '../lib/img'

/**
 * As tres revelacoes do site, num lugar so (28/09). Home e paginas proprias
 * usam as mesmas: e o que faz as rotas parecerem da mesma familia.
 *
 * - `MaskTitle`  titulo em caixa-alta que sobe palavra por palavra por mascara
 * - `RevealPhoto` foto que abre das laterais para as bordas e assenta
 * - `Rise`        bloco de texto que sobe 18px e acende
 *
 * Tudo dispara UMA vez ao entrar na tela (`once`), ou na montagem com
 * `onMount` (titulo de capa, que ja esta a vista). Com movimento reduzido o
 * MotionConfig do App corta os transforms e a foto ja nasce aberta.
 */

type Tag = 'h1' | 'h2' | 'h3' | 'p'
const TAGS = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p }

const titleSeq = (delay: number) => sequence(0.06, delay)
const titleWord = wordRise('110%')
const inView = { once: true, amount: 0.5 } as const
/** Bloco de texto pode ser mais alto que a tela. Com fracao (0.5, e ate 0.15)
 *  o acordeao aberto da Atuacao ficou em opacidade 0 com 24% dele a vista.
 *  O gatilho aqui independe da altura: qualquer pedaco visivel, 10% acima
 *  do pe da tela. (medido 28/09) */
const blockInView = { once: true, amount: 'some', margin: '0px 0px -10% 0px' } as const

export function MaskTitle({
  text,
  as = 'h2',
  className,
  id,
  onMount = false,
  delay = 0.1,
}: {
  /** uma linha, ou uma linha por item (cada uma vira um bloco) */
  text: string | readonly string[]
  as?: Tag
  className?: string
  id?: string
  onMount?: boolean
  delay?: number
}) {
  const Tag = TAGS[as]
  const lines = typeof text === 'string' ? [text] : text
  const trigger = onMount ? { animate: 'show' } : { whileInView: 'show', viewport: inView }
  return (
    <Tag id={id} className={className} variants={titleSeq(delay)} initial="hidden" {...trigger}>
      {lines.map((line, l) => (
        <span key={`${line}-${l}`} className={lines.length > 1 ? 'mask-line' : undefined}>
          {words(line).map((word, n, all) => (
            <Fragment key={`${word}-${n}`}>
              <span className="reveal-mask"><motion.span variants={titleWord}>{word}</motion.span></span>
              {n < all.length - 1 ? ' ' : null}
            </Fragment>
          ))}
        </span>
      ))}
    </Tag>
  )
}

const rise = riseIn(1, 0.25)

export function Rise({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'p' }) {
  const Tag = as === 'p' ? motion.p : motion.div
  return (
    <Tag className={className} variants={rise} initial="hidden" whileInView="show" viewport={blockInView}>
      {children}
    </Tag>
  )
}

/**
 * Foto que abre das laterais (como cortina de janela) e assenta de 1.08
 * para 1. `box` e a proporcao da caixa (largura / altura), para o srcset
 * baixar a foto no tamanho do recorte. `moldura` recorta na Moldura Urbana
 * (um momento por pagina, nao mais: PLANO.md).
 */
export function RevealPhoto({
  src,
  alt,
  caption,
  className = '',
  sizes,
  box,
  eager = false,
  moldura = false,
}: {
  src: string
  alt: string
  caption?: string
  className?: string
  sizes: string
  box?: number
  eager?: boolean
  moldura?: boolean
}) {
  const reduced = useReducedMotion()
  const trigger = eager ? { animate: 'open' } : { whileInView: 'open', viewport: { once: true, amount: 0.25 } }
  return (
    <motion.figure className={`reveal-photo ${moldura ? 'reveal-photo--moldura' : ''} ${className}`} initial={reduced ? false : 'closed'} {...trigger}>
      <motion.div
        className="reveal-photo__frame"
        variants={{ closed: { clipPath: 'inset(0% 12% 0% 12%)' }, open: { clipPath: 'inset(0% 0% 0% 0%)' } }}
        transition={{ duration: DUR.reveal, ease: EASE_MASK }}
      >
        <motion.img
          {...imgProps(src, sizes, box)}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : undefined}
          decoding="async"
          variants={{ closed: { scale: 1.08 }, open: { scale: 1 } }}
          transition={{ duration: DUR.reveal * 1.4, ease: EASE_MASK }}
        />
      </motion.div>
      {caption && <figcaption>{caption}</figcaption>}
    </motion.figure>
  )
}
