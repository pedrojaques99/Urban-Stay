import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { Eclipse } from '@theme-toggles/react'
import '@theme-toggles/react/styles/eclipse.css'
import { SITE } from '../design'
import { DUR } from '../lib/motion'
import { clamp01, easeOutQuint } from '../lib/math'

type Theme = 'light' | 'dark'

/** cor da barra do navegador por tema: a mesma superficie da pagina */
const BAR: Record<Theme, string> = { light: '#f8f4e2', dark: '#081821' }

/**
 * Persiana (o gesto do simbolo, AGENTS.md): 7 laminas verticais giram no
 * proprio eixo, a do centro primeiro e as outras ate as pontas. Um unico
 * `polygon` desenha as 7, ligadas por arestas de area zero no topo; os
 * quadros sao amostrados aqui porque cada lamina tem o proprio atraso.
 */
const SLATS = 7
const FRAMES = 36
/** atraso por passo do centro ate a ponta, em fracao da duracao (o loader usa 0.16s de 1.6s) */
const STEP = 0.14
const TURN = 1 - STEP * Math.floor(SLATS / 2)

function persiana(): Keyframe[] {
  const half = 100 / SLATS / 2
  return Array.from({ length: FRAMES + 1 }, (_, f) => {
    const t = f / FRAMES
    const points: string[] = []
    for (let i = 0; i < SLATS; i++) {
      const cx = (i + 0.5) * (100 / SLATS)
      const delay = Math.abs(i - Math.floor(SLATS / 2)) * STEP
      // +0.05: as laminas abertas se sobrepoem, sem fresta de meio pixel
      const w = (half + 0.05) * easeOutQuint(clamp01((t - delay) / TURN))
      points.push(`${cx - w}% 0%`, `${cx - w}% 100%`, `${cx + w}% 100%`, `${cx + w}% 0%`)
    }
    return { clipPath: `polygon(${points.join(', ')})` }
  })
}

const read = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', BAR[theme])
}

/**
 * Dia e noite (pedido do dono, 28/09). O tema inicial vem de
 * `theme-boot.js` (sistema escuro, ou noite das 18h as 6h); o clique salva
 * a escolha. O icone e o eclipse; a troca e a persiana da marca: o tema
 * novo entra pelas 7 laminas (View Transitions). Sem suporte, ou com menos
 * movimento pedido, troca seco.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>(read)

  useEffect(() => apply(theme), [theme])

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    try { localStorage.setItem('us-theme', next) } catch { /* aba privada: vale so nesta visita */ }

    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || still) return setTheme(next)

    document.startViewTransition(() => flushSync(() => setTheme(next))).ready.then(() => {
      document.documentElement.animate(persiana(), {
        duration: DUR.theme * 1000,
        easing: 'linear', // a curva ja esta nos quadros, lamina por lamina
        pseudoElement: '::view-transition-new(root)',
      })
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
