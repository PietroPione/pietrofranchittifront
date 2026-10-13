# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Personal portfolio / services site for Pietro Franchitti (Italian-language content). Next.js 16 App Router (JavaScript/JSX, no TypeScript), React 19, Tailwind CSS v4, content from Prismic.

## Commands

- `npm run dev` — dev server with Turbopack (http://localhost:3000)
- `npm run build` / `npm run start` — production build / serve
- `npm run lint` — ESLint (flat config, `next/core-web-vitals`)
- `npm run slicemachine` — Prismic Slice Machine UI (edits `slices/*/model.json`, `customtypes/`, regenerates `prismicio-types.d.ts`)
- `npm run generate:sitemap` — legacy static sitemap script (`scripts/generate-sitemap.js`); the live sitemap is `app/sitemap.js`

There is no test suite. Both `package-lock.json` and `pnpm-lock.yaml` are committed.

## Architecture

**Content from Prismic, rendered by `app/components`, not by slices.** `prismicio.js` exports `createClient()` (repo `pietrofranchitticorporate`, overridable via `NEXT_PUBLIC_PRISMIC_ENVIRONMENT`). Pages are async server components that fetch a document (`getSingle`, `getByUID`, `getByType`), then pick slices by hand with `data.slices.find(s => s.slice_type === "...")` and pass `slice.primary` data to components in `app/components/`. The `slices/*/index.js` files are Slice Machine placeholders and are only used by `app/slice-simulator`; `SliceZone` is not used for real pages. When adding a Prismic field/slice, update the model via Slice Machine and then wire it into the relevant page/component manually.

**Caching.** In production the Prismic client uses `cache: "force-cache"` with tag `prismic`; `POST /api/revalidate` calls `revalidateTag("prismic")` (Prismic webhook target). Dev uses `revalidate: 5`. `/api/preview` and `/api/exit-preview` handle Prismic previews.

**Root layout** (`app/layout.js`) fetches the `menu` and `impostazioni` documents for `Menu` (incl. `colori` slice) and `Footer`, injects Person JSON-LD, and wraps everything in `ThemeProvider`.

**SEO landing pages** (`consulenza-seo-torino`, `corporate-communication`, `servizi-advertising-torino`, `sviluppo-siti-web-torino`) are each a standalone `page.jsx` with a hardcoded `slug`. Each fetches `getByUID("seo_page", slug)`, maps the `Seo*` slices into a plain data object (`mapPrismicToData`), and merges it field-by-field over the local fallback in `app/seo-pages.json` (`mergePageData` / `pickValue`). If Prismic has no document, the JSON is used as is. These helpers are duplicated per page. `app/sitemap.js` lists SEO pages from `seo-pages.json`, so a new SEO page needs an entry there plus its own route folder.

**SEO defaults** (site URL, title, description, keywords) live in `app/seoConfig.js`; `NEXT_PUBLIC_SITE_URL` overrides the base URL.

**Theming.** Dark mode is class-based (`@custom-variant dark` in `app/globals.css`). `ThemeProvider` stores the choice in `localStorage("theme")` and listens for a custom `themeChanged` window event dispatched by `DarkModeToggle`. Custom font-size tokens (`--text-10` … `--text-95`) and colors are defined in `globals.css`.

**Path alias:** `@/*` → repo root (e.g. `import { createClient } from "@/prismicio"`).

Images from `images.prismic.io` are allowed in `next.config.mjs`.
