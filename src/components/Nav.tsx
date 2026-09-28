import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ListIcon } from '@phosphor-icons/react/dist/csr/List'
import { XIcon } from '@phosphor-icons/react/dist/csr/X'
import { CORPORATE, INSTITUTIONAL_LINKS, SECTION, SITE, toHome } from '../design'
import { ENTER_DELAY, riseIn, sequence } from '../lib/motion'

const NAV_STAGGER = 0.09
const navSequence = sequence(NAV_STAGGER, ENTER_DELAY)
const navItem = riseIn()
const navLogo = riseIn(1, ENTER_DELAY)
const navCta = riseIn(1, ENTER_DELAY + NAV_STAGGER * (INSTITUTIONAL_LINKS.length + 1))

const current = (href: string) => (window.location.pathname === href ? 'page' : undefined)

/**
 * Duas camadas fixas na mesma grade (ver AGENTS.md > Navbar):
 *
 * - `.nav` mesclada em `difference`: logo, links e o botao do menu, brancos,
 *   invertem o que passar por baixo (gradiente ou foto).
 * - `.nav-cta` fora da mesclagem: o botao em Brasa. `difference` o viraria
 *   em duas cores ilegiveis. Os `ghost` guardam o lugar de cada um na camada
 *   do outro, para os dois ficarem lado a lado sem se cobrir.
 *
 * Os links levam as paginas proprias (rota, nao ancora: pedido do dono,
 * 28/09). A lista de abertura mora na home, entao o botao vai para `/#lista`.
 * No celular os links vao para o menu; o botao da lista fica sempre a vista.
 */
export function Nav() {
  const menu = useRef<HTMLDialogElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)

  return (
    <>
      <nav className="nav" aria-label="Principal">
        <motion.a className="nav__logo" href="/" aria-label="Urban Stay, início" variants={navLogo} initial="hidden" animate="show">
          <img src="/img/logo.svg" alt="Urban Stay" width={202} height={20} />
        </motion.a>

        <motion.div className="nav__links" variants={navSequence} initial="hidden" animate="show">
          {INSTITUTIONAL_LINKS.map((link) => (
            // o wrapper carrega a entrada; a opacidade 0.8 e o hover
            // continuam com o CSS do proprio link
            <motion.span key={link.href} className="nav__link" variants={navItem}>
              <a href={link.href} aria-current={current(link.href)}>{link.label}</a>
            </motion.span>
          ))}
        </motion.div>
        <span className="nav__right">
          <span className="btn btn--brasa nav__ghost" aria-hidden="true">{SITE.ctaShort}</span>
          <button
            className="nav-toggle"
            ref={toggle}
            type="button"
            aria-label={CORPORATE.menu}
            aria-haspopup="dialog"
            aria-controls="menu-movel"
            onClick={() => menu.current?.showModal()}
          >
            <ListIcon aria-hidden="true" />
          </button>
        </span>
      </nav>

      <div className="nav-cta">
        <motion.a className="btn btn--brasa" href={toHome(`#${SECTION.lista}`)} variants={navCta} initial="hidden" animate="show">
          {SITE.ctaShort}
        </motion.a>
        <span className="nav-toggle nav__ghost" aria-hidden="true" />
      </div>

      <dialog id="menu-movel" className="menu" ref={menu} aria-label="Navegação" onClose={() => toggle.current?.focus()}>
        <button className="menu__close" type="button" onClick={() => menu.current?.close()}>
          {CORPORATE.close} <XIcon aria-hidden="true" />
        </button>
        <nav className="menu__links" aria-label="Páginas">
          <a href="/" aria-current={current('/')}>{CORPORATE.home}</a>
          {INSTITUTIONAL_LINKS.map((link) => (
            <a key={link.href} href={link.href} aria-current={current(link.href)}>{link.label}</a>
          ))}
        </nav>
        <a className="btn btn--brasa btn--lg menu__cta" href={toHome(`#${SECTION.lista}`)} onClick={() => menu.current?.close()}>
          {SITE.cta}
        </a>
      </dialog>
    </>
  )
}
