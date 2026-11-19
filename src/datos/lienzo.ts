/**
 * Lienzo común de las ilustraciones placeholder (800×600). La silueta se dibuja en 400×240 y se lleva al lienzo
 * con TRASLADO y ESCALA. Los hotspots se declaran en coordenadas de la silueta y se convierten a %.
 * Cuando lleguen las fotos reales, los puntos se recalibran sobre cada foto (docs/PENDIENTES.md).
 */
export const LIENZO = { ancho: 800, alto: 600 } as const;
export const TRASLADO = { x: 40, y: 96 } as const;
export const ESCALA = 1.8;

export const aPorcentaje = (x: number, y: number): { x: number; y: number } => ({
  x: Math.round(((TRASLADO.x + x * ESCALA) / LIENZO.ancho) * 1000) / 10,
  y: Math.round(((TRASLADO.y + y * ESCALA) / LIENZO.alto) * 1000) / 10,
});
