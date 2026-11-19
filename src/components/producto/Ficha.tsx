'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { cop, ENVIO } from '@/domain/dinero';
import { disponible, unidadesDe, type Producto } from '@/domain/tipos';
import { agregarAlCarrito } from '@/estado/carrito';
import { IconoBillete, IconoBolsa, IconoCambio, IconoCampana, IconoCamion, IconoCheck, IconoFlecha } from '../Iconos';
import { Galeria } from './Galeria';
import { ListaEspera } from './ListaEspera';
import { MedidorPie } from './MedidorPie';
import { animarEmpaque } from './empaque';
import estilos from './Ficha.module.css';

export function Ficha({ producto: p, nombreCategoria }: { readonly producto: Producto; readonly nombreCategoria: string }) {
  const [talla, setTalla] = useState<number | null>(null);
  const [faltaTalla, setFaltaTalla] = useState(false);
  const [empacando, setEmpacando] = useState(false);
  const [empacado, setEmpacado] = useState<number | null>(null);
  const grupoTallas = useRef<HTMLFieldSetElement>(null);
  const zonaFicha = useRef<HTMLDivElement>(null);

  const hay = disponible(p);
  const unidades = talla === null ? null : unidadesDe(p, talla);
  const tallaAgotada = unidades === 0;
  const disponibles = p.existencias.filter((e) => e.unidades > 0).map((e) => e.talla);
  const cercanas = talla !== null && tallaAgotada ? disponibles.filter((t) => Math.abs(t - talla) === 1) : [];

  const elegir = (t: number): void => {
    setTalla(t);
    setFaltaTalla(false);
  };

  const empacar = async (): Promise<void> => {
    if (talla === null) {
      setFaltaTalla(true);
      grupoTallas.current?.querySelector<HTMLInputElement>('input:not([data-agotada])')?.focus();
      return;
    }
    if (empacando) return;
    setEmpacando(true);
    const imagen = zonaFicha.current?.querySelector<HTMLElement>('[data-imagen-producto]') ?? null;
    const destino = document.querySelector<HTMLElement>('[data-destino-carrito]');
    agregarAlCarrito(p.slug, talla);
    await animarEmpaque(imagen, destino);
    setEmpacando(false);
    // Confirmación en línea, junto al botón: no tapa nada y ofrece ir directo al pago (UFF™: menos toques)
    setEmpacado(talla);
  };

  return (
    <div className={estilos.ficha} ref={zonaFicha}>
      <Galeria producto={p} />

      <div className={estilos.panel}>
        <p className={estilos.categoria}>{nombreCategoria} · {p.referencia}</p>
        <h1 className={estilos.titulo}>{p.nombre}</h1>
        <p className={estilos.resumen}>{p.resumen}</p>

        <div className={estilos.precioColor}>
        <p className={estilos.precio}>
          <span className="visualmente-oculto">Precio: </span>
          <strong data-precio="">{cop(p.precio)}</strong>
          {p.precioAntes && <><span className="visualmente-oculto">, antes </span><s>{cop(p.precioAntes)}</s></>}
        </p>
        <p className={estilos.color}><span className={estilos.muestra} style={{ background: p.color.hex }} aria-hidden="true" /> Color: <strong>{p.color.nombre}</strong></p>
        </div>

        <fieldset ref={grupoTallas} className={`${estilos.tallas} ${faltaTalla ? estilos.tallasAlerta : ''}`} aria-describedby={faltaTalla ? 'aviso-talla' : 'ayuda-talla'}>
          <legend>Elige tu talla <span className={estilos.legendaNota}>(colombiana)</span></legend>
          <div className={estilos.rejillaTallas}>
            {p.existencias.map((e) => {
              const agotada = e.unidades === 0;
              return (
                <label key={e.talla} className={`${estilos.talla} ${agotada ? estilos.tallaAgotada : ''}`}>
                  <input type="radio" name="talla" value={e.talla} checked={talla === e.talla} onChange={() => elegir(e.talla)} data-agotada={agotada ? '' : undefined} />
                  <span className={estilos.tallaNumero}>{e.talla}</span>
                  {agotada && <span className={estilos.tallaNota}><IconoCampana tam={12} /> Avísame</span>}
                  {!agotada && e.unidades <= 2 && <span className={`${estilos.tallaNota} ${estilos.tallaUltimas}`}>Últimas</span>}
                  <span className="visualmente-oculto">{agotada ? ', agotada: puedes apartar tu turno' : e.unidades <= 2 ? ', últimas unidades' : ''}</span>
                </label>
              );
            })}
          </div>
          {faltaTalla
            ? <p key="aviso" id="aviso-talla" className="mensaje-error" role="alert">Elige tu talla para poder empacar tus zapatos.</p>
            : <p key="ayuda" id="ayuda-talla" className={estilos.ayudaTalla}>{hay ? `${disponibles.length} de ${p.existencias.length} tallas disponibles.` : 'Todas las tallas están en camino.'}</p>}
        </fieldset>

        <div className={estilos.accion}>
          {!hay || tallaAgotada ? (
            <>
              <ListaEspera key={`${talla ?? 'todo'}`} producto={p} talla={hay ? talla : null} todoAgotado={!hay} />
              {cercanas.length > 0 && (
                <p className={estilos.cercanas}>
                  ¿Te sirve una talla cercana? {cercanas.map((t) => (
                    <button key={t} type="button" className={estilos.chipCercana} onClick={() => elegir(t)}>Talla {t} disponible</button>
                  ))}
                </p>
              )}
            </>
          ) : empacado !== null && empacado === talla ? (
            <div className={estilos.empacado} role="status" data-confirmacion-agregado="">
              <p className={estilos.empacadoTitulo}><IconoCheck tam={22} /> {p.nombre} talla {empacado} quedó empacado</p>
              <div className={estilos.empacadoAcciones}>
                <Link href="/checkout" className="boton boton--grande" data-accion="finalizar-compra">Finalizar compra <IconoFlecha tam={20} /></Link>
                <Link href="/carrito" className="boton boton--fantasma boton--grande">Ver carrito</Link>
              </div>
              <button type="button" className={estilos.otroPar} onClick={() => setEmpacado(null)}>Empacar otro par</button>
            </div>
          ) : (
            <button type="button" className={`boton boton--grande boton--bloque ${estilos.botonEmpacar}`} onClick={empacar} aria-busy={empacando}
              data-accion="agregar-carrito">
              <IconoBolsa tam={22} /> {empacando ? 'Empacando…' : talla ? `Empacar talla ${talla}` : faltaTalla ? 'Elige tu talla arriba ↑' : 'Empacar en mi caja'}
            </button>
          )}
        </div>

        <MedidorPie alElegir={elegir} tallasDisponibles={p.existencias.map((e) => e.talla)} />

        <ul className={estilos.garantias}>
          <li><IconoCamion tam={20} /> Envío gratis desde {cop(ENVIO.umbralGratis)}. Llega en 2 a 5 días hábiles.</li>
          <li><IconoBillete tam={20} /> Paga contra entrega o por transferencia Bre-B.</li>
          <li><IconoCambio tam={20} /> ¿No te quedó? Cambio de talla gratis en 30 días.</li>
        </ul>

        <div className={estilos.acordeones}>
          <details open>
            <summary>Descripción</summary>
            <p>{p.descripcion}</p>
          </details>
          <details>
            <summary>Materiales</summary>
            <ul>{p.materiales.map((m) => <li key={m}>{m}</li>)}</ul>
          </details>
          <details>
            <summary>Cuidados</summary>
            <ul>{p.cuidados.map((m) => <li key={m}>{m}</li>)}</ul>
          </details>
          <details>
            <summary>Envíos y cambios</summary>
            <p>Despachamos a toda Colombia. Consulta las <Link href="/legal/envios">condiciones de envío</Link> y la <Link href="/legal/cambios-y-devoluciones">política de cambios</Link>.</p>
          </details>
        </div>
      </div>
    </div>
  );
}
