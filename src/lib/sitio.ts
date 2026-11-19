/** Datos globales del sitio para SEO. La URL real se define con NEXT_PUBLIC_SITIO_URL al desplegar. */
export const SITIO = {
  nombre: 'Alfonsini',
  url: (process.env.NEXT_PUBLIC_SITIO_URL ?? 'https://alfonsini.example').replace(/\/$/, ''),
  descripcion: 'Calzado fabricado en Colombia. Compra en línea con pago contra entrega o transferencia Bre-B y envío a todo el país.',
  idioma: 'es-CO',
} as const;
