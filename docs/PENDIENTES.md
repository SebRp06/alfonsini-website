# Pendientes · Alfonsini (para después de la maqueta visual)

Estado: **v0.1 maqueta visual** (19 nov 2026). Todo lo de abajo queda **fuera** de esta versión a propósito.
La base técnica ya está lista para conectarlo sin rehacer pantallas (ver "Dónde se conecta").

## 1. Contenido y marca (lo entrega el cliente)
| # | Pendiente | Dónde se conecta |
|---|---|---|
| 1.1 | **Licencia web de la fuente Flexing** (la versión gratuita de Say Studio es solo para uso personal). Con el `.woff2` licenciado: añadirlo con `next/font/local` en `src/app/layout.tsx`; el token `--fuente-marca` ya lo pone de primero. | `src/app/layout.tsx`, `src/app/globals.css` |
| 1.2 | Logo definitivo (si cambia el isotipo "A + suela"). | `src/components/Logo.tsx`, `Isotipo.tsx`, `src/app/icon.svg` |
| 1.3 | **Fotos reales** de cada referencia (mín. 3 por producto: lateral, par, detalle), fondo limpio, 1600 px, exportadas a AVIF/WebP. Recalibrar la posición de los hotspots sobre cada foto. | `src/datos/catalogo.ts` → luego la BD |
| 1.4 | **Nombres reales de las categorías** (hoy "Categoría 1…4"). Al definirlas, crear rutas indexables `/coleccion/[categoria]` para SEO. | `src/datos/catalogo.ts`, `src/app/tienda` |
| 1.5 | Descripciones, materiales, cuidados y precios reales. | catálogo / BD |
| 1.6 | **Tabla de tallas real** según la horma de Alfonsini (hoy es referencial). | `src/domain/tallas.ts` |
| 1.7 | Datos reales del pie de página: dirección, WhatsApp, correo, horario, NIT, razón social. | `src/components/PiePagina.tsx` |
| 1.8 | **QR del pie de página → Instagram** del cliente (hoy es un patrón de muestra no escaneable). Generar el QR real en build (SVG). | `src/components/PiePagina.tsx` |
| 1.9 | Historia del taller para "El oficio" y textos de la portada. | `src/app/page.tsx` |
| 1.10 | Paleta: si el cliente pide otros colores, se cambian solo los tokens del bloque `:root` (2×3). | `src/app/globals.css` |

## 2. Operación del sitio
| # | Pendiente | Base ya creada |
|---|---|---|
| 2.1 | **Base de datos** de catálogo, pedidos y lista de espera. | Puertos en `src/lib/repositorios/puertos.ts`; adaptador de maqueta en `maqueta.ts`; selector único en `index.ts`. |
| 2.2 | **Gestión de inventario/stock** (existencias por talla, reserva al confirmar, liberación si no se paga). | `InventarioRepositorio.reservar()` con clave de idempotencia. |
| 2.3 | **Medios de pago definitivos** (confirmar con el cliente). Hoy: "Pago contra entrega" y "Transferencia Bre-B" con llave de muestra `@alfonsini`. Si se suma pasarela (Wompi, Bold, ePayco, Mercado Pago), agregar el medio al tipo `MedioPago`. | `src/domain/tipos.ts`, `Checkout.tsx` |
| 2.4 | Verificación del pago Bre-B (conciliación automática o manual desde un panel). | `PedidosRepositorio` |
| 2.5 | **Tarifa real de envío** por ciudad/transportadora (hoy: $14.900 o gratis desde $300.000). | `src/domain/dinero.ts` |
| 2.6 | Correos transaccionales (confirmación, despacho, lista de espera) y WhatsApp. | `ListaEsperaRepositorio`, `PedidosRepositorio` |
| 2.7 | Factura electrónica DIAN (proveedor tecnológico). | Pedido ya pide cédula. |
| 2.8 | Panel administrativo para cargar productos, fotos y stock. | — |
| 2.9 | Pasar la lista de espera a un servicio real (hoy no envía datos a ningún servidor). | `ListaEsperaRepositorio` |
| 2.10 | Analítica respetuosa (sin cookies de terceros por defecto) y banner de consentimiento si se usa publicidad. | — |

## 3. Usuarios (NO construir hasta que Jan Sebastián lo indique)
- Creación de cuentas de cliente para gestión personalizada: historial de pedidos, direcciones guardadas, favoritos, lista de espera propia, cambios de talla en línea.
- Solo está anotado. **No hay código de usuarios en el sitio.**

## 4. Seguridad, legal y despliegue
| # | Pendiente |
|---|---|
| 4.1 | Dominio, hosting y `NEXT_PUBLIC_SITIO_URL` (canónicas, sitemap y datos estructurados ya la usan). |
| 4.2 | CSP con `nonce` cuando exista render dinámico (hoy `script-src 'self' 'unsafe-inline'` por las páginas estáticas). |
| 4.3 | Textos legales definitivos (@LEGAL): términos, Ley 1581, retracto, garantía (Ley 1480), PQRS. Hoy son de muestra. |
| 4.4 | Imagen Open Graph final con foto real (`public/og.png`). |
| 4.5 | Registrar el sitio en Google Search Console y Merchant Center (los productos ya publican `Product` + `Offer` en JSON-LD). |
| 4.6 | Prueba de carga k6 (HSS™) sobre el hosting real y auditoría completa del Quality Kit con WebKit. |

## 5. Ideas propuestas (por decidir)
- **Probador de talla por foto**: la clienta sube foto del pie sobre una hoja A4 y se calcula el largo.
- **"Arma tu caja"**: combo de 2 pares con descuento, empacados en la misma caja animada.
- **Reseñas reales verificadas** (solo de compras confirmadas; nunca inventadas).
- **Pedido mayorista / distribuidores** con tabla de curvas de tallas.
- **Rastreo del pedido** en la página de gracias con la guía de la transportadora.
- **AAUM™** (modularización por edad): pospuesto por decisión del cliente.
- Recordatorio de carrito por WhatsApp (con consentimiento explícito).
- Mejora propuesta al Quality Kit: elegir la variante obligatoria (talla) en el recorrido `@prospecto`. Parche en `accedit/propuesta-kit-variante-obligatoria.patch`.
