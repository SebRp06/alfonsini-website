# ADR 0001 · Next.js (App Router) con generación estática, sobre SSR puro

- Estado: aceptado · 19 nov 2026
- Decisores: Jan Sebastián Rodríguez Peña (AccedIT), con @KIT y @WEB

## Contexto
Alfonsini necesita SEO fuerte, carga rápida en celulares de gama baja (HSS™) y una base lista para
conectar base de datos e inventario más adelante. Se pidió React + TypeScript y se preguntó entre
"Next.js o SSR".

## Decisión
Next.js 16 con App Router, **páginas prerenderizadas (SSG)** y componentes de servidor por defecto.
Solo son de cliente los componentes interactivos (filtros, ficha de producto, carrito, checkout).

## Por qué no "SSR puro"
- Next.js ya es SSR cuando se necesita: cada ruta puede ser estática, ISR o dinámica sin cambiar de framework.
- Para un catálogo, el HTML estático en CDN es lo más rápido (TTFB mínimo) y lo mejor para indexar:
  Google recibe todo el contenido, los precios y los datos estructurados sin ejecutar JavaScript.
- Cuando llegue la BD, las fichas pasan a **ISR** (`revalidate`) o revalidación por evento al cambiar
  stock/precio, sin tocar componentes (puertos en `src/lib/repositorios`).

## Consecuencias
- SEO: metadatos por página, canónicas, `sitemap.xml`, `robots.txt`, JSON-LD (`Organization`, `WebSite`
  con `SearchAction`, `ItemList`, `Product` + `Offer` en COP, `BreadcrumbList`).
- Rendimiento: fuentes auto-hospedadas con métricas de respaldo (CLS 0), cero librerías de animación,
  imágenes vectoriales en la maqueta, animaciones solo con `transform`/`opacity`.
- Seguridad: cabeceras en `next.config.ts` (modo servidor) y CSP en `<meta>` (modo estático).
- Vista previa: `npm run build:preview` exporta HTML estático en `out/`.
- Pendiente: CSP con `nonce` cuando haya rutas dinámicas.
