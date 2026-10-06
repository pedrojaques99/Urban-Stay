// Colhido do registry: `@visant/rail` — a versão canônica vive lá.
// Correção que valha para outros projetos deve ir no registry primeiro.
//
// Adaptado sem Tailwind (regra do projeto): o comportamento é o mesmo — snap
// nativo, setas que desabilitam nas pontas, o trilho é UMA parada de Tab
// (←/→, Home/End por dentro) e a máscara só existe do lado onde a lista
// continua. A aparência mora em `.rail*` no site.css.
import { useCallback, useEffect, useRef, useState } from 'react'
import type { FocusEvent, KeyboardEvent, ReactNode } from 'react'
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/csr/ArrowLeft'
import { ArrowRightIcon } from '@phosphor-icons/react/dist/csr/ArrowRight'

type RailProps = {
  children: ReactNode
  label: string
  prevLabel: string
  nextLabel: string
  className?: string
}

export function Rail({ children, label, prevLabel, nextLabel, className }: RailProps) {
  const ref = useRef<HTMLUListElement>(null)
  const [edge, setEdge] = useState({ start: true, end: false })

  const sync = useCallback(() => {
    const el = ref.current
    if (!el) return
    const start = el.scrollLeft < 8
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8
    setEdge((e) => (e.start === start && e.end === end ? e : { start, end }))
  }, [])

  // quem avisa que as pontas mudaram e o scroller, nao so a janela
  useEffect(() => {
    const el = ref.current
    if (!el) return
    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    return () => ro.disconnect()
  }, [sync])

  const items = () => Array.from((ref.current?.children ?? []) as HTMLCollectionOf<HTMLElement>)

  /** anda ate o proximo ITEM, nao uma distancia: o alvo ja e ponto de encaixe */
  const nudge = (dir: -1 | 1) => {
    const el = ref.current
    if (!el) return
    // paddingLeft, nao scrollPadding: o computado do scroll-padding com
    // max(calc(%)) volta sem resolver e a seta mirava o primeiro card
    const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0
    const base = el.getBoundingClientRect().left + pad
    const off = (c: HTMLElement) => c.getBoundingClientRect().left - base
    const list = items()
    const target = dir === 1 ? list.find((c) => off(c) > 4) : [...list].reverse().find((c) => off(c) < -4)
    el.scrollTo({
      left: target ? el.scrollLeft + off(target) : dir === 1 ? el.scrollWidth : 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  // tabindex rotativo: so o item ativo e alcancavel por Tab
  const anchor = useCallback((active: number) => {
    items().forEach((item, i) => {
      if (i === active) item.setAttribute('tabindex', '0')
      else item.setAttribute('tabindex', '-1')
    })
  }, [])

  useEffect(() => { anchor(0); sync() }, [anchor, children, sync])

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const list = items()
    const now = list.findIndex((it) => it.contains(document.activeElement))
    if (now === -1) return
    const step = e.key === 'ArrowRight' ? now + 1 : e.key === 'ArrowLeft' ? now - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? list.length - 1 : null
    if (step === null) return
    e.preventDefault()
    const next = list[Math.max(0, Math.min(step, list.length - 1))]
    anchor(list.indexOf(next))
    next.focus()
  }

  const onFocus = (e: FocusEvent<HTMLUListElement>) => {
    const i = items().findIndex((it) => it.contains(e.target as Node))
    if (i > 0) anchor(i)
  }

  return (
    <div className={`rail${className ? ` ${className}` : ''}`}>
      <ul
        ref={ref}
        className="rail__track"
        aria-label={label}
        onScroll={sync}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        data-start={edge.start || undefined}
        data-end={edge.end || undefined}
      >
        {children}
      </ul>
      {/* setas sao afordancia de ponteiro: o teclado ja anda com ←/→ */}
      <div className="rail__arrows">
        <button type="button" className="rail__arrow" tabIndex={-1} aria-label={prevLabel} disabled={edge.start} onClick={() => nudge(-1)}>
          <ArrowLeftIcon aria-hidden="true" />
        </button>
        <button type="button" className="rail__arrow" tabIndex={-1} aria-label={nextLabel} disabled={edge.end} onClick={() => nudge(1)}>
          <ArrowRightIcon aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
