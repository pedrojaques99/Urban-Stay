# Auditoria — Urban Stay (fork pedrojaques99/Urban-Stay @ 9fe9f56)

Data: 28/09/2026 · alvo: `src/` + páginas publicadas via `vite preview` · norte do dono:
**mobile-first, leve, intuitivo, limpo, high ticket**.

## Nota

**Depois do upgrade: 84/100** (antes 42). Detalhe por eixo na tabela; o que falta para 90+ está em "Próximo".

| Eixo | Antes | Depois | Por quê |
|---|---|---|---|
| Portão (4 detectores) | fechado | **aberto** | copy e ruído zerados; motion-lint limpo; token pulado (repo sem linter de token) |
| Mobile (390px) | 3/10 | **9/10** | abertura própria de 1 tela, texto ≥ 16px, história nativa |
| Leveza | 2/10 | **8/10** | 8,1MB → 528KB, LCP 23,9s → 3,6s, CLS 0,918 → 0; resta o peso do JS |
| Limpo / high ticket | 5/10 | **8/10** | uma ação só, paleta do vault, moldura em momentos-chave; placeholder segue nas institucionais (decisão do cliente) |
| Acessibilidade (Lighthouse) | 100 / 95 | **100 / 100** | Brasa de botão ajustada para AA (4,53:1) |


## Superfícies

Depois do upgrade (branch `upgrade/mobile-first`). A home virou uma página que vende; as institucionais seguem como vieram, ligadas pelo rodapé, para o cliente escolher.

| Arquivo | Superfície (A/B/C) | Variável de negócio que move | Notas |
|---|---|---|---|
| src/App.tsx | A | tempo até ver a marca e o título (LCP) | abertura mobile ou show do desktop por largura |
| src/components/Nav.tsx | A | inscrições na lista de abertura (CTA sempre à vista) | CTA Brasa fora da mesclagem |
| src/components/Stage.tsx | A | primeira impressão de marca no desktop | intacto, só o CTA mudou |
| src/components/MobileStage.tsx | A | primeira impressão de marca no celular sem custar rolagem | 1 tela de show, trio de molduras |
| src/components/Story.tsx | A | leitura dos 6 benefícios no polegar | foto 4:5, título ≥ 32px, contador fixo |
| src/components/Sections.tsx | A | inscrições na lista de abertura; confiança no lugar (Rua 902) | formulário nome + WhatsApp, sem fingir envio |
| src/components/Loader.tsx | A | tempo até o título (LCP) | só o pulso, 0,8s mínimo, teto de fonte 2,5s |
| src/components/InternalPages.tsx | A | confiança institucional (a decidir pelo cliente) | preservado |
| src/components/Corporate.tsx | A | tipo das páginas institucionais | preservado; o diretório não está na home |
| src/legal.tsx | C | conformidade LGPD da lista de abertura | texto atualizado; colchetes aguardam dados do cliente |
| src/main.tsx | A | estabilidade do layout (CLS) | escala antes do 1º render |

## Tela vista

Antes (28/09, manhã): ver quadros em `scratchpad/shoot/before/` e a nota 42/100 no topo.

Depois (28/09, tarde), Playwright chromium, `vite dev` :5180 e build em `vite preview` :5181, fontes carregadas, loader esperado:

- `/` 390×844 mobile+touch, 13 posições: anel de 6 fotos nasce e fecha no trio de molduras em 1 tela; título 44px, lead 16px, CTA 16px; história com contador `01 / 06` fixo e fotos 4:5 abrindo da moldura; Rua 902 em Maré Funda; lista com trio em mosaico; rodapé com institucional. Estouro 0, erro de console 0.
- `/` 1440×900: show do Figma intacto (roda → esteira), CTA Brasa no herói e na nav; Rua 902 com texto centralizado ao lado da foto 5:4; lista em duas colunas; rodapé com wordmark Areia. Estouro 0, erro 0.
- `/empresa` `/atuacao` `/destino` `/contato` `/privacidade` em 390 e 1440: estouro 0, erro 0; alturas iguais às de antes (o conteúdo não mudou).
- Formulário (390, com e sem movimento reduzido): CTA da nav leva à lista; vazio acusa os dois campos com mensagem; preenchido mostra "Protótipo: seu contato não foi enviado…". Com movimento reduzido o trio aparece montado sem animação.
- corta-scan: nenhum corte real. Acusados e confirmados como desenho: nav-cta sobre a nav mesclada (duas camadas, AGENTS.md), benefícios empilhados da esteira desktop, título display com line-height 0,97 (vault).
- Lighthouse mobile (build): home perf 88 · a11y 100 · boas práticas 100 · LCP 3,6s · CLS 0 · 528KB. Empresa perf 94 · a11y 100 · LCP 2,8s · CLS 0. SEO 66 por causa do `noindex` de protótipo (intencional).

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

## Próximo (fora desta rodada)

1. **JS**: framer-motion + GSAP + Lenis somam ~170KB gz (FCP 2,0s no 4G simulado). Caminho: `LazyMotion` + `m` no framer, e loader em HTML estático para pintar antes do JS.
2. **Fotos reais** em alta: `cards`/`camera` têm 404px e `suitcase` 501px; as atuais são referência.
3. **Lettering script "urban stay"**: não há arquivo na pasta da marca; pedir ao cliente antes de usar como grafismo.
4. **Vault**: Areia sobre Brasa dá 4,499:1 e reprova AA por 0,001; corrigir o par na marca (o site usa `#CD3A00` no botão).
5. **Institucionais**: o cliente decide quais ficam; `contato.html` ainda mostra dados de demonstração.
6. **Destino da lista** (`VITE_WAITLIST_ENDPOINT`) e dados reais do jurídico.
