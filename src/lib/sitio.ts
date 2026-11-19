/**
 * Datos globales del sitio para SEO.
 * - NEXT_PUBLIC_SITIO_URL: origen público (sin ruta), p. ej. https://alfonsini.com.co
 * - NEXT_PUBLIC_BASE_PATH: subruta cuando el sitio no vive en la raíz (vista previa en GitHub Pages)
 * - NEXT_PUBLIC_INDEXAR=0: vista previa con datos de muestra, fuera de Google
 */
const ORIGEN = (process.env.NEXT_PUBLIC_SITIO_URL ?? 'https://alfonsini.example').replace(/\/$/, '');
export const BASE = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');

export const SITIO = {
  nombre: 'Alfonsini',
  url: `${ORIGEN}${BASE}`,
  descripcion: 'Calzado fabricado en Colombia. Compra en línea con pago contra entrega o transferencia Bre-B y envío a todo el país.',
  idioma: 'es-CO',
  indexable: process.env.NEXT_PUBLIC_INDEXAR !== '0',
} as const;

/** Ruta de un archivo de /public respetando la subruta de despliegue. */
export const recurso = (ruta: string): string => `${BASE}${ruta}`;
/** URL absoluta de un recurso que ya trae la subruta (imágenes del catálogo). */
export const absoluta = (rutaConBase: string): string => `${ORIGEN}${rutaConBase}`;
