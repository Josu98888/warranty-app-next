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
**Solución aplicada:**
Se agregó `ROUTES.PRODUCTS` (`/products`) y se creó la página correspondiente en `src/app/(pages)/products/page.tsx`, mostrando la tabla de productos por separado del dashboard. El ítem "Productos" del Sidebar ahora apunta ahí. También se agregó `ROUTES.SETTINGS` (`/settings`) con una página placeholder (`src/app/(pages)/settings/page.tsx`), y el botón de Configuración se reemplazó por un `SidebarItem` que navega a esa ruta.

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

## 9.Rutas relativas rotas en ROUTES
Los valores de `ROUTES` (excepto `HOME`) no tenían `/` inicial, por lo que los links del Sidebar/Topbar se resolvían de forma relativa a la página actual en vez de ser absolutos. Ejemplo: desde `/reminders`, un link a `record-product` navegaba a `/reminders/record-product` (ruta inexistente) en vez de `/record-product`.
**Solución:** se agregó `/` inicial a cada valor de `ROUTES`.

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