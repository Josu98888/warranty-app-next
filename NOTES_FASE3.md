# Fase 3 — Optimización (imágenes y fuentes)

Auditoría del código migrado hasta ahora (`src/features/`, `src/shared/`, `src/app/`)
para las optimizaciones nativas de Next.js que pide la consigna: `next/image`,
`next/font` y code-splitting.

## Imágenes

Se encontraron exactamente **3 usos de `<img>`** en todo el proyecto, y ninguna otra
imagen estática (no hay `public/` con assets ni imports de imagen en ningún componente):

| Archivo | Línea | Qué renderiza |
|---|---|---|
| `src/features/products/components/ProductForm.tsx` | 178 | Preview del comprobante recién subido |
| `src/features/products/components/ProductsTable.tsx` | 217 | Thumbnail del comprobante en la tabla |
| `src/app/(pages)/reminders/page.tsx` | 40 | Comprobante en la lista de recordatorios |

**Decisión: los tres se dejan como `<img>`, no se migran a `next/image`.**

Motivo: en los tres casos el `src` es un `data:` URI generado en el momento por
`FileReader.readAsDataURL()` (ver `ProductForm.tsx`, `reader.onload = () =>
setValue("receipt", reader.result as string)`) — no es un archivo estático que Next
pueda optimizar (comprimir, servir en otro formato, cachear por URL). Además, el tamaño
de cada uno lo controlan puramente clases de Tailwind (`h-20`, `h-16`, `h-10 w-10
object-cover`), mientras que `next/image` exige `width`/`height` (o `fill` + contenedor
posicionado) explícitos y calculados — forzarlo acá arriesga romper exactamente el
layout que la consigna pide mantener idéntico, a cambio de cero beneficio real de
optimización sobre una imagen que ni siquiera existe como archivo.

Esto es una decisión técnica documentada, no una omisión: si en una fase futura el
comprobante se guarda en storage real (archivo con URL propia) en vez de `data:` URI,
ahí sí correspondería reevaluar `next/image`.

No hay ningún otro `<img>` en el proyecto — el resto de las imágenes referenciadas en el
proyecto Vite original (`hero.png`, `react.svg`, `vite.svg`) nunca se migraron porque
tampoco se usaban ahí (assets muertos del scaffold de Vite).

## Fuentes

**No aplica** — el proyecto no usa ninguna fuente custom:

- `src/app/globals.css` solo tiene `@import "tailwindcss";`, sin `@font-face` ni
  variables de fuente.
- `src/app/layout.tsx` no importa `next/font` ni declara ninguna familia tipográfica.
- No hay ningún `<link>` a Google Fonts ni imports de CDN en ningún archivo.

El proyecto Vite original tampoco cargaba una fuente custom activa (el único rastro era
un bloque de CSS comentado y muerto en `index.css` con `var(--sans)`, nunca aplicado).
No se agrega `next/font` porque no hay nada que migrar — inventar una carga de fuente
que no existía cambiaría la tipografía real del sitio (usa la fuente por defecto del
navegador vía Tailwind), violando la restricción de mantener el diseño idéntico.

## Code-splitting / lazy loading

El App Router ya hace code-splitting automático por ruta (cada `page.tsx` es su propio
chunk) sin configuración adicional. Se revisaron los componentes migrados
(`ProductForm`, `ProductsTable`, `Sidebar`, etc.) y ninguno es lo bastante pesado para
justificar `dynamic()`/lazy-loading manual — son formularios y tablas simples, no
librerías de gráficos, editores ni nada con bundle grande. Agregar lazy-loading acá sería
complejidad sin beneficio medible.

## Verificación

- `pnpm build` — sin errores, las 4 rutas siguen prerenderizando como estático.
- `pnpm lint` — mismos warnings ya conocidos de Fase 2 (`no-img-element` en los 3 usos
  documentados arriba, y el warning de `watch()` de react-hook-form en `ProductForm`),
  cero errores nuevos.
- `pnpm dev` — recorrido visual de `/`, `/record-product` y `/reminders`: sin cambios
  respecto a antes de esta fase (no se tocó ningún estilo, clase ni componente).
