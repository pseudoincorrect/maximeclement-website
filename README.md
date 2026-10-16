# Maxime Clément – Portfolio

Personal portfolio: [maximeclement.com](https://www.maximeclement.com)

Built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com). Static output, almost zero client-side JavaScript.

## Development

Requires Node.js >= 22.22 (see `.nvmrc`, Node 26 recommended).

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # type-check + static build to ./dist
npm run preview
```

## Structure

- `src/data/` – projects, career and site data (JSON/TS)
- `src/pages/` – routes (`/projects/[id]` are generated statically)
- `src/components/`, `src/layouts/` – UI
- `public/` – images, CVs, icons
