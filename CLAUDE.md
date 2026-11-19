# Alfonsini · sitio de comercio (AccedIT)

Tienda en línea de calzado Alfonsini. Next.js 16 (App Router, SSG) + React 19 + TypeScript estricto. Sin librerías de UI ni animación.

## Mapa
- `src/app/` rutas: inicio, `tienda` (vitrina), `producto/[slug]` (ficha), `carrito`, `checkout` (GWT™ 3 pasos) y `checkout/gracias`, `guia-de-tallas`, `legal/[documento]`.
- `src/components/` UI por zona (`inicio`, `vitrina`, `producto`, `compra`) con CSS Modules.
- `src/domain/` reglas puras (precios, tallas, validaciones). `src/datos/catalogo.ts` datos de maqueta.
- `src/lib/repositorios/` puertos + adaptador de maqueta: aquí se conecta la BD.
- `src/estado/` carrito y preferencias (tema, tamaño de letra) con `useSyncExternalStore`.
- Tokens de diseño: bloque `:root` de `src/app/globals.css`.

## Reglas
Ver `.cursor/rules/*.mdc`. No construir módulo de usuarios hasta que el dueño lo indique (`docs/PENDIENTES.md`).

## Comandos
`npm run dev` · `npm run check` (lint + tipos + build + Playwright/axe) · `npm run build:preview` (HTML estático en `out/`) · `npm run placeholders` (regenera ilustraciones).
Quality Kit: `accedit/consultant-notes.alfonsini.json` → copiar a `consultant-notes.json` del kit.
