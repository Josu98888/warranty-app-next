# Registro de Bugs y Tareas Pendientes (Warranty Tracker)

## 1. Desajuste en la configuración de Rutas
**Descripción:** Existe una inconsistencia entre el diccionario de rutas y el router principal. 
- La constante `ROUTES` exporta `EDIT_WARRANTY: "edit-warranty"`.
- El `createBrowserRouter` no tiene declarada esta ruta en su array de `children`.
**Solución propuesta:** 
- Agregar el objeto faltante en el router: `{ path: ROUTES.EDIT_WARRANTY, Component: EditWarrantyPage }` (creando el componente si no existe) o eliminarlo de `ROUTES` si fue descartado.
**Solución aplicada:**
Este proyecto usa Next.js (App Router), no react-router, por lo que el equivalente real era la falta de una carpeta/página para esa ruta. Se creó `src/app/(pages)/edit-warranty/[id]/page.tsx`, una página dinámica que recibe el `id` del producto, precarga sus datos (categoría, fecha de compra, duración, importancia) y guarda los cambios usando `updateProduct` y `updateWarranty` (funciones que ya existían en los stores pero no se usaban). También se agregó un link "Editar" en `ProductsTable` para que la página sea alcanzable desde la UI.

## 2. Errores de navegación en el Sidebar
**Descripción:** El menú lateral tiene problemas de ruteo y enlaces sin salida.
- **Rutas duplicadas:** Los ítems "Dashboard" y "Productos" apuntan exactamente a la misma ruta (`to={ROUTES.HOME}`).
- **Botón sin acción:** El botón de "Configuración" es una etiqueta `<button>` que solo ejecuta `closeMenu`. No redirige a ninguna página ni abre ningún panel de ajustes.
**Solución propuesta:**
- Crear una ruta específica en `ROUTES` para Productos (ej: `ROUTES.PRODUCTS`) y asignarla a su `SidebarItem`.
- Cambiar el botón de Configuración por un `SidebarItem` con su respectiva ruta, o agregarle la lógica para abrir un modal de configuración.
**Solución aplicada (parcial, corregida 2026-08-10):**
Se creó `src/app/(pages)/products/page.tsx` y `src/app/(pages)/settings/page.tsx` en su momento, pero la parte de `ROUTES`/`Sidebar` que describe este ítem nunca se aplicó de verdad: `ROUTES.PRODUCTS`/`ROUTES.SETTINGS` no existían, el ítem "Productos" seguía apuntando a `ROUTES.HOME` y el botón de "Configuración" seguía siendo un `<button>` sin navegación — quedó documentado como resuelto sin estarlo. **Resuelto de verdad** en el commit `b7c60cc` (2026-08-10): se agregaron `ROUTES.PRODUCTS`/`ROUTES.SETTINGS` (ver bug #9) y `Sidebar.tsx` ahora apunta "Productos" a `ROUTES.PRODUCTS` y "Configuración" es un `Link` a `ROUTES.SETTINGS`.

## 3. Buscador inactivo en el Topbar
**Descripción:** El input de búsqueda en la cabecera es puramente visual (UI estática). No está conectado a ningún estado ni maneja eventos.
**Solución propuesta:**
- Importar `useState` de React.
- Crear un estado `const [searchTerm, setSearchTerm] = useState("")`.
- Agregar los atributos `value={searchTerm}` y `onChange={(e) => setSearchTerm(e.target.value)}` al input.
- Implementar la lógica para filtrar los datos o redirigir a una página de resultados con parámetros de búsqueda.
**Solución aplicada:**
Se agregó el estado local al input del Topbar tal como se proponía. Como el buscador aparece en todas las páginas (no solo en el home), en lugar de filtrar en el lugar se optó por redirigir: al escribir y confirmar, navega a `/?q=<término>`. La página principal lee ese parámetro con `useSearchParams` y lo pasa como valor inicial a `useProductFilters`, reutilizando el filtro que ya existía en `ProductFilters` en vez de duplicar la lógica de filtrado.

## 4. Componente huérfano: `ProductList`
**Descripción:** El componente `ProductList` está declarado en el código pero no se importa ni se renderiza en ninguna vista.
**Solución propuesta:**
- Importar e integrar `<ProductList />` en la página correspondiente (probablemente dentro de `HomePage` o la futura página de Productos). Si es código viejo que ya no sirve, eliminar el archivo para mantener limpio el proyecto.
**Solución aplicada:**
Se confirmó que `page.tsx` ya usaba `ProductsTable`, un componente que cubre la misma función con más features (paginación, estado de garantía, filtros). Al no haber ninguna importación de `ProductList` en todo el proyecto, se eliminó el archivo para mantener el código limpio, en vez de integrarlo.

## 5. Refactorización de arquitectura: Componentes globales en dominio local (Solucionado)
**Descripción:** Hubo un error de diseño en la estructura de carpetas. Los componentes estructurales de navegación (`Sidebar`, `SidebarItem`, `Topbar`) y la carpeta `layouts` estaban ubicados dentro del dominio específico del `home`, a pesar de ser elementos globales que envuelven a toda la aplicación.
**Solución aplicada:** 
- Se refactorizó la estructura del proyecto moviendo todos estos archivos a una carpeta compartida: `shared/layout`. 
- Ahora los componentes de estructura global están correctamente centralizados y disponibles para todas las páginas sin acoplarse al dominio del `home`.

## 6. Etiquetas de importancia invertidas en ProductForm
En el `<select>` de importancia, el valor `Low` mostraba la etiqueta "Alta" y el valor `High` mostraba "Baja" — al revés de lo esperado.
**Solución:** se corrigió el orden de las etiquetas (`Low` → "Baja", `High` → "Alta").

## 7. deleteProduct / removeWarranty sin usar
Ambas funciones ya existían en sus respectivos stores (productos y garantías), pero no había ningún botón en la UI que las llamara — quedaban muertas, igual que pasaba con `ProductList` (bug 4).
**Solución:** se agregó un botón "Eliminar" en `ProductsTable` que borra el producto y su garantía asociada, con confirmación previa.

## 8.`<Toaster />` nunca montado
Toda la app usa `react-hot-toast` (`toast.success(...)`) para notificar al agregar, editar o eliminar productos, pero el componente `<Toaster />` que renderiza esas notificaciones nunca se montaba en ningún lado. Resultado: las notificaciones nunca se veían en pantalla.
**Solución:** se agregó `<Toaster />` en `layout.tsx`.

## 9. Rutas relativas rotas en ROUTES
Los valores de `ROUTES` (excepto `HOME`) no tenían `/` inicial, por lo que los links del Sidebar/Topbar se resolvían de forma relativa a la página actual en vez de ser absolutos.

**Solución (marcada aplicada antes de tiempo, corregida 2026-08-10):** este ítem se marcó como resuelto en una auditoría anterior, pero el `/` inicial nunca se agregó al código — solo quedó anotado. El bug siguió siendo reproducible: como `Sidebar`/`Topbar` viven en `layout.tsx` y se renderizan en todas las páginas, un `href` relativo depende de la página actual. Para rutas de un solo segmento (`/`, `/products`, `/reminders`, etc.) da la casualidad de que resuelve bien, pero desde `/edit-warranty/[id]` (la única ruta anidada) los links a "Agregar producto" o "Recordatorios" navegaban a `/edit-warranty/record-product` o `/edit-warranty/reminders` — ambos 404. También rompía el resaltado de "página activa" en `SidebarItem` (`pathname === to` nunca daba `true` porque `pathname` es absoluto y `to` no lo era).

**Resuelto de verdad** en el commit `4e9cfad` (2026-08-10): se agregó `/` inicial a `RECORD_PRODUCT`, `EDIT_WARRANTY` y `REMINDERS` en `src/shared/utils/route.ts`.

## 10. Lógica de negocio mezclada dentro de un hook de filtros
**Descripción:** El hook `useProductFilters` no solo filtraba productos por búsqueda y categoría, sino que además:
- Hacía un join manual con el store de `warranty` usando `Array.find` dentro de un `map` (O(n·m)).
- Contenía ~40 líneas de lógica de agrupamiento y ordenamiento por urgencia de garantía (vencida / por vencer / vigente) directamente dentro de un `useMemo`.
- El archivo se llamaba `useProducts.ts` pero exportaba `useProductFilters`, generando confusión al navegar el código.

**Solución propuesta:**
- Extraer el filtrado, el join y el ordenamiento a funciones puras y testeables fuera de React.
- Reemplazar el `find` dentro del `map` por un `Map` para evitar la búsqueda O(n·m).
- Renombrar el archivo del hook para que coincida con su export.

**Solución aplicada:**
Se crearon tres utilidades puras: `filterProducts.ts` (búsqueda + categoría, en `features/products/utils`), `attachWarrantyToProducts.ts` (join usando `Map` en vez de `find`, en `features/warranty/utils`) y `sortByWarrantyUrgency.ts` (agrupamiento y comparación por urgencia de garantía, también en `features/warranty/utils`). El hook `useProductFilters` quedó reducido a orquestar estas tres funciones dentro de su `useMemo`, sin lógica de negocio propia. Se renombró `useProducts.ts` a `useProductFilters.ts` para que el nombre del archivo coincida con el hook exportado.

---

## 11. Bug de tipos por `productT.id` opcional
**Descripción:** Al usar `product.id` como clave de un `Map<string, warrantyT>` en `attachWarrantyToProducts`, TypeScript arrojaba `Argument of type 'string | undefined' is not assignable to parameter of type 'string'`, porque `productT.id` está tipado como opcional.

**Solución propuesta:**
- Revisar si `id` debería ser obligatorio en `productT` (ya que es el identificador del producto una vez persistido).
- Si debe seguir siendo opcional, agregar un guard antes de usarlo como clave de búsqueda.

**Solución aplicada:**
Se agregó un guard explícito en `attachWarrantyToProducts`: `product.id ? warrantyById.get(product.id) : undefined`. Queda pendiente evaluar si conviene hacer `id` obligatorio en `productT` a nivel de tipos para evitar que el mismo problema reaparezca en otros puntos del código (ordenamientos, `key` de listas en React, etc.).

---

## 12. Prop explosion en `ProductFilters`
**Descripción:** El componente `ProductFilters` recibía 8 props sueltas (`searchQuery`, `onSearchChange`, `categoryFilter`, `onCategoryChange`, `onReset`, `totalProductCount`, `filteredProductCount`, `activeFilterCount`), lo cual volvía la firma ruidosa y difícil de extender.

**Solución propuesta:**
- Agrupar las props por responsabilidad (estado, acciones, estadísticas) en vez de pasarlas todas sueltas.

**Solución aplicada:**
Se agruparon las props en tres objetos tipados: `state` (`searchQuery`, `categoryFilter`), `actions` (`onSearchChange`, `onCategoryChange`, `onReset`) y `stats` (`totalProductCount`, `filteredProductCount`, `activeFilterCount`). La firma del componente pasó de 8 props sueltas a 3 props agrupadas, sin perder tipado.

---

## 13. Responsabilidad mezclada: filtrado + gestión de datos en el mismo componente
**Descripción:** `ProductFilters` recibía además `onClearAllData` y `hasProducts`, mezclando la responsabilidad de filtrar productos con la de cargar/limpiar datos de prueba. El handler `onClearAllData` cambiaba de comportamiento según `hasProducts` (a veces limpiaba, a veces cargaba datos), lo cual era ambiguo y estaba armado con una ternaria inline en `ProductsPage`.

**Solución propuesta:**
- Separar la gestión de datos (seed/clear) en un componente propio, con handlers explícitos y nombrados.

**Solución aplicada:**
Se creó `ProductDataActions.tsx`, un componente independiente que recibe `hasProducts`, `onClear` y `onLoadSampleData` como props separadas y explícitas. `ProductFilters` quedó exclusivamente enfocado en búsqueda, categoría y reset de filtros. En `ProductsPage` ambos componentes se renderizan de forma independiente.

---

## 14. Doble suscripción al store en `ProductsPage`
**Descripción:** `ProductsPage` llamaba a `useProductStore((storeState) => storeState.products.length)` para obtener `totalProducts`, pero el hook `useProductFilters` ya devolvía ese mismo valor bajo el nombre `totalProductCount`. Esto generaba dos suscripciones distintas al mismo slice del store desde el mismo componente.

**Solución propuesta:**
- Eliminar la suscripción directa al store en la página y derivar todo desde el valor que ya expone el hook.

**Solución aplicada:**
Se eliminó el `useProductStore` de `ProductsPage`. Ahora `hasProducts` se deriva directamente de `totalProductCount` (`totalProductCount > 0`), que ya viene de `useProductFilters`, evitando la doble suscripción al store desde el mismo componente.

---

## 15. Pérdida de metadata en `/` y `/reminders` durante el merge de `feature/email-reminders`

**Descripción:** La Fase 4 había dejado `src/app/page.tsx` y `src/app/(pages)/reminders/page.tsx` como Server Components delgados con `export const metadata` completo, renderizando una vista `"use client"` separada (`HomeView`/`RemindersView`). Al mergear `feature/email-reminders` a `main`, la resolución del conflicto en esos dos archivos se quedó con la versión vieja (monolítica, `"use client"` en el propio `page.tsx`, con toda la lógica adentro), que no puede exportar `metadata` — Next.js lo rechaza en build para Client Components. El `export const metadata` directamente desapareció de esas dos rutas, dejando solo un `import type { Metadata }` sin usar, y las páginas se quedaron sin `<title>`, sin `description` ni Open Graph. El commit `973d898 fix: add missing use client directives` solo tapó el síntoma (agregó `"use client"` para que compilara) sin notar que la metadata ya se había perdido.

**Solución aplicada (2026-08-01, PR #8 `refactor/page-server`):** se volvió a dividir cada ruta en un Server Component (`page.tsx`, exporta `metadata`) + una vista `"use client"` (`HomeView.tsx`, `RemindersView.tsx`), commits `d531d2a`, `ea9e441`, `cd0ca45`, `f9683ce`, mergeados en `7b305e5`. Mismo patrón se aplicó también a `/products` y `/edit-warranty/[id]` cuando se crearon.

## 16. Email de recordatorio con datos hardcodeados en vez de reales

**Descripción:** El botón de "enviar" recordatorio en la UI (`RemindersPage`, antes de la refactorización a hooks) llamaba a `emailjs.send(...)` con `product_name: "Producto de prueba"` y `expiry_date: "01/09/2026"` fijos — a pesar de que el componente ya calculaba los recordatorios reales unas líneas arriba (`checkReminders(warranties, settings)`), el envío ignoraba ese resultado y mandaba siempre el mismo email de prueba, sin importar qué garantía estuviera por vencer.

**Solución aplicada (2026-08-01, PR #7 `refactor/custom-email`):** el envío real de recordatorios se resolvió del lado del servidor en `scripts/send-reminders.ts` (corrido por el cron de GitHub Actions), que arma el asunto y el cuerpo del email con `product.name` y la fecha de vencimiento real de cada producto — commit `0515853 feat(warranty): send reminder email with dynamic product data`, mergeado en `6dfc2ba`. El hook `useReminderEmail` (envío desde el navegador vía EmailJS) quedó sin usar en ningún lado — ver nota de limpieza pendiente en `.env.example`.

## 17. Duplicación de estado entre Zustand (localStorage) y Supabase

**Descripción:** Al integrar Supabase, tanto los productos como la configuración de recordatorios quedaron con dos copias persistentes independientes: el store de Zustand (con `persist`, en localStorage) y la tabla correspondiente en Supabase, sin ningún mecanismo que las mantuviera sincronizadas.

**Productos — resuelto (2026-08-05, commits `4c1ff3c`, `d5fa346`, `7e35acf`):** se le sacó el `persist` a `useProductStore` — ya no vive en localStorage. Supabase es la única fuente de verdad; `useLoadProducts()` hace `productRepository.getAll()` al montar y llena el store (reemplazo completo, no merge), y `ProductForm.onSubmit` vuelve a pedir la lista completa después de insertar en vez de asumir el resultado localmente.

**Configuración de recordatorios — parcialmente resuelto, no bloqueante:** `useReminderStore` (settings) todavía usa `persist` a localStorage, y en paralelo `useReminderSettings` hace su propio fetch/update contra `supabase.from("settings")`. En el camino feliz, Supabase gana (su `useEffect` sobreescribe el `useState` sembrado desde Zustand apenas carga), pero si la carga de Supabase falla, el componente se queda en silencio con los valores de localStorage sin avisar al usuario, y el store de Zustand solo se actualiza cuando el usuario guarda con éxito — no cuando Supabase cambia por otra vía. Queda pendiente para una fase futura decidir una única fuente de verdad para la configuración, igual que se hizo con productos.

## 18. Heading `<h1>` duplicado en `RemindersView`

**Descripción:** `RemindersView.tsx` tenía su propio `<h1>Recordatorios</h1>`, pero `Topbar` (montado en `layout.tsx`) ya renderiza un `<h1>Mis Garantías</h1>` en todas las páginas — dos `<h1>` por carga en `/reminders`. Ya se había corregido una vez en Fase 4 (bajado a `<h2>`), pero volvió a aparecer como `<h1>` cuando `RemindersView` se reescribió durante la integración de Supabase/email, y nadie lo notó ni lo documentó en ese momento. De paso, el label "Correo de notificación" del formulario de configuración tampoco estaba asociado a su `<input type="email">` (sin `id`/`htmlFor`).

**Solución aplicada:** commit `a373df0` (2026-08-10) — `<h1>` vuelve a `<h2>`, y se agregó el `id`/`htmlFor` faltante entre el label y el input de email.