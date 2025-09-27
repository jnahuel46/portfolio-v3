# Portfolio Website

💫 This portfolio is based on a free template by [Veranika Kasparevych](https://github.com/veranikabarel) using **[Astro 2.0](https://astro.build/blog/astro-2/) + [Tailwind CSS](https://tailwindcss.com/)**, with several modifications and improvements by [Jeremias Muriette](https://github.com/jnahuel46).

## Modifications and Improvements

- Added smooth fade-in animations for better user experience
- Redesigned the hero section with sequential animations
- Enhanced the about section with a new two-column layout
- Improved responsive design and accessibility
- Added new interactive elements and transitions
- Customized the color scheme and typography

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Project structure](#project-structure)
- [Commands](#commands)
- [Contributing](#contributing)
- [Credits](#credits)

## Features

✔️ Integration with **Tailwind CSS** ([@astrojs/tailwind](https://docs.astro.build/en/guides/integrations-guide/tailwind/)) supporting **Dark mode**.

✔️ Uses the following integrations:

- @astrojs/mdx
- @astrojs/image
- @astrojs/tailwind - with prettier class sorting plugin
- @astro-icon
- @astro-seo
- @astro-navbar

✔️([@Playwright](https://github.com/microsoft/playwright)) e2e tests are setted up.

🔜 Blog with frontmatter (title, description, author, date, image, tags) and RSS feed, sitemap and robots.txt

🔜 404 error page

## Project Structure

Inside of your Astro project, you'll see the following folders and files:

```
/
├── public/
│   └── favicon.ico
|   ├── hero.png
|   └── ...
├── src/
|   ├── assets/
|   |   ├── images/
│   │   |   ├── hero.png
|   |   |   └── ...
│   ├── components/
│   │   ├── ui/
│   │   |   ├── BackToTop.astro
|   |   |   └── ...
│   │   ├── About.astro
│   │   ├── Contact.astro
|   |   └── ...
│   ├── content/
│   │   ├── projects/
│   │   │   ├── project-1.md
│   │   │   ├── project-1.md
│   │   │   └── ...
│   │   └-- config.ts
│   ├── layouts/
│   │   ├── Layout.astro
│   ├── pages/
│   │   ├── index.astro
│   ├── tests/
│   │   ├── index.spec.ts
├── package.json
├── astro.config.mjs
└── ...
```

Astro looks for `.astro`, `.md` or `.mdx` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

`src/components/` is where we put any Astro components and similarly `src/layouts/` for layouts.

Images can be placed in `src/images/`.

Blog and documentation content are created as collections of Markdown or MDX files in `src/content`.

Any static assets, eg. images, can be placed in the `public/` directory.

## Commands

All commands are run from the root of the project, from a terminal:

| Command             | Action                                             |
| :------------------ | :------------------------------------------------- |
| `yarn`              | Installs dependencies                              |
| `yarn dev`          | Starts local dev server at `localhost:3000`        |
| `yarn build`        | Build your production site to `./dist/`            |
| `yarn preview`      | Preview your build locally, before deploying       |
| `yarn astro ...`    | Run CLI commands like `astro add`, `astro preview` |
| `yarn astro --help` | Get help using the Astro CLI                       |
| `yarn test:e2e`     | Run Playwright tests                               |

## Credits

Original template by [Veranika Kasparevych](https://github.com/veranikabarel)
Modified and enhanced by [Jeremias Muriette](https://github.com/jnahuel46)
Assets designed by [Freepik](https://www.freepik.com)
