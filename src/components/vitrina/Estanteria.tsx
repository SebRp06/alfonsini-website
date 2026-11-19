'use client';
import { useEffect, useRef } from 'react';
import type { Producto } from '@/domain/tipos';
import { CajaProducto } from './CajaProducto';
import estilos from './Estanteria.module.css';

/**
 * Estantería de cajas (vitrina PLP). En pantallas táctiles (sin hover) un único IntersectionObserver
 * abre la caja que está en la franja central de la pantalla: cero toques extra para ver el zapato.
 */
export function Estanteria({ productos, etiqueta, prioridad = 0 }: { readonly productos: readonly Producto[]; readonly etiqueta: string; readonly prioridad?: number }) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const lista = ref.current;
    if (!lista || !('IntersectionObserver' in window) || window.matchMedia('(hover: hover)').matches) return;
    const io = new IntersectionObserver((entradas) => {
      for (const e of entradas) (e.target as HTMLElement).dataset.abierta = e.isIntersecting ? 'si' : 'no';
    }, { rootMargin: '-35% 0px -35% 0px', threshold: 0 });
    lista.querySelectorAll('[data-caja]').forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [productos]);

  return (
    <ul ref={ref} className={estilos.estanteria} aria-label={etiqueta}>
      {productos.map((p, i) => (
        <li key={p.slug} className={estilos.celda}>
          <CajaProducto producto={p} indice={i} prioridad={i < prioridad} />
        </li>
      ))}
    </ul>
  );
}
