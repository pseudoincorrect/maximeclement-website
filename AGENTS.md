# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Overview

Personal portfolio for Maxime Clément — a statically-generated Astro site deployed to
[maximeclement.com](https://www.maximeclement.com). The focus is content, UI polish, and
near-zero client-side JavaScript. There is **no** React/Vue/Svelte; interactivity lives in a
single vanilla-TS script and Astro view transitions.

## Tech Stack

- **Astro 7** — static output (`output: 'static'`), file-based routing under `src/pages/`
- **Tailwind CSS 4** — via `@tailwindcss/vite`; theme tokens are defined in
  `src/styles/global.css` with `@theme` (there is **no** `tailwind.config.js`)
- **TypeScript** — `astro/tsconfigs/strict`; keep all code type-safe, no `any` unless justified
- **Prettier 3** — with `prettier-plugin-astro`, `prettier-plugin-tailwindcss`,
  `@ianvs/prettier-plugin-sort-imports`
- Node.js >= 22.22 (see `.nvmrc`), npm >= 10

## Commands

```bash
npm install          # install deps
npm run dev          # dev server at http://localhost:4321
npm run build        # astro check (type errors) + static build to ./dist
npm run preview      # preview the built site
npm run check        # astro check only
npm run format       # Prettier write across the repo
npm run format:check # Prettier check (use before committing)
```

**Always run `npm run format` after editing, and `npm run build` before finishing** to catch
type errors and broken routes.

## Structure

```
src/
  components/   # reusable .astro components (Card, Carousel, Lightbox, charts, …)
  data/         # content + types: projects.json, path.json, site.ts, types.ts, categories.ts
  layouts/      # Layout.astro (head, theme init, sidebar, footer, view transitions)
  pages/        # routes; projects/[id].astro generates one page per project
  scripts/ui.ts # all client-side behaviour (theme, nav, carousel, lightbox, filters)
  styles/       # global.css — Tailwind import + @theme design tokens
public/         # images, CVs, favicons (served as-is, not formatted)
```

## Conventions

- **Astro components** use `interface Props` and destructure `Astro.props` with defaults.
- **Styling** is utility-first Tailwind. Use semantic color tokens (`bg-bg-paper`,
  `text-primary`, `border-secondary/40`, …) defined in `global.css`; avoid hard-coded hex.
- **Class lists** in components use `class:list={[…]}`; accept a `class?: string` prop for
  composition.
- **Interactivity**: progressive enhancement only. Prefer native HTML (`<details>`, `<dialog>`)
  and small event handlers in `src/scripts/ui.ts`. Re-init on `astro:page-load` because of
  `<ClientRouter />` view transitions. Respect `prefers-reduced-motion`.
- **Content/data**: add/changes to projects or career go in `src/data/*.json` and must match the
  interfaces in `src/data/types.ts`.
- **Accessibility**: keep alt text, aria labels, focus states, and the skip link intact.
- **Imports** are auto-sorted by Prettier — don't hand-order them.

## Do / Don't

- ✅ Edit `src/styles/global.css` to add theme tokens; use them via Tailwind classes.
- ✅ Keep pages static and data-driven from `src/data/`.
- ✅ Follow the existing quote style (single quotes) and formatting — let Prettier decide.
- ❌ Don't add a client framework or heavy JS dependencies without a strong reason.
- ❌ Don't create `tailwind.config.js`; Tailwind 4 is configured in CSS.
- ❌ Don't commit `dist/`, `.astro/`, or `node_modules/` (see `.gitignore`).

## Verifying Changes

1. `npm run format`
2. `npm run check` (or `npm run build`) — must pass with no errors
3. `npm run build` and confirm all pages render, then optionally `npm run preview`
