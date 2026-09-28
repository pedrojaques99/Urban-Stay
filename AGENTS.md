# Urban Stay®

Single-page React + Vite landing. Pixel-faithful recreation of the Figma file
[DS Urban Stay®](https://www.figma.com/design/DtBJMg8yBdK0gejCUnFApu/DS-Urban-Stay%C2%AE)
— frames `9068:838` (hero), `9068:893` (open wheel), `9068:919` (benefits).

Copy, UI, and comments are in Brazilian Portuguese. Keep new copy in PT-BR.

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run preview
npm run img      # regenerate public/img/opt/*.webp + src/img-manifest.json after adding/replacing a photo
node scripts/css-orfao.mjs [--fix]   # list (or remove) CSS rules whose classes no .tsx/.html uses
```

## Upgrade 28/09/2026 (branch `upgrade/mobile-first`) — read PLANO.md and AUDIT.md

The home is now **one page that sells the stay**. The venue does not operate yet, so the single action is the **waitlist** (`#lista`, "Lista de abertura"). No reviews, ratings or numbers without a source.

- **< 1024px** renders `MobileStage` (one screen of pinned show: 6 photos born in a ring that closes into the **trio of Moldura Urbana**) + `Story` (the 6 benefits in native scroll, sticky `01 / 06` counter). The 820svh `Stage` is desktop only and unchanged except its CTA.
- After the show, both widths render `Sections.tsx`: `Manifesto` (Figma `9111:4`), `Place` (Rua 902, Maré Funda), `Depoimentos` (Figma `9111:2336`), `Waitlist`, `Footer`.
- `Manifesto`: geometry in `MANIFESTO` (design.ts), all in `em` of the title; the title size comes from the frame width (`100cqi / 5.25`), so every line fits at any width. Photos sit inline on the baseline (`MaskTitle` accepts elements inside a line) and open in place like a curtain; `perLine` makes each line trigger on its own (the title is taller than the screen). - `Depoimentos` is a **PLACEHOLDER** by the owner's call (28/09): the Figma's sample quotes, not real guests. The "no reviews without a source" rule is suspended for this section only. Replace `SITE.depoimentos.items` with real, authorized guests before launch. Stars are Phosphor `Star` fill (project rule), not the Figma SVG.
- The institutional pages (empresa/atuação/destino/contato) are **kept** and are the nav links: **links go to their own routes, never to anchors** (owner's call, 28/09). The only anchor is the waitlist CTA (`toHome('#lista')`), because the list lives on the home. **At every width and on every route** the links live only in the full-screen `<dialog>` menu (`.menu`, Noite Urbana, links in the h1 scale, each link swaps the photo on the right via `MENU_PHOTOS`, the waitlist button bottom-right; owner's call 28/09). The bar keeps logo, waitlist CTA and the Menu button. Every page ends with the same `Footer`; institutional pages add `NextPage` before it (empresa → atuação → destino → contato → empresa). The client decides which pages stay; do not delete them without that decision.
- Copy lives in `design.ts` (`SITE`, `SECTION`, `INSTITUTIONAL_LINKS`), never in components: an EN-US version comes later.
- New sections have no Figma node: they are **mobile-first in rem/clamp** (`site.css`), not `figma * --k`. The `--k` rule still binds everything that came from the art-board.
- Palette: only the vault's six (Areia, Céu Aberto, Maré Funda, Pôr do Sol, Brasa, Noite Urbana). Brasa is for buttons only; button background is `--brasa-acao` (`#CD3A00`) because Areia on the vault's `#CE3A00` is 4.499:1 and fails AA.
- Waitlist destination: `VITE_WAITLIST_ENDPOINT` (POST JSON). Unset = prototype: the form validates and says nothing was sent. Never fake a success.
- Photos: `imgProps(src, sizes, boxRatio)` from `lib/img.ts`. Pass the box ratio when the photo is cropped with `object-fit: cover`, or the browser downloads a size too small (landscape `window.png` in a 4:5 box was blurry).
- Icons: `@phosphor-icons/react`, imported per file (`@phosphor-icons/react/dist/csr/ArrowUpRight`). Never an arrow character or a hand-drawn SVG.
- **Reveals are shared** (`components/Reveal.tsx`): `MaskTitle` (caps title rising word by word through a mask), `RevealPhoto` (photo opening from the sides, `moldura` for the one Moldura Urbana moment per page), `Rise`. Home sections and institutional pages use the same ones; never copy a reveal into a component.
- **Institutional and legal pages** follow the vault type: h1 Medium, caps, -4%, leading .97, one scale for every route (`clamp(3rem, 9.5vw, 8.5rem)`). Labels are one design: .75rem caps, tracking .16em, location in the brand bracket. `<Nav solid />` adds an Areia band behind the nav after the first scroll (pages without photos only; the home keeps the pure blend). Accordions open with native `::details-content` + `interpolate-size`, icon Phosphor `Plus` rotated 45°.
- **Symbol motion = persiana** (owner's call, 28/09): the 7 slices turn on their own axis (`scaleX`), center first, 0.16s per step to the tips, all landing on the original shape. Loader: CSS `.mark--persiana` (`minDuration` 1600 covers it). Footer: GSAP in `FooterMark` (symbol split into slats once at SVG injection; the ® stays whole). Standalone version + variants in `public/loader/urbanstay-loader`; `python scripts/loader-mp4.py` exports MP4.
- Motion durations for reveals live in `DUR` (`lib/motion.ts`). `node ~/.claude/skills/visant-motion/scripts/motion-lint.mjs src` must stay clean.

### Scars (do not reintroduce)

- `applyDesignScale()` runs in `main.tsx` **before** the first render. Writing `--k` only in the hook's effect painted the page at scale 1 first: CLS 0.918.
- The loader waits for **fonts only** (cap 2.5s), never `window.load`: that tied the LCP to the heaviest photo (23.9s on 4G).
- The loader's full-screen background is the home's LCP. It is served as **lossless** WebP (`opt/bg-gradient.webp`, pixel-identical, 66KB) with `preload`. Lossy WebP destroys the grain.
- `.story__list` has no `gap`; spacing is padding inside each item. With a gap, the mid-screen line fell between items and the counter froze.
- Phosphor icons sit above the text baseline unless their wrapper is flex (`span:has(> svg:only-child)` in styles.css).
- The loader forces the top while it covers the page. Arriving with a hash (`/#lista` from the other pages) scrolls to it in `App.tsx` when the loader leaves; without that the waitlist button landed on the hero.
- `Rise` (tall text blocks) triggers on `amount: 'some'` + bottom margin, never a fraction: with 0.5, and even 0.15, the open Atuação accordion stayed at opacity 0 with 24% of it on screen.
- **One Brasa action on screen at a time**: CTAs carry `data-cta`; the nav pill goes quiet (`.nav-cta.is-quiet`) while any of them is visible. The home footer has no CTA (the form is right above it).
- The nav band also turns on over `data-nav-band` sections on the home (the waitlist: text on the gradient, no photo).

No test or lint scripts. TypeScript is strict (`noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`). `npm run build` is the typecheck.

## Layout

```
src/
  App.tsx                 # Nav + Stage + footer; mounts scale + Lenis
  design.ts               # ALL Figma numbers, grid, CARDS, copy, nav links
  styles.css              # tokens + layout; every px is calc(figma * var(--k|--kb))
  main.tsx
  components/
    Nav.tsx               # two-layer navbar (blend vs. CTA)
    Stage.tsx             # the whole scroll show: wheel → strip → copy
  hooks/
    useDesignScale.ts     # publishes --k, --kb, --frame-half, --side-clip
    useSmoothScroll.ts    # Lenis driven by the GSAP ticker
  lib/math.ts             # lerp, range, ease, smoothstep, settle
public/img/               # Figma exports (do not recompress or rename; screen versions are generated into public/img/opt by `npm run img`)
```

There is no router, no state library, no component library. Do not add any of those unless asked.

## Geometry is law

`src/design.ts` is the single source of truth for sizes, slots, and copy. Numbers come from the Figma art-board of **1440 × 960**.

- Grid: 12 columns, margin 32, gutter 32 → column = 85.3333. Use `COLUMN`, `span(n)`, `columnX(n)`.
- Photo widths (`344.524` on the wheel, `436.157` / `321.206` on the strip) come from the art, **not** from a column count. Do not round them to the grid.
- Annotate every new coordinate with its Figma node id.

CSS never hard-codes a viewport size. Write `calc(<figma px> * var(--k))`. The benefits block uses `--kb` (same as `--k`, then shrunk if the window is shorter than the composition).

`useDesignScale` publishes:

| viewport | `--k` |
|---|---|
| ≤ 1440, ≥ 1024 | `innerWidth / 1440` |
| > 1440 | `1` — art stops growing, frame stays centered, photos bleed to the window edge |
| < 1024 | `innerWidth / 860` (compact art-board) |

`--side-clip` only aligns in-flow text to the art-board margin. Do not use it to clip photos.

Trust the **code** over README / CSS comments when they disagree. Known stale notes: README says track height 620vh (code is `TRACK_VH = 820`); a CSS comment says compact frame 820 (code is 860).

## The scroll show (`Stage.tsx`)

One sticky `100svh` stage inside a ~`578svh` track (was 820 until 28/09: the strip now stops only at `STRIP_STOPS`, max 3, see below). One `ScrollTrigger` (`start: top top`, `end: bottom bottom`). **No per-card tweens.** Every frame, `draw(progress)` writes `transform` / `opacity` / `border-radius` onto the 12 card nodes.

Progress windows (they overlap on purpose so no card ever rests between phases):

| progress | what happens |
|---|---|
| `0 → 0.35` | cards born at scale 0.05, spin 148°, grow into frame `9068:893` |
| `0.29 → 0.44` | wheel keeps spinning +90° while unrolling onto the strip (arc, not a straight lerp) |
| `0.33 → …` | hero unpins and rises at exact scroll speed |
| `0.38 → 0.46` | first benefit copy rises through a mask |
| `0.44 → 1.00` | strip walks card to card |

These windows are the ORIGINAL fractions of the 720vh **pin distance** (track − 100svh; ScrollTrigger progress runs on it). `Stage.tsx` rescales them with `at()` so the wheel keeps its absolute length and only the strip shrinks. The strip stops at `STRIP_STOPS` in `design.ts` (max 3, card indices): the tape walks through the cards in between but copy exists only for the stops.

If you change a window, re-check the overlaps. A gap between wheel and strip is a regression.

### Wheel

Each open-wheel slot is stored as a cartesian offset from frame center, then converted once to `(angle, radius)` via `atan2` / `hypot`. That is why the spin lands on the grid with no manual correction.

`border-radius` is counter-scaled every frame (`radiusPx * k / scale`) so the Figma radius (6 on the wheel, 4.715 on the strip) stays visually constant while the card is scaled up to ~1.61×.

Strip sizes are uniform scales of the wheel photo (`436.157 / 344.524`, `321.206 / 344.524`). **Never change width and height independently** — photos must not distort.

### Strip (benefits)

A 12-slot tape: 6 wheel cards + 6 echoes of the same photos (echoes exist so the last real card still has tape to its right).

`layoutRow(active)` rebuilds the tape from scratch every frame:

1. each card width lerps `321.206 → 436.157` by proximity to the active index
2. gutters of 32 accumulate
3. the tape slides so the **left edge of the active card** sits on the 32px margin

Cards grow/shrink around `ROW_CENTER_Y`, so the lead card always starts at `ROW_TOP` and the copy below never moves.

`CARDS` array order **is** the strip order **and** the clockwise wheel order (from top-left): suitcase → bed → robe → cards → camera → window. Reordering the array breaks the unroll (trajectories cross). To change sequence, change the array and re-derive slots from Figma.

Copy: one benefit per card, all stacked at the same point. Incoming waits below the mask, outgoing leaves through the top. Swap happens mid-travel (`|d|` between 0.25 and 0.5) so two texts are never visible at once and the slot is never empty. The active index goes through `settle` (linear mixed with smoothstep).

## Navbar

No background, no padding of its own: 32 from the top, 32 from the sides. Bar = logo + waitlist CTA + Menu button (no inline links since 28/09; see the upgrade section).

Two fixed layers on the same grid, because `mix-blend-mode: difference` only composites against the page backdrop if it sits on a top-level element. Any new stacking context (filter, opacity < 1, transform on a wrapper, `isolation`, `will-change` on an ancestor) kills the blend.

- `.nav` — logo + links, white type, `mix-blend-mode: difference`
- `.nav-cta` — the Brasa “Lista de abertura” pill, **outside** the blend (difference would invert it into two unreadable colors)
- `.nav__ghost` — invisible twin of the pill, keeps the links where they sit in Figma

Do not wrap `.nav` in a new parent. Do not put `mix-blend-mode` on `.nav-cta`.

## Motion stack

- **gsap + ScrollTrigger** — scroll progress only. Transforms are written in the `draw` loop.
- **lenis** — inertia, ticked by `gsap.ticker` so Lenis and ScrollTrigger share the frame. `lagSmoothing(0)`.
- Font: Clash Grotesk (ITF Free Font License), self-hosted in public/fonts, weights 400/500 (the brand never uses Bold).
- `prefers-reduced-motion: reduce` skips Lenis. Do not add a reduced-motion path that still drives Lenis.

After font load, call `ScrollTrigger.refresh()` (already done in `Stage`). If you change type sizes or the track height, trigger a refresh.

## Assets

`public/img/` — exported from Figma. `bg-gradient.png` is the shared fill of the three frames, painted as one `position: fixed` `.backdrop`. Do not replace with a CSS gradient; the grain and stops are in the PNG. The site serves its lossless WebP copy (`opt/bg-gradient.webp`); regenerate with `npm run img`.

## Do not

- Introduce CSS modules, Tailwind, styled-components, or a UI kit.
- Animate cards with GSAP tweens, React state, or CSS keyframes. The `draw` loop owns transforms.
- Recenter / round Figma fractional pixels.
- Clip the stage (`overflow: hidden` on `.stage` would crop the bleeding photos).
- Add a background, scrim, or blur to the navbar to “fix” contrast. The blend is the design.
- Translate the Portuguese copy.
- Edit `dist/` — it is a build output.

## Verify UI in the browser

This is a visual, scroll-driven page. After any layout, style, or motion change:

1. `npm run dev` and walk the full 820vh pin: birth → spin → unroll → strip walk → footer.
2. Check 1440-wide (1:1 with Figma), >1440 (art capped, photos bleed), and <1024 (compact 860, nav links hidden).
3. Confirm the active strip card’s left edge sits on the 32px margin, copy never dual-appears, and `mix-blend-mode` still inverts the nav over both the gradient and the photos.
