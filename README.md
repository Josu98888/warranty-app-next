# 🔖 Warranty Manager — Next.js

Registro de garantías de tus productos: sabé cuáles siguen vigentes, cuáles están por
vencer y cuáles ya caducaron, con recordatorios automáticos por email.

Migración a Next.js 16 (App Router + TypeScript) de [warranty-app](https://github.com/FranciscoDevelopment/warranty-app)
(React + Vite), hecha como Tercer Proyecto Integrador.

## Integrantes

| Integrante | Área principal |
|---|---|
| Sofía Zilijosky | Scaffold inicial, optimización de imágenes/fuentes, SEO y metadata |
| Daina Paucar | Integración con Supabase (DB + Storage) y recordatorios por email |
| Josué Aquino | Refactors de arquitectura (Server Components, stores, props) |
| Luz Mendoza Alcantara | Rutas nuevas (productos, editar garantía, configuración), fixes de UI |

## Tecnologías

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Zustand · React Hook Form · Zod ·
date-fns · Supabase (Postgres + Storage) · Nodemailer · GitHub Actions

## Funcionalidades

- CRUD de productos con fecha de compra, categoría, precio y duración de garantía.
- Cálculo automático de fecha de vencimiento y clasificación visual (vigente / próxima a
  vencer / vencida).
- Filtros por categoría y búsqueda por nombre (con sincronización vía `?q=` en la URL).
- Adjunto de comprobante de compra, subido a Supabase Storage.
- Configuración de recordatorios por email (30/7/1 días antes del vencimiento y al vencer),
  guardada en Supabase.
- Envío automático de esos recordatorios por correo vía un cron de GitHub Actions
  (`.github/workflows/reminders.yml`), sin depender de que la app esté abierta en un
  navegador.
- Metadata y Open Graph por página, `robots.txt` y `sitemap.xml` generados con las
  convenciones nativas de Next.js.

## Rutas

| Ruta | Descripción |
|---|---|
| `/` | Panel principal: resumen y listado de productos con sus garantías |
| `/products` | Listado completo de productos (filtros y acciones separados del panel) |
| `/record-product` | Formulario para agregar un producto nuevo |
| `/edit-warranty/[id]` | Editar los datos de un producto/garantía existente |
| `/reminders` | Configuración de recordatorios por email y listado de garantías por vencer o vencidas |
| `/settings` | Placeholder — todavía en construcción |

## Estructura del proyecto

```
src/
├── app/                        # Rutas (App Router). Cada page.tsx es un Server
│   │                           # Component: exporta metadata y renderiza la vista
│   │                           # "use client" correspondiente de src/features/.
│   ├── (pages)/
│   │   ├── edit-warranty/[id]/page.tsx
│   │   ├── products/page.tsx
│   │   ├── record-product/page.tsx
│   │   ├── reminders/page.tsx
│   │   └── settings/page.tsx
│   ├── layout.tsx               # Layout raíz: Sidebar + Topbar + metadata base
│   ├── page.tsx                 # "/"
│   ├── robots.ts
│   └── sitemap.ts
├── features/                    # Código de dominio, organizado por feature
│   ├── home/                    # Panel principal (HomeView, SummaryCards)
│   ├── products/
│   │   ├── components/          # ProductForm, ProductsTable, ProductFilters, ...
│   │   ├── hooks/                # useProductFilters, useLoadProducts
│   │   ├── repositories/         # productRepository.ts (acceso a Supabase)
│   │   ├── store.ts              # Zustand: cache local de productos
│   │   └── utils/
│   └── warranty/
│       ├── components/          # RemindersView, EditWarrantyView
│       ├── hooks/                # useReminderSettings
│       ├── store/                # store.ts (garantías), reminderStore.ts (config)
│       └── utils/
├── lib/                         # Integraciones compartidas: supabase.ts, uploadReceipt.ts
└── shared/                      # Layout global (Sidebar, Topbar) y utils compartidos

scripts/
└── send-reminders.ts            # Script Node que corre el cron: lee productos y
                                  # configuración de Supabase, manda los emails
                                  # pendientes con nodemailer y registra el envío
                                  # en reminder_logs para no duplicar.

.github/workflows/reminders.yml  # Corre send-reminders.ts todos los días (cron)
```

## Instalación local

Este proyecto necesita un proyecto de **Supabase** ya creado (tablas `products`,
`settings`, `reminder_logs`, y un bucket de Storage llamado `receipts`). Sin eso, la app
no levanta: `src/lib/supabase.ts` valida al arrancar que existan las variables de entorno
y corta con un error explícito si faltan.

```bash
git clone https://github.com/shadowia-sofiazilijosky/warranty-app-next.git
cd warranty-app-next
cp .env.example .env.local
# completar .env.local con las credenciales reales del proyecto de Supabase
# (ver los comentarios de cada variable en .env.example)
pnpm install
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000).

Para probar el envío de recordatorios en local (no hace falta esperar al cron):

```bash
pnpm send-reminders
```

## Scripts

- `pnpm dev` — servidor de desarrollo
- `pnpm build` — build de producción
- `pnpm start` — sirve el build de producción
- `pnpm lint` — ESLint
- `pnpm send-reminders` — corre manualmente el script de recordatorios por email

## Bugs y decisiones técnicas

El detalle de bugs encontrados y corregidos durante la migración está en
[BUGFIXES.md](./BUGFIXES.md). Las decisiones de optimización (imágenes/fuentes) y de SEO
están documentadas en [NOTES_FASE3.md](./NOTES_FASE3.md) y [NOTES_FASE4.md](./NOTES_FASE4.md).

## Links

- 📦 Repositorio: [warranty-app-next](https://github.com/shadowia-sofiazilijosky/warranty-app-next)
- 🚀 Deploy: pendiente — `metadataBase`, `robots.ts` y `sitemap.ts` usan por ahora la URL
  placeholder `https://warranty-app-next.vercel.app`, a actualizar cuando exista el deploy real.
