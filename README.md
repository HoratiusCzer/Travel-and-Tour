# Ridge & Reef

**Author:** Softsaro Nepal

Ridge & Reef is a modern, responsive travel and tourism website built with Next.js (App Router),
TypeScript and Tailwind CSS. Visitors can search destinations, browse tour packages with prices,
read destination details, and get in touch, in light or dark mode.

## Features

- Hero section with destination search (with suggestions)
- Featured destinations with category filters and search results
- Tour packages with clear per-person prices
- Statically generated destination detail pages with quick facts and related packages
- About, traveller testimonials, contact form and footer
- Mobile-first responsive layout with an accessible mobile menu
- Dark mode toggle (remembers your choice, falls back to system preference, no flash on load)
- Custom "Lagoon + Saffron" palette with Fraunces and Outfit fonts
- Reusable components and typed content in `src/data`

## Tech stack

Next.js 15 · React 19 · TypeScript · Tailwind CSS 4

## Getting started

Requires Node.js 18.18 or newer.

```bash
git clone https://github.com/HoratiusCzer/Travel-and-Tour.git
cd Travel-and-Tour
npm install
npm run dev
```

Open <http://localhost:3000>.

Other scripts:

```bash
npm run build   # production build
npm start       # serve the production build
npm run lint    # type-check
```

## Project structure

```
src/
  app/                 routes, layout and global styles
    destinations/[slug]/  destination detail page
  components/
    layout/            header, footer, logo, theme toggle
    sections/          home page sections
    destinations/      destination card and explorer
    packages/          package card
    contact/           contact form
    ui/                small shared primitives
  data/                destinations, packages, testimonials
  lib/                 helpers
```

## Customising

Edit the files in `src/data` to change destinations, packages and testimonials. Images are loaded
from Unsplash; swap the URLs for your own or local files in `public/`. The contact form is a
front-end demo: connect it to an API route or email service to receive real messages.

## Screenshots

Add screenshots to `docs/screenshots/` and reference them here:

| Home (light) | Home (dark) | Destination page |
| --- | --- | --- |
| `docs/screenshots/home-light.png` | `docs/screenshots/home-dark.png` | `docs/screenshots/destination.png` |

## License

Released under the [MIT License](LICENSE). Copyright (c) 2026 Softsaro Nepal.
