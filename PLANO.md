# Urban Stay — plano de upgrade (fork)

Status: **conceituação** · 28/09/2026 · auditoria em [AUDIT.md](AUDIT.md) (42/100)

## Pré-voo — 28/09/2026

### Respostas do dono

| Pergunta | Resposta |
|---|---|
| Pra quem é o site | **Hóspede. É pra reserva**; o sistema é externo, o site só precisa vender |
| Onde a reserva acontece | **Airbnb / Booking**: o CTA leva pro anúncio |
| Tom: high ticket × vault ("jovem, vibrante") | **Meio a meio**: herói e foto premium e contidos; copy e momentos de marca com a vibração do vault |
| Moldura Urbana (hexágono chanfrado) | **Só em momentos-chave**: herói e um ou dois pontos de assinatura; o resto em retângulo limpo |
| Norte geral | mobile-first, leve, intuitivo, limpo, high ticket |

### O que a marca já decidiu (vault `6a56b9bc…` + Estratégia.pdf no Drive)

- **Produto:** hospedagem urbana de curta duração ("express", 1 a 3 dias), Rua 902, BC, a poucos passos da praia.
- **Público:** Gen Z e Millennials, fins de semana, casais e grupos de amigos, movidos por rede social.
- **Território:** jovem + autoral + acessível, com **alto valor percebido**. Não é BRUT/Felissimo (caros, corporativos), nem Airbnb (sem alma).
- **Endosso:** D'Sintra como marca-mãe (credibilidade de marca nova).
- **Paleta de seis:** Areia Clara `#F8F4E2`, Céu Aberto `#BFD9E3`, Maré Funda `#1A3E56`, Pôr do Sol `#DF5B09`, **Brasa `#CE3A00` (CTA)**, Noite Urbana `#020608`.
- **Tipo:** Clash Grotesk Medium caixa-alta, tracking −4%, leading 0,97 · corpo Regular, leading 1,3. Nunca Bold.
- **Foto:** sem rosto identificável em primeiro plano; silhueta e contraluz; alternar plano aberto de BC com detalhe sensorial.
- **Evitar:** tom corporativo de rede hoteleira, linguagem de tarifário.

### Tensão resolvida pelo "meio a meio"

"High ticket" aqui quer dizer **alto valor percebido**, não preço de luxo: a estratégia diz *acessível*. O site parece caro pela contenção e pela execução; o preço não aparece.

### Checagens

| Checagem | Situação |
|---|---|
| Vault × Drive | ⚠ o site diverge do vault: B2B em vez de hóspede, sem Brasa/Maré/Pôr do Sol, sem moldura, fotos com rosto em primeiro plano |
| Fontes carregáveis | ✅ Clash Grotesk via Fontshare (ITF Free Font License); ⚠ bloqueia render ~0,9s, então hospedar no site |
| Resolução de foto | ⚠ teto 2560px (`window.png`); `camera`/`cards` 404px e `suitcase` 501px são **thumb**, mas o site usa como card principal e herói |
| Arquivos de marca | ✅ logo em SVG no repo, pasta Drive com ícone, vertical, tagline e gradientes; ⚠ sem favicon no site |
| Números com fonte | ⚠ razão social, CNPJ, endereço, telefone e e-mail são placeholder no ar |

### Respostas da segunda rodada (28/09)

| Pergunta | Resposta | Consequência |
|---|---|---|
| Já opera? | **Não** | CTA é **pré-lançamento** ("quero ser avisado da abertura"), não "reservar". Sem nota nem avaliação: prova social não existe e **não se inventa**. O link de Airbnb/Booking entra quando o anúncio existir |
| O que é o fork | **Upgrade enviado ao cliente** (proposta). Jeferson é colaborador da Visant, autor da versão atual | Publicar com `noindex`; nada de dado fictício no ar; créditos do trabalho original preservados |

### Premissas adotadas sem resposta (o dono pode derrubar qualquer uma)

- **Uma página que vende** + páginas legais. Empresa/Atuação/Destino/Contato viram seções da home (a suíte, a experiência, a Rua 902 e a praia, FAQ) ou saem.
- **Fotos atuais = mood**, não o empreendimento. Mantidas na proposta, com as de rosto em primeiro plano rebaixadas pra detalhe; pedir ensaio real antes de ir ao ar.
- **D'Sintra** entra discreta no rodapé ("um projeto D'Sintra"), porque a estratégia usa o endosso para dar confiança a marca nova. Confirmar com o cliente.
- **EN-US no futuro** (resposta do dono, 28/09): nesta rodada, só deixar a copy isolada em `design.ts` pronta pra ganhar um segundo idioma. ES não.
- **Fotos são referência** (confirmado 28/09). O protótipo usa as atuais; o ensaio real vem depois.
- **Entrega = protótipo para aprovação do cliente** (confirmado 28/09).

### Sistema visual minerado dos mockups do Drive (40 peças)

- **Moldura Urbana:** hexágono vertical com ponta em cima e embaixo e laterais retas. Aparece em trio, com vista de BC dentro.
- **Colchetes de enquadramento:** `‹ RUA 902, BALNEÁRIO CAMBORIÚ ›`, a moldura em forma de tipo.
- **Lettering script "urban stay"** em outline, como marca d'água sobre foto e sobre cor.
- **Mosaico de molduras** em alturas alternadas (ritmo de skyline), em Maré Funda, amarelo e Areia.
- **Faixa vertical "URBAN STAY"** colada na lateral da foto.
- **Gradiente granulado** Céu/Maré → amarelo, o mesmo do `bg-gradient.png` do site.
- **Captura de pré-lançamento:** formulário simples (nome, WhatsApp/e-mail, data pretendida). Destino a definir: Formspree, planilha ou WhatsApp. Na proposta fica funcional com destino de teste.

## Cicatrizes (herdar, não reintroduzir)

- `--k` precisa existir **antes** da primeira pintura; gravar no `useEffect` causa CLS 0,918. (medido, 28/09)
- Loader não pode esperar `window.load`: segura o LCP até a maior PNG baixar (23,9s no 4G). (medido, 28/09)
- `mix-blend-mode: difference` da nav morre com qualquer stacking context em ancestral (AGENTS.md).
- `.reveal-line` usa `clip-path: inset(0 -100% …)` e não `overflow: hidden`: o overflow comia o ponto final e movia a baseline (comentário em `styles.css:351`).
- CARDS: a ordem do array é a ordem da roda e da esteira; reordenar cruza as trajetórias (AGENTS.md).

## Direção escolhida — 28/09

**A · Show curto, história nativa** ([comparação](https://claude.ai/artifact/UszSfGo31GjaE9p2n3P9hM)).
Premissas adotadas sem objeção: uma página que vende, institucional no rodapé, D'Sintra no rodapé,
lista de abertura com nome + WhatsApp e destino de teste.

## Execução

Branch `upgrade/mobile-first` no fork. Cada fase fecha com build verde e fotos em 390/1440.
Desktop ≥ 1024 **não muda de desenho** nas fases 1–3: só fica mais leve e estável.

| Fase | O quê | Pronto quando |
|---|---|---|
| **1 · Leveza e estabilidade** | `--k` antes da 1ª pintura (script inline no `<head>`) · loader espera só fonte, com teto · imagens AVIF/WebP em 480/960/1600 por script `sharp` (`npm run img`), PNG originais intactos · Clash Grotesk hospedada + `preload` · favicon, `robots` `noindex` (é proposta), OG | Lighthouse mobile: LCP < 2,5s, CLS < 0,1, perf ≥ 90 |
| **2 · Portão** | `↗` `+` `×` → `@phosphor-icons/react` · travessão e bolinha em texto visível e `aria-label` | `killer-scan` sem achado de copy e ruído |
| **3 · Limpeza** | sai `Memoir`, `Voices`, `LoaderPreview` + 3 variantes, CSS `.memoir/.voices`, avatares fictícios | build verde, nada renderizado some |
| **4 · Home mobile (A)** | abaixo de 1024: trecho fixado curto (~150svh) com o trio de molduras abrindo em leque, depois os 6 benefícios em fluxo nativo (foto 4:5, título ≥ 32px, texto ≥ 16px). O `draw` continua dono dos transforms | 390: nada abaixo de 14px, zero estouro, show < 2 telas |
| **5 · Página que vende** | seção Rua 902 (Maré Funda + colchetes) · Lista de abertura (form nome/WhatsApp, destino por env, teste por padrão) · CTA Brasa na nav · rodapé com D'Sintra + legais + institucional · placeholder fora do ar · copy isolada em `design.ts` pronta pra EN | nenhum dado fictício visível; o CTA leva pra lista de qualquer tela |
| **6 · Verificação** | `scripts/shoot.mjs` (antes/depois 390/1440) · Lighthouse · `killer-scan --report` · AGENTS.md atualizado (mobile, imagens, cicatrizes) | portão aberto com tela vista |
| **7 · Entrega** | push no fork + deploy de preview na Vercel com `noindex` · link pro cliente | URL responde 200 |

### Fase 4 "mais elaboradinha" (pedido do dono, 28/09)

O esboço da comparação é o piso, não o teto. Elaboração, sem perder a leveza:

1. **Roda de verdade, em retrato.** As 6 fotos nascem em anel girando (herança do desktop) e, no fim do trecho fixado, o anel se fecha no **trio de molduras**: a roda vira a assinatura da marca.
2. **Título em máscara por palavra** no herói e em cada benefício (o `wordRise` que já existe), disparado ao entrar na tela.
3. **Benefício com foto que abre**: a foto entra por recorte (`clip-path` de moldura → retângulo) e faz um parallax curto dentro da caixa.
4. **Grafismos do Drive como pontuação**, um por seção: colchetes `‹ RUA 902 ›`, faixa vertical "URBAN STAY" colada na foto, lettering script em outline como marca d'água na Rua 902, mosaico de molduras na lista de abertura.
5. **Contador discreto `01 / 06`** fixo durante a história, mostrando onde a pessoa está.
6. **Fechamento com o trio de volta**: a lista de abertura repete as três molduras, e o site termina com a mesma forma que abriu.

Tudo em `transform`, `opacity` e `clip-path`, com `prefers-reduced-motion` virando corte seco.

Fora desta rodada: versão EN, ensaio fotográfico real, destino definitivo da lista, dados comerciais reais.
