'use client';
import { useAlmacen } from '@/estado/almacen';
import { useEffect, type RefObject } from 'react';
import { aplicarPreferencias, cambiarPreferencias, ESCALAS, preferencias, type Escala, type Tema } from '@/estado/preferencias';
import { IconoCerrar } from './Iconos';
import estilos from './PanelAccesibilidad.module.css';

const ETIQUETA_ESCALA: Record<Escala, string> = { 1: '100 %', 1.125: '112 %', 1.25: '125 %', 1.5: '150 %' };
const TEMAS: readonly { valor: Tema; texto: string }[] = [
  { valor: 'sistema', texto: 'Como mi dispositivo' },
  { valor: 'claro', texto: 'Claro' },
  { valor: 'oscuro', texto: 'Oscuro' },
];

/** Tamaño de letra y tema al instante, sin recargar. Se recuerda en este dispositivo. */
export function PanelAccesibilidad({ referencia }: { readonly referencia: RefObject<HTMLDialogElement | null> }) {
  const p = useAlmacen(preferencias);

  // Si la persona eligió "como mi dispositivo", seguir los cambios del sistema en vivo
  useEffect(() => {
    aplicarPreferencias(p);
    if (p.tema !== 'sistema') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const alCambiar = (): void => aplicarPreferencias(preferencias.leer());
    mq.addEventListener('change', alCambiar);
    return () => mq.removeEventListener('change', alCambiar);
  }, [p]);

  return (
    <dialog ref={referencia} className={estilos.panel} aria-labelledby="titulo-a11y"
      onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }}>
      <div className={estilos.interior}>
        <div className={estilos.cabeza}>
          <h2 id="titulo-a11y" className={estilos.titulo}>Ver a mi manera</h2>
          <button type="button" className="icono-boton" aria-label="Cerrar" onClick={() => referencia.current?.close()}>
            <IconoCerrar />
          </button>
        </div>

        <fieldset className={estilos.grupo}>
          <legend>Tamaño de letra</legend>
          <div className={estilos.opciones}>
            {ESCALAS.map((e) => (
              <label key={e} className={estilos.opcion}>
                <input type="radio" name="escala" value={e} checked={p.escala === e} onChange={() => cambiarPreferencias({ escala: e })} />
                <span style={{ fontSize: `${0.85 + (e - 1) * 1.4}rem` }} aria-hidden="true">A</span>
                <span className={estilos.valor}>{ETIQUETA_ESCALA[e]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className={estilos.grupo}>
          <legend>Tema</legend>
          <div className={estilos.opciones}>
            {TEMAS.map((t) => (
              <label key={t.valor} className={`${estilos.opcion} ${estilos.opcionTexto}`}>
                <input type="radio" name="tema" value={t.valor} checked={p.tema === t.valor} onChange={() => cambiarPreferencias({ tema: t.valor })} />
                <span>{t.texto}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <p className={estilos.nota}>Los cambios se aplican al instante y se recuerdan en este dispositivo. El zoom de tu navegador también funciona.</p>
      </div>
    </dialog>
  );
}
