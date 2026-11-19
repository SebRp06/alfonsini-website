import type { SVGProps } from 'react';

/** Íconos de línea propios (sin librería: HSS™). Decorativos por defecto: aria-hidden. */
type P = SVGProps<SVGSVGElement> & { tam?: number };

const base = ({ tam = 24, ...p }: P): SVGProps<SVGSVGElement> => ({
  width: tam, height: tam, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2,
  strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false, ...p,
});

export const IconoBolsa = (p: P) => (<svg {...base(p)}><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>);
export const IconoMenu = (p: P) => (<svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h10" /></svg>);
export const IconoCerrar = (p: P) => (<svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>);
export const IconoBuscar = (p: P) => (<svg {...base(p)}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></svg>);
export const IconoAccesibilidad = (p: P) => (<svg {...base(p)}><circle cx="12" cy="4.5" r="1.8" /><path d="M5 8.5c2.3.8 4.6 1.2 7 1.2s4.7-.4 7-1.2M12 9.7V14m0 0-3 6.5M12 14l3 6.5" /></svg>);
export const IconoSol = (p: P) => (<svg {...base(p)}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>);
export const IconoLuna = (p: P) => (<svg {...base(p)}><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" /></svg>);
export const IconoFlecha = (p: P) => (<svg {...base(p)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
export const IconoAtras = (p: P) => (<svg {...base(p)}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>);
export const IconoCheck = (p: P) => (<svg {...base(p)}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>);
export const IconoAlerta = (p: P) => (<svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.5h.01" /></svg>);
export const IconoCampana = (p: P) => (<svg {...base(p)}><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16Z" /><path d="M10 20.5a2.2 2.2 0 0 0 4 0" /></svg>);
export const IconoCamion = (p: P) => (<svg {...base(p)}><path d="M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></svg>);
export const IconoBillete = (p: P) => (<svg {...base(p)}><rect x="2.5" y="6" width="19" height="12" rx="2" /><circle cx="12" cy="12" r="2.6" /><path d="M6 9.5v5M18 9.5v5" /></svg>);
export const IconoCambio = (p: P) => (<svg {...base(p)}><path d="M4 9h13l-3-3M20 15H7l3 3" /></svg>);
export const IconoHilo = (p: P) => (<svg {...base(p)}><path d="M4 20 20 4" /><circle cx="18" cy="6" r="2" /><path d="M5 13c3 0 3 3 6 3s3-3 6-3" /></svg>);
export const IconoMas = (p: P) => (<svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>);
export const IconoMenos = (p: P) => (<svg {...base(p)}><path d="M5 12h14" /></svg>);
export const IconoPapelera = (p: P) => (<svg {...base(p)}><path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13" /></svg>);
export const IconoCopiar = (p: P) => (<svg {...base(p)}><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" /></svg>);
export const IconoRegla = (p: P) => (<svg {...base(p)}><rect x="2.5" y="8" width="19" height="8" rx="1.5" /><path d="M6.5 8v3M10.5 8v4M14.5 8v3M18.5 8v4" /></svg>);
