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