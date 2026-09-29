import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { Eclipse } from '@theme-toggles/react'
import '@theme-toggles/react/styles/eclipse.css'
import { SITE } from '../design'
import { DUR, EASE_MASK } from '../lib/motion'

type Theme = 'light' | 'dark'

/** cor da barra do navegador por tema: a mesma superficie da pagina */
const BAR: Record<Theme, string> = { light: '#f8f4e2', dark: '#081821' }

const read = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', BAR[theme])
}

/**
 * Dia e noite (pedido do dono, 28/09). O tema inicial vem de
 * `theme-boot.js` (sistema escuro, ou noite das 18h as 6h); o clique salva
 * a escolha. A troca e um eclipse: o tema novo cobre a pagina num circulo
 * que nasce no botao (View Transitions). Sem suporte, ou com menos
 * movimento pedido, troca seco.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>(read)

  useEffect(() => apply(theme), [theme])

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    try { localStorage.setItem('us-theme', next) } catch { /* aba privada: vale so nesta visita */ }

    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || still) return setTheme(next)

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

    document.startViewTransition(() => flushSync(() => setTheme(next))).ready.then(() => {
      // WAAPI pede a curva em string; os numeros sao o token EASE_MASK
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        // motion-lint-disable-next-line hardcoded-curve  a string e montada do token EASE_MASK
        { duration: DUR.eclipse * 1000, easing: `cubic-bezier(${EASE_MASK.join(',')})`, pseudoElement: '::view-transition-new(root)' },
      )
    })
  }

  const label = theme === 'dark' ? SITE.theme.toLight : SITE.theme.toDark
  return (
    <Eclipse
      className={className}
      toggled={theme === 'dark'}
      onClick={toggle}
      duration={750}
      aria-label={label}
      title={label}
    />
  )
}
