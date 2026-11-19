import Link from 'next/link';
import type { ReactNode } from 'react';
import { Logo } from './Logo';
import estilos from './PiePagina.module.css';

/**
 * Pie de página con forma de etiqueta de caja de zapatos: campos "MOD./REF./TALLA", código de barras y QR.
 * DATOS DUMMY: se reemplazan con los reales del cliente (docs/PENDIENTES.md). El QR enlazará al Instagram.
 */
const COLUMNAS = [
  { campo: 'Tienda', codigo: 'T-01', enlaces: [
    { href: '/tienda', texto: 'Toda la colección' },
    { href: '/tienda?categoria=categoria-1', texto: 'Categoría 1' },
    { href: '/tienda?categoria=categoria-2', texto: 'Categoría 2' },
    { href: '/tienda?categoria=categoria-3', texto: 'Categoría 3' },
    { href: '/tienda?categoria=categoria-4', texto: 'Categoría 4' },
  ] },
  { campo: 'Ayuda', codigo: 'A-02', enlaces: [
    { href: '/guia-de-tallas', texto: 'Guía de tallas' },
    { href: '/legal/envios', texto: 'Envíos y tiempos' },
    { href: '/legal/cambios-y-devoluciones', texto: 'Cambios y devoluciones' },
    { href: '/legal/pqrs', texto: 'PQRS' },
  ] },
  { campo: 'Legal', codigo: 'L-03', enlaces: [
    { href: '/legal/terminos', texto: 'Términos y condiciones' },
    { href: '/legal/privacidad', texto: 'Tratamiento de datos (Ley 1581)' },
    { href: '/legal/garantia', texto: 'Garantía' },
  ] },
] as const;

// Patrón determinista de barras (decorativo)
const BARRAS = Array.from({ length: 46 }, (_, i) => 1 + ((i * 7 + 3) % 4));
// Patrón QR de muestra 21×21 con los tres marcadores de posición (no es un QR válido: es un marcador visual)
const QR = Array.from({ length: 21 * 21 }, (_, k) => {
  const x = k % 21; const y = Math.floor(k / 21);
  const enMarcador = (cx: number, cy: number): boolean => x >= cx && x < cx + 7 && y >= cy && y < cy + 7;
  if (enMarcador(0, 0) || enMarcador(14, 0) || enMarcador(0, 14)) {
    const lx = x % 14 % 7; const ly = y % 14 % 7;
    return lx === 0 || lx === 6 || ly === 0 || ly === 6 || (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4);
  }
  return ((x * 31 + y * 17 + x * y) % 7) < 3;
});

export function PiePagina() {
  const anio = 2026;
  return (
    <footer className={estilos.pie}>
      <div className="contenedor">
        <div className={estilos.etiqueta}>
          <div className={estilos.encabezado}>
            <div className={estilos.marca}>
              <Logo comoEnlace={false} />
              <p className={estilos.lema}>Calzado hecho en Colombia. Texto de muestra del cliente.</p>
            </div>
            <dl className={estilos.campos}>
              <div><dt>Mod.</dt><dd>Tienda en línea</dd></div>
              <div><dt>Ref.</dt><dd>ALF-WEB-2026</dd></div>
              <div><dt>Hecho en</dt><dd>Bogotá, Colombia</dd></div>
            </dl>
          </div>

          <div className={estilos.cuerpo}>
            {COLUMNAS.map((c) => (
              <nav key={c.campo} aria-labelledby={`pie-${c.codigo}`} className={estilos.columna}>
                <h2 id={`pie-${c.codigo}`} className={estilos.campo}><span>{c.campo}</span><span aria-hidden="true">{c.codigo}</span></h2>
                <ul>
                  {c.enlaces.map((e) => <li key={e.href}><Link href={e.href}>{e.texto}</Link></li>)}
                </ul>
              </nav>
            ))}
            <section aria-labelledby="pie-contacto" className={estilos.columna}>
              <h2 id="pie-contacto" className={estilos.campo}><span>Contacto</span><span aria-hidden="true">C-04</span></h2>
              <address className={estilos.direccion}>
                <span>Calle 00 # 00-00, Bogotá D.C.</span>
                <span>WhatsApp: <a href="https://wa.me/573000000000" rel="noopener noreferrer">300 000 0000</a></span>
                <span>Correo: <a href="mailto:hola@alfonsini.example">hola@alfonsini.example</a></span>
                <span>Lunes a sábado, 8:00 a. m. a 6:00 p. m.</span>
              </address>
            </section>
          </div>

          <div className={estilos.tallas} aria-hidden="true">
            {[['EUR', '40'], ['US', '8'], ['UK', '7'], ['CM', '25,7'], ['CO', '39']].map(([k, v]) => (
              <span key={k}><small>{k}</small><strong>{v}</strong></span>
            ))}
          </div>

          <div className={estilos.base}>
            <div className={estilos.codigo} aria-hidden="true">
              <svg viewBox="0 0 120 40" preserveAspectRatio="none">
                {BARRAS.reduce<{ x: number; nodos: ReactNode[] }>((acc, w, i) => {
                  if (i % 2 === 0) acc.nodos.push(<rect key={i} x={acc.x} y="0" width={w} height="40" />);
                  acc.x += w * 1.05;
                  return acc;
                }, { x: 0, nodos: [] }).nodos}
              </svg>
              <span>7 709990 000002</span>
            </div>
            <div className={estilos.qr}>
              <svg viewBox="0 0 21 21" role="img" aria-label="Código QR de muestra. Pronto enlazará al Instagram de Alfonsini." shapeRendering="crispEdges">
                {QR.map((on, k) => (on ? <rect key={k} x={k % 21} y={Math.floor(k / 21)} width="1" height="1" /> : null))}
              </svg>
              <span>Síguenos<br />(pronto)</span>
            </div>
            <div className={estilos.legal}>
              <p>Medios de pago: pago contra entrega · transferencia Bre-B.</p>
              <p>
                © {anio} Alfonsini. Datos de muestra. ·{' '}
                <a href="https://www.sic.gov.co" rel="noopener noreferrer">Superintendencia de Industria y Comercio</a>
              </p>
              <p className={estilos.firma}>Software fácil, software para todos · Calidad AccedIT</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
