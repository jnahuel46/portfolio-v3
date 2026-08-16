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
- **One hue.** Neutral dark surfaces carry the structure; every piece of text and every
  accent comes from a single green ramp (`--color-glow` → `--color-deep`), the way a
  phosphor monitor only ever had one colour. Hierarchy is brightness, never hue.
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
| `frame-*`            | Recolours the frame (`frame-bright`, `frame-green`, `frame-mid`, `frame-dim`) |
| `text-hard-shadow`   | Offset text shadow with no blur                                      |
| `selectable`         | Blinking ▶ menu selector on hover/focus                              |
| `crt-overlay`        | Fixed scanlines + vignette over the whole page                       |

## Accessibility

The arcade styling is deliberately not allowed to cost usability:

- `prefers-reduced-motion` disables the blinking, flicker and scanline animation.
- The stage-select tabs are a real ARIA tablist with arrow-key navigation.
- A skip link is the first tab stop; focus rings are 4px and high-contrast.
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
│   │   ├── ui/            SectionHeader, BackToTop, PixelTerminal
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
