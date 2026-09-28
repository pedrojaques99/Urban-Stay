import { Fragment } from 'react'
import type { ReactElement, ReactNode } from 'react'
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

/** Uma linha do titulo: texto, ou texto e elementos (foto entre palavras). */
type MaskLine = string | readonly (string | ReactElement)[]

const titleSeq = (delay: number) => sequence(0.06, delay)
const titleWord = wordRise('110%')
const inView = { once: true, amount: 0.5 } as const
/** Bloco de texto pode ser mais alto que a tela. Com fracao (0.5, e ate 0.15)
 *  o acordeao aberto da Atuacao ficou em opacidade 0 com 24% dele a vista.
 *  O gatilho aqui independe da altura: qualquer pedaco visivel, 10% acima
 *  do pe da tela. (medido 28/09) */
/** uma linha do titulo: dispara com a linha ja um pouco acima do pe da tela */
const lineInView = { once: true, amount: 'some', margin: '0px 0px -12% 0px' } as const
const blockInView = { once: true, amount: 'some', margin: '0px 0px -10% 0px' } as const

export function MaskTitle({
  text,
  as = 'h2',
  className,
  id,
  onMount = false,
  delay = 0.1,
  perLine = false,
}: {
  /** uma linha, ou uma linha por item (cada uma vira um bloco). Um item
   *  pode misturar texto e elementos: o elemento sobe pela mascara como
   *  mais uma palavra (as fotos do manifesto). */
  text: string | readonly MaskLine[]
  as?: Tag
  className?: string
  id?: string
  onMount?: boolean
  delay?: number
  /** titulo mais alto que a tela: cada linha dispara quando ELA entra.
   *  Com o gatilho no titulo inteiro (amount 0.5) um bloco de 1400px nunca
   *  chegava a 50% visivel numa janela baixa e ficava apagado. */
  perLine?: boolean
}) {
  const Tag = TAGS[as]
  const lines = typeof text === 'string' ? [text] : text
  const trigger = onMount ? { animate: 'show' } : { whileInView: 'show', viewport: inView }
  return (
    <Tag id={id} className={className} {...(perLine ? {} : { variants: titleSeq(delay), initial: 'hidden', ...trigger })}>
      {lines.map((line, l) => {
        const tokens = (typeof line === 'string' ? [line] : line).flatMap<string | ReactElement>((t) => (typeof t === 'string' ? words(t) : [t]))
        const Line = perLine ? motion.span : 'span'
        const own = perLine ? { variants: titleSeq(0.05), initial: 'hidden', whileInView: 'show', viewport: lineInView } : {}
        return (
          <Line key={l} className={lines.length > 1 ? 'mask-line' : undefined} {...own}>
            {tokens.map((word, n, all) => (
              <Fragment key={n}>
                {/* elemento (foto) traz a propria entrada; palavra sobe pela mascara */}
                <span className="reveal-mask">{typeof word === 'string' ? <motion.span variants={titleWord}>{word}</motion.span> : word}</span>
                {n < all.length - 1 ? ' ' : null}
              </Fragment>
            ))}
          </Line>
        )
      })}
    </Tag>
  )
}

export function Rise({ children, className, as = 'div', delay = 0 }: { children: ReactNode; className?: string; as?: 'div' | 'p'; delay?: number }) {
  const Tag = as === 'p' ? motion.p : motion.div
  return (
    <Tag className={className} variants={riseIn(1, 0.25 + delay)} initial="hidden" whileInView="show" viewport={blockInView}>
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
