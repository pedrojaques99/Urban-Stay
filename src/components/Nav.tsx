import { motion } from 'framer-motion'
import { NAV_LINKS, SECTION, SITE, toHome } from '../design'
import { ENTER_DELAY, riseIn, sequence } from '../lib/motion'

const NAV_STAGGER = 0.09
const navSequence = sequence(NAV_STAGGER, ENTER_DELAY)
const navItem = riseIn()
const navLogo = riseIn(1, ENTER_DELAY)
const navCta = riseIn(1, ENTER_DELAY + NAV_STAGGER * (NAV_LINKS.length + 1))

/**
 * Duas camadas fixas na mesma grade (ver AGENTS.md > Navbar):
 *
 * - `.nav` mesclada em `difference`: logo e links, brancos, invertem o que
 *   passar por baixo (gradiente ou foto).
 * - `.nav-cta` fora da mesclagem: o botao em Brasa. `difference` o viraria
 *   em duas cores ilegiveis. O `.nav__ghost` guarda a largura dele na camada
 *   mesclada para os links ficarem onde estao.
 *
 * No celular os links saem: sao duas ancoras e a propria rolagem ja leva a
 * elas. Fica logo + a unica acao do site, sempre a vista.
 */
export function Nav() {
  return (
    <>
      <nav className="nav" aria-label="Principal">
        <motion.a
          className="nav__logo"
          href={toHome(`#${SECTION.top}`)}
          aria-label="Urban Stay, voltar ao topo"
          variants={navLogo}
          initial="hidden"
          animate="show"
        >
          <img src="/img/logo.svg" alt="Urban Stay" width={202} height={20} />
        </motion.a>

        <motion.div className="nav__links" variants={navSequence} initial="hidden" animate="show">
          {NAV_LINKS.map((link) => (
            // o wrapper carrega a entrada; a opacidade 0.8 e o hover
            // continuam com o CSS do proprio link
            <motion.span key={link.href} className="nav__link" variants={navItem}>
              <a href={toHome(link.href)}>{link.label}</a>
            </motion.span>
          ))}
          <span className="btn btn--brasa nav__ghost" aria-hidden="true">{SITE.ctaShort}</span>
        </motion.div>
      </nav>

      <div className="nav-cta">
        <motion.a
          className="btn btn--brasa"
          href={toHome(`#${SECTION.lista}`)}
          variants={navCta}
          initial="hidden"
          animate="show"
        >
          {SITE.ctaShort}
        </motion.a>
      </div>
    </>
  )
}
