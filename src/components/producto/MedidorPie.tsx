'use client';
import { useId, useState } from 'react';
import { leerCentimetros, LARGO_MAX_CM, LARGO_MIN_CM, tallaRecomendada } from '@/domain/tallas';
import { IconoRegla } from '../Iconos';
import estilos from './Ficha.module.css';

/** "Mido 25,5 cm → talla 39": elimina la duda de talla, primera causa de cambios en calzado. */
export function MedidorPie({ alElegir, tallasDisponibles }: { readonly alElegir?: (talla: number) => void; readonly tallasDisponibles?: readonly number[] }) {
  const id = useId();
  const [valor, setValor] = useState('');
  const cm = leerCentimetros(valor);
  const sugerida = tallaRecomendada(cm);
  const escrito = valor.trim() !== '';
  const existe = sugerida && (!tallasDisponibles || tallasDisponibles.includes(sugerida.co));

  return (
    <details className={estilos.medidor}>
      <summary><IconoRegla tam={20} /> ¿No sabes tu talla? Mide tu pie</summary>
      <div className={estilos.medidorCuerpo}>
        <p>Párate sobre una hoja, marca el talón y la punta del dedo más largo y mide en centímetros.</p>
        <div className="campo">
          <label htmlFor={`${id}-cm`}>Largo de tu pie (cm)</label>
          <input id={`${id}-cm`} className="entrada" inputMode="decimal" autoComplete="off" placeholder="Ej. 25,5" value={valor}
            onChange={(e) => setValor(e.target.value)} aria-describedby={`${id}-res`} />
        </div>
        <p id={`${id}-res`} className={estilos.medidorResultado} aria-live="polite">
          {!escrito ? '' : sugerida
            ? <>Tu talla Alfonsini es la <strong>{sugerida.co}</strong> (EU {sugerida.eu} · US {sugerida.us}).</>
            : `Escribe una medida entre ${LARGO_MIN_CM} y ${LARGO_MAX_CM} cm.`}
        </p>
        {sugerida && alElegir && (
          <button type="button" className="boton boton--fantasma" onClick={() => alElegir(sugerida.co)}>
            {existe ? `Elegir talla ${sugerida.co}` : `Ver la talla ${sugerida.co}`}
          </button>
        )}
      </div>
    </details>
  );
}
