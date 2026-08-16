# Portfolio v3 — 8-bit Galaga rebuild

Rebuilds the portfolio as an arcade-styled single page and brings the stack up to date.
The content model is untouched: the same markdown collection drives the same projects.
Everything else is new.

## Stack

| | before | after |
| :-- | :-- | :-- |
| Astro | 2.3 | 7.2 |
| Tailwind | 3 (JS config) | 4 (CSS-first theme) |
| Content collections | `src/content/config.ts` | `src/content.config.ts`, glob loader |
| Fonts | — | Press Start 2P + VT323, self-hosted at build |
| Lockfiles | `yarn.lock` + `pnpm-lock.yaml` + `package-lock.json` | npm only |

Dropped `@astrojs/image`, `@astrojs/mdx`, `@astrojs/tailwind`, `@astrojs/ts-plugin`,
`astro-icon`, `astro-navbar` and `@radix-ui/react-icons` — all either unused or now
covered by Astro core. Every `.md` in the collection is plain markdown, so the MDX
integration was pulling peer dependencies for nothing.

## Design system

Lives in `src/styles/global.css` as Tailwind 4 theme tokens.

- **Galaga's colour discipline.** The cabinet keeps its text white and puts the colour in
  the sprites. Body copy runs on three neutral steps, and each hue owns exactly one job:
  red for the 1UP register and stage numbers, yellow for whatever must be found first
  (focus ring, active nav tile, featured marker), cyan for everything interactive, blue
  for structure, green for illustrations. Every text colour was contrast-checked against
  both the page background and the panel fill; all clear AA.
- **Pixel primitives.** `pixel-frame` draws borders from four offset shadows so the
  corners stay notched; `pixel-bevel`, `pixel-press`, `text-hard-shadow` and
  `crt-overlay` do the rest. No `border-radius` anywhere, no eased transitions.
- **Scale, don't reflow.** Past 1920px and again at 2560px, `--ui-scale` and
  `--pixel-unit` step up together, so type, spacing, frames and focus rings grow in
  proportion — the way a cabinet on a bigger screen shows the same picture, bigger.

## What's on the page

- **`Starfield`** — three depths of blinking pixels drifting behind the whole page.
- **`GalagaScreen`** — a CRT running an endless attract loop on a 96×128 virtual canvas:
  8×8 sprites, a breathing formation, dives along cubic beziers, four-frame explosions
  and a live score. It leads the hero.
- **`PixelProjectArt`** — the two NestJS backends both pointed at the same stock photo of
  a laptop, which said nothing about either system. They now render diagrams of the real
  architecture (gateway/NATS/services/persistence, and client/JWT/rack/Postgres).
- **`StatusBar`** — arcade HUD carrying the GitHub, LinkedIn and CV links with pixel
  icons, moved out of the left rail.
- `Experience` is data-driven now, cutting ~130 lines of duplicated markup.

Deleted as dead code: `Navbar`, `ContactHero`, `Card`, `Social`, `Tags`, `ToggleTheme`,
`Button`, `TypewriterHeader`.

## Fixes found along the way

- **Ultrawide layout.** At 2560px the content sat 1024px wide starting at x=160, leaving
  1376px of dead space on the right. Now 1664px centred, with 386px either side of the
  sidebar.
- **Section numbers** were off by one against the sidebar (About read `01`, the rail
  read `02`).
- **Missing spaces** around inline `<span>`s rendered as `Tech-House,Darwoft` and
  `andAzure AZ-900` — Astro strips whitespace at line boundaries around elements.
- **`BackToTop` was always visible.** It used the `hidden` attribute, whose UA
  `display:none` loses to Tailwind's `.flex` on source order.
- **Experience tabs** had no ARIA and no keyboard support; they are a real tablist now.
- **`cursor: none`** globally removed the pointer with nothing in its place. Replaced
  with a pixel cursor plus a blinking ▶ marker on hover, so affordance never depends on
  the cursor image alone.
- **`--color-blue` was missing from the built CSS.** Tailwind 4 tree-shakes theme
  variables it cannot find in the scanned source, and the diagram components build fills
  as `` `var(--color-${key})` `` — so the literal name appears nowhere. The palette is
  declared `@theme static` for exactly this reason.
- **The starfield was invisible.** `<body class="bg-void">` overrode the base rule making
  body transparent, and an in-flow block background paints *after* negative-z-index
  children. The black belongs on `<html>`.

## Accessibility

`prefers-reduced-motion` drops the blinking, flicker, scanlines, starfield and attract
loop to static frames. Skip link is the first tab stop. Focus rings are yellow and scale
with the UI. The stage-select tabs support arrow keys, Home and End. Decorative canvases
are `aria-hidden`; the architecture diagrams carry real labels.

## Testing

The previous suite tested v1 markup — a navbar and theme toggle that no longer exist, on
port 3000. Rewritten against the current page: 16 tests passing on chromium and Mobile
Chrome, plus `astro check` clean.

The Galaga loop is tested by diffing two canvas frames rather than asserting on the
score, which would depend on a shot connecting and be flaky.

> `astro dev` and `astro preview` daemonise when they have no TTY, which Playwright reads
> as the server exiting early — the config uses `vite preview` instead. Worth knowing if
> a port ever seems stuck: `astro preview stop`.

## Deployment

Astro 7 requires Node `>=22.12`, and the first Vercel build on this branch failed on Node
20. `engines.node` is now pinned to `24.x` in `package.json`, which Vercel reads to pick
the runtime, with a matching `.nvmrc` for local consistency. 24 also clears the
deprecation notice Vercel raises for 20.x builds after 2026-10-01.

The first build after merge will skip the build cache — the lockfile changed from yarn to
npm. That is expected and only affects that one build.

## Follow-up needed

**The LinkedIn URL in `StatusBar.astro` is a guess.** The original was the placeholder
`https://linkedin.com`, and I substituted a plausible profile path. It needs to be
replaced with the real one before merge.
