/**
 * Genera las ilustraciones placeholder (SVG, ~2-4 KB) de cada producto: lateral, par y detalle.
 * Uso libre: son originales de AccedIT. Se reemplazan por las fotos reales del cliente (docs/PENDIENTES.md).
 * Ejecutar: npm run placeholders
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { PRODUCTOS } from '../src/datos/catalogo';
import { ESCALA, LIENZO, TRASLADO } from '../src/datos/lienzo';
import type { Producto, Silueta } from '../src/domain/tipos';

interface Forma { suela: string; capellada: string; extras: string; tacon?: string }

const FORMAS: Record<Silueta, Forma> = {
  tenis: {
    suela: 'M22 196 Q20 176 40 172 L372 168 Q392 168 394 184 Q395 198 378 200 L40 202 Q24 202 22 196 Z',
    capellada: 'M38 172 L36 104 Q36 78 62 74 L112 72 Q132 72 142 86 L176 118 Q196 132 232 136 L318 144 Q366 150 382 166 L384 170 Z',
    extras: `<path d="M120 170 Q150 122 200 132 Q240 140 262 170 Z" fill="var(--acento)" opacity=".55"/>
      <path d="M300 144 Q352 149 382 166 L384 170 L300 170 Z" fill="#fff" opacity=".16"/>
      <path d="M40 104 Q42 84 62 82 L108 80 Q122 80 130 92" fill="none" stroke="var(--oscuro)" stroke-width="7" stroke-linecap="round"/>
      <path d="M36 104 L27 100 L29 150 L37 152 Z" fill="var(--acento)"/>
      ${[0, 1, 2, 3, 4].map((i) => `<path d="M${150 + i * 18} ${94 + i * 9} l10 -8" stroke="var(--claro)" stroke-width="5" stroke-linecap="round"/>`).join('')}
      <path d="M30 186 L388 182" stroke="var(--oscuro)" stroke-width="2" opacity=".35"/>
      <path d="M46 162 L374 158" stroke="var(--claro)" stroke-width="2" stroke-dasharray="6 6" opacity=".7"/>`,
  },
  formal: {
    suela: 'M30 196 L376 192 Q392 190 390 182 L384 176 L40 178 Q28 180 30 196 Z',
    tacon: 'M36 180 L36 202 L100 202 L102 180 Z',
    capellada: 'M40 178 Q34 132 58 118 Q80 108 120 108 L168 106 Q196 106 214 118 L262 140 Q330 146 366 160 Q386 168 386 176 Z',
    extras: `<path d="M56 120 Q96 104 152 112" fill="none" stroke="var(--oscuro)" stroke-width="6" stroke-linecap="round"/>
      <path d="M214 118 Q198 150 216 176" fill="none" stroke="var(--claro)" stroke-width="2" stroke-dasharray="4 5" opacity=".7"/>
      ${[0, 1, 2].map((i) => `<path d="M${178 + i * 11} ${110 + i * 6} l8 -6" stroke="var(--claro)" stroke-width="4" stroke-linecap="round"/>`).join('')}
      <path d="M296 150 Q330 150 344 176" fill="none" stroke="var(--claro)" stroke-width="3" stroke-dasharray="1 7" stroke-linecap="round" opacity=".8"/>
      <path d="M48 172 L380 172" stroke="var(--claro)" stroke-width="2" stroke-dasharray="5 6" opacity=".55"/>`,
  },
  bota: {
    suela: 'M28 198 Q26 182 44 180 L370 176 Q392 176 394 190 Q394 204 376 204 L44 206 Q30 206 28 198 Z',
    capellada: 'M44 180 L42 36 Q42 22 58 22 L146 22 Q160 22 160 38 L164 122 Q196 140 260 146 L330 152 Q378 158 386 176 Z',
    extras: `<path d="M42 42 L160 42" stroke="var(--oscuro)" stroke-width="8"/>
      <path d="M58 22 L58 6 Q58 0 66 0 L80 0 Q86 0 86 6 L86 22" fill="none" stroke="var(--acento)" stroke-width="5"/>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${156 + (i > 3 ? i * 4 : 0)}" cy="${52 + i * 15}" r="3.5" fill="var(--acento)"/>`).join('')}
      <path d="M104 30 L108 176" stroke="var(--claro)" stroke-width="2" stroke-dasharray="5 6" opacity=".6"/>
      <path d="M300 152 Q350 156 386 176 L300 176 Z" fill="#fff" opacity=".12"/>
      <path d="M34 192 L390 188" stroke="var(--oscuro)" stroke-width="3" opacity=".4"/>`,
  },
  tacon: {
    suela: 'M96 142 Q140 178 220 190 Q300 198 386 194 L386 200 Q300 204 218 196 Q136 184 92 148 Z',
    tacon: 'M56 120 L76 122 L84 208 L72 208 Z',
    capellada: 'M52 112 Q56 96 74 98 Q96 102 112 120 Q160 160 240 168 Q330 172 372 176 Q392 180 388 192 L384 194 Q300 196 220 188 Q140 176 96 140 Q76 126 60 124 Z',
    extras: `<path d="M74 102 Q120 132 168 156" fill="none" stroke="var(--oscuro)" stroke-width="5" stroke-linecap="round" opacity=".6"/>
      <path d="M300 172 Q350 174 386 186" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".25"/>
      <circle cx="98" cy="118" r="5" fill="var(--acento)"/>`,
  },
  mocasin: {
    suela: 'M30 196 L378 192 Q392 190 390 182 L386 176 L40 178 Q28 180 30 196 Z',
    tacon: 'M36 180 L36 200 L92 200 L94 180 Z',
    capellada: 'M40 178 Q36 140 56 128 Q90 118 150 120 L200 122 Q250 126 290 140 Q350 150 374 164 Q388 172 386 178 Z',
    extras: `<path d="M206 126 Q272 116 334 152" fill="none" stroke="var(--claro)" stroke-width="3" stroke-dasharray="6 5"/>
      <path d="M178 124 Q200 152 242 134 L236 124 Q204 134 186 122 Z" fill="var(--oscuro)"/>
      <ellipse cx="210" cy="132" rx="10" ry="3.5" fill="var(--acento)"/>
      <path d="M56 130 Q100 122 150 124" fill="none" stroke="var(--oscuro)" stroke-width="5" stroke-linecap="round"/>
      <path d="M48 172 L380 172" stroke="var(--claro)" stroke-width="2" stroke-dasharray="5 6" opacity=".5"/>`,
  },
};

const mezclar = (hex: string, con: string, t: number): string => {
  const a = hex.replace('#', ''); const b = con.replace('#', '');
  const c = [0, 2, 4].map((k) => Math.round(parseInt(a.slice(k, k + 2), 16) * (1 - t) + parseInt(b.slice(k, k + 2), 16) * t));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
};

function zapato(p: Producto, id: string): string {
  const f = FORMAS[p.silueta];
  const base = p.color.hex;
  const claroBase = mezclar(base, '#ffffff', 0.35);
  const oscuro = mezclar(base, '#000000', 0.45);
  const acento = p.silueta === 'tenis' || p.silueta === 'bota' ? '#F2A93B' : mezclar(base, '#F2A93B', 0.5);
  const suela = p.silueta === 'tenis' ? '#F1EEE8' : p.silueta === 'bota' ? '#2B2420' : '#1A1614';
  return `<g style="--acento:${acento};--oscuro:${oscuro};--claro:${mezclar(base, '#ffffff', 0.7)}">
    <linearGradient id="${id}c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${claroBase}"/><stop offset=".55" stop-color="${base}"/><stop offset="1" stop-color="${oscuro}"/></linearGradient>
    <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></linearGradient>
    ${f.tacon ? `<path d="${f.tacon}" fill="${mezclar(suela, '#000000', 0.2)}"/>` : ''}
    <path d="${f.capellada}" fill="url(#${id}c)"/>
    <path d="${f.capellada}" fill="url(#${id}b)"/>
    ${f.extras}
    <path d="${f.suela}" fill="${suela}"/>
    <path d="M60 140 l10 -18 l10 18 m-16 -6 h12" fill="none" stroke="var(--claro)" stroke-width="3" stroke-linejoin="round" opacity=".85"/>
  </g>`;
}

const sombra = (cx: number, cy: number, rx: number, op = 0.35): string =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${rx * 0.06}" fill="#000" opacity="${op}"/>`;

const transformar = (dx = 0, dy = 0, s = 1, espejo = false): string =>
  `translate(${TRASLADO.x + dx} ${TRASLADO.y + dy}) scale(${(espejo ? -1 : 1) * ESCALA * s} ${ESCALA * s})${espejo ? ' translate(-400 0)' : ''}`;

function svg(contenido: string, viewBox = `0 0 ${LIENZO.ancho} ${LIENZO.alto}`): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${LIENZO.ancho}" height="${LIENZO.alto}">${contenido}</svg>\n`;
}

const destino = join(process.cwd(), 'public', 'img', 'productos');
mkdirSync(destino, { recursive: true });

for (const p of PRODUCTOS) {
  const lateral = svg(`${sombra(400, 470, 330)}<g transform="${transformar()}">${zapato(p, 'l')}</g>`);
  const par = svg(
    `${sombra(470, 430, 280, 0.22)}<g transform="${transformar(130, -30, 0.78)}" opacity=".7">${zapato(p, 'a')}</g>` +
      `${sombra(370, 500, 300, 0.35)}<g transform="${transformar(-20, 80, 0.86)}">${zapato(p, 'b')}</g>`,
  );
  const detalle = svg(`${sombra(400, 470, 330)}<g transform="${transformar()}">${zapato(p, 'd')}</g>`, '330 180 400 300');
  writeFileSync(join(destino, `${p.slug}-lateral.svg`), lateral);
  writeFileSync(join(destino, `${p.slug}-par.svg`), par);
  writeFileSync(join(destino, `${p.slug}-detalle.svg`), detalle);
}
console.warn(`Placeholders generados: ${PRODUCTOS.length * 3} archivos en public/img/productos`);
