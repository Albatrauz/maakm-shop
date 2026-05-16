# MAAKM.shop — Design System Implementation Plan

Source of truth (do not edit, treat as read-only):
- [pattern.html](pattern.html) — canonical design pattern doc from Claude Design (open in browser to view)
- [reference-styles.css](reference-styles.css) — production CSS used in the original HTML prototype

The pattern doc is the spec. Open it before building any new component. This file is the implementation playbook for translating it into the Nuxt 4 + Vue 3 + Tailwind app.

---

## 0. Locked decisions (2026-05-09)

1. **Tailwind v4** — upgrade from `@nuxtjs/tailwindcss@6.14` (v3). Tokens go in `@theme` blocks in CSS, not `tailwind.config.{js,ts}`.
2. **Cart** — Shopify Storefront Cart API (server-truth, supports Shopify-hosted checkout handoff). `useCart()` wraps it.
3. **Serif** — locked to **Instrument Serif** italic. No `data-serif` switcher; drop the alt-serif CSS rules from the reference styles when porting.
4. **Language** — Dutch only. No locale switcher, no `/en/...` routes.
5. **Product data conventions:**
   - **Color** → `variant.selectedOptions` with option name `Kleur` (Color). Hex resolved from a fixed `colors` map keyed by option value.
   - **Material** → product `tag` prefix `material:PETG` / `material:PLA` / `material:ASA`. Filters parse the prefix; PDP shows the value as a `MTag`.
   - **Marketing tag** (`Bestseller`, `Nieuw`) → product tag (`badge:bestseller`, `badge:nieuw`). Show max one per card.

---

## 1. The system in one paragraph

Editorial, Dutch-first webshop for a 3D-print studio. Warm-paper neutrals, one terracotta accent, deep ink text. Three type families: **Inter Tight** (sans, body + UI), **Instrument Serif** italic (emphasis inside headlines, never full paragraphs), **JetBrains Mono** (kickers + meta, uppercase, tight letterspacing). Generous editorial vertical rhythm (56–80px between sections). Photography over illustration. Pill-shaped buttons. Cards with 4:5 product imagery.

## 2. Five principles (lift verbatim from the spec)

1. **Quiet by default, loud on accent** — page rests in warm neutrals; accent is reserved for the one thing that matters most. Never two accents in the same viewport.
2. **Photography over illustration** — real product photos on warm neutral surfaces; placeholders only as scaffolding.
3. **Editorial spacing** — 56–80px between sections; tight density only inside cards and tables.
4. **Mixed type voice** — sans for body/UI, italic serif for one-or-two-phrase emphasis inside a headline. Never set bodies in serif.
5. **Honest about production** — print-on-demand is the product; surface lead times, "geen voorraad, geen verspilling", real material names.

## 3. Tokens

These are the canonical values. Everything in the app must resolve through them.

### Color
```
--bg          #F6F4EF   page background, warm paper
--bg-2        #EFEBE2   footer / soft fill
--paper       #FFFFFF   cards, inputs
--ink         #1A1A17   primary text, primary buttons
--ink-2       #4A4A45   body copy, nav
--ink-3       #8A8A82   muted, captions, mono-meta color
--line        #D9D4C7   borders, dividers
--line-2      #EBE6DB   soft inner dividers (table rows)
--accent      #D65A31   terracotta — CTAs, prices, italic-serif
--accent-2    #2A3F2E   moss — secondary accent (rare)
```
Themeable alts (override `--accent` on `<html>`): forest `#3A8A4A`, cobalt `#2A5FCC`.

**Rule:** one accent visible per viewport. Never color-fill cards or alternate-bg sections. Don't tint icons.

### Type
```
--font-sans   "Inter Tight", system-ui, sans-serif
--font-serif  "Instrument Serif", serif        /* always italic via .serif */
--font-mono   "JetBrains Mono", ui-monospace, monospace
```

Type scale (matches `.h1`/`.h2`/`.h3` in `reference-styles.css`):
| Role | Family | Size / line | Tracking | Weight |
|---|---|---|---|---|
| H1 / hero | Inter Tight | clamp(48, 7vw, 104) / 0.96 | -3.5% | 500 |
| H2 / section | Inter Tight | clamp(32, 4.5vw, 64) / 1.0 | -3% | 500 |
| H3 / card title | Inter Tight | clamp(20, 2vw, 28) / 1.15 | -2% | 500 |
| Body | Inter Tight | 16 / 1.5 | 0 | 400 |
| Small | Inter Tight | 13 / 1.4 | 0 | 400 |
| Mono kicker | JetBrains Mono | 11 uppercase | +6–8% | 400 |
| Serif accent | Instrument Serif italic | matches headline size | 0 | 400 |

Google Fonts URL: `Inter+Tight:wght@400;500;600&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500`.

### Spacing (4-base scale)
`2xs 4 · xs 8 · sm 12 · md 16 · lg 24 · xl 32 · 2xl 56 · 3xl 80`

Rule: **gaps inside cards 12–24, section padding 56–80**. Never 40 or 48 for section rhythm — break the editorial feel.

### Radius
| Token | px | Use |
|---|---|---|
| `--r-xs` | 4 | tags, swatches inside cards |
| `--r-sm` | 6 | inputs, small thumbnails, soft buttons |
| `--r-md` | 8 | cards, product imagery, panels |
| `--r-lg` | 12 | hero banners, large CTAs |
| `--r-pill` | 999 | buttons, chips, qty steppers, icon buttons |

### Motion
| Token | Value | Use |
|---|---|---|
| `--d-fast` | 150ms ease | hover (button lift, image scale 1.005) |
| `--d-base` | 250ms ease | drawer overlay fade, toast |
| `--d-slow` | 300ms cubic-bezier(.2,.7,.2,1) | cart drawer slide |
| marquee | 40s linear infinite | homepage strip |

No springs, no parallax, no decorative motion.

### Layout
- Page container: `max-width: 1440px`, `padding: 0 28px` (`.shell`).
- Catalog: 3-col × 24px gap with 260px sidebar at 48px gap.
- Featured (home): 4-col × 24px gap.
- PDP: `1.3fr / 1fr` — gallery left, info right (sticky).
- Checkout: `1.3fr / 1fr` — form left, summary right (sticky).
- Hero collage: `2fr / 1fr` — primary photo + 2 stacked.
- Footer: `2fr / 1fr / 1fr / 1fr`.

## 4. Component inventory

Lifted from the pattern doc. Each one needs a Vue SFC.

| # | Component | Notes |
|---|---|---|
| 1 | `Btn` (primary / accent / ghost / icon-only) | All pill. Hover: `translateY(-1px)`, 150ms. Accent hover bg `#b9492a`. |
| 2 | `Chip` | mono 10px uppercase, line border, pill. |
| 3 | `Tag` | mono 9px uppercase, 4px radius, intra-card. |
| 4 | `Field` | mono 10px label above; input 12/14 padding; 6px radius; focus border swaps to ink. |
| 5 | `ProductCard` | 4:5 image, hover scale 1.005 / 0.3s, meta row (title + price), color dots (14×14, first 5 + `+N`), 1 marketing tag + 1 material tag. |
| 6 | `SectionHeader` | 3-col grid: kicker / title / link — top border, no heavy bar. Numbered kickers only on homepage (01–04 max). |
| 7 | `TopBar` | sticky, blurred bg, wordmark `MAAKM<span class="dot">.</span>shop`, nav, icon buttons (search/account/cart with badge). |
| 8 | `Footer` | 4-col grid (2/1/1/1). |
| 9 | `MarqueeStrip` | 40s linear infinite mono text. |
| 10 | `CartDrawer` | 460px, slide from right, 300ms cubic-bezier(.2,.7,.2,1); overlay fade 250ms. Free-shipping progress bar. |
| 11 | `Toast` | bottom-center pill, slide+fade 250ms. |
| 12 | `CheckoutSteps` | pill steps with dot indicator (active / done). |

Icons: Lucide-style line icons, **1.5px stroke**, consistent across one viewport. The original used inline SVGs (see `cart`, `search`, `user`, `arrow-right`, `check`, `truck`, `shield`, `leaf`, `tool`, `menu`, `star`, `filter`, `heart`, `x`, `plus`, `minus`).

## 5. Voice / copy

Dutch-first. Direct, never over-promising. Examples from the spec:

| Say | Don't say |
|---|---|
| Op bestelling geprint | Made-to-order luxury |
| Levertijd 3–5 dagen | Snel verzonden |
| Wij printen het | Onbeperkte mogelijkheden |
| Lokaal · Eindhoven | Premium European craftsmanship |
| Geen voorraad, geen verspilling | Sustainable luxury experience |

Avoid AI-generated tropes the user explicitly removed: numbered eyebrows on every section, mono-text intro labels (`X · Y · NL`), step-numbered tags inside cards, numbered process steps, `01` overlays on tiles.

## 6. Implementation phases

Current state: Nuxt 4 + Vue 3 + Shopify Storefront API. `app/pages/index.vue` lists products with default Tailwind styling — needs full rebuild. Tailwind currently on v3 via `@nuxtjs/tailwindcss@6.14` — Phase 1 step 1 swaps to v4.

### Phase 1 — Tokens & globals (foundation)
1. Migrate to **Tailwind v4**: remove `@nuxtjs/tailwindcss@6.14`, install `tailwindcss@^4` + `@tailwindcss/vite` (or `@tailwindcss/postcss`). Wire via `nuxt.config.ts` Vite plugins.
2. Create `app/assets/css/main.css` with `@import "tailwindcss";` followed by a `@theme` block exposing tokens as Tailwind utilities:
   - `--color-bg / --color-bg-2 / --color-paper / --color-ink / --color-ink-2 / --color-ink-3 / --color-line / --color-line-2 / --color-accent / --color-accent-2`
   - `--font-sans / --font-serif / --font-mono`
   - `--radius-xs / --radius-sm / --radius-md / --radius-lg / --radius-pill`
   - `--spacing-2xl: 56px; --spacing-3xl: 80px`
   - `--ease-maakm: cubic-bezier(.2,.7,.2,1)`
3. Below the `@theme` block, add a `@layer base` with: body defaults, `.serif`, `.mono`, `.h1` / `.h2` / `.h3` / `.kicker`, `.shell`, `hr.rule`. Lift values from `reference-styles.css` but drop the `data-serif` variants — Instrument Serif only.
4. Wire `main.css` into Nuxt via `css: ['~/assets/css/main.css']`.
5. Add Google Fonts `<link>` via `app.head.link` in `nuxt.config.ts`: `Inter+Tight:wght@400;500;600&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500`.

### Phase 2 — Atomic components (`app/components/ui/`)
Build in this order (each verifiable in isolation):
- `MIcon.vue` — name-prop, 1.5px stroke. Port the inline SVG set from the prototype's `components.jsx` (`cart`, `search`, `user`, `arrow-right`, `arrow-left`, `arrow-up-right`, `check`, `truck`, `shield`, `leaf`, `tool`, `menu`, `star`, `filter`, `heart`, `x`, `plus`, `minus`).
- `MBtn.vue` — variant prop (`primary` | `accent` | `ghost` | `icon-only`), size, loading.
- `MChip.vue`, `MTag.vue`
- `MField.vue` — wraps input/select/textarea.
- `MTopBar.vue`, `MFooter.vue`, `MMarquee.vue`.

### Phase 3 — Catalog primitives
- `MProductCard.vue` — wired to Shopify product node (image, title, price, color swatches from `Kleur` option values via the `colors` map, material tag from `material:` tag prefix, marketing badge from `badge:` tag prefix).
- `MSectionHeader.vue`.
- `MFilterGroup.vue` (sidebar filter, see `.filter-group` in reference styles).

### Phase 4 — Pages
Replace `app/pages/index.vue` and add:
- `index.vue` — Home: hero collage (`2fr/1fr`), featured 4-col, materials editorial split, fresh-drops 4-col, CTA banner, marquee.
- `shop.vue` (or `products/index.vue`) — sidebar filters + 3-col grid.
- `products/[handle].vue` — PDP: gallery left, info right (sticky), tabs (details/specs/shipping), reviews, related row.
- `cart.vue` — drawer or full page (the prototype uses a drawer via global state; with Nuxt, lean on a `useCart()` composable + global `<MCartDrawer>` mounted in `app.vue`).
- Checkout itself is **Shopify-hosted** — redirect to `cart.checkoutUrl`. Skip building a custom 3-step checkout page; the prototype's checkout existed because it had no Shopify backend.
- `about.vue`, `collections/index.vue`, `briefing.vue` (custom briefing form), `thanks.vue`.

### Phase 5 — Composables / state
- `useCart()` — wraps Shopify **Storefront Cart API**. Operations: `cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove`. Cart ID persisted in `localStorage`. Exposes lines, subtotal, free-shipping threshold (€50), drawer open/close, and `checkoutUrl` for handoff to Shopify-hosted checkout.
- `useShopify()` — already exists; extend with collection/product detail queries.
- `useToast()` — single global toast.

### Phase 6 — Polish
- Hover scale on product cards (`transform: scale(1.005)` over 0.3s).
- Sticky add-to-cart on PDP.
- Free-shipping progress bar in cart.
- Trust badges row (verzending / retour / duurzaam) in footer or PDP.
- `onError` fallback on `<img>` → SVG placeholder.

## 7. Things NOT to do

- ❌ Don't theme by adding new colors. The palette is fixed; only `--accent` / `--accent-2` are themeable.
- ❌ Don't number every section. Numbering (`01 — Bestsellers`) is homepage-only, max 01–04.
- ❌ Don't use AI/3D-render imagery, floating-on-white e-comm photos, or SVG product mockups in production.
- ❌ Don't put the accent color on icons by default, on body copy, or fill cards with it.
- ❌ Don't set body, buttons, or paragraphs in the serif italic — it's emphasis only.
- ❌ Don't use 40px or 48px between sections — breaks the editorial rhythm.

## 8. Still to verify in Shopify admin (before Phase 3)

- A **Kleur** option exists on variants for products that come in multiple colors, with values that match the keys of our `colors` hex map.
- Material is tagged consistently as `material:PETG` / `material:PLA` / `material:ASA`.
- Marketing badges use `badge:bestseller` / `badge:nieuw` (or none).
- The `colors` hex map needs the actual production values — derive from a designer-provided list, not guessed. Until then, use the four shown in the pattern doc (`#d9c9a8`, `#c75a3c`, `#ece4d3`, `#3a4a37`) as defaults.
