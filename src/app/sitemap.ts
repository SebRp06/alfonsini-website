import type { MetadataRoute } from 'next';
import { PRODUCTOS } from '@/datos/catalogo';
import { absoluta, SITIO } from '@/lib/sitio';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const ahora = new Date();
  const fijas = ['', '/tienda', '/guia-de-tallas', '/legal/envios', '/legal/cambios-y-devoluciones', '/legal/terminos', '/legal/privacidad', '/legal/garantia', '/legal/pqrs'];
  return [
    ...fijas.map((r) => ({ url: `${SITIO.url}${r}`, lastModified: ahora, changeFrequency: 'weekly' as const, priority: r === '' ? 1 : 0.6 })),
    ...PRODUCTOS.map((p) => ({ url: `${SITIO.url}/producto/${p.slug}`, lastModified: ahora, changeFrequency: 'daily' as const, priority: 0.8, images: p.imagenes.map((i) => absoluta(i.src)) })),
  ];
}
