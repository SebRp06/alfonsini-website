'use client';
import { useAlmacen } from '@/estado/almacen';
import { useEffect, type RefObject } from 'react';
import { aplicarPreferencias, preferencias } from '@/estado/preferencias';
import { ControlesPreferencias } from './ControlesPreferencias';
import { IconoCerrar } from './Iconos';
import estilos from './PanelAccesibilidad.module.css';

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

        <ControlesPreferencias grupo="panel" />
        <p className={estilos.nota}>Los cambios se aplican al instante y se recuerdan en este dispositivo. El zoom de tu navegador también funciona.</p>
      </div>
    </dialog>
  );
}
