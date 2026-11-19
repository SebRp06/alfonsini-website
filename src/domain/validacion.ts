import type { DatosCliente, DatosEnvio } from './tipos';

/** Mensajes amables y accionables: dicen qué falta y cómo resolverlo (UFF™). */
export type Errores<T> = Partial<Record<keyof T, string>>;

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const soloDigitos = (v: string): string => v.replace(/\D/g, '');

/** Celular colombiano: 10 dígitos iniciando en 3; acepta +57 y espacios. */
export const normalizarCelular = (v: string): string => {
  const d = soloDigitos(v);
  return d.length === 12 && d.startsWith('57') ? d.slice(2) : d;
};

export function validarCliente(d: DatosCliente): Errores<DatosCliente> {
  const e: Errores<DatosCliente> = {};
  if (d.nombres.trim().length < 2) e.nombres = 'Escribe tu nombre para saber a quién entregamos.';
  if (d.apellidos.trim().length < 2) e.apellidos = 'Escribe tu apellido; lo pide la transportadora.';
  if (!CORREO.test(d.correo.trim())) e.correo = 'Revisa el correo: debe verse como nombre@correo.com.';
  const cel = normalizarCelular(d.celular);
  if (!(cel.length === 10 && cel.startsWith('3'))) e.celular = 'El celular debe tener 10 dígitos y empezar por 3 (ej. 310 555 0101).';
  const doc = soloDigitos(d.documento);
  if (doc.length < 6 || doc.length > 10) e.documento = 'Escribe tu cédula sin puntos (entre 6 y 10 números).';
  return e;
}

export function validarEnvio(d: DatosEnvio): Errores<DatosEnvio> {
  const e: Errores<DatosEnvio> = {};
  if (!d.departamento) e.departamento = 'Elige el departamento de entrega.';
  if (d.ciudad.trim().length < 2) e.ciudad = 'Escribe la ciudad o municipio.';
  if (d.direccion.trim().length < 6) e.direccion = 'Escribe la dirección completa (ej. Calle 12 # 34-56).';
  return e;
}

export const sinErrores = <T>(e: Errores<T>): boolean => Object.keys(e).length === 0;
