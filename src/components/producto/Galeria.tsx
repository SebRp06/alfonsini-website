'use client';
import Image from 'next/image';
import { useState } from 'react';
import type { Producto } from '@/domain/tipos';
import estilos from './Galeria.module.css';

/**
 * Galería con hotspots de materiales: cada punto cuenta una parte del oficio (suela, cuero, costura).
 * La explicación aparece en un panel bajo la foto (no tapa el zapato) y se anuncia al lector de pantalla.
 */
export function Galeria({ producto }: { readonly producto: Producto }) {
  const [actual, setActual] = useState(0);
  const [punto, setPunto] = useState<string | null>(null);
  const imagen = producto.imagenes[actual] ?? producto.imagenes[0];
  const detalle = producto.puntos.find((p) => p.id === punto);

  if (!imagen) return null;

  return (
    <div className={estilos.galeria}>
      <div className={estilos.principal} style={{ ['--tono' as string]: producto.color.hex }} data-imagen-producto="">
        <Image key={imagen.src} className={estilos.foto} src={imagen.src} alt={imagen.alt} width={imagen.ancho} height={imagen.alto}
          priority={actual === 0} sizes="(min-width: 60rem) 55vw, 100vw" />
        {actual === 0 && producto.puntos.map((p, i) => (
          <button key={p.id} type="button" className={estilos.punto} style={{ left: `${p.x}%`, top: `${p.y}%`, ['--i' as string]: i }}
            aria-pressed={punto === p.id} aria-controls="detalle-punto" onClick={() => setPunto(punto === p.id ? null : p.id)}>
            <span className="visualmente-oculto">Conocer: {p.titulo}</span>
            <span aria-hidden="true">{i + 1}</span>
          </button>
        ))}
        {actual === 0 && !detalle && <p className={estilos.pista} aria-hidden="true">Toca los puntos</p>}
        <div className={estilos.miniaturas} role="group" aria-label="Vistas del producto">
        {producto.imagenes.map((img, i) => (
          <button key={img.src} type="button" className={estilos.miniatura} aria-pressed={i === actual} onClick={() => { setActual(i); setPunto(null); }}>
            <Image src={img.src} alt="" width={160} height={120} loading="lazy" />
            <span className="visualmente-oculto">Ver {img.alt}</span>
          </button>
        ))}
        </div>
      </div>

      <div id="detalle-punto" className={`${estilos.panel} ${detalle ? '' : estilos.panelVacio}`} aria-live="polite">
        {detalle && (
          <>
            <p className={estilos.panelTitulo}>{detalle.titulo}</p>
            <p className={estilos.panelTexto}>{detalle.texto}</p>
          </>
        )}
      </div>

    </div>
  );
}
