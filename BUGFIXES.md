# Registro de Bugs y Tareas Pendientes (Warranty Tracker)

## 1. Desajuste en la configuración de Rutas
**Descripción:** Existe una inconsistencia entre el diccionario de rutas y el router principal. 
- La constante `ROUTES` exporta `EDIT_WARRANTY: "edit-warranty"`.
- El `createBrowserRouter` no tiene declarada esta ruta en su array de `children`.
**Solución propuesta:** 
- Agregar el objeto faltante en el router: `{ path: ROUTES.EDIT_WARRANTY, Component: EditWarrantyPage }` (creando el componente si no existe) o eliminarlo de `ROUTES` si fue descartado.

## 2. Errores de navegación en el Sidebar
**Descripción:** El menú lateral tiene problemas de ruteo y enlaces sin salida.
- **Rutas duplicadas:** Los ítems "Dashboard" y "Productos" apuntan exactamente a la misma ruta (`to={ROUTES.HOME}`).
- **Botón sin acción:** El botón de "Configuración" es una etiqueta `<button>` que solo ejecuta `closeMenu`. No redirige a ninguna página ni abre ningún panel de ajustes.
**Solución propuesta:**
- Crear una ruta específica en `ROUTES` para Productos (ej: `ROUTES.PRODUCTS`) y asignarla a su `SidebarItem`.
- Cambiar el botón de Configuración por un `SidebarItem` con su respectiva ruta, o agregarle la lógica para abrir un modal de configuración.

## 3. Buscador inactivo en el Topbar
**Descripción:** El input de búsqueda en la cabecera es puramente visual (UI estática). No está conectado a ningún estado ni maneja eventos.
**Solución propuesta:**
- Importar `useState` de React.
- Crear un estado `const [searchTerm, setSearchTerm] = useState("")`.
- Agregar los atributos `value={searchTerm}` y `onChange={(e) => setSearchTerm(e.target.value)}` al input.
- Implementar la lógica para filtrar los datos o redirigir a una página de resultados con parámetros de búsqueda.

## 4. Componente huérfano: `ProductList`
**Descripción:** El componente `ProductList` está declarado en el código pero no se importa ni se renderiza en ninguna vista.
**Solución propuesta:**
- Importar e integrar `<ProductList />` en la página correspondiente (probablemente dentro de `HomePage` o la futura página de Productos). Si es código viejo que ya no sirve, eliminar el archivo para mantener limpio el proyecto.

## 5. Refactorización de arquitectura: Componentes globales en dominio local (Solucionado)
**Descripción:** Hubo un error de diseño en la estructura de carpetas. Los componentes estructurales de navegación (`Sidebar`, `SidebarItem`, `Topbar`) y la carpeta `layouts` estaban ubicados dentro del dominio específico del `home`, a pesar de ser elementos globales que envuelven a toda la aplicación.
**Solución aplicada:** 
- Se refactorizó la estructura del proyecto moviendo todos estos archivos a una carpeta compartida: `shared/layout`. 
- Ahora los componentes de estructura global están correctamente centralizados y disponibles para todas las páginas sin acoplarse al dominio del `home`.