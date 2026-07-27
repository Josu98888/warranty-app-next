# Fase 4 — SEO y Metadatos

Implementación de los requisitos obligatorios de la consigna (sección 6 del PDF):
metadata por página, Open Graph, `robots.ts`, `sitemap.ts` y estructura semántica de
headings. Cero cambios visuales — todo lo de esta fase es metadata, estructura de
componentes invisible al usuario, o el tag HTML de elementos que ya tenían sus clases de
Tailwind explícitas.

## Hallazgo previo: las páginas no podían exportar metadata

Antes de tocar nada, al intentar agregar `export const metadata` a `src/app/page.tsx` y
`src/app/(pages)/reminders/page.tsx` tal como pedía la consigna, Next.js lo rechaza en
build: **no se puede exportar `metadata` desde un archivo `"use client"`**, y ambas
páginas quedaron como Client Components completos desde que Fase 2 les agregó estado real
(`useProductStore`, `useProductFilters`).

Solución: se dividió cada una en un Server Component delgado (`page.tsx`, exporta
`metadata`, sin directiva) que renderiza un nuevo componente `"use client"` con el mismo
JSX/lógica de antes:

- `src/app/page.tsx` (server) → `src/features/home/HomeView.tsx` (client, contenido
  idéntico al `HomePage` anterior)
- `src/app/(pages)/reminders/page.tsx` (server) → `src/features/warranty/RemindersView.tsx`
  (client, contenido idéntico al `RemindersPage` anterior, salvo el fix de heading de más
  abajo)

`/record-product` ya tenía un `page.tsx` de servidor que renderizaba el `ProductForm`
(client) como hijo, así que ahí se agregó `metadata` directamente, sin necesidad de dividir
nada.

## 1. Metadata por página

| Ruta | Title | Description (150-160 caracteres) |
|---|---|---|
| `/` | Panel de garantías \| Warranty Manager | Consultá el estado de tus productos registrados: filtrá por nombre o categoría y mirá qué garantías siguen vigentes, están por vencer o ya vencieron. |
| `/record-product` | Agregar producto \| Warranty Manager | Registrá un producto nuevo con fecha de compra, categoría, precio, duración de garantía y comprobante para hacer seguimiento automático del vencimiento. |
| `/reminders` | Recordatorios de garantías \| Warranty Manager | Mirá qué garantías están por vencer pronto o ya vencieron, con el comprobante de compra a mano, para gestionar reclamos a tiempo desde un único listado. |

Cada página repite `title`/`description`/`type: "website"` dentro de `openGraph`. Esto no
fue solo una elección de estilo: se probó primero dejar `locale`/`siteName` únicamente en
`layout.tsx` confiando en que Next mezclara ese `openGraph` con el de cada página, pero
`curl` contra el HTML servido mostró que **no aparecían** `og:locale` ni `og:site_name` en
ninguna ruta — Next reemplaza el objeto `openGraph` completo del padre en vez de
mezclarlo campo por campo cuando el hijo define el suyo propio. Se corrigió agregando
`locale: "es_AR"` y `siteName: "Warranty Manager"` explícitos en el `openGraph` de las 3
páginas, y se volvió a verificar con `curl` que las 3 etiquetas aparecen en las 3 rutas.

`src/app/layout.tsx` agrega:
- `metadataBase: new URL("https://warranty-app-next.vercel.app")` — URL placeholder,
  requerida por Next para resolver URLs relativas de Open Graph. Tiene un comentario
  `// TODO: update with real production URL once the app is deployed to Vercel`.
- `openGraph: { siteName: "Warranty Manager", type: "website", locale: "es_AR" }` como
  default del sitio (locale en español de Argentina, coherente con el resto del contenido
  de la app).

## 2. `robots.ts`

`src/app/robots.ts` permite crawling de todas las rutas (`allow: "/"` para `userAgent:
"*"`) y apunta a `${SITE_URL}/sitemap.xml`. Usa el mismo placeholder de URL que
`metadataBase`, con el mismo TODO.

## 3. `sitemap.ts`

`src/app/sitemap.ts` lista las 3 rutas reales:

| Ruta | changeFrequency | priority |
|---|---|---|
| `/` | daily | 1 |
| `/record-product` | monthly | 0.8 |
| `/reminders` | daily | 0.8 |

`/` y `/reminders` son "daily" porque los datos de garantías (productos agregados, estados
que vencen) cambian seguido; `/record-product` es "monthly" porque el formulario en sí
casi no cambia de contenido. `/` tiene la prioridad más alta por ser el panel principal.

## 4. Jerarquía de headings

Se revisaron las 3 páginas y todos los componentes visibles (`HomeView`, `ProductForm`,
`ProductsTable`, `RemindersView`, `Sidebar`, `Topbar`, `SummaryCards`/`SummaryCard`,
`ProductFilters`). Se encontraron 3 problemas reales, los 3 confirmados con el usuario
antes de tocar código porque afectan componentes compartidos/globales:

1. **`/reminders` tenía dos `<h1>`** por carga de página: el `"Mis Garantías"` del
   `Topbar` (vive en `layout.tsx`, se renderiza en las 3 rutas) más un `<h1>Recordatorios</h1>`
   propio. Se bajó el de `RemindersView.tsx` a `<h2>`, igual que `HomeView` ya usa `<h2>`
   como título de sección bajo el h1 compartido del Topbar.
2. **El `<h2>Warranty</h2>` del `Sidebar`** (nombre de marca en el header del menú) se
   renderiza antes que el `<h1>` del Topbar en el DOM, porque `Sidebar` va primero en
   `layout.tsx`. Es un logo persistente en cada página, no un título de sección de
   contenido, así que no necesitaba ser heading — se cambió a `<p>`.
3. **`SummaryCard` usaba `<h2>` para el valor numérico** (ej. "12") de cada tarjeta,
   mientras el título descriptivo ("Productos", "Garantías vigentes", etc.) era un `<p>`.
   Se repite 4 veces en Home; un lector de pantalla navegando por headings escuchaba
   "12", "10", "1", "0" sin contexto, lo cual falla WCAG 2.4.6 (los headings deben
   describir el propósito de la sección). Se invirtió: el título pasa a heading y el
   valor pasa a `<p>`. Primer intento: título a `<h3>` — pero al chequear el HTML
   renderizado con `curl` apareció un salto real `h1 → h3` (`SummaryCards` se renderiza
   antes que cualquier `<h2>` en el DOM, y no hay un `<h2>` tipo "Resumen" que las
   contenga), justo el tipo de salto que la tarea pedía evitar. Se corrigió a `<h2>`: las
   4 tarjetas son secciones de nivel superior como "Garantías para tus productos", no
   subsecciones de nada. Verificado de nuevo con `curl`: `h1` y luego seis `h2` hermanos,
   sin saltos.

En los 3 casos solo se cambió el tag HTML, nunca las clases de Tailwind — como el proyecto
usa Tailwind v4 con preflight (`@import "tailwindcss";` en `globals.css`), los headings no
tienen estilos por defecto del navegador que sobrevivan; todo el aspecto visual ya venía
100% de las clases explícitas, así que el cambio de tag no tiene ningún efecto visual.
Verificado con `pnpm build` + `pnpm lint` después de cada cambio.

**No se tocó** (documentado, no es un bug de esta fase): `/record-product` no tiene ningún
heading propio de página — el `ProductForm` no incluye ningún `<h1>`/`<h2>` que diga
"Agregar producto", solo hereda el `<h1>Mis Garantías</h1>` del Topbar. Esto ya era así en
el proyecto Vite original (el `RecordProductPage` original tampoco tenía heading propio),
así que no es una regresión de la migración. Agregar un heading nuevo ahí implicaría meter
texto visible que no existía, lo cual está fuera del alcance de esta fase (que debía ser
invisible al usuario) — queda anotado para que una fase futura lo evalúe como mejora de
contenido, no de SEO técnico.

## 5. Alt text, labels y links

- **Alt text**: de las 3 imágenes (`ProductForm`, `ProductsTable`, `RemindersView`, todas
  auditadas en Fase 3), dos ya tenían alt descriptivo con el nombre del producto
  (`ProductForm`: "Vista previa del comprobante"; `ProductsTable`: `` `Comprobante de
  ${productRow.name}` ``). La de `RemindersView` tenía `alt="Comprobante"`, genérico y sin
  identificar el producto — se corrigió a `` `Comprobante de ${p.name}` `` para que sea
  consistente con `ProductsTable`.
- **Labels de formulario**: los 7 campos de `ProductForm` (nombre, categoría, precio,
  fecha de compra, duración, importancia, comprobante) ya tenían `<label htmlFor>`
  asociado a su `id`, o el input envuelto directamente por el `<label>` (el grupo de
  radios de categoría). No hizo falta ningún cambio.
- **Links de navegación**: `Sidebar`/`SidebarItem`/`Topbar` ya usaban `next/link` (no
  `<a>` plano) con texto descriptivo ("Dashboard", "Agregar producto", "Recordatorios",
  etc.), sin ningún "click aquí". No hizo falta ningún cambio.

## Pendiente para fases futuras

- `metadataBase` y las URLs de `robots.ts`/`sitemap.ts` usan el placeholder
  `https://warranty-app-next.vercel.app` — actualizar con el dominio real una vez que
  exista el deploy de Vercel (Fase 6).
- `/record-product` no tiene un heading propio (ver sección 4) — evaluar en una fase de
  contenido/UX, no de SEO técnico.
- No se generó `opengraph-image` — no hay ningún asset de marca/imagen en el proyecto
  todavía (confirmado en la auditoría de Fase 3, no hay `public/` con imágenes) para
  usar como `og:image`; agregar uno queda para cuando exista una imagen de marca real.

## Verificación

- `pnpm build` sin errores después de cada tarea; las 3 rutas siguen prerenderizando
  estáticas, más `/robots.txt` y `/sitemap.xml` nuevos.
- `pnpm lint` sin errores en ningún punto; mismos 4 warnings ya conocidos de fases
  anteriores (3× `no-img-element` por los `data:` URI de comprobantes, ya documentado en
  Fase 3; 1× `watch()` de react-hook-form).
- `pnpm dev` + recorrido visual de `/`, `/record-product` y `/reminders`: sin cambios
  visuales respecto a antes de esta fase.
- Metadata verificado en el HTML servido (`curl` a cada ruta): `<title>`, `<meta
  name="description">` y las etiquetas `og:title`/`og:description`/`og:type` presentes en
  las 3 páginas.
