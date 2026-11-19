'use client';
import { useId, useState } from 'react';
import type { Producto } from '@/domain/tipos';
import { repositorios } from '@/lib/repositorios';
import { useAvisos } from '../Avisos';
import { IconoCampana, IconoCheck } from '../Iconos';
import { Isotipo } from '../Isotipo';
import estilos from './Ficha.module.css';

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Agotado sin decepción: en lugar de un botón apagado, una invitación activa a "apartar el turno".
 * El botón sigue vivo y lleva a una acción con valor (aviso prioritario + alternativas).
 */
export function ListaEspera({ producto, talla, todoAgotado }: { readonly producto: Producto; readonly talla: number | null; readonly todoAgotado: boolean }) {
  const id = useId();
  const avisar = useAvisos();
  const [abierta, setAbierta] = useState(todoAgotado);
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState('');
  const [estado, setEstado] = useState<'inicial' | 'enviando' | 'listo'>('inicial');
  const [posicion, setPosicion] = useState(0);

  const enviar = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!CORREO.test(correo.trim())) {
      setError('Escribe un correo como nombre@correo.com para poder avisarte.');
      document.getElementById(`${id}-correo`)?.focus();
      return;
    }
    setError('');
    setEstado('enviando');
    const r = await repositorios.listaEspera.inscribir({ slug: producto.slug, talla, correo: correo.trim() });
    setPosicion(r.posicion);
    setEstado('listo');
    avisar({ tipo: 'exito', titulo: '¡Turno apartado!', texto: `Te avisaremos primero cuando ${producto.nombre}${talla ? ` talla ${talla}` : ''} vuelva.` });
  };

  if (estado === 'listo') {
    return (
      <div className={`${estilos.espera} ${estilos.esperaLista}`} role="status">
        <span className={estilos.esperaIcono}><IconoCheck tam={26} /></span>
        <div>
          <p className={estilos.esperaTitulo}>¡Listo! Eres el turno #{posicion}</p>
          <p className={estilos.esperaTexto}>Te escribiremos a {correo} apenas llegue{talla ? ` la talla ${talla}` : ''}. Sin spam: un solo correo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={estilos.espera}>
      <p className={estilos.esperaTitulo}>
        {todoAgotado ? '¡Este modelo voló! Aparta tu turno para la próxima tanda.' : `La talla ${talla} se agotó, pero vuelve pronto.`}
      </p>
      <p className={estilos.esperaTexto}>Quienes están en la lista reciben el aviso antes que nadie y tienen 48 horas para comprarlo primero.</p>
      {!abierta ? (
        <button type="button" className="boton boton--grande boton--bloque" onClick={() => setAbierta(true)} aria-expanded="false" aria-controls={`${id}-form`}>
          <IconoCampana tam={20} /> Avísame cuando llegue{talla ? ` la ${talla}` : ''}
        </button>
      ) : (
        <form id={`${id}-form`} className={estilos.esperaForm} onSubmit={enviar} noValidate>
          <div className="campo">
            <label htmlFor={`${id}-correo`}>Tu correo</label>
            <input id={`${id}-correo`} className="entrada" type="email" name="email" autoComplete="email" inputMode="email" value={correo}
              onChange={(e) => setCorreo(e.target.value)} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} required />
            {error && <p id={`${id}-err`} className="mensaje-error">{error}</p>}
          </div>
          <button type="submit" className="boton boton--grande boton--bloque" aria-busy={estado === 'enviando'}>
            {estado === 'enviando' ? <Isotipo tam="pequeno" etiqueta="Apartando tu turno" /> : <><IconoCampana tam={20} /> Apartar mi turno</>}
          </button>
        </form>
      )}
    </div>
  );
}
