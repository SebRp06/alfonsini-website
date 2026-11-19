import { CATEGORIAS, PRODUCTOS } from '../../datos/catalogo';
import { costoEnvio } from '../../domain/dinero';
import { disponible, type Pedido, type Producto, type Slug } from '../../domain/tipos';
import type { FiltroCatalogo, NuevoPedido, Repositorios } from './puertos';

/**
 * Adaptador de MAQUETA: datos en memoria + almacenamiento del navegador para pedidos y lista de espera.
 * No envía datos a ningún servidor (Ley 1581: en la demo no se recolecta información real).
 */
const esperar = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

const leerLocal = <T>(clave: string, inicial: T): T => {
  try {
    const v = typeof window === 'undefined' ? null : window.sessionStorage.getItem(clave);
    return v ? (JSON.parse(v) as T) : inicial;
  } catch {
    return inicial;
  }
};
const guardarLocal = (clave: string, valor: unknown): void => {
  try {
    window.sessionStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    /* sin persistencia */
  }
};

function filtrar(filtro: FiltroCatalogo = {}): Producto[] {
  const q = (filtro.busqueda ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const lista = PRODUCTOS.filter((p) => {
    if (filtro.categoriaId && p.categoriaId !== filtro.categoriaId) return false;
    if (filtro.talla && !p.existencias.some((e) => e.talla === filtro.talla && (!filtro.soloDisponibles || e.unidades > 0))) return false;
    if (filtro.soloDisponibles && !disponible(p)) return false;
    if (q) {
      const texto = `${p.nombre} ${p.resumen} ${p.color.nombre} ${p.referencia}`.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
      if (!q.split(/\s+/).every((t) => texto.includes(t))) return false;
    }
    return true;
  });
  if (filtro.orden === 'precio-asc') return [...lista].sort((a, b) => a.precio - b.precio);
  if (filtro.orden === 'precio-desc') return [...lista].sort((a, b) => b.precio - a.precio);
  return [...lista].sort((a, b) => Number(b.nuevo) - Number(a.nuevo));
}

export const repositoriosMaqueta: Repositorios = {
  catalogo: {
    listar: async (filtro) => filtrar(filtro),
    porSlug: async (slug) => PRODUCTOS.find((p) => p.slug === slug) ?? null,
    categorias: async () => CATEGORIAS,
    relacionados: async (slug: Slug, limite) => {
      const base = PRODUCTOS.find((p) => p.slug === slug);
      return PRODUCTOS.filter((p) => p.slug !== slug && disponible(p))
        .sort((a, b) => Number(b.categoriaId === base?.categoriaId) - Number(a.categoriaId === base?.categoriaId))
        .slice(0, limite);
    },
  },
  inventario: {
    existencias: async (slug) => new Map((PRODUCTOS.find((p) => p.slug === slug)?.existencias ?? []).map((e) => [e.talla, e.unidades])),
    reservar: async () => ({ ok: true }),
  },
  pedidos: {
    async crear(nuevo: NuevoPedido): Promise<Pedido> {
      const previos = leerLocal<Record<string, Pedido>>('alfonsini:pedidos', {});
      const repetido = previos[nuevo.claveIdempotencia];
      if (repetido) return repetido;
      await esperar(1400); // simula la latencia de la pasarela para mostrar el isotipo de carga
      const lineas = nuevo.lineas.flatMap((l) => {
        const p = PRODUCTOS.find((x) => x.slug === l.slug);
        return p ? [{ ...l, nombre: p.nombre, precioUnitario: p.precio }] : [];
      });
      const subtotal = lineas.reduce((t, l) => t + l.precioUnitario * l.cantidad, 0);
      const envio = costoEnvio(subtotal);
      const pedido: Pedido = {
        numero: `ALF-${Date.now().toString(36).toUpperCase().slice(-6)}`,
        creadoEn: new Date().toISOString(),
        cliente: nuevo.cliente,
        envio: nuevo.envio,
        medioPago: nuevo.medioPago,
        lineas,
        subtotal,
        costoEnvio: envio,
        total: subtotal + envio,
      };
      guardarLocal('alfonsini:pedidos', { ...previos, [nuevo.claveIdempotencia]: pedido });
      guardarLocal(`alfonsini:pedido:${pedido.numero}`, pedido);
      return pedido;
    },
    porNumero: async (numero) => leerLocal<Pedido | null>(`alfonsini:pedido:${numero}`, null),
  },
  listaEspera: {
    async inscribir() {
      await esperar(700);
      return { posicion: 3 + Math.floor(Math.random() * 9) };
    },
  },
};
