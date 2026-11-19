'use client';
import { useSyncExternalStore } from 'react';

/**
 * Almacén mínimo con persistencia local (sin librerías: HSS™). Lectura segura: si el navegador bloquea
 * el almacenamiento (modo privado, iframe), la tienda sigue funcionando en memoria.
 */
export interface Almacen<T> {
  leer: () => T;
  escribir: (cambio: (actual: T) => T) => void;
  suscribir: (oyente: () => void) => () => void;
  servidor: () => T;
}

/** Lee un almacén en un componente. En el servidor (y al hidratar) devuelve el valor inicial: sin desajustes. */
export function useAlmacen<T>(almacen: Almacen<T>): T {
  return useSyncExternalStore(almacen.suscribir, almacen.leer, almacen.servidor);
}

const sinSuscripcion = (): (() => void) => () => undefined;
/** true solo en el cliente ya hidratado (sin setState en efectos). */
export const useHidratado = (): boolean => useSyncExternalStore(sinSuscripcion, () => true, () => false);

export function crearAlmacen<T>(clave: string, inicial: T, validar: (v: unknown) => v is T, medio: 'local' | 'sesion' = 'local'): Almacen<T> {
  const almacenamiento = (): Storage => (medio === 'local' ? window.localStorage : window.sessionStorage);
  let estado: T = inicial;
  let hidratado = false;
  const oyentes = new Set<() => void>();

  const cargar = (): void => {
    if (hidratado || typeof window === 'undefined') return;
    hidratado = true;
    try {
      const crudo = almacenamiento().getItem(clave);
      if (crudo) {
        const v: unknown = JSON.parse(crudo);
        if (validar(v)) estado = v;
      }
    } catch {
      /* almacenamiento no disponible: se continúa en memoria */
    }
  };

  const leer = (): T => {
    cargar();
    return estado;
  };

  const escribir = (cambio: (actual: T) => T): void => {
    cargar();
    estado = cambio(estado);
    try {
      almacenamiento().setItem(clave, JSON.stringify(estado));
    } catch {
      /* sin persistencia */
    }
    oyentes.forEach((o) => o());
  };

  const suscribir = (oyente: () => void): (() => void) => {
    oyentes.add(oyente);
    const alCambiarOtraPestana = (e: StorageEvent): void => {
      if (e.key !== clave) return;
      hidratado = false;
      cargar();
      oyente();
    };
    window.addEventListener('storage', alCambiarOtraPestana);
    return () => {
      oyentes.delete(oyente);
      window.removeEventListener('storage', alCambiarOtraPestana);
    };
  };

  const servidor = (): T => inicial;

  return { leer, escribir, suscribir, servidor };
}
