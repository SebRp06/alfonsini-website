'use client';
import { useAlmacen, useHidratado } from '@/estado/almacen';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { DEPARTAMENTOS } from '@/domain/colombia';
import { cop } from '@/domain/dinero';
import type { DatosCliente, DatosEnvio, MedioPago } from '@/domain/tipos';
import { sinErrores, validarCliente, validarEnvio } from '@/domain/validacion';
import { crearAlmacen } from '@/estado/almacen';
import { carrito, vaciarCarrito } from '@/estado/carrito';
import { repositorios } from '@/lib/repositorios';
import { useAvisos } from '../Avisos';
import { IconoAlerta, IconoAtras, IconoBillete, IconoCheck, IconoCopiar, IconoFlecha } from '../Iconos';
import { Isotipo } from '../Isotipo';
import { detallar } from './resumen';
import estilos from './Compra.module.css';

/**
 * CHECKOUT GWT™ (Guided Wizard Transformation): tres pasos cortos, uno por pantalla, con progreso visible.
 * - Cada paso es una entrada del historial: el botón "Atrás" del navegador regresa al paso anterior.
 * - Autocompletado nativo (Google / iCloud) con los tokens `autocomplete` estándar.
 * - Errores amables: resumen enfocable con enlaces a cada campo + mensaje junto al campo.
 * - Los datos viven solo en esta pestaña (sessionStorage) y se borran al confirmar (Ley 1581, datos efímeros).
 */
type Paso = 'datos' | 'envio' | 'pago';
const PASOS: readonly { id: Paso; titulo: string; animo: string }[] = [
  { id: 'datos', titulo: 'Tus datos', animo: 'Empecemos: así sabremos a quién entregar.' },
  { id: 'envio', titulo: 'Envío', animo: '¡Vas muy bien! ¿A dónde llevamos tu caja?' },
  { id: 'pago', titulo: 'Pago', animo: 'Último paso. Elige cómo prefieres pagar.' },
];

interface Borrador {
  cliente: DatosCliente;
  envio: DatosEnvio;
  medioPago: MedioPago | '';
  clave: string;
}

const CLAVE = 'alfonsini:checkout:v1';
const VACIO: Borrador = {
  cliente: { nombres: '', apellidos: '', correo: '', celular: '', documento: '' },
  envio: { departamento: '', ciudad: '', direccion: '', complemento: '', indicaciones: '' },
  medioPago: '',
  clave: '',
};

const esBorrador = (v: unknown): v is Borrador =>
  typeof v === 'object' && v !== null && typeof (v as Borrador).cliente === 'object' && typeof (v as Borrador).envio === 'object';
const borrador = crearAlmacen<Borrador>(CLAVE, VACIO, esBorrador, 'sesion');
/** Borra los datos personales de la pestaña una vez confirmado el pedido (datos efímeros). */
export const limpiarBorrador = (): void => borrador.escribir(() => VACIO);

const LLAVE_BREB = '@alfonsini';

export function Checkout() {
  const router = useRouter();
  const params = useSearchParams();
  const avisar = useAvisos();
  const lineas = useAlmacen(carrito);
  const { lineas: detalle, subtotal, envio: costoEnvio, total } = detallar(lineas);

  const montado = useHidratado();
  const b = useAlmacen(borrador);
  const setB = borrador.escribir;
  const [fallas, setFallas] = useState<{ paso: string; mapa: Record<string, string> }>({ paso: '', mapa: {} });
  const [aceptaDatos, setAceptaDatos] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const resumenErrores = useRef<HTMLDivElement>(null);
  const tituloPaso = useRef<HTMLHeadingElement>(null);
  const primeraCarga = useRef(true);

  const pasoUrl = params.get('paso');
  const paso: Paso = pasoUrl === 'envio' || pasoUrl === 'pago' ? pasoUrl : 'datos';
  const indice = PASOS.findIndex((p) => p.id === paso);

  // Guardia del asistente: no se puede saltar a un paso sin completar los anteriores
  useEffect(() => {
    if (!montado || procesando) return;
    if (paso !== 'datos' && !sinErrores(validarCliente(b.cliente))) router.replace('/checkout?paso=datos');
    else if (paso === 'pago' && !sinErrores(validarEnvio(b.envio))) router.replace('/checkout?paso=envio');
  }, [paso, montado, procesando, b.cliente, b.envio, router]);

  // Los errores pertenecen al paso en que se mostraron: al cambiar de paso desaparecen solos
  const errores = fallas.paso === paso ? fallas.mapa : {};

  // Al cambiar de paso: llevar el foco al título (lectores de pantalla y teclado)
  useEffect(() => {
    if (primeraCarga.current) { primeraCarga.current = false; return; }
    tituloPaso.current?.focus();
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }, [paso]);

  const mostrarErrores = (e: Record<string, string>): void => {
    setFallas({ paso, mapa: e });
    requestAnimationFrame(() => resumenErrores.current?.focus());
  };

  const ir = (destino: Paso): void => router.push(`/checkout?paso=${destino}`, { scroll: false });

  const enviarDatos = (e: FormEvent): void => {
    e.preventDefault();
    const err = validarCliente(b.cliente);
    if (!sinErrores(err)) return mostrarErrores(err as Record<string, string>);
    ir('envio');
  };

  const enviarEnvio = (e: FormEvent): void => {
    e.preventDefault();
    const err = validarEnvio(b.envio);
    if (!sinErrores(err)) return mostrarErrores(err as Record<string, string>);
    ir('pago');
  };

  const confirmar = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!b.medioPago) err.medioPago = 'Elige cómo quieres pagar: contra entrega o transferencia Bre-B.';
    if (!aceptaDatos) err.aceptaDatos = 'Para enviar tu pedido necesitamos tu autorización de tratamiento de datos.';
    if (!sinErrores(err)) return mostrarErrores(err);
    if (procesando || !b.medioPago) return;
    setProcesando(true);
    const clave = b.clave || crypto.randomUUID();
    setB((x) => ({ ...x, clave }));
    try {
      const pedido = await repositorios.pedidos.crear({ cliente: b.cliente, envio: b.envio, medioPago: b.medioPago, lineas, claveIdempotencia: clave });
      vaciarCarrito();
      router.replace(`/checkout/gracias?pedido=${encodeURIComponent(pedido.numero)}`);
    } catch {
      setProcesando(false);
      avisar({ tipo: 'error', titulo: 'No pudimos confirmar tu pedido', texto: 'No se hizo ningún cobro. Revisa tu conexión e inténtalo de nuevo.' });
    }
  };

  const copiarLlave = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(LLAVE_BREB);
      avisar({ tipo: 'exito', titulo: 'Llave Bre-B copiada', texto: 'Pégala en la app de tu banco.' });
    } catch {
      avisar({ tipo: 'info', titulo: `La llave es ${LLAVE_BREB}`, texto: 'Cópiala manualmente en la app de tu banco.' });
    }
  };

  if (!montado) return <div className={estilos.cargando}><Isotipo etiqueta="Preparando tu compra" /></div>;

  if (detalle.length === 0 && !procesando) {
    return (
      <div className={estilos.vacio}>
        <div className={estilos.cajaVacia} aria-hidden="true"><span /><span /></div>
        <h1>No hay nada por pagar todavía</h1>
        <p>Empaca al menos un par para empezar tu compra.</p>
        <Link href="/tienda" className="boton boton--grande">Ir a la tienda <IconoFlecha tam={20} /></Link>
      </div>
    );
  }

  const listaErrores = Object.entries(errores);
  const campoError = (nombre: string): { 'aria-invalid'?: true; 'aria-describedby'?: string } =>
    errores[nombre] ? { 'aria-invalid': true, 'aria-describedby': `err-${nombre}` } : {};
  const msgError = (campo: string): ReactNode =>
    errores[campo] ? <p id={`err-${campo}`} className="mensaje-error"><IconoAlerta tam={16} /> {errores[campo]}</p> : null;

  const setCliente = (k: keyof DatosCliente, v: string): void => setB((x) => ({ ...x, cliente: { ...x.cliente, [k]: v } }));
  const setEnvio = (k: keyof DatosEnvio, v: string): void => setB((x) => ({ ...x, envio: { ...x.envio, [k]: v } }));
  const pasoActual = PASOS[indice] ?? { id: 'datos', titulo: 'Tus datos', animo: '' };

  return (
    <div className={estilos.compra}>
      <div className={estilos.columnaPrincipal}>
        <h1 className={estilos.titulo}>Finalizar compra</h1>

        <nav aria-label="Pasos de la compra">
          <ol className={estilos.pasos} style={{ ['--p' as string]: indice / (PASOS.length - 1) }}>
            {PASOS.map((p, i) => {
              const hecho = i < indice;
              return (
                <li key={p.id} className={`${estilos.pasoItem} ${hecho ? estilos.pasoHecho : ''} ${i === indice ? estilos.pasoActual : ''}`} aria-current={i === indice ? 'step' : undefined}>
                  {hecho ? (
                    <button type="button" onClick={() => router.push(`/checkout?paso=${p.id}`)} className={estilos.pasoBoton}>
                      <span className={estilos.pasoNumero} aria-hidden="true"><IconoCheck tam={16} /></span>
                      <span>{p.titulo}<span className="visualmente-oculto"> (completado, editar)</span></span>
                    </button>
                  ) : (
                    <span className={estilos.pasoBoton}>
                      <span className={estilos.pasoNumero} aria-hidden="true">{i + 1}</span>
                      <span>{p.titulo}</span>
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className={estilos.tarjetaPaso} key={paso}>
          <p className={estilos.contadorPaso}>Paso {indice + 1} de {PASOS.length}</p>
          <h2 ref={tituloPaso} tabIndex={-1} className={estilos.tituloPaso}>{pasoActual.titulo}</h2>
          <p className={estilos.animo}>{pasoActual.animo}</p>

          {listaErrores.length > 0 && (
            <div ref={resumenErrores} tabIndex={-1} role="alert" className={estilos.resumenErrores}>
              <p><IconoAlerta tam={20} /> {listaErrores.length === 1 ? 'Falta un dato para continuar:' : `Faltan ${listaErrores.length} datos para continuar:`}</p>
              <ul>
                {listaErrores.map(([k, m]) => <li key={k}><a href={`#campo-${k}`}>{m}</a></li>)}
              </ul>
            </div>
          )}

          {paso === 'datos' && (
            <form onSubmit={enviarDatos} noValidate className={estilos.formulario} aria-label="Tus datos" data-formulario="checkout">
              <div className={estilos.fila2}>
                <div className="campo">
                  <label htmlFor="campo-nombres">Nombres</label>
                  <input id="campo-nombres" name="given-name" className="entrada" autoComplete="given-name" value={b.cliente.nombres}
                    onChange={(e) => setCliente('nombres', e.target.value)} {...campoError('nombres')} />
                  {msgError('nombres')}
                </div>
                <div className="campo">
                  <label htmlFor="campo-apellidos">Apellidos</label>
                  <input id="campo-apellidos" name="family-name" className="entrada" autoComplete="family-name" value={b.cliente.apellidos}
                    onChange={(e) => setCliente('apellidos', e.target.value)} {...campoError('apellidos')} />
                  {msgError('apellidos')}
                </div>
              </div>
              <div className="campo">
                <label htmlFor="campo-correo">Correo electrónico</label>
                <input id="campo-correo" name="email" type="email" inputMode="email" className="entrada" autoComplete="email" value={b.cliente.correo}
                  onChange={(e) => setCliente('correo', e.target.value)} {...campoError('correo')} />
                <span className="ayuda">Aquí te llega la confirmación.</span>
                {msgError('correo')}
              </div>
              <div className={estilos.fila2}>
                <div className="campo">
                  <label htmlFor="campo-celular">Celular</label>
                  <input id="campo-celular" name="tel" type="tel" inputMode="tel" className="entrada" autoComplete="tel-national" value={b.cliente.celular}
                    onChange={(e) => setCliente('celular', e.target.value)} {...campoError('celular')} />
                  <span className="ayuda">Por si el mensajero te llama.</span>
                  {msgError('celular')}
                </div>
                <div className="campo">
                  <label htmlFor="campo-documento">Cédula</label>
                  <input id="campo-documento" name="documento" inputMode="numeric" className="entrada" autoComplete="off" value={b.cliente.documento}
                    onChange={(e) => setCliente('documento', e.target.value)} {...campoError('documento')} />
                  <span className="ayuda">Para tu factura electrónica.</span>
                  {msgError('documento')}
                </div>
              </div>
              <div className={estilos.navegacionPaso}>
                <Link href="/carrito" className={`boton boton--fantasma ${estilos.atras}`}><IconoAtras tam={18} /> <span>Carrito</span></Link>
                <button type="submit" className="boton boton--grande">Ir al envío <IconoFlecha tam={20} /></button>
              </div>
            </form>
          )}

          {paso === 'envio' && (
            <form onSubmit={enviarEnvio} noValidate className={estilos.formulario} aria-label="Datos de envío" data-formulario="checkout">
              <p className={estilos.recordatorio}>Entregamos a <strong>{b.cliente.nombres} {b.cliente.apellidos}</strong> · {b.cliente.celular}</p>
              <div className={estilos.fila2}>
                <div className="campo">
                  <label htmlFor="campo-departamento">Departamento</label>
                  <select id="campo-departamento" name="address-level1" className="entrada" autoComplete="address-level1" value={b.envio.departamento}
                    onChange={(e) => setEnvio('departamento', e.target.value)} {...campoError('departamento')}>
                    <option value="">Elige uno</option>
                    {DEPARTAMENTOS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {msgError('departamento')}
                </div>
                <div className="campo">
                  <label htmlFor="campo-ciudad">Ciudad o municipio</label>
                  <input id="campo-ciudad" name="address-level2" className="entrada" autoComplete="address-level2" value={b.envio.ciudad}
                    onChange={(e) => setEnvio('ciudad', e.target.value)} {...campoError('ciudad')} />
                  {msgError('ciudad')}
                </div>
              </div>
              <div className="campo">
                <label htmlFor="campo-direccion">Dirección</label>
                <input id="campo-direccion" name="address-line1" className="entrada" autoComplete="address-line1" placeholder="Calle 12 # 34-56" value={b.envio.direccion}
                  onChange={(e) => setEnvio('direccion', e.target.value)} {...campoError('direccion')} />
                {msgError('direccion')}
              </div>
              <div className="campo">
                <label htmlFor="campo-complemento">Apartamento, torre o barrio <span className="ayuda">(opcional)</span></label>
                <input id="campo-complemento" name="address-line2" className="entrada" autoComplete="address-line2" value={b.envio.complemento}
                  onChange={(e) => setEnvio('complemento', e.target.value)} />
              </div>
              <div className="campo">
                <label htmlFor="campo-indicaciones">Indicaciones para el mensajero <span className="ayuda">(opcional)</span></label>
                <textarea id="campo-indicaciones" name="indicaciones" className="entrada" rows={2} autoComplete="off" value={b.envio.indicaciones}
                  onChange={(e) => setEnvio('indicaciones', e.target.value)} />
              </div>
              <div className={estilos.navegacionPaso}>
                <button type="button" className={`boton boton--fantasma ${estilos.atras}`} onClick={() => router.back()}><IconoAtras tam={18} /> <span>Tus datos</span></button>
                <button type="submit" className="boton boton--grande">Ir al pago <IconoFlecha tam={20} /></button>
              </div>
            </form>
          )}

          {paso === 'pago' && (
            <form onSubmit={confirmar} noValidate className={estilos.formulario} aria-label="Medio de pago" data-formulario="checkout">
              <p className={estilos.recordatorio}>Enviamos a <strong>{b.envio.direccion}</strong>, {b.envio.ciudad} ({b.envio.departamento})</p>
              <fieldset className={estilos.medios} id="campo-medioPago" {...(errores.medioPago ? { 'aria-describedby': 'err-medioPago' } : {})}>
                <legend>¿Cómo quieres pagar?</legend>
                <label className={estilos.medio}>
                  <input type="radio" name="medio" value="contra-entrega" checked={b.medioPago === 'contra-entrega'} onChange={() => setB((x) => ({ ...x, medioPago: 'contra-entrega' }))} />
                  <span className={estilos.medioIcono} aria-hidden="true"><IconoBillete /></span>
                  <span><strong>Pago contra entrega</strong><small>Pagas en efectivo cuando recibes tu caja.</small></span>
                </label>
                <label className={estilos.medio}>
                  <input type="radio" name="medio" value="transferencia-breb" checked={b.medioPago === 'transferencia-breb'} onChange={() => setB((x) => ({ ...x, medioPago: 'transferencia-breb' }))} />
                  <span className={`${estilos.medioIcono} ${estilos.breb}`} aria-hidden="true">B</span>
                  <span><strong>Transferencia Bre-B</strong><small>Inmediata desde la app de tu banco, con una llave.</small></span>
                </label>
                {msgError('medioPago')}
              </fieldset>

              {b.medioPago === 'transferencia-breb' && (
                <div className={estilos.instruccionesBreb}>
                  <p><strong>Así pagas con Bre-B</strong> (datos de muestra):</p>
                  <ol>
                    <li>Confirma el pedido y abre la app de tu banco.</li>
                    <li>Elige “Transferir con llave” y pega la llave
                      <button type="button" className={estilos.llave} onClick={copiarLlave}><code>{LLAVE_BREB}</code> <IconoCopiar tam={16} /> <span className="visualmente-oculto">Copiar llave</span></button>
                    </li>
                    <li>Envía <strong>{cop(total)}</strong> y listo: lo verificamos al instante.</li>
                  </ol>
                </div>
              )}

              <label className={estilos.consentimiento} id="campo-aceptaDatos">
                <input type="checkbox" checked={aceptaDatos} onChange={(e) => setAceptaDatos(e.target.checked)}
                  {...(errores.aceptaDatos ? { 'aria-invalid': true, 'aria-describedby': 'err-aceptaDatos' } : {})} />
                <span>Acepto los <Link href="/legal/terminos">términos</Link> y autorizo el <Link href="/legal/privacidad">tratamiento de mis datos</Link> para gestionar este pedido.</span>
              </label>
              {msgError('aceptaDatos')}

              <div className={estilos.navegacionPaso}>
                <button type="button" className={`boton boton--fantasma ${estilos.atras}`} onClick={() => router.back()}><IconoAtras tam={18} /> <span>Envío</span></button>
                <button type="submit" className="boton boton--grande" aria-busy={procesando} data-accion="confirmar-pedido">
                  Confirmar pedido · {cop(total)}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <aside className={estilos.resumen} aria-labelledby="resumen-pedido">
        <details className={estilos.resumenPlegable} open>
          <summary><h2 id="resumen-pedido" className={estilos.resumenTitulo}>Tu pedido · {cop(total)}</h2></summary>
          <ul className={estilos.resumenLineas}>
            {detalle.map((l) => (
              <li key={`${l.slug}-${l.talla}`}>
                <Image src={l.producto.imagenes[0]?.src ?? ''} alt="" width={72} height={54} />
                <span><strong>{l.producto.nombre}</strong><small>Talla {l.talla} · {l.cantidad} {l.cantidad === 1 ? 'par' : 'pares'}</small></span>
                <span>{cop(l.producto.precio * l.cantidad)}</span>
              </li>
            ))}
          </ul>
          <dl className={estilos.totales}>
            <div><dt>Subtotal</dt><dd data-subtotal="">{cop(subtotal)}</dd></div>
            <div><dt>Envío</dt><dd>{costoEnvio === 0 ? 'Gratis' : cop(costoEnvio)}</dd></div>
            <div className={estilos.total}><dt>Total</dt><dd data-total="">{cop(total)}</dd></div>
          </dl>
        </details>
      </aside>

      {procesando && (
        <div className={estilos.procesando} role="dialog" aria-modal="true" aria-label="Confirmando tu pedido">
          <Isotipo tam="grande" conPalabra etiqueta="Empacando tu pedido…" />
          <p>No cierres esta ventana. Tarda unos segundos.</p>
        </div>
      )}
    </div>
  );
}
