'use client';
import { PRODUCTOS } from '@/datos/catalogo';
import { costoEnvio } from '@/domain/dinero';
import type { LineaCarrito, Producto } from '@/domain/tipos';

export interface LineaDetallada extends LineaCarrito { readonly producto: Producto }

export function detallar(lineas: readonly LineaCarrito[]): { lineas: LineaDetallada[]; subtotal: number; envio: number; total: number } {
  const detalladas = lineas.flatMap((l) => {
    const producto = PRODUCTOS.find((p) => p.slug === l.slug);
    return producto ? [{ ...l, producto }] : [];
  });
  const subtotal = detalladas.reduce((t, l) => t + l.producto.precio * l.cantidad, 0);
  const envio = costoEnvio(subtotal);
  return { lineas: detalladas, subtotal, envio, total: subtotal + envio };
}
