'use client';
import { useAlmacen, useHidratado } from '@/estado/almacen';
import Image from 'next/image';
import Link from 'next/link';
import { cop, ENVIO } from '@/domain/dinero';
import { CANTIDAD_MAXIMA, cambiarCantidad, carrito, quitarDelCarrito, restaurarLinea } from '@/estado/carrito';
import { useAvisos } from '../Avisos';
import { IconoFlecha, IconoMas, IconoMenos, IconoPapelera } from '../Iconos';
import { Isotipo } from '../Isotipo';
import { detallar } from './resumen';
import estilos from './Compra.module.css';

export function Carrito() {
  const lineas = useAlmacen(carrito);
  const avisar = useAvisos();
  const montado = useHidratado();
  const { lineas: detalle, subtotal, envio, total } = detallar(lineas);
  const faltaGratis = Math.max(0, ENVIO.umbralGratis - subtotal);
  const progreso = Math.min(100, Math.round((subtotal / ENVIO.umbralGratis) * 100));

  if (!montado) return <div className={estilos.cargando}><Isotipo etiqueta="Abriendo tu carrito" /></div>;

  if (detalle.length === 0) {
    return (
      <div className={estilos.vacio}>
        <div className={estilos.cajaVacia} aria-hidden="true"><span /><span /></div>
        <h1>Tu caja está vacía</h1>
        <p>Todavía no has empacado ningún par. La estantería te está esperando.</p>
        <Link href="/tienda" className="boton boton--grande">Ir a la tienda <IconoFlecha tam={20} /></Link>
      </div>
    );
  }

  const quitar = (slug: (typeof detalle)[number]['slug'], talla: number, nombre: string): void => {
    const quitada = quitarDelCarrito(slug, talla);
    avisar({
      tipo: 'info', titulo: `Sacaste ${nombre} talla ${talla}`,
      acciones: quitada ? [{ texto: 'Deshacer', alPulsar: () => restaurarLinea(quitada) }] : [],
    });
  };

  return (
    <div className={estilos.compra}>
      <section aria-labelledby="titulo-carrito" className={estilos.columnaPrincipal}>
        <h1 id="titulo-carrito" className={estilos.titulo}>Tu carrito</h1>
        <div className={estilos.atajoPago}>
          <p><span>Total</span> <strong>{cop(total)}</strong></p>
          <Link href="/checkout" className="boton boton--grande" data-accion="iniciar-compra">Finalizar compra <IconoFlecha tam={20} /></Link>
        </div>
        <div className={estilos.progresoEnvio}>
          <p aria-live="polite">{faltaGratis > 0 ? <>Te faltan <strong>{cop(faltaGratis)}</strong> para el envío gratis.</> : <strong>¡Tu envío es gratis! 🎉</strong>}</p>
          <div className={estilos.barraProgreso} role="progressbar" aria-label="Avance hacia el envío gratis" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progreso}>
            <span style={{ width: `${progreso}%` }} />
          </div>
        </div>
        <ul className={estilos.lineas}>
          {detalle.map((l) => (
            <li key={`${l.slug}-${l.talla}`} className={estilos.linea}>
              <Image src={l.producto.imagenes[0]?.src ?? ''} alt="" width={120} height={90} className={estilos.miniatura} />
              <div className={estilos.lineaInfo}>
                <Link href={`/producto/${l.slug}`} className={estilos.lineaNombre}>{l.producto.nombre}</Link>
                <p className={estilos.lineaMeta}>Talla {l.talla} · {l.producto.color.nombre}</p>
                <p className={estilos.lineaPrecio} data-precio-linea="">{cop(l.producto.precio * l.cantidad)}</p>
              </div>
              <div className={estilos.controles}>
                <div className={estilos.cantidad} role="group" aria-label={`Cantidad de ${l.producto.nombre} talla ${l.talla}`}>
                  <button type="button" onClick={() => cambiarCantidad(l.slug, l.talla, l.cantidad - 1)} disabled={l.cantidad <= 1} aria-label="Quitar uno">
                    <IconoMenos tam={18} />
                  </button>
                  <label className="visualmente-oculto" htmlFor={`cant-${l.slug}-${l.talla}`}>Cantidad</label>
                  <input id={`cant-${l.slug}-${l.talla}`} type="number" inputMode="numeric" min={1} max={CANTIDAD_MAXIMA} value={l.cantidad}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      if (n > CANTIDAD_MAXIMA) avisar({ tipo: 'info', titulo: `Máximo ${CANTIDAD_MAXIMA} pares por talla`, texto: '¿Necesitas más? Escríbenos y te ayudamos con un pedido especial.' });
                      if (Number.isFinite(n) && n > 0) cambiarCantidad(l.slug, l.talla, n);
                    }} />
                  <button type="button" onClick={() => {
                    if (l.cantidad >= CANTIDAD_MAXIMA) avisar({ tipo: 'info', titulo: `Máximo ${CANTIDAD_MAXIMA} pares por talla`, texto: '¿Necesitas más? Escríbenos y te ayudamos con un pedido especial.' });
                    else cambiarCantidad(l.slug, l.talla, l.cantidad + 1);
                  }} aria-label="Agregar uno">
                    <IconoMas tam={18} />
                  </button>
                </div>
                <button type="button" className={estilos.quitar} onClick={() => quitar(l.slug, l.talla, l.producto.nombre)} data-accion="quitar-carrito">
                  <IconoPapelera tam={18} /> Quitar <span className="visualmente-oculto">{l.producto.nombre} talla {l.talla}</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <aside aria-labelledby="titulo-resumen" className={estilos.resumen}>
        <h2 id="titulo-resumen" className={estilos.resumenTitulo}>Resumen</h2>
        <dl className={estilos.totales}>
          <div><dt>Subtotal</dt><dd data-subtotal="">{cop(subtotal)}</dd></div>
          <div><dt>Envío</dt><dd>{envio === 0 ? 'Gratis' : cop(envio)}</dd></div>
          <div className={estilos.total}><dt>Total</dt><dd data-total="">{cop(total)}</dd></div>
        </dl>
        <Link href="/checkout" className="boton boton--grande boton--bloque" data-accion="iniciar-compra-resumen">Finalizar compra <IconoFlecha tam={20} /></Link>
        <Link href="/tienda" className={estilos.seguir}>Seguir viendo zapatos</Link>
      </aside>
    </div>
  );
}
