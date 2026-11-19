'use client';
import Image from 'next/image';
import Link from 'next/link';
import { cop } from '@/domain/dinero';
import { disponible, type Producto } from '@/domain/tipos';
import estilos from './Estanteria.module.css';

interface Props {
  readonly producto: Producto;
  readonly indice: number;
  readonly prioridad?: boolean;
}

/**
 * Caja de zapatos de la vitrina. Al pasar el cursor, enfocarla con teclado o (en celular) al quedar centrada
 * en pantalla, la tapa se levanta y el zapato sale de la caja. Un único enlace accesible por producto.
 */
export function CajaProducto({ producto: p, indice, prioridad = false }: Props) {
  const hay = disponible(p);
  const tallasConStock = p.existencias.filter((e) => e.unidades > 0).length;
  const idNombre = `caja-${p.slug}`;
  const estado = !hay ? 'Agotado, únete a la lista de espera' : tallasConStock <= 3 ? `Quedan ${tallasConStock} tallas` : `${tallasConStock} tallas disponibles`;

  return (
    <article className={estilos.caja} style={{ ['--tono' as string]: p.color.hex, ['--i' as string]: indice }} data-caja="">
      <div className={estilos.escena} aria-hidden="true">
        <div className={estilos.interior}>
          <Image className={estilos.zapato} src={p.imagenes[0]?.src ?? ''} alt="" width={400} height={300}
            sizes="(min-width: 60rem) 22vw, (min-width: 36rem) 45vw, 90vw" priority={prioridad} loading={prioridad ? undefined : 'lazy'} />
        </div>
        <div className={estilos.frente}>
          <span className={estilos.marcaCaja}>Alfonsini</span>
          <span className={estilos.numero}>#{String(indice + 1).padStart(2, '0')}</span>
          <span className={estilos.rango}>Tallas {p.existencias[0]?.talla}–{p.existencias[p.existencias.length - 1]?.talla}</span>
          <span className={estilos.franja} />
        </div>
        <div className={estilos.tapa}><span /></div>
        {p.nuevo && hay && <span className={estilos.sello}>Nuevo</span>}
        {!hay && <span className={`${estilos.sello} ${estilos.selloEspera}`}>¡Voló!</span>}
      </div>

      <div className={estilos.etiqueta}>
        <h3 className={estilos.nombre} id={idNombre}>
          <Link href={`/producto/${p.slug}`} className={estilos.enlace}>
            {p.nombre}
            <span className="visualmente-oculto">, {cop(p.precio)}. {estado}.</span>
          </Link>
        </h3>
        <p className={estilos.ref} aria-hidden="true">{p.referencia} · {p.color.nombre}</p>
        <p className={estilos.precio} aria-hidden="true">
          <strong>{cop(p.precio)}</strong>
          {p.precioAntes && <s>{cop(p.precioAntes)}</s>}
        </p>
        <p className={`${estilos.estado} ${!hay ? estilos.estadoEspera : ''}`} aria-hidden="true">{estado}</p>
      </div>
    </article>
  );
}
