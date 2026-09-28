import { motion, useReducedMotion } from 'framer-motion'
import { CORPORATE, NAV_LINKS, LEGAL_LINKS } from '../design'
import '../institutional.css'

export function Footer() {
  const reduced = useReducedMotion()
  return <footer className="site-footer"><div className="editorial">
    <div className="footer-corporate"><p>{CORPORATE.footerDescription}</p><div><h2>{CORPORATE.footerNav}</h2><nav aria-label="Navegação do rodapé"><a href="/">{CORPORATE.home}</a>{NAV_LINKS.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav></div><div><h2>{CORPORATE.footerContact}</h2><address>{CORPORATE.contact.email}<br />{CORPORATE.contact.phone}</address><p className="corporate-note">{CORPORATE.contact.notice}</p></div></div>
    <div className="footer-signature">
      <img className="footer-logo" src="/img/logo.svg" alt="Urban Stay" loading="lazy" />
      <motion.div className="footer-signature__reveal" aria-hidden="true" initial={reduced ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.7 }}>
        {Array.from({ length: 7 }, (_, i) => {
          const left = i * 100 / 7
          const right = 100 - (i + 1) * 100 / 7
          return <motion.div key={i} className="footer-signature__slice" variants={{ hidden: { clipPath: `inset(${i % 2 ? 0 : 100}% ${right}% ${i % 2 ? 100 : 0}% ${left}%)` }, visible: { clipPath: `inset(0% ${right}% 0% ${left}%)` } }} transition={{ duration: reduced ? 0 : 1.15, delay: reduced ? 0 : i * 0.07, ease: [0.22, 1, 0.36, 1] }} />
        })}
      </motion.div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Urban Stay®</span><nav aria-label="Informações legais">{LEGAL_LINKS.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav></div>
  </div></footer>
}
