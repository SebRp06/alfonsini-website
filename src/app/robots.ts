import type { MetadataRoute } from 'next';
import { SITIO } from '@/lib/sitio';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: SITIO.indexable
      ? [{ userAgent: '*', allow: '/', disallow: ['/checkout', '/carrito'] }]
      : [{ userAgent: '*', disallow: '/' }],
    sitemap: `${SITIO.url}/sitemap.xml`,
    host: SITIO.url,
  };
}
