import type { CSSProperties } from 'react'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { DUR, EASE_MASK } from '../lib/motion'
import { Sky } from './Sky'

/**
 * Loading — o simbolo Urban Stay em movimento.
 *
 * O simbolo e uma esfera fatiada: sete cordas verticais de um circulo de
 * raio 231.492 dentro do viewBox de 463. As alturas sao diferentes de
 * proposito (a corda encurta conforme se afasta do centro), e e essa
 * geometria que carrega o movimento — nada aqui inventa forma nova, so
 * reordena o tempo de cada fatia.
 *
 * `SLICES` esta na ordem visual, da esquerda para a direita:
 *
 *   i      0   1   2   3   4   5   6     indice da esquerda para a direita
 *   dist   3   2   1   0   1   2   3     distancia ate a fatia central
 *
 * Cada fatia publica `--i` e `--dist`; o CSS le um ou outro para decidir o
 * atraso. Onda que atravessa (usa `--i`) e onda que abre do centro (usa
 * `--dist`) saem da mesma tabela.
 *
 * `--cx` e o centro horizontal da fatia e vira `transform-origin`: sem ele
 * um `scaleX` arrastaria a fatia para o lado em vez de fecha-la no proprio
 * eixo. O `transform-box: view-box` do CSS e o que faz esses valores serem
 * lidos em unidades do viewBox.
 *
 * Duas leituras, ambas keyframe de CSS (rodam no compositor, sem frame de
 * React): `persiana` e a oficial da tela de carga (28/09, escolha do dono):
 * as fatias giram como laminas de um blackout, do centro para as pontas, e
 * param juntas na forma original. `pulso` e o loop para esperas menores. As outras tres
 * leituras (orbita, varredura, traco) foram testadas e descartadas em 28/09;
 * estao no historico do git se voltarem a ser consideradas. O
 * `draw` de `Stage.tsx` continua unico dono dos transforms dos cards — o
 * loader vive fora do palco.
 */

/** Fatias do simbolo, da esquerda para a direita. */
const SLICES: { cx: number; dist: number; d: string }[] = [
  { cx: 20.234, dist: 3, d: "M19.3827 138.657C6.93224 167.075 0 198.47 0 231.492C0 274.049 11.487 313.915 31.5204 348.176C31.9208 348.852 32.9594 348.564 32.9594 347.788V165.035C32.9594 164.272 33.9354 163.984 34.3609 164.622C35.8875 166.949 37.4516 169.252 39.0658 171.542C39.4913 172.155 40.4673 171.842 40.4673 171.091V103.233C40.4673 102.47 39.4787 102.169 39.0533 102.795C31.4954 114.082 24.901 126.082 19.3827 138.657Z" },
  { cx: 86.659, dist: 2, d: "M60.4882 75.7666V194.015C60.4882 194.215 60.5633 194.416 60.7009 194.553C62.9783 196.918 65.3433 199.196 67.7458 201.448C67.8959 201.598 67.9835 201.798 67.9835 201.998V395.025C67.9835 395.225 68.0711 395.426 68.2087 395.576C79.1577 406.475 91.2078 416.285 104.159 424.831C104.672 425.169 105.36 424.794 105.36 424.181V231.917C105.36 231.304 106.036 230.941 106.536 231.279C108.251 232.393 109.965 233.494 111.679 234.57C112.192 234.895 112.855 234.52 112.855 233.919V34.0481C112.855 33.4474 112.192 33.072 111.679 33.3849C92.7219 44.8719 75.5539 58.9866 60.6634 75.2536C60.5382 75.3913 60.4632 75.579 60.4632 75.7792L60.4882 75.7666Z" },
  { cx: 159.085, dist: 1, d: "M133.339 245.381C135.517 246.357 137.706 247.283 139.921 248.197C140.209 248.309 140.397 248.597 140.397 248.898V443.851C140.397 444.164 140.584 444.439 140.872 444.564C152.409 449.482 164.422 453.474 176.822 456.477C177.31 456.589 177.773 456.227 177.773 455.726V261.298C177.773 260.797 178.236 260.435 178.712 260.56C180.589 261.01 182.466 261.448 184.343 261.861C184.818 261.974 185.281 261.598 185.281 261.11V5.56832C185.281 5.08031 184.831 4.71743 184.355 4.80502C166.511 8.49637 149.419 14.2524 133.339 21.7978C133.064 21.9229 132.889 22.1982 132.889 22.4985V244.681C132.889 244.981 133.064 245.256 133.339 245.381Z" },
  { cx: 231.492, dist: 0, d: "M231.492 0C222.87 0 214.361 0.48801 205.99 1.40146C205.602 1.439 205.302 1.77686 205.302 2.16476V264.314C205.302 264.714 205.602 265.039 206.003 265.077C208.28 265.29 210.557 265.477 212.847 265.64H212.81V461.52C212.81 461.92 213.123 462.258 213.523 462.295C219.454 462.746 225.448 462.984 231.492 462.984C237.536 462.984 243.529 462.746 249.461 462.295C249.861 462.27 250.174 461.933 250.174 461.52V265.64H250.136C252.426 265.477 254.704 265.302 256.981 265.077C257.381 265.039 257.682 264.702 257.682 264.314V2.17727C257.682 1.78937 257.381 1.45152 256.993 1.41398C248.622 0.500523 240.113 0 231.492 0Z" },
  { cx: 303.899, dist: 1, d: "M278.641 261.861C280.518 261.448 282.395 261.01 284.272 260.56C284.747 260.447 285.21 260.81 285.21 261.298V455.726C285.21 456.227 285.686 456.589 286.161 456.477C298.562 453.474 310.574 449.469 322.111 444.564C322.399 444.439 322.587 444.164 322.587 443.851V248.898C322.587 248.585 322.775 248.309 323.062 248.197C325.277 247.296 327.467 246.357 329.644 245.381C329.92 245.256 330.095 244.981 330.095 244.681V22.4985C330.095 22.1982 329.92 21.9229 329.644 21.7978C313.565 14.2524 296.472 8.49637 278.629 4.80502C278.153 4.70491 277.703 5.08031 277.703 5.56832V261.11C277.703 261.598 278.153 261.974 278.641 261.861Z" },
  { cx: 376.287, dist: 2, d: "M350.116 34.0481V233.944C350.116 234.545 350.779 234.92 351.292 234.595C353.006 233.519 354.733 232.418 356.435 231.304C356.948 230.979 357.611 231.342 357.611 231.942V424.206C357.611 424.819 358.299 425.194 358.812 424.856C371.763 416.31 383.801 406.5 394.762 395.601C394.913 395.451 394.988 395.263 394.988 395.05V202.024C394.988 201.811 395.075 201.611 395.225 201.473C397.628 199.221 399.993 196.931 402.27 194.578C402.408 194.428 402.483 194.24 402.483 194.04V75.7666C402.483 75.5789 402.408 75.3913 402.283 75.2411C387.405 58.9866 370.224 44.8594 351.267 33.3724C350.754 33.0595 350.091 33.4349 350.091 34.0356L350.116 34.0481Z" },
  { cx: 442.75, dist: 3, d: "M430.024 347.776V165.022C430.024 164.259 429.048 163.971 428.623 164.609C427.096 166.937 425.532 169.239 423.918 171.529C423.492 172.142 422.516 171.829 422.516 171.079V103.22C422.516 102.457 423.505 102.157 423.93 102.782C431.488 114.069 438.083 126.057 443.601 138.632C456.064 167.049 462.984 198.445 462.984 231.467C462.984 274.024 451.497 313.89 431.463 348.151C431.063 348.827 430.024 348.552 430.024 347.776Z" },
]

type MarkProps = {
  /** lado do simbolo em px de tela; vira `--mark-size` */
  size?: number
  /** `persiana` abre uma vez e para; `pulso` repete */
  motion?: 'persiana' | 'pulso'
}

/**
 * O simbolo animado, sem moldura nem fundo. Serve para a tela de carga e
 * para qualquer espera menor (um botao, um bloco que ainda vai chegar).
 */
export function Mark({ size = 88, motion = 'pulso' }: MarkProps) {
  return (
    <svg
      className={`mark mark--${motion}`}
      style={{ '--mark-size': `${size}px` } as CSSProperties}
      viewBox="0 0 463 463"
      role="img"
      aria-label="Carregando"
      xmlns="http://www.w3.org/2000/svg"
    >
      {SLICES.map((slice, i) => (
        <path
          key={i}
          className="mark__slice"
          d={slice.d}
          style={
            {
              '--i': i,
              '--dist': slice.dist,
              '--cx': `${slice.cx}px`,
            } as CSSProperties
          }
        />
      ))}
    </svg>
  )
}

/* ------------------------------------------------------------------
   Tela de carregamento
   ------------------------------------------------------------------ */

type LoaderProps = {
  /** tempo minimo em tela: cobre a persiana inteira (1.6s), senao ela sai pela metade */
  minDuration?: number
  onDone: () => void
}

/**
 * Cobre a pagina com o mesmo ceu do `.backdrop` (parado), entao a saida nao e
 * uma cortina abrindo: e a marca sumindo sobre o fundo que ja estava la.
 *
 * O fim depende de duas coisas: a fonte assentada (`document.fonts.ready`,
 * sem isso o titulo do hero troca de metrica na frente do usuario) e o tempo
 * minimo. NAO espera o `load` da janela: isso amarrava a saida a maior foto
 * da pagina, e o titulo do hero (o LCP) so pintava depois dela. Medido em
 * 28/09: LCP de 23,9s no 4G. As fotos que faltam chegam com a pagina ja a
 * vista; `MAX_WAIT` segura o caso de fonte que nunca responde.
 */
/** teto de espera pela fonte, em ms: depois disso a pagina aparece de qualquer jeito */
const MAX_WAIT = 2500

export function Loader({ minDuration = 1600, onDone }: LoaderProps) {
  useEffect(() => {
    let alive = true
    const started = performance.now()

    const settled = Promise.race([
      document.fonts ? document.fonts.ready : Promise.resolve(),
      new Promise((resolve) => window.setTimeout(resolve, MAX_WAIT)),
    ])

    let timer = 0
    settled.then(() => {
      const left = Math.max(0, minDuration - (performance.now() - started))
      timer = window.setTimeout(() => {
        if (alive) onDone()
      }, left)
    })

    // trava o scroll enquanto a marca esta na frente. A classe vai na raiz,
    // nao no body: o html ja tem `overflow-x: clip`, entao o overflow do body
    // nao propaga para o viewport e um `hidden` la nao travaria nada.
    document.documentElement.classList.add('is-loading')
    window.scrollTo(0, 0)

    return () => {
      alive = false
      window.clearTimeout(timer)
      document.documentElement.classList.remove('is-loading')
    }
  }, [minDuration, onDone])

  return (
    <motion.div
      className="loader"
      // sai subindo de leve enquanto some: o mesmo gesto das mascaras
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: DUR.exit, ease: EASE_MASK }}
      // o Lenis ignora a roda enquanto o ponteiro estiver sobre a camada
      data-lenis-prevent
      role="status"
      aria-live="polite"
    >
      <Sky still />
      <Mark size={104} motion="persiana" />
      <span className="loader__label">Urban Stay®</span>
    </motion.div>
  )
}
