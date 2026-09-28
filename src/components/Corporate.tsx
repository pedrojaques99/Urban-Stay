import { CORPORATE } from '../design'
import '../corporate.css'
import { ArrowUpRightIcon } from '@phosphor-icons/react/dist/csr/ArrowUpRight'

export type CorporatePage = keyof typeof CORPORATE.pages

export function CorporateDirectory() {
  return <section id="institucional" className="editorial corporate-directory">
    <p className="corporate-kicker">{CORPORATE.eyebrow}</p>
    <div className="corporate-intro"><h2>{CORPORATE.homeTitle}</h2><p>{CORPORATE.homeBody}</p></div>
    <div className="corporate-links">{Object.entries(CORPORATE.pages).map(([key, page], index) => <a href={`/${key}.html`} key={key}><span className="corporate-number">0{index + 1}</span><h3>{page.label}</h3><p>{page.description}</p><span aria-hidden="true"><ArrowUpRightIcon /></span></a>)}</div>
  </section>
}

export function CorporateNext() {
  return <section className="editorial corporate-next"><h2>{CORPORATE.nextTitle}</h2><div><p>{CORPORATE.nextBody}</p><a className="text-link" href="/contato.html">{CORPORATE.contactLabel}<span aria-hidden="true"><ArrowUpRightIcon /></span></a></div></section>
}
