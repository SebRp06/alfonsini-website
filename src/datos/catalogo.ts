import type { Categoria, ExistenciaTalla, PuntoDetalle, Producto, Silueta, Slug } from '../domain/tipos';
import { aPorcentaje } from './lienzo';

/**
 * CATÁLOGO DE MAQUETA (datos dummy). Fuente única para la vista previa.
 * En producción lo reemplaza el adaptador de `CatalogoRepositorio` conectado a la BD o al ERP (docs/PENDIENTES.md).
 * Las categorías son genéricas hasta que el cliente defina sus líneas.
 */
export const CATEGORIAS: readonly Categoria[] = [
  { id: 'categoria-1', nombre: 'Categoría 1', descripcion: 'Descripción de la categoría 1. Se reemplaza con la línea real de Alfonsini.' },
  { id: 'categoria-2', nombre: 'Categoría 2', descripcion: 'Descripción de la categoría 2. Se reemplaza con la línea real de Alfonsini.' },
  { id: 'categoria-3', nombre: 'Categoría 3', descripcion: 'Descripción de la categoría 3. Se reemplaza con la línea real de Alfonsini.' },
  { id: 'categoria-4', nombre: 'Categoría 4', descripcion: 'Descripción de la categoría 4. Se reemplaza con la línea real de Alfonsini.' },
];

const RANGO_TALLAS: Record<Silueta, readonly [number, number]> = {
  tenis: [35, 44], formal: [37, 44], bota: [36, 44], tacon: [34, 40], mocasin: [37, 44],
};

const PUNTOS: Record<Silueta, readonly (Omit<PuntoDetalle, 'x' | 'y'> & { sx: number; sy: number })[]> = {
  tenis: [
    { id: 'suela', titulo: 'Suela de caucho', texto: 'Caucho vulcanizado con labrado antideslizante para el andén mojado.', sx: 210, sy: 190 },
    { id: 'capellada', titulo: 'Capellada transpirable', texto: 'Cuero perforado que deja respirar el pie todo el día.', sx: 300, sy: 152 },
    { id: 'cuello', titulo: 'Cuello acolchado', texto: 'Espuma de memoria que abraza el tobillo sin rozar.', sx: 66, sy: 92 },
  ],
  formal: [
    { id: 'suela', titulo: 'Suela cosida', texto: 'Costura perimetral que permite cambiar la suela y alarga la vida del zapato.', sx: 230, sy: 186 },
    { id: 'capellada', titulo: 'Cuero plena flor', texto: 'Cuero curtido en Colombia, pulido a mano.', sx: 290, sy: 154 },
    { id: 'tacon', titulo: 'Tacón apilado', texto: 'Capas de cuero que amortiguan cada paso.', sx: 66, sy: 188 },
  ],
  bota: [
    { id: 'cana', titulo: 'Caña estructurada', texto: 'Sostiene el tobillo y conserva la forma con el uso.', sx: 100, sy: 70 },
    { id: 'capellada', titulo: 'Cuero engrasado', texto: 'Repele la lluvia ligera y gana carácter con el tiempo.', sx: 300, sy: 160 },
    { id: 'suela', titulo: 'Suela de tracción', texto: 'Labrado profundo para terreno irregular.', sx: 230, sy: 194 },
  ],
  tacon: [
    { id: 'tacon', titulo: 'Tacón estable', texto: 'Base reforzada que reparte el peso y evita la torcedura.', sx: 72, sy: 166 },
    { id: 'capellada', titulo: 'Capellada suave', texto: 'Forro en cuero que no marca el empeine.', sx: 250, sy: 176 },
    { id: 'plantilla', titulo: 'Plantilla acolchada', texto: 'Almohadilla en el metatarso para usarlos horas sin dolor.', sx: 170, sy: 160 },
  ],
  mocasin: [
    { id: 'costura', titulo: 'Costura a mano', texto: 'El delantal se cose a mano, punto por punto.', sx: 268, sy: 132 },
    { id: 'antifaz', titulo: 'Antifaz clásico', texto: 'Tira con ranura, el detalle que lo hace inconfundible.', sx: 206, sy: 134 },
    { id: 'suela', titulo: 'Suela flexible', texto: 'Se dobla con el pie desde el primer día.', sx: 230, sy: 188 },
  ],
};

interface Semilla {
  readonly nombre: string;
  readonly silueta: Silueta;
  readonly categoria: number;
  readonly color: { readonly nombre: string; readonly hex: string };
  readonly precio: number;
  readonly precioAntes?: number;
  readonly nuevo?: boolean;
  readonly destacado?: boolean;
  readonly agotado?: boolean;
}

const SEMILLAS: readonly Semilla[] = [
  { nombre: 'Aurora', silueta: 'tenis', categoria: 1, color: { nombre: 'Blanco hueso', hex: '#E6E0D4' }, precio: 239_900, nuevo: true, destacado: true },
  { nombre: 'Bruma', silueta: 'formal', categoria: 2, color: { nombre: 'Café espresso', hex: '#5A3A26' }, precio: 329_900, destacado: true },
  { nombre: 'Cenit', silueta: 'bota', categoria: 3, color: { nombre: 'Negro noir', hex: '#24242E' }, precio: 389_900, precioAntes: 429_900, destacado: true },
  { nombre: 'Dalia', silueta: 'tacon', categoria: 4, color: { nombre: 'Vino', hex: '#7A1E3A' }, precio: 279_900, nuevo: true, destacado: true },
  { nombre: 'Eclipse', silueta: 'tenis', categoria: 1, color: { nombre: 'Violeta humo', hex: '#6B55D9' }, precio: 259_900, destacado: true, agotado: true },
  { nombre: 'Faro', silueta: 'mocasin', categoria: 2, color: { nombre: 'Miel', hex: '#B8743A' }, precio: 299_900, destacado: true },
  { nombre: 'Galena', silueta: 'bota', categoria: 3, color: { nombre: 'Gris galena', hex: '#6E7079' }, precio: 409_900 },
  { nombre: 'Halo', silueta: 'tacon', categoria: 4, color: { nombre: 'Nude', hex: '#D8B49A' }, precio: 289_900 },
  { nombre: 'Índigo', silueta: 'tenis', categoria: 1, color: { nombre: 'Índigo', hex: '#2E3A8C' }, precio: 249_900 },
  { nombre: 'Jade', silueta: 'mocasin', categoria: 2, color: { nombre: 'Verde jade', hex: '#2F6F5E' }, precio: 309_900, agotado: true },
  { nombre: 'Kora', silueta: 'formal', categoria: 3, color: { nombre: 'Negro charol', hex: '#17171C' }, precio: 349_900, precioAntes: 379_900 },
  { nombre: 'Lumen', silueta: 'tenis', categoria: 4, color: { nombre: 'Ámbar', hex: '#E89A2C' }, precio: 269_900, nuevo: true },
];

const slugDe = (nombre: string): Slug =>
  nombre.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-') as Slug;

const TIPO: Record<Silueta, string> = { tenis: 'tenis', formal: 'zapato formal', bota: 'bota', tacon: 'tacón', mocasin: 'mocasín' };

function existencias(indice: number, silueta: Silueta, agotado: boolean): ExistenciaTalla[] {
  const [desde, hasta] = RANGO_TALLAS[silueta];
  const lista: ExistenciaTalla[] = [];
  for (let talla = desde; talla <= hasta; talla++) {
    // Determinista: siempre el mismo inventario de maqueta, con algunas tallas agotadas para mostrar la lista de espera.
    const unidades = agotado ? 0 : (indice * 7 + talla * 3) % 6;
    lista.push({ talla, unidades });
  }
  return lista;
}

export const PRODUCTOS: readonly Producto[] = SEMILLAS.map((s, i) => {
  const slug = slugDe(s.nombre);
  const tipo = TIPO[s.silueta];
  const n = String(i + 1).padStart(3, '0');
  return {
    slug,
    referencia: `ALF-${n}`,
    nombre: `${s.nombre}`,
    resumen: `${tipo.charAt(0).toUpperCase()}${tipo.slice(1)} en ${s.color.nombre.toLowerCase()}, hecho en Colombia.`,
    descripcion:
      `Texto de muestra para ${s.nombre}. Aquí va la historia del modelo: para qué ocasión se diseñó, cómo se siente al caminar ` +
      'y qué lo hace distinto. Se reemplaza con la descripción real que entregue Alfonsini.',
    categoriaId: `categoria-${s.categoria}`,
    silueta: s.silueta,
    precio: s.precio,
    ...(s.precioAntes ? { precioAntes: s.precioAntes } : {}),
    color: s.color,
    materiales: ['Capellada: cuero (muestra)', 'Forro: cuero de cabra (muestra)', 'Suela: caucho (muestra)'],
    cuidados: ['Limpia con un paño húmedo.', 'Deja secar a la sombra, nunca al sol directo.', 'Usa crema neutra cada mes.'],
    imagenes: [
      { src: `/img/productos/${slug}-lateral.svg`, alt: `${s.nombre}, ${tipo} ${s.color.nombre.toLowerCase()}, vista lateral`, ancho: 800, alto: 600 },
      { src: `/img/productos/${slug}-par.svg`, alt: `${s.nombre}, el par visto en diagonal`, ancho: 800, alto: 600 },
      { src: `/img/productos/${slug}-detalle.svg`, alt: `${s.nombre}, acercamiento a la punta y la costura`, ancho: 800, alto: 600 },
    ],
    puntos: PUNTOS[s.silueta].map(({ sx, sy, ...p }) => ({ ...p, ...aPorcentaje(sx, sy) })),
    existencias: existencias(i, s.silueta, s.agotado === true),
    nuevo: s.nuevo === true,
    destacado: s.destacado === true,
  };
});
