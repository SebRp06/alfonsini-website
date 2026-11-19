import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import { ProveedorAvisos } from '@/components/Avisos';
import { Cabecera } from '@/components/Cabecera';
import { PiePagina } from '@/components/PiePagina';
import { SCRIPT_PREFERENCIAS } from '@/estado/preferencias';
import { SITIO } from '@/lib/sitio';
import './globals.css';

// Fuentes auto-hospedadas (sin peticiones a terceros) con métricas de respaldo ajustadas: CLS 0.
const unbounded = localFont({ src: '../fonts/unbounded-latin.woff2', variable: '--f-unbounded', weight: '200 900', display: 'swap', preload: true });
const manrope = localFont({ src: '../fonts/manrope-latin.woff2', variable: '--f-manrope', weight: '200 800', display: 'swap', preload: true });

export const metadata: Metadata = {
  metadataBase: new URL(SITIO.url),
  title: { default: 'Alfonsini · Calzado hecho en Colombia', template: '%s · Alfonsini' },
  description: SITIO.descripcion,
  applicationName: SITIO.nombre,
  keywords: ['calzado', 'zapatos', 'Colombia', 'tienda en línea', 'Alfonsini', 'zapatos hechos en Colombia'],
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'es_CO', siteName: SITIO.nombre, url: '/', title: 'Alfonsini · Calzado hecho en Colombia', description: SITIO.descripcion, images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Alfonsini' }] },
  twitter: { card: 'summary_large_image', title: 'Alfonsini · Calzado hecho en Colombia', description: SITIO.descripcion, images: ['/og.jpg'] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Nunca se bloquea el zoom (WCAG 1.4.4)
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0b0b10' },
    { media: '(prefers-color-scheme: light)', color: '#f4f4f6' },
  ],
};

const ORGANIZACION = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Organization', '@id': `${SITIO.url}/#organizacion`, name: SITIO.nombre, url: SITIO.url, logo: `${SITIO.url}/icon.svg` },
    {
      '@type': 'WebSite', '@id': `${SITIO.url}/#sitio`, name: SITIO.nombre, url: SITIO.url, inLanguage: SITIO.idioma,
      potentialAction: { '@type': 'SearchAction', target: `${SITIO.url}/tienda?q={search_term_string}`, 'query-input': 'required name=search_term_string' },
    },
  ],
};

const CSP_META = [
  "default-src 'self'", "script-src 'self' 'unsafe-inline'", "style-src 'self' 'unsafe-inline'", "img-src 'self' data: blob:",
  "font-src 'self'", "connect-src 'self'", "object-src 'none'", "base-uri 'self'", "form-action 'self'",
].join('; ');

export default function RaizLayout({ children }: { readonly children: ReactNode }) {
  return (
    <html lang="es-CO" data-tema="oscuro" className={`${unbounded.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        {/* CSP también en <meta> para hosting estático sin control de cabeceras. En desarrollo Next necesita eval. */}
        {process.env.NODE_ENV === 'production' && <meta httpEquiv="Content-Security-Policy" content={CSP_META} />}
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_PREFERENCIAS }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZACION) }} />
      </head>
      <body>
        <a href="#contenido" className="saltar-contenido">Saltar al contenido</a>
        <ProveedorAvisos>
          <Cabecera />
          <main id="contenido" tabIndex={-1}>{children}</main>
          <PiePagina />
        </ProveedorAvisos>
      </body>
    </html>
  );
}
