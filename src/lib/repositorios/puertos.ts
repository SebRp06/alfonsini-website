import type { Categoria, DatosCliente, DatosEnvio, LineaCarrito, MedioPago, Pedido, Producto, SolicitudListaEspera, Slug } from '../../domain/tipos';

/**
 * PUERTOS (arquitectura hexagonal). La UI solo conoce estas interfaces.
 * Hoy: adaptador de maqueta (`maqueta.ts`). Mañana: Postgres/Supabase, ERP o API propia, sin tocar componentes.
 * Ver docs/PENDIENTES.md y docs/sugerencias-produccion.txt.
 */

export interface FiltroCatalogo {
  readonly categoriaId?: string;
  readonly talla?: number;
  readonly busqueda?: string;
  readonly soloDisponibles?: boolean;
  readonly orden?: 'recientes' | 'precio-asc' | 'precio-desc';
}

export interface CatalogoRepositorio {
  listar(filtro?: FiltroCatalogo): Promise<readonly Producto[]>;
  porSlug(slug: string): Promise<Producto | null>;
  categorias(): Promise<readonly Categoria[]>;
  relacionados(slug: Slug, limite: number): Promise<readonly Producto[]>;
}

export interface InventarioRepositorio {
  /** Unidades disponibles por talla en el momento (la fuente de verdad será el sistema de inventario). */
  existencias(slug: Slug): Promise<ReadonlyMap<number, number>>;
  /** Reserva temporal al confirmar el pedido; debe ser idempotente por `clave`. */
  reservar(lineas: readonly LineaCarrito[], clave: string): Promise<{ ok: true } | { ok: false; sinExistencia: readonly LineaCarrito[] }>;
}

export interface NuevoPedido {
  readonly cliente: DatosCliente;
  readonly envio: DatosEnvio;
  readonly medioPago: MedioPago;
  readonly lineas: readonly LineaCarrito[];
  /** Clave de idempotencia: un doble toque en "Confirmar" no crea dos pedidos. */
  readonly claveIdempotencia: string;
}

export interface PedidosRepositorio {
  crear(pedido: NuevoPedido): Promise<Pedido>;
  porNumero(numero: string): Promise<Pedido | null>;
}

export interface ListaEsperaRepositorio {
  inscribir(solicitud: Omit<SolicitudListaEspera, 'creadaEn'>): Promise<{ posicion: number }>;
}

export interface Repositorios {
  readonly catalogo: CatalogoRepositorio;
  readonly inventario: InventarioRepositorio;
  readonly pedidos: PedidosRepositorio;
  readonly listaEspera: ListaEsperaRepositorio;
}
