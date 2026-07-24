## HANDOFF FASE 1 → FASES 2-6

### ✅ COMPLETADO POR SOFÍA (FASE 1)

- Next.js 16.2.11 + TypeScript + Tailwind v4 + App Router configurado
- Estructura de carpetas base: src/app/ con 3 rutas vacías
  - / → src/app/page.tsx (metadata: title y description básicas)
  - /record-product → src/app/record-product/page.tsx (metadata básica)
  - /reminders → src/app/reminders/page.tsx (metadata básica)
- src/app/layout.tsx y globals.css limpios (sin contenido demo)
- next.config.ts y tsconfig.json generados correctamente por Next 16
- .gitignore funcional
- Git inicializado + 1er commit: "feat: scaffold Next.js 16 project with base routes"
- Compilación verificada: pnpm build sin errores
- Repositorio en GitHub: https://github.com/shadowia-sofiazilijosky/warranty-app-next

### 🚀 PARA EMPEZAR (TODO EL EQUIPO)

```bash
git clone https://github.com/shadowia-sofiazilijosky/warranty-app-next.git
cd warranty-app-next
corepack pnpm install
corepack pnpm dev
```

Accede a http://localhost:3000

### 📋 FASES PENDIENTES (Asignar 1 integrante por fase)

#### FASE 2: Migración de Componentes + Zustand (1-2 integrantes)
Responsabilidad:
- Copiar carpeta src/features/ del repo original (../warranty-app/src/features)
- Copiar src/shared/ del original
- Crear src/lib/store.ts con Zustand stores (del original src/stores/)
- Migrar componentes reemplazando React Router <Link> con next/link
- Agregar "use client" en:
  - Sidebar, SidebarItem
  - ProductForm, ProductList, ProductsTable
  - ProductFilters, SearchBox
  - HomeView, RemindersView
  - Cualquier componente con useState, useEffect, eventos onClick, localStorage
- Mantener componentes puramente visuales sin "use client"
- Verificar que el estado persista con localStorage (Zustand persist middleware)

Rama: feature/fase2-componentes
Commits esperados:
- feat: migrate features and shared components from original Vite app
- feat: add Zustand stores (products, filters)
- feat: replace React Router Link with next/link and usePathname

Verificar: npm run dev, navegar por todas las rutas, ver que componentes rendericen

#### FASE 3: Optimizaciones (Imágenes y Fuentes) (1 integrante)
Responsabilidad:
- Revisar todos los <img> en componentes migrados
- Convertir a next/image donde sea seguro (mantener exactitud de layout)
- Nota: No forzar next/image si rompe el layout visual con data: URIs
- Buscar si hay fuentes custom (Google Fonts, @font-face)
- Si las hay, migrar a next/font para optimización
- Code-splitting ya lo da App Router automáticamente
- NO agregar dynamic()/lazy-loading artificial si no hay componentes pesados

Rama: feature/fase3-optimizaciones
Commits esperados:
- perf: migrate images to next/image where applicable
- perf: setup custom fonts with next/font (si aplica)

Verificar: pnpm build, revisar que imágenes y fuentes carguen correctamente

#### FASE 4: SEO y Metadatos (CRÍTICA - 1 integrante) ⭐
Responsabilidad:
- OBLIGATORIO: Agregar metadata completo a cada página
  - title: descriptivo
  - description: conciso (~155 caracteres)
  - openGraph: og:title, og:description, og:image
- Crear app/robots.ts (permitir crawling)
- Crear app/sitemap.ts (listar todas las rutas)
- Revisar jerarquía de headings semántica (<h1>, <h2>, <h3>)
- Mantener alt text en imágenes
- Verificar que todos los formularios tengan labels asociadas

Rama: feature/fase4-seo
Commits esperados:
- feat: add metadata and Open Graph tags to all pages
- feat: generate robots.txt and sitemap.xml
- feat: improve semantic HTML structure and heading hierarchy

Verificar: pnpm build genera estáticos, verificar metadatos con browser DevTools, comprobar robots.txt y sitemap.ts

#### FASE 5: Documentación de Bugs (PARALELO - cualquiera encontrando)
Responsabilidad:
- Crear archivo BUGFIXES.md en raíz del proyecto
- Mientras migran componentes, si encuentran bugs del original o new bugs:
  - Documentar: qué pasaba, por qué, cómo se solucionó
  - Hacer commit fix: descripción
- Bug conocido a corregir: en ProductForm.tsx (del original), el <select> de importancia tiene etiquetas invertidas:
  - value="Low" → "Alta" (INCORRECTO)
  - value="High" → "Baja" (INCORRECTO)
  - Debería ser: Low→Baja, Medium→Media, High→Alta
- Corregir este bug y documentarlo

Rama: feature/fase5-bugfixes (o commits directos a main tras review)
Commits esperados:
- fix: correct importance priority labels in ProductForm
- docs: add BUGFIXES.md with bug registry

#### FASE 6: Deploy en Vercel (AL FINAL - 1 integrante)
Responsabilidad:
- Conectar repositorio GitHub a Vercel (vercel.com)
- Configurar variables de entorno si existen (.env.local en local, secrets en Vercel)
- Ejecutar pnpm build y pnpm start localmente para verificar
- Deploy automático en Vercel (se triggers con git push)
- Verificar que todas las rutas funcionen en el deploy
- Compartir URL de Vercel con el equipo

Rama: feature/fase6-deploy (o documentación en README)
Commits esperados:
- docs: add Vercel deployment configuration
- docs: update README with live deploy link

### 📌 GIT WORKFLOW (OBLIGATORIO)

Cada fase usa su propia rama:

```bash
# Crear rama (desde main)
git checkout -b feature/fase-X-nombre

# Trabajar y hacer commits frecuentes (conventional commits)
git commit -m "feat: descripción corta"
git commit -m "fix: descripción corta"
git commit -m "perf: descripción corta"
git commit -m "docs: descripción corta"

# Push a GitHub
git push -u origin feature/fase-X-nombre

# Abrir Pull Request en GitHub
# → Revisar cambios → Merge a main
```

Evitar commits genéricos: NO hagas "cambios", "avance", "arreglos", "commit final"

### ⚠️ RESTRICCIONES Y NOTAS TÉCNICAS

- **Identidad visual:** NO cambiar estilos, colores, tipografía ni spacing del proyecto original
- **Mismo comportamiento:** Todas las funcionalidades del original deben funcionar exactamente igual
- **Package manager:** Usar pnpm en todos los comandos (corepack pnpm si no está global)
- **Proyecto original:** Mantener ../warranty-app para comparar durante migración
- **Compilación:** Antes de hacer PR, verificar: pnpm build && pnpm lint
- **TypeScript:** No debe haber errores de tipos (pnpm type-check)

### ✅ DEFINICIÓN DE "LISTO" PARA CADA FASE

FASE 2 ✅ cuando:
- Todos los componentes migrados y funcionan
- Zustand stores persisten estado
- Todas las rutas cargan correctamente
- Visualmente idéntico al original

FASE 3 ✅ cuando:
- pnpm build sin advertencias de imágenes
- Fuentes cargan rápido (DevTools Network)
- No hay layout shift visual

FASE 4 ✅ cuando:
- Cada página tiene metadata
- robots.txt y sitemap.ts generan correctamente
- Open Graph tags se ven en browser inspector
- Headings semánticos correctos

FASE 5 ✅ cuando:
- BUGFIXES.md documentado y completo
- Todos los bugs corregidos y commitados

FASE 6 ✅ cuando:
- Deploy funcional en Vercel
- Todas las rutas accesibles desde el deployment
- README actualizado con link de Vercel

### 📞 REFERENCIAS

- Repo original: https://github.com/FranciscoDevelopment/warranty-app
- PDF consigna: "Tercer Proyecto Integrador - Migración a Next.js"
- Docs Next.js: https://nextjs.org/docs
- Vercel Deploy: https://vercel.com
