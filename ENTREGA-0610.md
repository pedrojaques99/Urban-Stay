# Urban Stay · entrega 06/10/2026

Branch `upgrade/mobile-first`. Ordem = impacto no celular (90% dos acessos).

## 1. Fotos em baixa: feito (provisório até os originais do cliente)

- O Figma **não tem** versão maior: o preenchimento original das fotos é o mesmo arquivo do exporte (câmera e cartões 404 px, mala 501, cama 736, banho 580). Reexportar em 3x só esticaria.
- Upscale de IA da Visant (`moodboard-upscale`) deu erro de servidor nas 8 tentativas (créditos ok).
- Feito com **Real-ESRGAN** (`realesrgan-x4plus`, binário oficial ncnn-vulkan) em 4x, depois limitado a 2000 px no lado maior. Mesmo nome em `public/img`, versões regeneradas com `npm run img`.

| foto | antes | agora |
|---|---|---|
| camera / cards | 404 × 257 | 1616 × 1028 |
| suitcase | 501 × 752 | 1332 × 2000 |
| bed | 736 × 920 | 1600 × 2000 |
| memoir-bath | 580 × 870 | 1333 × 2000 |
| memoir-terrace | 736 × 981 | 1501 × 2000 |
| memoir-paper | 735 × 1101 | 1335 × 2000 |

- `scripts/img.mjs`: versões `480/960/1440/1920` (celular 3x tem tamanho certo) e **aviso no console** quando um original tem menos de 1200 px no lado maior.
- **Pendente (cliente):** originais em ≥ 1600 px no lado maior destas 7 fotos. Quando chegarem: mesmo nome em `public/img` → `npm run img`.

## 2. Primeira rolagem lenta no celular: feito

**Causa principal:** na primeira rolagem a barra de endereço recolhe e dispara `resize`. `useDesignScale` criava estado novo, re-renderizava o App inteiro e regravava o `:root` justamente nessa hora.

| correção | arquivo |
|---|---|
| abaixo de 1024, `resize` só de altura é ignorado | `hooks/useDesignScale.ts` |
| `width/height` e `clip-path` escritos só quando mudam (antes, a cada quadro) | `MobileStage.tsx` |
| as 6 fotos do anel `eager` (3 eram `lazy` e decodificavam na primeira rolagem) | `MobileStage.tsx` |
| `will-change` sem `clip-path` | `site.css` |
| entrada do anel 1,6 s → 1,1 s, sem o atraso de 0,15 s | `lib/motion.ts`, `MobileStage.tsx` |

**Medido** (Chromium headless, 390 × 844 @3x, toque, CPU 4x mais lenta, barra recolhendo no 5º quadro, 4 rodadas):

| | tarefa longa | pior quadro |
|---|---|---|
| antes | 50–70 ms, em todas as rodadas | 50–70 ms |
| depois | **nenhuma** | 20–30 ms |

`npm run build` e `motion-lint` limpos.

## 3. Em aberto

- **Loader**: 3,1–3,6 s na CPU 4x. A persiana precisa de 1,6 s (`minDuration`); encurtar corta a animação de marca. Decisão do dono.
- Passada visual em 768, 1024, 1440 e 1920 + deploy de preview.
