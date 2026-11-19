'use client';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CLAVE_BIENVENIDA } from '@/estado/preferencias';
import { ControlesPreferencias } from './ControlesPreferencias';
import { IconoAccesibilidad } from './Iconos';
import estilos from './BienvenidaPreferencias.module.css';

/**
 * Tarjeta de bienvenida (HCQE™): en la PRIMERA visita invita a ajustar letra y tema antes de navegar.
 * - No es modal: la tienda se ve y se usa detrás; no roba el foco.
 * - Va primera en el orden del DOM (justo después de "Saltar al contenido"): teclado y lector la encuentran antes que nada.
 * - El script previo al pintado marca `html[data-bienvenida="pendiente"]`: sin parpadeo para quien ya la vio y sin
 *   saltos de diseño (la portada ya reserva su espacio desde el primer cuadro).
 * - Se cierra con "Listo", "Más tarde", Esc o al navegar; después el botón "Ver a mi manera" de la cabecera
 *   se ilumina para mostrar dónde quedó.
 */
const BOTON_CABECERA = '[data-boton-a11y]';

export function BienvenidaPreferencias() {
  const tarjeta = useRef<HTMLElement>(null);
  const ruta = usePathname();
  const rutaInicial = useRef(ruta);
  const [saliendo, setSaliendo] = useState(false);

  const cerrar = useCallback((resaltar: boolean): void => {
    const html = document.documentElement;
    if (html.dataset.bienvenida !== 'pendiente') return;
    const teniaFoco = tarjeta.current?.contains(document.activeElement) ?? false;
    setSaliendo(true);
    window.setTimeout(() => {
      delete html.dataset.bienvenida;
      setSaliendo(false);
      if (teniaFoco) document.querySelector<HTMLElement>(BOTON_CABECERA)?.focus();
      if (resaltar) {
        html.dataset.resaltarA11y = 'si';
        window.setTimeout(() => { delete html.dataset.resaltarA11y; }, 3600);
      }
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 220);
  }, []);

  // Al mostrarse se recuerda como vista: aparece solo en la primera visita del dispositivo
  useEffect(() => {
    if (document.documentElement.dataset.bienvenida !== 'pendiente') return;
    try { window.localStorage.setItem(CLAVE_BIENVENIDA, new Date().toISOString()); } catch { /* sin almacenamiento */ }
    const alTeclear = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && !document.querySelector('dialog[open]')) cerrar(true);
    };
    document.addEventListener('keydown', alTeclear);
    return () => document.removeEventListener('keydown', alTeclear);
  }, [cerrar]);

  // Navegar cuenta como "ya decidí": la tarjeta no persigue a la persona por el sitio
  useEffect(() => {
    if (ruta !== rutaInicial.current) cerrar(false);
  }, [ruta, cerrar]);

  return (
    <section ref={tarjeta} className={`${estilos.tarjeta} ${saliendo ? estilos.saliendo : ''}`} aria-labelledby="bienvenida-titulo" data-bienvenida-tarjeta="">
      <div className={estilos.encabezado}>
        <span className={estilos.icono} aria-hidden="true"><IconoAccesibilidad tam={20} /></span>
        <div>
          <h2 id="bienvenida-titulo" className={estilos.titulo}>¿Ves bien la tienda?</h2>
          <p className={estilos.texto}>Elige letra y tema. Luego lo cambias en <strong>Ver a mi manera</strong>.</p>
        </div>
      </div>
      <div className={estilos.controles}>
        <ControlesPreferencias grupo="bienvenida" compacto />
      </div>
      <div className={estilos.acciones}>
        <button type="button" className={`boton ${estilos.ajustar}`} onClick={() => { cerrar(false); document.querySelector<HTMLElement>(BOTON_CABECERA)?.click(); }}>
          Ajustar letra y tema
        </button>
        <button type="button" className={`boton ${estilos.listo}`} onClick={() => cerrar(true)}>Listo, a comprar</button>
        <button type="button" className={estilos.despues} onClick={() => cerrar(true)}>Más tarde</button>
      </div>
    </section>
  );
}
