import type { NextConfig } from 'next';

/**
 * Dos modos de construcción:
 * - Servidor (por defecto): SSG + cabeceras de seguridad. Es el modo de producción (Vercel, Node, contenedor).
 * - STATIC_EXPORT=1: HTML estático en `out/` para la vista previa (visor) y hosting sin servidor.
 */
const exportar = process.env.STATIC_EXPORT === '1';
// Subruta de despliegue (GitHub Pages: /alfonsini-website). Vacía en producción con dominio propio.
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');

const csp = [
  "default-src 'self'",
  // Next inyecta scripts inline de hidratación en páginas estáticas. Migrar a nonce cuando haya render dinámico (ver docs/PENDIENTES.md).
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const cabecerasSeguridad = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(self)' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  output: exportar ? 'export' : undefined,
  ...(basePath ? { basePath } : {}),
  trailingSlash: exportar,
  images: {
    // Placeholders SVG locales. Con las fotos reales: AVIF/WebP y un loader de CDN (ver docs/PENDIENTES.md).
    unoptimized: true,
  },
  ...(exportar
    ? {}
    : {
        async headers() {
          return [
            { source: '/:path*', headers: cabecerasSeguridad },
            { source: '/fonts/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
            { source: '/img/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' }] },
          ];
        },
      }),
};

export default nextConfig;
