import { useCallback, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { Loader } from './components/Loader'
import { Nav } from './components/Nav'
import { Stage } from './components/Stage'
import { MobileStage } from './components/MobileStage'
import { Story } from './components/Story'
import { Footer, Place, Waitlist } from './components/Sections'
import { InternalContent, NextPage } from './components/InternalPages'
import type { CorporatePage } from './components/Corporate'
import { CORPORATE, SITE } from './design'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { useDesignScale } from './hooks/useDesignScale'

/**
 * Uma pagina que vende a estadia (PLANO.md, 28/09/2026).
 *
 * Abaixo de 1024px o show de 820svh vira a abertura curta (`MobileStage`)
 * + os beneficios em rolagem nativa (`Story`). De 1024 para cima o `Stage`
 * do Figma segue intacto. Rua 902, lista de abertura e rodape sao iguais
 * nos dois.
 *
 * As paginas institucionais (empresa, atuacao, destino, contato) seguem
 * com a composicao original e sem loader; o cliente decide quais ficam.
 */
const pageKey = window.location.pathname.split('/').pop()?.replace('.html', '') ?? ''
const page = Object.hasOwn(CORPORATE.pages, pageKey) ? (pageKey as CorporatePage) : null
export default function App() {
  useSmoothScroll()
  const { compact } = useDesignScale()

  const [loading, setLoading] = useState(!page)
  // identidade estavel: o efeito do Loader depende de `onDone`
  const done = useCallback(() => setLoading(false), [])

  return (
    // `reducedMotion="user"` acompanha o mesmo respeito que o Lenis ja tem
    // por `prefers-reduced-motion`: as entradas viram corte seco, sem curso.
    <MotionConfig reducedMotion="user">
      {/* a marca cobre a pagina enquanto a fonte assenta; sai subindo */}
      {/* motion-lint-disable-next-line loader-without-guard  tela de marca, nao espera de request: o Loader ja tem tempo minimo e teto */}
      <AnimatePresence>{loading && <Loader onDone={done} />}</AnimatePresence>

      <div className={page ? 'internal-backdrop' : 'backdrop'} aria-hidden />
      <a className="skip-link" href="#conteudo">{SITE.skip}</a>
      <Nav solid={Boolean(page)} />
      <main id="conteudo" tabIndex={-1}>
        {page ? (
          <InternalContent page={page} />
        ) : (
          <>
            {compact ? <><MobileStage ready={!loading} /><Story /></> : <Stage />}
            <Place />
            <Waitlist />
          </>
        )}
      </main>
      {page && <NextPage page={page} />}
      <Footer />
    </MotionConfig>
  )
}
