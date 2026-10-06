import { useRef, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import { CORPORATE, INTERNAL, INTERNAL_LAYOUT } from '../design'
import type { CorporatePage } from './Corporate'
import { imgProps } from '../lib/img'
import { MaskTitle, RevealPhoto, Rise } from './Reveal'
import '../internal.css'
import { ArrowUpRightIcon } from '@phosphor-icons/react/dist/csr/ArrowUpRight'
import { PlusIcon } from '@phosphor-icons/react/dist/csr/Plus'

const layout = Object.fromEntries(Object.entries(INTERNAL_LAYOUT).map(([name, value]) => [`--i-${name}`, `${value}px`])) as CSSProperties
type Photo = { src: string; alt: string; caption: string }

/**
 * Paginas proprias, refinadas em 28/09 para a mesma familia da home: titulo
 * no padrao do vault (Medium, caixa-alta, -4%) subindo por mascara, rotulo
 * unico com o colchete da marca, foto que abre ao entrar na tela, texto que
 * sobe. A composicao de cada pagina (a do trabalho original) fica.
 *
 * `box` e a proporcao (largura / altura) da caixa de cada foto, para o
 * srcset baixar no tamanho do recorte. `moldura` marca o UM momento de
 * Moldura Urbana da pagina.
 */
function Photograph({ photo, className = '', eager = false, box, sizes = '(max-width: 1023px) 100vw, 50vw', moldura = false }: { photo: Photo; className?: string; eager?: boolean; box?: number; sizes?: string; moldura?: boolean }) {
  return <RevealPhoto src={photo.src} alt={photo.alt} caption={photo.caption} className={`internal-photo ${className}`} sizes={sizes} box={box} eager={eager} moldura={moldura} />
}

function PageLabel({ page }: { page: CorporatePage }) {
  return <div className="internal-label"><span>{CORPORATE.pages[page].label}</span><span className="bracket">{INTERNAL.location}</span></div>
}

const lines = (text: string) => text.split('\n')

function Company() {
  const content = INTERNAL.company
  return <>
    <header className="internal-frame company-cover">
      <PageLabel page="empresa" />
      <div className="company-cover__spread">
        <MaskTitle as="h1" text={content.title} onMount />
        <Rise as="p" className="company-cover__lead">{content.lead}</Rise>
        <Photograph photo={content.photo} className="company-cover__main" eager box={0.62} sizes="(max-width: 1023px) 70vw, 36vw" />
        <Photograph photo={content.inset} className="company-cover__inset" box={0.72} sizes="(max-width: 1023px) 34vw, 18vw" moldura />
      </div>
    </header>
    <section className="internal-frame company-story" aria-labelledby="company-story-title">
      <p className="internal-eyebrow">{content.label}</p>
      <MaskTitle id="company-story-title" text={lines(content.statement)} />
      <Rise className="company-story__text">{content.paragraphs.map(text => <p key={text}>{text}</p>)}</Rise>
    </section>
    <section className="company-city">
      <div className="internal-frame company-city__spread">
        <Photograph photo={content.closingPhoto} box={1.25} sizes="(max-width: 1023px) 100vw, 56vw" />
        <div>
          <MaskTitle text={lines(content.closing)} />
          <Rise><p>{content.closingText}</p><a className="internal-link" href="/destino.html">{content.closingLink}<span aria-hidden="true"><ArrowUpRightIcon /></span></a></Rise>
        </div>
      </div>
    </section>
  </>
}

function Activity() {
  const content = INTERNAL.activity
  return <>
    <header className="internal-frame activity-cover">
      <PageLabel page="atuacao" />
      <MaskTitle as="h1" text={content.title} onMount />
      <Rise as="p">{content.intro}</Rise>
    </header>
    <Rise className="internal-frame activity-index">
      <section aria-label={content.label}>
        {content.items.map((item, index) => <details key={item.title} name="atuacao" open={index === 0} className="activity-entry">
          <summary><h2>{item.title}</h2><span className="activity-entry__tag">{item.tag}</span><span className="activity-entry__toggle" aria-hidden="true"><PlusIcon /></span></summary>
          <div className="activity-entry__body">
            <img {...imgProps(item.image, '(max-width: 1023px) 70vw, 30vw', 0.8)} alt={item.alt} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" />
            <div><p className="activity-entry__lead">{item.text}</p><p>{item.detail}</p><a className="internal-link" href={item.href}>{item.link}<span aria-hidden="true"><ArrowUpRightIcon /></span></a></div>
          </div>
        </details>)}
      </section>
    </Rise>
  </>
}

function Destination() {
  const content = INTERNAL.destination
  return <>
    <header className="internal-frame destination-cover">
      <PageLabel page="destino" />
      <div className="destination-cover__spread">
        <div className="destination-cover__title"><MaskTitle as="h1" text={content.title} onMount /></div>
        <Photograph photo={content.photo} eager box={1.4} sizes="(max-width: 1023px) 84vw, 62vw" />
      </div>
    </header>
    <section className="internal-frame destination-story" aria-labelledby="destination-story-title">
      <div className="destination-story__copy">
        <p className="internal-eyebrow">{content.label}</p>
        <MaskTitle id="destination-story-title" text={lines(content.statement)} />
        <Rise>{content.paragraphs.map(text => <p key={text}>{text}</p>)}<a className="internal-link" href={content.mapHref} target="_blank" rel="noreferrer">{content.mapLabel}<span aria-hidden="true"><ArrowUpRightIcon /></span></a><p className="internal-note">{content.note}</p></Rise>
      </div>
      <Photograph photo={content.detailPhoto} box={0.72} sizes="(max-width: 1023px) 84vw, 40vw" moldura />
    </section>
  </>
}

function Contact() {
  const content = INTERNAL.contact
  const details = CORPORATE.contact
  const [summary, setSummary] = useState('')
  const [status, setStatus] = useState('')
  const result = useRef<HTMLDivElement>(null)
  const requested = new URLSearchParams(window.location.search).get('assunto')
  const subject = details.subjects.find(item => item === requested) ?? details.subjects[0]
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setSummary([`${content.name}: ${data.get('nome')}`, `${content.organization}: ${data.get('empresa')}`, `${content.email}: ${data.get('email')}`, `${content.subject}: ${data.get('assunto')}`, '', data.get('mensagem')].join('\n'))
    setStatus(content.ready)
    requestAnimationFrame(() => result.current?.focus())
  }
  return <>
    <header className="internal-frame contact-cover"><PageLabel page="contato" /><div><MaskTitle as="h1" text={content.title} onMount /><Rise as="p">{content.lead}</Rise></div></header>
    <section className="internal-frame contact-desk" aria-labelledby="contact-form-title">
      <Rise className="contact-address">
        <dl><dt>{content.emailLabel}</dt><dd className="contact-address__email">{details.email}</dd><dt>{content.phoneLabel}</dt><dd>{details.phone}</dd><dt>{content.addressLabel}</dt><dd>{details.address}</dd></dl>
        <p className="internal-note">{content.note}</p>
        <details className="contact-company"><summary>{content.companyLabel}<span aria-hidden="true"><PlusIcon /></span></summary><p>{details.company}<br />{details.registration}</p></details>
      </Rise>
      <form className="contact-form" onSubmit={prepare} onChange={() => { setSummary(''); setStatus('') }}>
        <h2 id="contact-form-title">{content.formTitle}</h2>
        <label>{content.name}<input name="nome" autoComplete="name" required maxLength={120} /></label>
        <label>{content.organization}<input name="empresa" autoComplete="organization" required maxLength={160} /></label>
        <label>{content.email}<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
        <label>{content.subject}<select name="assunto" defaultValue={subject}>{details.subjects.map(item => <option key={item}>{item}</option>)}</select></label>
        <label className="contact-form__wide">{content.message}<textarea name="mensagem" rows={4} required maxLength={5000} /></label>
        <div className="contact-form__submit"><p className="internal-note">{content.formNote}</p><button className="btn btn--cta btn--lg" type="submit" data-cta>{content.submit}<ArrowUpRightIcon aria-hidden="true" /></button></div>
        <p className="internal-note contact-form__wide">{content.privacy} <a href="/privacidade.html">{content.privacyLink}</a></p>
        <p className="contact-form__wide" role="status">{status}</p>
        {summary && <div className="contact-result contact-form__wide" ref={result} tabIndex={-1} aria-label={content.summaryTitle}><h3>{content.summaryTitle}</h3><pre>{summary}</pre><button className="internal-link" type="button" onClick={async () => { try { await navigator.clipboard.writeText(summary); setStatus(content.copied) } catch { setStatus(content.copyError) } }}>{content.copy}</button></div>}
      </form>
    </section>
  </>
}

export function InternalContent({ page }: { page: CorporatePage }) {
  return <div className={`internal-page internal-page--${page}`} style={layout}>
    {page === 'empresa' && <Company />}
    {page === 'atuacao' && <Activity />}
    {page === 'destino' && <Destination />}
    {page === 'contato' && <Contact />}
  </div>
}

/**
 * Fim de cada pagina institucional: a proxima da sequencia, com hierarquia
 * clara (rotulo pequeno colado ao nome, nome em destaque, uma linha do que
 * tem la, seta alinhada ao nome). O rodape em si e o mesmo da home
 * (`Footer`), para o site inteiro ter um rodape so. (28/09)
 */
export function NextPage({ page }: { page: CorporatePage }) {
  const key = INTERNAL.footer.next[page]
  const next = CORPORATE.pages[key]
  return <nav className="next-page" style={layout} aria-label={INTERNAL.footer.nextLabel}>
    <div className="internal-frame">
      <a className="next-page__link" href={`/${key}.html`}>
        <span className="next-page__text">
          <span className="next-page__label">{INTERNAL.footer.nextLabel}</span>
          <span className="next-page__title">{next.label}</span>
          <span className="next-page__desc">{next.description}</span>
        </span>
        <span className="next-page__icon" aria-hidden="true"><ArrowUpRightIcon /></span>
      </a>
    </div>
  </nav>
}
