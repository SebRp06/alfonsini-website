/** Formato único de moneda en todo el recorrido (el kit audita la consistencia de montos entre pasos). */
const formato = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0, minimumFractionDigits: 0 });

export const cop = (valor: number): string => formato.format(Math.round(valor)).replace(/ /g, ' ');

/** Reglas de envío de la maqueta. Se reemplazan por la tarifa real de la transportadora (docs/PENDIENTES.md). */
export const ENVIO = { umbralGratis: 300_000, tarifa: 14_900 } as const;

export const costoEnvio = (subtotal: number): number => (subtotal === 0 || subtotal >= ENVIO.umbralGratis ? 0 : ENVIO.tarifa);
