# Alfonsini · Tienda en línea

Maqueta visual v0.1 del comercio electrónico de calzado **Alfonsini**, construida por **AccedIT**
("Software fácil, software para todos") bajo HCQE™, UFF™, HSS™ y GWT™.

## Qué incluye
- **Portada** vectorial en alta resolución: logotipo protagonista con humo/espectro animado y escenario geométrico simétrico (solo `transform`/`opacity`, se pausa fuera de pantalla).
- **Vitrina "Estantería de cajas"**: cada producto es una caja; la tapa se levanta y el zapato sale (hover, foco o al centrar en el celular).
- **Ficha con hotspots** de materiales, selector de talla con medidor de pie (cm → talla), agotados con **lista de espera** (nunca un botón apagado) y **animación de empacar** en la caja que viaja al carrito.
- **Carrito** con barra de envío gratis y deshacer al quitar.
- **Checkout GWT™** en 3 pasos (datos, envío, pago contra entrega / Bre-B), autocompletado nativo, errores amables y botón Atrás entre pasos; **página de gracias** animada.
- **Pie de página tipo etiqueta** de caja de zapatos con código de barras y QR (Instagram, pendiente).
- **Accesibilidad**: tamaño de letra 100–150 % y tema claro/oscuro al instante, saltar al contenido, lector de pantalla, teclado, zoom.
- **SEO**: SSG, metadatos, canónicas, sitemap, robots, JSON-LD de producto y organización.

## Vista previa pública
https://sebrp06.github.io/alfonsini-website/ — se actualiza sola en cada cambio de `main` (workflow `vista-previa`). Lleva `noindex`: es una maqueta con datos de muestra.

## Comandos
```bash
npm ci
npm run dev            # desarrollo
npm run check          # lint + tipos + build + Playwright/axe (compuerta de calidad)
npm run build:preview  # HTML estático en out/
npm run build:pages    # igual, con la subruta de GitHub Pages
```

## Calidad (19 nov 2026)
- Playwright + axe-core: 58/58 pruebas (WCAG 2.2 AA en tema claro y oscuro, 375 px y 1440 px, letra al 125 % y 150 % sin desborde, objetivos ≥ 44 px, compra completa con Atrás).
- Lighthouse móvil: Accesibilidad 100 · Buenas prácticas 100 · SEO 100 · Rendimiento 91–96.
- Quality Kit AccedIT: **Índice de Salud UFF™ 99/100**.

## Documentos
- `docs/PENDIENTES.md` — todo lo que falta (contenido, BD, inventario, pagos, usuarios).
- `docs/sugerencias-produccion.txt` — opciones gratuitas y de pago para producción.
- `docs/adr/0001-nextjs-ssg-app-router.md` — por qué Next.js con SSG.
