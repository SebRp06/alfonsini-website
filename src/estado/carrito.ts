'use client';
import type { LineaCarrito, Slug } from '@/domain/tipos';
import { crearAlmacen } from './almacen';

export const CANTIDAD_MAXIMA = 10;

const esLineas = (v: unknown): v is LineaCarrito[] =>
  Array.isArray(v) && v.every((l) => typeof l === 'object' && l !== null && typeof (l as LineaCarrito).slug === 'string'
    && typeof (l as LineaCarrito).talla === 'number' && typeof (l as LineaCarrito).cantidad === 'number');

const VACIO: LineaCarrito[] = [];
export const carrito = crearAlmacen<LineaCarrito[]>('alfonsini:carrito:v1', VACIO, esLineas);

const acotar = (n: number): number => Math.min(CANTIDAD_MAXIMA, Math.max(1, Math.round(n)));

export const agregarAlCarrito = (slug: Slug, talla: number, cantidad = 1): void =>
  carrito.escribir((lineas) => {
    const existe = lineas.find((l) => l.slug === slug && l.talla === talla);
    if (existe) return lineas.map((l) => (l === existe ? { ...l, cantidad: acotar(l.cantidad + cantidad) } : l));
    return [...lineas, { slug, talla, cantidad: acotar(cantidad) }];
  });

export const cambiarCantidad = (slug: Slug, talla: number, cantidad: number): void =>
  carrito.escribir((lineas) => lineas.map((l) => (l.slug === slug && l.talla === talla ? { ...l, cantidad: acotar(cantidad) } : l)));

export const quitarDelCarrito = (slug: Slug, talla: number): LineaCarrito | undefined => {
  const quitada = carrito.leer().find((l) => l.slug === slug && l.talla === talla);
  carrito.escribir((lineas) => lineas.filter((l) => !(l.slug === slug && l.talla === talla)));
  return quitada;
};

export const restaurarLinea = (linea: LineaCarrito): void => carrito.escribir((lineas) => [...lineas, linea]);
export const vaciarCarrito = (): void => carrito.escribir(() => []);
export const unidadesEnCarrito = (lineas: readonly LineaCarrito[]): number => lineas.reduce((t, l) => t + l.cantidad, 0);
