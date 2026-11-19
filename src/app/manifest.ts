import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Alfonsini · Calzado hecho en Colombia',
    short_name: 'Alfonsini',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0b10',
    theme_color: '#0b0b10',
    lang: 'es-CO',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
