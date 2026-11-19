'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { cop } from '@/domain/dinero';
import type { Pedido } from '@/domain/tipos';
import { repositorios } from '@/lib/repositorios';
import { IconoFlecha } from '../Iconos';
import { limpiarBorrador } from './Checkout';
import estilos from './Gracias.module.css';

const LINEA_TIEMPO = ['Pedido confirmado', 'Empacando tu caja', 'En camino', 'En tus manos'] as const;

/**
 * Página de gracias: la caja se cierra, se sella con el lazo ámbar y estalla un confeti ligero (12 piezas CSS).
 * El título recibe el foco para que el lector de pantalla anuncie la confirmación de inmediato.
 */
export function Gracias() {
  const params = useSearchParams();
  const numero = params.get('pedido') ?? '';
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const titulo = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    titulo.current?.focus();
    limpiarBorrador();
    if (numero) void repositorios.pedidos.porNumero(numero).then(setPedido);
  }, [numero]);

  return (
    <div className={estilos.gracias}>
      <div className={estilos.escena} aria-hidden="true">
        <div className={estilos.brillo} />
        <div className={estilos.caja}>
          <div className={estilos.tapa} />
          <div className={estilos.frente}><span>ALFONSINI</span></div>
          <div className={estilos.lazoV} />
          <div className={estilos.lazoH} />
          <svg className={estilos.check} viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" /><path d="M15 27 l7 7 l15 -16" /></svg>
        </div>
        {Array.from({ length: 12 }, (_, i) => <span key={i} className={estilos.confeti} style={{ ['--i' as string]: i }} />)}
      </div>

      <p className={estilos.antetitulo}>¡Compra confirmada!</p>
      <h1 ref={titulo} tabIndex={-1} className={estilos.titulo}>
        {pedido ? `Gracias, ${pedido.cliente.nombres.split(' ')[0]}. Tu caja ya tiene dueño.` : 'Gracias. Tu caja ya tiene dueño.'}
      </h1>
      {numero && <p className={estilos.numero}>Pedido <strong>{numero}</strong></p>}
      <p className={estilos.texto}>
        {pedido ? `Te enviamos el detalle a ${pedido.cliente.correo}.` : 'Te enviamos el detalle a tu correo.'}{' '}
        {pedido?.medioPago === 'transferencia-breb'
          ? `Recuerda transferir ${cop(pedido.total)} a la llave Bre-B @alfonsini (muestra) para despachar hoy mismo.`
          : 'Ten listo el efectivo para pagar cuando recibas tu caja.'}
      </p>

      <ol className={estilos.linea} aria-label="Estado del pedido">
        {LINEA_TIEMPO.map((t, i) => (
          <li key={t} className={i === 0 ? estilos.hecho : ''} style={{ ['--i' as string]: i }}>
            <span aria-hidden="true" />{t}{i === 0 && <span className="visualmente-oculto"> (completado)</span>}
          </li>
        ))}
      </ol>

      {pedido && (
        <dl className={estilos.resumen}>
          <div><dt>Productos</dt><dd>{pedido.lineas.reduce((t, l) => t + l.cantidad, 0)} pares</dd></div>
          <div><dt>Envío a</dt><dd>{pedido.envio.ciudad}</dd></div>
          <div><dt>Total</dt><dd>{cop(pedido.total)}</dd></div>
        </dl>
      )}

      <div className={estilos.botones}>
        <Link href="/tienda" className="boton boton--grande">Seguir comprando <IconoFlecha tam={20} /></Link>
        <Link href="/" className="boton boton--fantasma boton--grande">Volver al inicio</Link>
      </div>
    </div>
  );
}
