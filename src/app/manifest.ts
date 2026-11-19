import type { MetadataRoute } from 'next';
import { recurso } from '@/lib/sitio';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Alfonsini · Calzado hecho en Colombia',
    short_name: 'Alfonsini',
    start_url: recurso('/'),
    display: 'standalone',
    background_color: '#0b0b10',
    theme_color: '#0b0b10',
    lang: 'es-CO',
    icons: [{ src: recurso('/icon.svg'), sizes: 'any', type: 'image/svg+xml' }],
  };
}
