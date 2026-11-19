/**
 * Animación "empacar en la caja": el zapato vuela a una caja Alfonsini, la tapa cierra, se sella
 * y la caja viaja al ícono del carrito. Web Animations API sobre transform/opacity (compositor, 60 fps en gama baja).
 * Nodo efímero fuera de React; se elimina al terminar. Con "reducir movimiento" no se ejecuta.
 */
import estilos from './Empaque.module.css';

const c_ = (k: string): string => estilos[k] ?? '';
const centro = (r: DOMRect): { x: number; y: number } => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

export async function animarEmpaque(imagen: HTMLElement | null, destino: HTMLElement | null): Promise<void> {
  if (!imagen || typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const origen = imagen.getBoundingClientRect();
  const foto = imagen.querySelector('img');
  const escena = document.createElement('div');
  escena.className = c_('escena');
  escena.setAttribute('aria-hidden', 'true');
  escena.innerHTML = `<div class="${c_('caja')}"><div class="${c_('fondo')}"></div><div class="${c_('frente')}"><span>ALFONSINI</span></div><div class="${c_('tapa')}"></div><div class="${c_('sello')}">✓</div></div>`;
  const vuelo = foto ? (foto.cloneNode(true) as HTMLImageElement) : null;
  if (vuelo) {
    vuelo.className = c_('vuelo');
    vuelo.removeAttribute('srcset');
    escena.appendChild(vuelo);
  }
  document.body.appendChild(escena);

  const caja = escena.firstElementChild as HTMLElement;
  const tapa = caja.querySelector(`.${c_('tapa')}`) as HTMLElement;
  const sello = caja.querySelector(`.${c_('sello')}`) as HTMLElement;
  const c = centro(origen);
  const anchoCaja = Math.min(origen.width * 0.55, 260);
  caja.style.width = `${anchoCaja}px`;
  caja.style.left = `${c.x - anchoCaja / 2}px`;
  caja.style.top = `${Math.min(origen.bottom - anchoCaja * 0.75, window.innerHeight - anchoCaja)}px`;

  const ritmo = { easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' as const };
  try {
    await caja.animate([{ opacity: 0, transform: 'translateY(30px) scale(.6)' }, { opacity: 1, transform: 'none' }], { ...ritmo, duration: 320 }).finished;

    if (vuelo) {
      const ancho = Math.min(origen.width * 0.8, 420);
      vuelo.style.width = `${ancho}px`;
      vuelo.style.left = `${c.x - ancho / 2}px`;
      vuelo.style.top = `${c.y - ancho * 0.375}px`;
      const cajaR = caja.getBoundingClientRect();
      const dy = cajaR.top + cajaR.height * 0.45 - c.y;
      await vuelo.animate([
        { transform: 'translate(0,0) scale(1) rotate(0deg)', opacity: 1 },
        { transform: `translate(0,${dy * 0.35 - 60}px) scale(.8) rotate(-8deg)`, opacity: 1, offset: 0.45 },
        { transform: `translate(0,${dy}px) scale(.5) rotate(0deg)`, opacity: 0 },
      ], { ...ritmo, duration: 620 }).finished;
    }

    await tapa.animate([{ transform: 'translateY(-140%) rotate(-12deg)' }, { transform: 'translateY(6%)' }, { transform: 'none' }],
      { duration: 380, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'forwards' }).finished;
    await sello.animate([{ opacity: 0, transform: 'scale(2.2) rotate(-25deg)' }, { opacity: 1, transform: 'scale(1) rotate(-12deg)' }],
      { duration: 260, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'forwards' }).finished;

    if (destino) {
      const d = centro(destino.getBoundingClientRect());
      const cajaR = caja.getBoundingClientRect();
      const o = centro(cajaR);
      await caja.animate([
        { transform: 'none', opacity: 1 },
        { transform: `translate(${(d.x - o.x) * 0.5}px, ${(d.y - o.y) * 0.5 - 80}px) scale(.55) rotate(10deg)`, opacity: 1, offset: 0.5 },
        { transform: `translate(${d.x - o.x}px, ${d.y - o.y}px) scale(.12) rotate(20deg)`, opacity: 0.2 },
      ], { ...ritmo, duration: 640 }).finished;
      destino.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }], { duration: 360, easing: 'cubic-bezier(.34,1.56,.64,1)' });
    } else {
      await caja.animate([{ opacity: 1 }, { opacity: 0, transform: 'scale(.8)' }], { ...ritmo, duration: 300 }).finished;
    }
  } finally {
    escena.remove();
  }
}
