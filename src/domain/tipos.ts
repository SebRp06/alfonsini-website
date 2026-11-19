/**
 * Modelo de dominio de la tienda Alfonsini. Agnóstico: sin React, sin Next, sin proveedor de datos.
 * Las fuentes reales (BD, ERP, inventario) se conectan implementando los puertos de `src/lib/repositorios/puertos.ts`.
 */

export type Slug = string & { readonly __marca: 'Slug' };

/** Silueta base: define el placeholder y la posición de los hotspots mientras llegan las fotos reales. */
export type Silueta = 'tenis' | 'formal' | 'bota' | 'tacon' | 'mocasin';

export interface Categoria {
  readonly id: string;
  readonly nombre: string;
  readonly descripcion: string;
}

export interface ExistenciaTalla {
  /** Talla colombiana (CO). */
  readonly talla: number;
  readonly unidades: number;
}

export interface PuntoDetalle {
  readonly id: string;
  readonly titulo: string;
  readonly texto: string;
  /** Posición relativa sobre la imagen principal, en % (0-100). */
  readonly x: number;
  readonly y: number;
}

export interface ImagenProducto {
  readonly src: string;
  readonly alt: string;
  readonly ancho: number;
  readonly alto: number;
}

export interface Producto {
  readonly slug: Slug;
  readonly referencia: string;
  readonly nombre: string;
  readonly resumen: string;
  readonly descripcion: string;
  readonly categoriaId: string;
  readonly silueta: Silueta;
  /** Precio en pesos colombianos, entero (sin decimales). */
  readonly precio: number;
  readonly precioAntes?: number;
  readonly color: { readonly nombre: string; readonly hex: string };
  readonly materiales: readonly string[];
  readonly cuidados: readonly string[];
  readonly imagenes: readonly ImagenProducto[];
  readonly puntos: readonly PuntoDetalle[];
  readonly existencias: readonly ExistenciaTalla[];
  readonly nuevo: boolean;
  readonly destacado: boolean;
}

export interface LineaCarrito {
  readonly slug: Slug;
  readonly talla: number;
  readonly cantidad: number;
}

export type MedioPago = 'contra-entrega' | 'transferencia-breb';

export interface DatosCliente {
  readonly nombres: string;
  readonly apellidos: string;
  readonly correo: string;
  readonly celular: string;
  readonly documento: string;
}

export interface DatosEnvio {
  readonly departamento: string;
  readonly ciudad: string;
  readonly direccion: string;
  readonly complemento: string;
  readonly indicaciones: string;
}

export interface Pedido {
  readonly numero: string;
  readonly creadoEn: string;
  readonly cliente: DatosCliente;
  readonly envio: DatosEnvio;
  readonly medioPago: MedioPago;
  readonly lineas: readonly (LineaCarrito & { readonly nombre: string; readonly precioUnitario: number })[];
  readonly subtotal: number;
  readonly costoEnvio: number;
  readonly total: number;
}

export interface SolicitudListaEspera {
  readonly slug: Slug;
  readonly talla: number | null;
  readonly correo: string;
  readonly creadaEn: string;
}

export const disponible = (p: Producto): boolean => p.existencias.some((e) => e.unidades > 0);
export const unidadesDe = (p: Producto, talla: number): number => p.existencias.find((e) => e.talla === talla)?.unidades ?? 0;
