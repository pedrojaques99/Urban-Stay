import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRightIcon } from '@phosphor-icons/react/dist/csr/ArrowUpRight'
import { CARDS, INSTITUTIONAL_LINKS, LEGAL_LINKS, MANIFESTO, SECTION, SITE, toHome } from '../design'
import { DUR, EASE_MASK, riseIn } from '../lib/motion'
import { MaskTitle, Rise } from './Reveal'
import { imgProps } from '../lib/img'

/**
 * As secoes que vendem, iguais no celular e no desktop (PLANO.md, fase 5).
 * Nao ha node no Figma para elas: sao mobile-first em rem/clamp, e nao em
 * `figma * --k` (a regra do AGENTS.md vale para o que veio do art-board).
 */

const fadeUp = riseIn(1, 0.35)

const byId = (id: string) => CARDS.find((c) => c.photo.id === id)!.photo

/* ------------------------------------------------------------------
   Manifesto — Figma 9111:4. O titulo e um <h2> de verdade: as fotos
   entram entre as palavras com alt vazio, entao o leitor de tela le a
   frase inteira. Geometria em `MANIFESTO` (design.ts), tudo em em.
   ------------------------------------------------------------------ */
export function Manifesto() {
  const reduced = useReducedMotion()
  const lines = MANIFESTO.lines.map((line) =>
    line.map((token) =>
      typeof token === 'string' ? token : (
        <motion.span
          key={token.src}
          className="manifesto__photo"
          style={{ width: `${token.w}em`, height: `${token.h}em` }}
          variants={reduced ? undefined : photoOpen}
        >
          <motion.img
            {...imgProps(token.src, `${Math.round((token.w / MANIFESTO.measure) * 100)}vw`, token.w / token.h)}
            alt=""
            loading="lazy"
            decoding="async"
            style={{ objectPosition: token.fit }}
            variants={reduced ? undefined : photoSettle}
          />
        </motion.span>
      ),
    ),
  )

  return (
    <section className="manifesto">
      <div className="site-frame manifesto__frame">
        <MaskTitle text={lines} className="manifesto__title" perLine />
        <div className="manifesto__body">
          {SITE.manifesto.body.map((text, i) => <Rise key={text} as="p" delay={i * 0.12}>{text}</Rise>)}
        </div>
      </div>
    </section>
  )
}

/* A foto do manifesto abre no lugar, do centro para as bordas, enquanto as
   palavras sobem: uma so direcao de movimento por elemento. O recorte vai no
   span e a escala na imagem, senao o clip-path escalaria junto. */
const photoOpen = {
  hidden: { clipPath: 'inset(0% 50% 0% 50%)' },
  show: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: DUR.reveal * 1.2, delay: 0.12, ease: EASE_MASK } },
}
const photoSettle = {
  hidden: { scale: 1.14 },
  show: { scale: 1, transition: { duration: DUR.reveal * 1.8, delay: 0.12, ease: EASE_MASK } },
}

/* ------------------------------------------------------------------
   Rua 902 — o lugar. Mare Funda, colchetes da marca, faixa vertical.
   ------------------------------------------------------------------ */
export function Place() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // a foto abre das laterais para as bordas, como uma cortina de janela
  const opening = useTransform(scrollYProgress, [0.05, 0.45], ['inset(0% 14% 0% 14%)', 'inset(0% 0% 0% 0%)'])
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])
  const photo = byId('window')

  return (
    <section className="place" id={SECTION.rua} ref={ref}>
      <div className="site-frame place__grid">
        <p className="bracket place__bracket">{SITE.place.bracket}</p>
        <MaskTitle text={SITE.place.title} className="caps place__title" />
        <motion.p className="place__body" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }}>
          {SITE.place.body}
        </motion.p>
        <div className="place__media">
          <motion.figure className="place__photo" style={{ clipPath: reduced ? undefined : opening }}>
            <motion.img
              {...imgProps(photo.src, '(max-width: 1023px) 92vw, 50vw', 4 / 5)}
              alt={SITE.place.photoAlt}
              loading="lazy"
              decoding="async"
              style={{ y: reduced ? 0 : y }}
            />
          </motion.figure>
          <span className="place__strip" aria-hidden="true">{SITE.place.strip}</span>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------
   Lista de abertura — a unica acao do site.

   Destino: `VITE_WAITLIST_ENDPOINT` (POST JSON; Formspree, planilha via
   Apps Script ou qualquer webhook). Sem destino, o formulario valida e diz
   que e prototipo: nunca finge que enviou.
   ------------------------------------------------------------------ */
const ENDPOINT = import.meta.env.VITE_WAITLIST_ENDPOINT as string | undefined
type Status = 'idle' | 'sending' | 'done' | 'prototype' | 'error'

const TRIO = [
  { id: 'bed', h: '82%' },
  { id: 'window', h: '100%' },
  { id: 'robe', h: '70%' },
]

export function Waitlist() {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<{ nome?: string; whatsapp?: string }>({})
  const reduced = useReducedMotion()
  const copy = SITE.lista

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const nome = String(data.get('nome') ?? '').trim()
    const whatsapp = String(data.get('whatsapp') ?? '').trim()
    const next = {
      nome: nome.length < 2 ? copy.invalidName : undefined,
      whatsapp: whatsapp.replace(/\D/g, '').length < 10 ? copy.invalidPhone : undefined,
    }
    setErrors(next)
    if (next.nome || next.whatsapp) return
    if (!ENDPOINT) { setStatus('prototype'); return }
    setStatus('sending')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ nome, whatsapp, origem: 'site' }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const message = status === 'done' ? copy.done : status === 'prototype' ? copy.prototype : status === 'error' ? copy.error : status === 'sending' ? copy.sending : ''

  return (
    <section className="lista" id={SECTION.lista} data-nav-band>
      <div className="site-frame lista__grid">
        <div className="lista__trio" aria-hidden="true">
          {TRIO.map((item, i) => {
            const photo = byId(item.id)
            return (
              <motion.div
                key={item.id}
                className="lista__moldura"
                style={{ height: item.h }}
                initial={reduced ? false : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: DUR.rise, delay: i * 0.08, ease: EASE_MASK }}
              >
                <img {...imgProps(photo.src, '(max-width: 1023px) 32vw, 16vw', 0.55)} alt="" loading="lazy" decoding="async" style={{ objectPosition: photo.fit }} />
              </motion.div>
            )
          })}
        </div>

        <div className="lista__copy">
          <MaskTitle text={copy.title} className="caps lista__title" />
          <motion.p className="lista__body" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }}>
            {copy.body}
          </motion.p>

          <form className="lista__form" onSubmit={submit} noValidate>
            <label className="field" htmlFor="lista-nome">
              <span>{copy.name}</span>
              <input id="lista-nome" name="nome" autoComplete="name" maxLength={120}
                aria-invalid={Boolean(errors.nome)} aria-describedby={errors.nome ? 'lista-nome-erro' : undefined} />
              {errors.nome && <small id="lista-nome-erro">{errors.nome}</small>}
            </label>
            <label className="field" htmlFor="lista-whatsapp">
              <span>{copy.phone} <em>{copy.phoneHint}</em></span>
              <input id="lista-whatsapp" name="whatsapp" type="tel" inputMode="tel" autoComplete="tel" maxLength={20}
                aria-invalid={Boolean(errors.whatsapp)} aria-describedby={errors.whatsapp ? 'lista-whatsapp-erro' : undefined} />
              {errors.whatsapp && <small id="lista-whatsapp-erro">{errors.whatsapp}</small>}
            </label>
            <button className="btn btn--brasa btn--lg" type="submit" data-cta disabled={status === 'sending' || status === 'done'}>
              {SITE.cta}
            </button>
            <p className="lista__status" role="status" aria-live="polite">{message}</p>
            <p className="lista__privacy">
              {copy.privacy} <a href="/privacidade.html">{copy.privacyLink}</a>
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------
   Rodape — Noite Urbana, wordmark em Areia (o vault proibe o escuro aqui).
   ------------------------------------------------------------------ */
/**
 * `cta`: o botao da lista no rodape. Na home ele sai, porque o formulario
 * esta logo acima e os dois ficavam na tela juntos (auditoria 28/09). Nas
 * outras paginas e o caminho para a lista, e fica.
 */
export function Footer({ cta = true }: { cta?: boolean }) {
  return (
    <footer className="site-footer">
      <div className="site-frame site-footer__grid">
        <div className="site-footer__about">
          <p>{SITE.footer.line}</p>
          <p className="site-footer__endorse">{SITE.footer.endorsement}</p>
        </div>
        <nav className="site-footer__nav" aria-label={SITE.footer.navLabel}>
          <a href="/">{SITE.footer.home}</a>
          {INSTITUTIONAL_LINKS.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>
        {cta && (
          <a className="btn btn--brasa btn--lg site-footer__cta" data-cta href={toHome(`#${SECTION.lista}`)}>
            {SITE.cta}
            <ArrowUpRightIcon aria-hidden="true" />
          </a>
        )}
        <img className="site-footer__mark" src="/img/logo-areia.svg" alt="Urban Stay" width={202} height={20} loading="lazy" />
        <div className="site-footer__bottom">
          <span>© {new Date().getFullYear()} Urban Stay®</span>
          <nav aria-label={SITE.footer.legalLabel}>
            {LEGAL_LINKS.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
          </nav>
        </div>
      </div>
    </footer>
  )
}
