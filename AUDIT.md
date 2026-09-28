# Auditoria — Urban Stay (fork pedrojaques99/Urban-Stay @ 9fe9f56)

Data: 28/09/2026 · alvo: `src/` + páginas publicadas via `vite preview` · norte do dono:
**mobile-first, leve, intuitivo, limpo, high ticket**.

## Nota

| Eixo | Nota | Por quê |
|---|---|---|
| Portão (4 detectores) | **fechado** | copy 6 achados, ruído 9 (seta em glifo); token pulado (repo sem linter de token) |
| Mobile (390px) | **3/10** | o compacto nunca foi desenhado: a home só encolhe a arte de 860 → texto de 6–8px |
| Leveza | **2/10** | LCP mobile 23,9s, 8,1MB na home; CLS 0,918 nas internas |
| Limpo / high ticket | **5/10** | desktop fiel e bonito; placeholder visível ("[Endereço… a informar]", `.example`, "Formulário demonstrativo") mata o high ticket |
| Acessibilidade (Lighthouse) | 100 home / 95 empresa | contraste do "Menu +" sobre o gradiente |

Nota geral: **42/100**. A arte de desktop é boa; o problema é o que ela vira fora de 1440.

## Superfícies

| Arquivo | Superfície (A/B/C) | Variável de negócio que move | Notas |
|---|---|---|---|
| src/App.tsx | A | tempo até o primeiro conteúdo (loader segura a página inteira) | loader espera `window.load` = todas as PNG eager |
| src/components/Corporate.tsx | A | clique para as 4 páginas institucionais | diretório da home; setas em glifo |
| src/components/Institutional.tsx | A | confiança institucional no rodapé da home | e-mail placeholder quebra linha a 390 |
| src/components/InternalPages.tsx | A | contato comercial enviado | formulário não envia: conversão = 0 por construção |
| src/components/Loader.tsx | A | tempo até o herói (LCP) | 250 linhas, 4 variantes + vitrine de dev; só `pulso` é usada |
| src/components/Memoir.tsx | — | nenhuma: não é renderizado | código morto (+ CSS + 5MB de imagem referenciada por internas) |
| src/components/Nav.tsx | A | orientação / acesso ao menu | "Menu +" e "Fechar ×" em glifo; contraste baixo no topo do gradiente |
| src/components/Stage.tsx | A | primeira impressão de marca (o "uau") e leitura dos 6 benefícios | a 390 o texto some; metade inferior da tela vazia na esteira |
| src/components/Voices.tsx | — | nenhuma: não é renderizado | código morto, depoimentos fictícios |
| src/legal.tsx | C | conformidade LGPD | ok |
| src/main.tsx | A | estabilidade do layout (CLS) | `--k` só é gravado depois da 1ª pintura |

## Tela vista

Playwright (chromium, cache npx), `vite dev` :5180 e `vite preview` :5181, fontes carregadas, loader esperado.
Quadros em `scratchpad/shoot/before/`.

- `/` 390×844 mobile+touch, 13 posições do trecho fixado: herói legível só no título; lead 8,2px, botão 6,3px; na esteira 55% da tela é gradiente vazio; título do benefício sangra ("A NOITE…" cortado pela borda na transição). Sem estouro horizontal, sem erro de console.
- `/` 1440×900: fiel ao Figma, roda → esteira → diretório → rodapé ok.
- `/empresa` `/atuacao` `/destino` `/contato` 390: legíveis (já usam `max(1rem, …)`); conteúdo passa por baixo do logo ao rolar; dados placeholder visíveis.
- Lighthouse mobile (build): home perf 61 / LCP 23,9s / CLS 0,21 / 8,1MB · empresa perf 48 / LCP 11,7s / CLS 0,918.
- corta-scan: só `line-height < 1` em título display (vaza, não corta: escolha tipográfica, falso positivo) e backdrop sob a nav (esperado). Nenhum corte real.

## Achados (confirmados em arquivo:linha)

### Raiz — consertar primeiro
1. **Escala única para tudo** — `styles.css:164,182,285,332` e `useDesignScale.ts:22`: todo texto é `figma × --k`; a 390 `--k = 0,45`. A home não tem piso de legibilidade. As internas já resolveram isso com `max(1rem, …)` (`internal.css:8`): o padrão existe no próprio repo.
2. **`--k` depois da pintura** — `styles.css:10` nasce `1`, `useDesignScale.ts:66` grava no `useEffect`. Causa o CLS 0,918 das internas e 0,21 da home.
3. **Loader amarrado ao `load`** — `Loader.tsx:168-174`: espera todas as imagens eager; o LCP (título do herói) só pinta quando `robe.png` (2,7MB) termina.
4. **Imagens PNG cruas** — `public/img` 12MB; `window.png` 3,7MB, `robe.png` 2,7MB servidas a 390px. Lighthouse: 7,8MB economizáveis.

### Mobile
5. Media query compacta (`styles.css:696-709`) só esconde links: herói, esteira e benefícios não têm composição de retrato.
6. Esteira a 390: cards ocupam o topo, copy do benefício com `white-space: nowrap` (`styles.css:327,336`) sangra pela borda; metade de baixo vazia.
7. Trecho fixado de 820svh = ~8 telas de polegar para 6 frases.
8. Rodapé: `comercial@urbanstay.example` quebra no meio (`Institutional.tsx`).

### Portão (conserto, não proposta)
9. Seta em glifo `↗` em 9 pontos (`Corporate.tsx:12,17,41,57`, `InternalPages.tsx:41,60,78,114,136`) + `+`/`×` no menu (`Nav.tsx:42,45`) → Phosphor.
10. Travessão em `aria-label` (`InternalPages.tsx:137`, `legal.tsx:13`), bolinha em kicker (`Corporate.tsx:53`). Loader/Voices: código morto, some com a limpeza.

### Leveza / higiene
11. Código morto: `Memoir.tsx`, `Voices.tsx`, CSS `.memoir`/`.voices` (~290 linhas), `LoaderPreview` + 3 variantes não usadas, 8 avatares fictícios.
12. `framer-motion` + `gsap` juntos: 166KB gz de JS para uma landing (Lighthouse: 79–92KB não usados).
13. Sem favicon (404 no console), sem `robots.txt`/`sitemap`, sem OG/card de compartilhamento.
14. Fonte do Fontshare bloqueando render (~750–970ms).

### High ticket (depende do cliente)
15. Placeholder visível: CNPJ, endereço, telefone, e-mail `.example`, "Dados ilustrativos", "Formulário demonstrativo".
16. O único CTA de conversão (contato) não envia nada.

## Advogado do diabo (resumo; perguntas no PLANO)

- **O show de scroll deveria existir no celular?** No desktop ele é a marca. No polegar são 8 telas pinadas pra ler 6 frases pequenas: o "uau" vira pedágio. Hierarquia de atenção: no mobile a foto e a frase têm que ser o conteúdo, não o intervalo entre fases.
- **High ticket é promessa do tamanho da prova.** Página premium com "[Endereço a informar]" e formulário que não envia é o contrário de prova. Isso pesa mais que qualquer token.
- **Leve** não é só peso: é também tempo até ler a primeira frase. Hoje são 24s no 4G.
