/**
 * Tabla referencial de tallas. Se reemplaza por la horma real de Alfonsini (docs/PENDIENTES.md).
 * Largo del pie en cm medido del talón al dedo más largo.
 */
export interface EquivalenciaTalla {
  readonly co: number;
  readonly eu: number;
  readonly us: number;
  readonly cm: number;
}

export const TABLA_TALLAS: readonly EquivalenciaTalla[] = [
  { co: 34, eu: 35, us: 4.5, cm: 22.4 },
  { co: 35, eu: 36, us: 5.5, cm: 23.0 },
  { co: 36, eu: 37, us: 6, cm: 23.7 },
  { co: 37, eu: 38, us: 7, cm: 24.3 },
  { co: 38, eu: 39, us: 7.5, cm: 25.0 },
  { co: 39, eu: 40, us: 8, cm: 25.7 },
  { co: 40, eu: 41, us: 9, cm: 26.3 },
  { co: 41, eu: 42, us: 9.5, cm: 27.0 },
  { co: 42, eu: 43, us: 10, cm: 27.7 },
  { co: 43, eu: 44, us: 11, cm: 28.3 },
  { co: 44, eu: 45, us: 12, cm: 29.0 },
];

export const LARGO_MIN_CM = 21;
export const LARGO_MAX_CM = 31;

/** Talla recomendada para un largo de pie: la menor cuya horma cubre el pie (con 0,2 cm de holgura). */
export function tallaRecomendada(largoCm: number): EquivalenciaTalla | null {
  if (!Number.isFinite(largoCm) || largoCm < LARGO_MIN_CM || largoCm > LARGO_MAX_CM) return null;
  return TABLA_TALLAS.find((t) => t.cm + 0.2 >= largoCm) ?? TABLA_TALLAS[TABLA_TALLAS.length - 1] ?? null;
}

/** Acepta "25,5", "25.5" o "25 cm". */
export function leerCentimetros(entrada: string): number {
  const limpio = entrada.replace(/cm/i, '').trim().replace(',', '.');
  return limpio === '' ? Number.NaN : Number(limpio);
}
