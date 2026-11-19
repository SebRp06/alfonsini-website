'use client';
import { crearAlmacen } from './almacen';

/**
 * Preferencias de accesibilidad: tema y tamaño de letra. Se aplican en <html> sin recargar.
 * El script anti-parpadeo de `layout.tsx` las aplica antes del primer pintado.
 */
export type Tema = 'sistema' | 'claro' | 'oscuro';
export const ESCALAS = [1, 1.125, 1.25, 1.5] as const;
export type Escala = (typeof ESCALAS)[number];

export interface Preferencias {
  tema: Tema;
  escala: Escala;
}

export const CLAVE_PREFERENCIAS = 'alfonsini:preferencias:v1';
/** Marca de que la tarjeta de bienvenida ya se mostró en este dispositivo. */
export const CLAVE_BIENVENIDA = 'alfonsini:bienvenida:v1';

const esPreferencias = (v: unknown): v is Preferencias =>
  typeof v === 'object' && v !== null && ['sistema', 'claro', 'oscuro'].includes((v as Preferencias).tema)
  && (ESCALAS as readonly number[]).includes((v as Preferencias).escala);

export const preferencias = crearAlmacen<Preferencias>(CLAVE_PREFERENCIAS, { tema: 'sistema', escala: 1 }, esPreferencias);

export function aplicarPreferencias(p: Preferencias): void {
  const html = document.documentElement;
  const oscuro = p.tema === 'oscuro' || (p.tema === 'sistema' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  html.dataset.tema = oscuro ? 'oscuro' : 'claro';
  html.style.setProperty('--escala-texto', String(p.escala));
  html.style.colorScheme = oscuro ? 'dark' : 'light';
}

export const cambiarPreferencias = (cambio: Partial<Preferencias>): void => {
  preferencias.escribir((actual) => ({ ...actual, ...cambio }));
  aplicarPreferencias(preferencias.leer());
};

/** Script inline (string) que corre antes de pintar: evita el destello de tema y de tamaño. */
export const SCRIPT_PREFERENCIAS = `(function(){try{var d=document.documentElement,p={tema:'sistema',escala:1};var s=localStorage.getItem('${CLAVE_PREFERENCIAS}');if(s){var v=JSON.parse(s);if(v&&v.tema)p=v;}var o=p.tema==='oscuro'||(p.tema==='sistema'&&matchMedia('(prefers-color-scheme: dark)').matches);d.dataset.tema=o?'oscuro':'claro';d.style.colorScheme=o?'dark':'light';d.style.setProperty('--escala-texto',String(p.escala||1));var n=navigator,m=n.deviceMemory||8,c=n.hardwareConcurrency||8,a=n.connection&&n.connection.saveData;if(m<=2||c<=2||a)d.dataset.rendimiento='ligero';if(!localStorage.getItem('${CLAVE_BIENVENIDA}'))d.dataset.bienvenida='pendiente';}catch(e){document.documentElement.dataset.tema='oscuro';}})();`;
