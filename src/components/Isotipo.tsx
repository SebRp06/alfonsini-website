import estilos from './Isotipo.module.css';

/**
 * Isotipo de carga de Alfonsini: la "A" de la marca se dibuja trazo a trazo y su travesaño es una suela.
 * Solo CSS (sin JS ni GIF): ~1 KB. Con "reducir movimiento" queda un pulso suave.
 * Uso: procesos de pago, envíos de formularios y transiciones de ruta.
 */
interface Props {
  readonly etiqueta?: string;
  readonly tam?: 'pequeno' | 'mediano' | 'grande';
  readonly conPalabra?: boolean;
}

const LETRAS = 'ALFONSINI'.split('');

export function Isotipo({ etiqueta = 'Cargando', tam = 'mediano', conPalabra = false }: Props) {
  return (
    <span className={`${estilos.isotipo} ${estilos[tam]}`} role="status" aria-live="polite">
      <svg className={estilos.marca} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="iso-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffd08a" />
            <stop offset=".55" stopColor="#f2a93b" />
            <stop offset="1" stopColor="#7c5cff" />
          </linearGradient>
        </defs>
        <rect className={estilos.marco} x="3" y="3" width="42" height="42" rx="12" />
        <path className={estilos.piernas} d="M12 37 L24 10 L36 37" />
        <path className={estilos.suela} d="M15.5 29.5 Q24 34 32.5 29.5" />
      </svg>
      {conPalabra && (
        <span className={estilos.palabra} aria-hidden="true">
          {LETRAS.map((l, i) => (
            <span key={i} style={{ ['--i' as string]: i }}>{l}</span>
          ))}
        </span>
      )}
      <span className={estilos.texto}>{etiqueta}</span>
    </span>
  );
}
