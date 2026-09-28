import { Fragment, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRightIcon } from '@phosphor-icons/react/dist/csr/ArrowUpRight'
import { CARDS, INSTITUTIONAL_LINKS, LEGAL_LINKS, NAV_LINKS, SECTION, SITE } from '../design'
import { DUR, EASE_MASK, riseIn, sequence, wordRise, words } from '../lib/motion'
import { imgProps } from '../lib/img'

/**
 * As secoes que vendem, iguais no celular e no desktop (PLANO.md, fase 5).
 * Nao ha node no Figma para elas: sao mobile-first em rem/clamp, e nao em
 * `figma * --k` (a regra do AGENTS.md vale para o que veio do art-board).
 */

const titleSeq = sequence(0.06, 0.1)
const titleWord = wordRise('110%')
const fadeUp = riseIn(1, 0.35)

/** titulo em caixa-alta com mascara por palavra, ao entrar na tela */
function MaskTitle({ text, as = 'h2', className }: { text: string; as?: 'h2' | 'h3'; className?: string }) {
  const Tag = as === 'h2' ? motion.h2 : motion.h3
  return (
    <Tag className={className} variants={titleSeq} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }}>
      {words(text).map((word, n, all) => (
        <Fragment key={`${word}-${n}`}>
          <span className="reveal-mask"><motion.span variants={titleWord}>{word}</motion.span></span>
          {n < all.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  )
}

const byId = (id: string) => CARDS.find((c) => c.photo.id === id)!.photo

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
    <section className="lista" id={SECTION.lista}>
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
            <button className="btn btn--brasa btn--lg" type="submit" disabled={status === 'sending' || status === 'done'}>
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
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-frame site-footer__grid">
        <div className="site-footer__about">
          <p>{SITE.footer.line}</p>
          <p className="site-footer__endorse">{SITE.footer.endorsement}</p>
        </div>
        <nav className="site-footer__nav" aria-label={SITE.footer.navLabel}>
          {NAV_LINKS.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
          <a href={`#${SECTION.lista}`}>
            {SITE.ctaShort}
            <span aria-hidden="true"><ArrowUpRightIcon /></span>
          </a>
        </nav>
        <nav className="site-footer__nav site-footer__nav--inst" aria-label={SITE.footer.instLabel}>
          {INSTITUTIONAL_LINKS.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>
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
