# daqiq Public API Documentation

Bilingual (English / Arabic) documentation site for the daqiq Public API, built with Nuxt 3, Nuxt Content, and Tailwind CSS.

## Features

- English and Arabic with RTL support
- Dark / light mode
- Partner-facing API reference (orders, products, stock, inventory, customers)
- Landing page with quick-start guide
- Static generation for fast deployment

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/en` or `/ar` based on browser language.

## Build

```bash
npm run generate
npm run preview
```

## Project structure

```
app/              # Vue pages, layouts, components
content/en/       # English documentation (markdown)
content/ar/       # Arabic documentation (markdown)
i18n/locales/     # UI strings
spec/             # Internal API spec reference (source of truth)
```

## Content

Documentation is derived from `spec/public-api.md` (Part 2 — partner-facing public API). Internal key-management endpoints (Part 1) are not published here.

## Links

- Dashboard: https://app.daqiqerp.com
- API (production): https://api.daqiqerp.com/api
- API (dev): https://api-dev.goerp.net/api
