# Warranty App — Next.js (migración)

Migración de [warranty-app](https://github.com/FranciscoDevelopment/warranty-app) (React +
Vite) a Next.js 16 (App Router + TypeScript + Tailwind v4).

## Estado: Fase 1 — Scaffold base

Lo que hay hasta ahora:

- Proyecto Next.js 16 con TypeScript, Tailwind v4 y ESLint.
- Rutas vacías creadas en `src/app/`:
  - `/` → `src/app/page.tsx`
  - `/record-product` → `src/app/record-product/page.tsx`
  - `/reminders` → `src/app/reminders/page.tsx`
- Cada página exporta `metadata` (title/description) básica.
- `pnpm run build` y `pnpm run lint` corren limpio.

Todavía **no** están migrados: componentes, stores de Zustand, formularios, estilos del
proyecto original, SEO avanzado (Open Graph, robots.txt, sitemap), ni accesibilidad. Eso
queda para las siguientes fases del equipo.

## Instalación local

```bash
pnpm install
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Scripts

- `pnpm dev` — servidor de desarrollo
- `pnpm build` — build de producción
- `pnpm start` — sirve el build de producción
- `pnpm lint` — ESLint
