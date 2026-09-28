import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import { LEGAL_PAGES } from './legalContent'
import { applyDesignScale, useDesignScale } from './hooks/useDesignScale'
import { Nav } from './components/Nav'
import { Footer } from './components/Sections'
import { MaskTitle } from './components/Reveal'
import './styles.css'
import './site.css'
import './legal.css'

applyDesignScale()

/**
 * Paginas legais com a mesma nav e o mesmo rodape do resto do site (28/09).
 * Antes tinham cabecalho e rodape proprios, e pareciam de outro site.
 */
function LegalPage() {
  useDesignScale()
  const page = LEGAL_PAGES.find(item => item.href === window.location.pathname) ?? LEGAL_PAGES[0]
  return <MotionConfig reducedMotion="user">
    <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>
    <Nav solid />
    <main id="conteudo" className="site-frame legal-main">
      <p className="legal-date">Atualizado em 28 de setembro de 2026</p>
      <MaskTitle as="h1" text={page.title} onMount />
      <p className="legal-intro">{page.intro}</p>
      {page.sections.map(section => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map(text => <p key={text}>{text}</p>)}</section>)}
      <p className="legal-source">Referência: <a href="https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados" target="_blank" rel="noreferrer">Autoridade Nacional de Proteção de Dados</a>.</p>
    </main>
    <Footer />
  </MotionConfig>
}

createRoot(document.getElementById('root')!).render(<LegalPage />)
