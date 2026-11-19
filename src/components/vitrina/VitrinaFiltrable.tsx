'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { CATEGORIAS, PRODUCTOS } from '@/datos/catalogo';
import { disponible, type Producto } from '@/domain/tipos';
import { IconoBuscar, IconoCerrar } from '../Iconos';
import { Estanteria } from './Estanteria';
import estilos from './Vitrina.module.css';

type Orden = 'recientes' | 'precio-asc' | 'precio-desc';
const TALLAS = Array.from({ length: 11 }, (_, i) => 34 + i);
const sinTildes = (s: string): string => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function filtrar(productos: readonly Producto[], f: { categoria: string; talla: number; orden: Orden; soloDisponibles: boolean; q: string }): Producto[] {
  const terminos = sinTildes(f.q).split(/\s+/).filter(Boolean);
  const lista = productos.filter((p) => {
    if (f.categoria && p.categoriaId !== f.categoria) return false;
    if (f.talla && !p.existencias.some((e) => e.talla === f.talla && (!f.soloDisponibles || e.unidades > 0))) return false;
    if (f.soloDisponibles && !disponible(p)) return false;
    const texto = sinTildes(`${p.nombre} ${p.resumen} ${p.color.nombre} ${p.referencia}`);
    return terminos.every((t) => texto.includes(t));
  });
  if (f.orden === 'precio-asc') return lista.sort((a, b) => a.precio - b.precio);
  if (f.orden === 'precio-desc') return lista.sort((a, b) => b.precio - a.precio);
  return lista.sort((a, b) => Number(b.nuevo) - Number(a.nuevo));
}

/**
 * Filtros en la URL: se pueden compartir y el botón "Atrás" regresa a la página anterior
 * (los filtros reemplazan la entrada del historial en lugar de apilarla). Resultado anunciado al lector de pantalla.
 */
export function VitrinaFiltrable() {
  const params = useSearchParams();
  const router = useRouter();
  const ruta = usePathname();
  const [, iniciar] = useTransition();
  const busqueda = useRef<HTMLInputElement>(null);

  const categoria = params.get('categoria') ?? '';
  const talla = Number(params.get('talla') ?? 0) || 0;
  const orden = (['recientes', 'precio-asc', 'precio-desc'].includes(params.get('orden') ?? '') ? params.get('orden') : 'recientes') as Orden;
  const soloDisponibles = params.get('disponibles') === '1';
  // Lo escrito en la búsqueda manda hasta que la URL cambie (p. ej. con "Atrás")
  const qUrl = params.get('q') ?? '';
  const [escrito, setEscrito] = useState({ base: qUrl, valor: qUrl });
  const q = escrito.base === qUrl ? escrito.valor : qUrl;
  const setQ = (valor: string): void => setEscrito({ base: qUrl, valor });
  useEffect(() => { if (window.location.hash === '#buscar') busqueda.current?.focus(); }, []);

  const actualizar = (cambios: Record<string, string>): void => {
    const nuevo = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(cambios)) {
      if (v) nuevo.set(k, v); else nuevo.delete(k);
    }
    const cadena = nuevo.toString();
    iniciar(() => router.replace(cadena ? `${ruta}?${cadena}` : ruta, { scroll: false }));
  };

  const resultado = useMemo(() => filtrar(PRODUCTOS, { categoria, talla, orden, soloDisponibles, q }), [categoria, talla, orden, soloDisponibles, q]);
  const nombreCategoria = CATEGORIAS.find((c) => c.id === categoria)?.nombre;
  const hayFiltros = Boolean(categoria || talla || soloDisponibles || q);

  return (
    <>
      <div className={estilos.barra}>
        <form role="search" className={estilos.busqueda} onSubmit={(e) => { e.preventDefault(); actualizar({ q: q.trim() }); }}>
          <label htmlFor="buscar" className="visualmente-oculto">Buscar zapatos</label>
          <IconoBuscar tam={20} />
          <input id="buscar" ref={busqueda} type="search" name="q" className={estilos.campoBusqueda} placeholder="Buscar por nombre, color o referencia"
            value={q} onChange={(e) => setQ(e.target.value)} onBlur={() => { if ((params.get('q') ?? '') !== q.trim()) actualizar({ q: q.trim() }); }}
            autoComplete="off" enterKeyHint="search" />
        </form>

        <fieldset className={estilos.chips}>
          <legend className="visualmente-oculto">Categoría</legend>
          {[{ id: '', nombre: 'Todo' }, ...CATEGORIAS].map((c) => (
            <label key={c.id || 'todo'} className={estilos.chip}>
              <input type="radio" name="categoria" checked={categoria === c.id} onChange={() => actualizar({ categoria: c.id })} />
              <span>{c.nombre}</span>
            </label>
          ))}
        </fieldset>

        <div className={estilos.selectores}>
          <div className="campo">
            <label htmlFor="filtro-talla">Talla</label>
            <select id="filtro-talla" className="entrada" value={talla || ''} onChange={(e) => actualizar({ talla: e.target.value })}>
              <option value="">Todas</option>
              {TALLAS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="filtro-orden">Ordenar</label>
            <select id="filtro-orden" className="entrada" value={orden} onChange={(e) => actualizar({ orden: e.target.value === 'recientes' ? '' : e.target.value })}>
              <option value="recientes">Novedades primero</option>
              <option value="precio-asc">Menor precio</option>
              <option value="precio-desc">Mayor precio</option>
            </select>
          </div>
          <label className={estilos.interruptor}>
            <input type="checkbox" role="switch" checked={soloDisponibles} onChange={(e) => actualizar({ disponibles: e.target.checked ? '1' : '' })} />
            <span aria-hidden="true" className={estilos.pista} />
            <span>Solo disponibles</span>
          </label>
        </div>
      </div>

      <div className={estilos.resumen}>
        <p role="status" aria-live="polite" className={estilos.cuenta}>
          {resultado.length === 1 ? '1 modelo' : `${resultado.length} modelos`}
          {nombreCategoria ? ` en ${nombreCategoria}` : ''}{talla ? ` · talla ${talla}` : ''}{q ? ` · “${q}”` : ''}
        </p>
        {hayFiltros && (
          <button type="button" className={estilos.limpiar} onClick={() => { setQ(''); iniciar(() => router.replace(ruta, { scroll: false })); }}>
            <IconoCerrar tam={16} /> Limpiar filtros
          </button>
        )}
      </div>

      {resultado.length > 0 ? (
        <Estanteria productos={resultado} etiqueta="Resultados de la colección" prioridad={4} />
      ) : (
        <div className={estilos.vacio}>
          <h2>No encontramos esa combinación</h2>
          <p>Prueba otra talla o quita un filtro. También puedes escribirnos y te ayudamos a encontrar tu par.</p>
          <button type="button" className="boton" onClick={() => { setQ(''); iniciar(() => router.replace(ruta, { scroll: false })); }}>Ver toda la colección</button>
        </div>
      )}
    </>
  );
}
