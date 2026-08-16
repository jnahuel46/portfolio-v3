# Portfolio — v3 (8-bit)

Personal portfolio of [Jeremias Muriette](https://github.com/jnahuel46), rebuilt as an
8-bit / arcade-styled single page with **[Astro 7](https://astro.build/)** and
**[Tailwind CSS 4](https://tailwindcss.com/)**.

Originally based on a free template by
[Veranika Kasparevych](https://github.com/veranikabarel); v3 keeps the content model and
replaces the presentation layer entirely.

## The 8-bit design system

Everything lives in [`src/styles/global.css`](src/styles/global.css), as Tailwind 4
CSS-first theme tokens. The rules that keep the look coherent:

- **4px grid.** Every border, offset and shadow is a multiple of 4. `border-radius` is
  forced to `0` globally.
- **Galaga's colour discipline.** The cabinet keeps its text white and puts every hue
  into the sprites, and so does this page. Body copy runs on three neutral steps
  (`text`/`dim`/`muted`, all clearing AA on black); the sprite hues each own exactly one
  job — `red` for the 1UP register and stage numbers, `yellow` for whatever must be
  found first (focus ring, active tile, featured marker), `cyan` for everything
  interactive, `blue` for structure behind the cyan, `green` for the illustrations.
  That split is what keeps a multi-hue arcade palette from turning into confetti.
- **A real starfield.** [`Starfield.astro`](src/components/Starfield.astro) drifts three
  depths of blinking pixels down a canvas behind the page. It is the single most
  recognisable thing about the cabinet, and it costs one 120-star canvas that pauses
  itself when the tab is hidden.
- **Scale, don't reflow.** An arcade cabinet on a bigger screen shows the same picture,
  bigger. Past 1920px and again at 2560px, `--ui-scale` and `--pixel-unit` step up
  together: type, spacing, frames, bevels and focus rings all grow in proportion, so a
  4px frame never ends up hairline beside 30px text. Containers are centred and widen to
  `7xl`, which is what keeps ultrawide monitors from stranding the content on the left.
  The root size is set as `calc(100% * var(--ui-scale))` so a reader's own browser
  font-size preference survives.
- **Photographs untouched.** The pixel styling lives in the chrome around images, not in
  the images themselves — they render at full fidelity through `astro:assets`.
- **Two faces.** _Press Start 2P_ for display text — only ever at the small
  `--text-pixel-*` sizes — and _VT323_ for body copy, which stays readable in
  paragraphs. Both are self-hosted at build time by Astro's font pipeline, so the page
  makes no third-party requests.
- **Stepped motion.** Transitions use `steps()`, never easing curves. Hover states move
  elements by whole pixels rather than scaling them.
- **Font smoothing off.** Anti-aliasing turns pixel faces to mush.

### Pixel primitives

Custom Tailwind utilities that do the visual heavy lifting:

| Utility              | What it does                                                        |
| :------------------- | :------------------------------------------------------------------ |
| `pixel-frame`        | Border drawn from four offset shadows, leaving notched corners       |
| `pixel-frame-raised` | Same, plus a hard drop shadow                                        |
| `pixel-bevel`        | Inset light/dark bevel — reads as a physical key                     |
| `pixel-press`        | Whole-pixel hover lift and press-down                                |
| `frame-*`            | Recolours the frame (`frame-cyan`, `frame-yellow`, `frame-red`, `frame-line`) |
| `text-hard-shadow`   | Offset text shadow with no blur                                      |
| `selectable`         | Blinking ▶ menu selector on hover/focus                              |
| `crt-overlay`        | Fixed scanlines + vignette over the whole page                       |

## Accessibility

The arcade styling is deliberately not allowed to cost usability:

- `prefers-reduced-motion` disables the blinking, flicker, scanlines, the starfield and
  the Galaga attract loop — each falls back to a single static frame.
- The stage-select tabs are a real ARIA tablist with arrow-key navigation.
- A skip link is the first tab stop; focus rings are yellow, scale with the UI, and never
  drop below 4px.
- The custom pixel cursor is paired with the `selectable` ▶ marker so click affordance
  never depends on the cursor image alone.

## Project structure

```
├── public/
│   ├── favicon.svg
│   └── jere-muriette-se.pdf
├── src/
│   ├── assets/images/
│   ├── components/
│   │   ├── ui/            SectionHeader, BackToTop, GalagaScreen, PixelProjectArt
│   │   ├── StatusBar.astro   arcade HUD, top
│   │   ├── Sidebar.astro     section nav, left
│   │   └── Hero / About / Experience / Projects / Contact / Footer
│   ├── content/projects/  one markdown file per project
│   ├── content.config.ts  collection schema (glob loader)
│   ├── layouts/Layout.astro
│   ├── pages/index.astro
│   └── styles/global.css  the design system
├── tests/index.spec.ts
├── astro.config.mjs
└── playwright.config.ts
```

Adding a project means dropping a markdown file into `src/content/projects/` matching the
schema in [`content.config.ts`](src/content.config.ts). To give it a thumbnail, add the
image to `src/assets/images/` and register it in the `sources` map in `Projects.astro`,
keyed by the file's `img_alt`.

The hero's centrepiece is
[`GalagaScreen.astro`](src/components/ui/GalagaScreen.astro): a CRT running an endless
Galaga attract loop on a 96×128 virtual canvas. Sprites are 8×8 character grids, the
formation breathes, enemies dive along cubic bezier paths, and the fighter tracks
whatever is diving at it. The canvas only runs while it is on screen and the tab is
visible, and integer-scales so every virtual pixel lands on a whole device pixel.

Backends have no screenshot worth showing, so they set `art:` instead and get a pixel-art
diagram of the real architecture from
[`PixelProjectArt.astro`](src/components/ui/PixelProjectArt.astro) — currently
`microservices` and `rest-api`. New scenes are rect lists on a 64×36 grid.

> Gotcha: those components build fills as `` `var(--color-${key})` ``, so the token names
> never appear literally in the source. The palette block is declared `@theme static` for
> exactly that reason — plain `@theme` tree-shakes any variable Tailwind cannot find in
> the scanned files, which silently drops colours used only by the diagrams.

## Commands

| Command           | Action                                          |
| :---------------- | :---------------------------------------------- |
| `npm install`     | Install dependencies                            |
| `npm run dev`     | Dev server at `localhost:4321`                  |
| `npm run build`   | Build to `./dist/`                              |
| `npm run preview` | Preview the build locally                       |
| `npm run check`   | Type-check `.astro` and `.ts` files             |
| `npm test`        | Playwright e2e tests (builds and serves first)  |

> Note: `astro dev` and `astro preview` daemonise when they have no TTY. Use
> `astro dev stop` / `astro preview status` to manage them. The Playwright config uses
> `vite preview` instead, since it stays in the foreground.

## Credits

Original template by [Veranika Kasparevych](https://github.com/veranikabarel).
Layout lineage from [Brittany Chiang](https://brittanychiang.com).
Assets designed by [Freepik](https://www.freepik.com).
