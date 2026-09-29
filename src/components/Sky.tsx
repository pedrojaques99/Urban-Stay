import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Ceu do comeco do heroi (pedido do dono, 28/09): so cores do vault (Ceu
 * Aberto sobre Areia, um toque de Mare Funda), deriva lenta em CSS e some na
 * primeira tela de rolagem. Dali para baixo o fundo e Areia lisa.
 *
 * `still`: a copia do loader fica parada no primeiro quadro. O ceu da
 * pagina so comeca a andar quando o loader sai (`html.is-loading` pausa),
 * entao a troca entre os dois e invisivel.
 */
export function Sky({ still = false }: { still?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || still) return
    // passada a primeira tela o ceu esta invisivel: pausa a deriva
    const off = (self: ScrollTrigger) => el.classList.toggle('is-off', self.progress === 1)
    const tween = gsap.to(el, {
      opacity: 0,
      ease: 'none',
      scrollTrigger: { start: 0, end: () => window.innerHeight, scrub: true, onUpdate: off, onRefresh: off },
    })
    return () => { tween.scrollTrigger?.kill(); tween.kill() }
  }, [still])

  return (
    <div className={still ? 'sky sky--still' : 'sky'} ref={ref} aria-hidden="true">
      <i className="sky__grain" />
    </div>
  )
}
