'use client';
import Link from 'next/link';
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { IconoAlerta, IconoCampana, IconoCerrar, IconoCheck } from './Iconos';
import estilos from './Avisos.module.css';

/**
 * Avisos amables (toasts) con región viva accesible. Los éxitos se anuncian con cortesía (polite);
 * los errores interrumpen (assertive). Cada aviso lleva una acción clara: nunca un callejón sin salida (UFF™).
 */
export type TipoAviso = 'exito' | 'error' | 'info';

export interface AccionAviso {
  readonly texto: string;
  readonly href?: string;
  readonly alPulsar?: () => void;
}

export interface Aviso {
  readonly tipo: TipoAviso;
  readonly titulo: string;
  readonly texto?: string;
  readonly acciones?: readonly AccionAviso[];
  readonly duracionMs?: number;
}

interface AvisoActivo extends Aviso { readonly id: number }

const Contexto = createContext<(a: Aviso) => void>(() => undefined);
export const useAvisos = (): ((a: Aviso) => void) => useContext(Contexto);

const ICONO = { exito: IconoCheck, error: IconoAlerta, info: IconoCampana } as const;

export function ProveedorAvisos({ children }: { readonly children: ReactNode }) {
  const [avisos, setAvisos] = useState<AvisoActivo[]>([]);
  const siguiente = useRef(0);

  const cerrar = useCallback((id: number) => setAvisos((l) => l.filter((a) => a.id !== id)), []);

  const avisar = useCallback((a: Aviso) => {
    const id = ++siguiente.current;
    setAvisos((l) => [...l.slice(-2), { ...a, id }]);
    const ms = a.duracionMs ?? (a.acciones?.length ? 8000 : 5000);
    window.setTimeout(() => cerrar(id), ms);
  }, [cerrar]);

  const valor = useMemo(() => avisar, [avisar]);

  return (
    <Contexto.Provider value={valor}>
      {children}
      <div className={estilos.region} aria-live="polite" aria-relevant="additions">
        {avisos.filter((a) => a.tipo !== 'error').map((a) => <Tarjeta key={a.id} aviso={a} cerrar={cerrar} />)}
      </div>
      <div className={estilos.region} role="alert" aria-live="assertive">
        {avisos.filter((a) => a.tipo === 'error').map((a) => <Tarjeta key={a.id} aviso={a} cerrar={cerrar} />)}
      </div>
    </Contexto.Provider>
  );
}

function Tarjeta({ aviso, cerrar }: { readonly aviso: AvisoActivo; readonly cerrar: (id: number) => void }) {
  const Icono = ICONO[aviso.tipo];
  return (
    <div className={`${estilos.aviso} ${estilos[aviso.tipo]}`}>
      <span className={estilos.icono}><Icono tam={20} /></span>
      <div className={estilos.cuerpo}>
        <p className={estilos.titulo}>{aviso.titulo}</p>
        {aviso.texto && <p className={estilos.texto}>{aviso.texto}</p>}
        {aviso.acciones && (
          <div className={estilos.acciones}>
            {aviso.acciones.map((ac) =>
              ac.href ? (
                <Link key={ac.texto} href={ac.href} className={estilos.accion} onClick={() => cerrar(aviso.id)}>{ac.texto}</Link>
              ) : (
                <button key={ac.texto} type="button" className={estilos.accion} onClick={() => { ac.alPulsar?.(); cerrar(aviso.id); }}>{ac.texto}</button>
              ),
            )}
          </div>
        )}
      </div>
      <button type="button" className={estilos.cerrar} onClick={() => cerrar(aviso.id)} aria-label="Cerrar aviso">
        <IconoCerrar tam={18} />
      </button>
    </div>
  );
}
