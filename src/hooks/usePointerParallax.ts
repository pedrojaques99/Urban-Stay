// Colhido do registry: `@visant/use-pointer-parallax` — a versão canônica vive lá.
// Correção que valha para outros projetos deve ir no registry primeiro.
import { useEffect } from 'react'
import type { RefObject } from 'react'

/**
 * Escreve `--px` e `--py` (-1 a 1, posicao do ponteiro sobre o alvo) uma vez
 * por quadro, e o CSS decide a profundidade de cada objeto com um `--d`.
 * So com ponteiro fino e sem movimento reduzido: no toque nao ha hover, e a
 * paralaxe ficaria presa no ultimo toque. Sem o hook, `--px/--py` ficam 0 e a
 * composicao e a imagem parada, que e o repouso correto.
 */
export function usePointerParallax<T extends HTMLElement>(ref: RefObject<T | null>, { enabled = true } = {}) {
  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return

    let fine = false
    try {
      fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) fine = false
    } catch {
      fine = false
    }
    if (!fine) return

    let pending = false
    let px = 0
    let py = 0
    let raf = 0

    const paint = () => {
      pending = false
      el.style.setProperty('--px', px.toFixed(3))
      el.style.setProperty('--py', py.toFixed(3))
    }
    const schedule = () => {
      if (pending) return
      pending = true
      raf = requestAnimationFrame(paint)
    }

    const move = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse') return
      const r = el.getBoundingClientRect()
      if (r.bottom < 0 || r.top > window.innerHeight) return
      px = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1))
      py = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1))
      schedule()
    }
    const rest = () => {
      px = 0
      py = 0
      schedule()
    }

    document.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', rest, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', rest)
    }
  }, [ref, enabled])
}
