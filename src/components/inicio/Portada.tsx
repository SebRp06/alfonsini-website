'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { CATEGORIAS } from '@/datos/catalogo';
import { IconoFlecha } from '../Iconos';
import estilos from './Portada.module.css';

/**
 * Portada: el logotipo es protagonista sobre un escenario vectorial (nítido en cualquier pantalla, ~4 KB).
 * El humo son capas de degradado animadas solo con transform/opacity (GPU): brota al abrir y luego deriva suave.
 * HSS™: se pausa fuera de pantalla, se simplifica en equipos de gama baja y respeta "reducir movimiento".
 */
export function Portada() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => { nodo.dataset.pausado = e?.isIntersecting ? 'no' : 'si'; }, { threshold: 0 });
    io.observe(nodo);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className={estilos.portada} aria-labelledby="portada-titulo">
      <div className={estilos.escenario} aria-hidden="true">
        <svg className={estilos.geometria} viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" focusable="false">
          <defs>
            <linearGradient id="pt-trazo" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffd08a" />
              <stop offset=".5" stopColor="#f2a93b" />
              <stop offset="1" stopColor="#7c5cff" />
            </linearGradient>
            <linearGradient id="pt-ala-i" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#07070b" />
              <stop offset="1" stopColor="#1b1530" />
            </linearGradient>
            <linearGradient id="pt-ala-d" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0" stopColor="#07070b" />
              <stop offset="1" stopColor="#1b1530" />
            </linearGradient>
            <linearGradient id="pt-piso" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7c5cff" stopOpacity=".28" />
              <stop offset="1" stopColor="#0b0b10" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="pt-foco" cx=".5" cy=".5" r=".5">
              <stop offset="0" stopColor="#f2a93b" stopOpacity=".35" />
              <stop offset="1" stopColor="#f2a93b" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Piso con perspectiva hacia el centro */}
          <path d="M0 1000 L560 600 H1040 L1600 1000 Z" fill="url(#pt-piso)" />
          <g stroke="#7c5cff" strokeOpacity=".22" strokeWidth="1.5">
            {[-760, -520, -300, -120, 0, 120, 300, 520, 760].map((dx) => <line key={dx} x1={800 + dx * 0.25} y1="600" x2={800 + dx * 1.3} y2="1000" />)}
            {[650, 720, 810, 920].map((y) => <line key={y} x1={800 - (y - 520) * 1.45} y1={y} x2={800 + (y - 520) * 1.45} y2={y} />)}
          </g>
          <line x1="300" y1="600" x2="1300" y2="600" stroke="url(#pt-trazo)" strokeWidth="2" opacity=".7" />

          {/* Bastidores simétricos con sombreado */}
          <path d="M0 80 L420 250 L420 700 L0 940 Z" fill="url(#pt-ala-i)" />
          <path d="M1600 80 L1180 250 L1180 700 L1600 940 Z" fill="url(#pt-ala-d)" />
          <path d="M420 250 L420 700" stroke="url(#pt-trazo)" strokeWidth="2" opacity=".55" />
          <path d="M1180 250 L1180 700" stroke="url(#pt-trazo)" strokeWidth="2" opacity=".55" />
          <path d="M0 80 L420 250 M1600 80 L1180 250" stroke="#7c5cff" strokeOpacity=".35" strokeWidth="1.5" />

          {/* Foco y geometrías concéntricas */}
          <circle cx="800" cy="470" r="380" fill="url(#pt-foco)" />
          <g className={estilos.rombos} fill="none" stroke="url(#pt-trazo)">
            <rect x="620" y="290" width="360" height="360" transform="rotate(45 800 470)" strokeWidth="2" opacity=".75" />
            <rect x="560" y="230" width="480" height="480" transform="rotate(45 800 470)" strokeWidth="1.5" opacity=".4" strokeDasharray="10 14" />
          </g>
          <g className={estilos.rombosInverso} fill="none" stroke="url(#pt-trazo)">
            <rect x="500" y="170" width="600" height="600" transform="rotate(45 800 470)" strokeWidth="1" opacity=".22" />
            <circle cx="800" cy="470" r="250" strokeWidth="1.5" opacity=".35" strokeDasharray="2 10" strokeLinecap="round" />
          </g>
          <g fill="#f2a93b">
            {[[800, 70], [800, 870], [400, 470], [1200, 470]].map(([x, y]) => <rect key={`${x}-${y}`} x={(x ?? 0) - 7} y={(y ?? 0) - 7} width="14" height="14" transform={`rotate(45 ${x} ${y})`} />)}
          </g>
        </svg>

        <div className={estilos.espectro} />
        <div className={`${estilos.humo} ${estilos.h1}`} />
        <div className={`${estilos.humo} ${estilos.h2}`} />
        <div className={`${estilos.humo} ${estilos.h3}`} />
        <div className={`${estilos.humo} ${estilos.h4}`} />
        <div className={`${estilos.humo} ${estilos.h5}`} />
        <div className={estilos.vineta} />
      </div>

      <div className={estilos.contenido}>
        <p className={estilos.antetitulo}>Hecho en Colombia</p>
        <h1 id="portada-titulo" className={estilos.titulo}>
          <span className={estilos.logo}>Alfonsini</span>
          <span className="visualmente-oculto">: calzado hecho en Colombia</span>
        </h1>
        <p className={estilos.lema}>Zapatos que se fabrican despacio para que camines lejos.</p>
        <div className={estilos.botones}>
          <Link href="/tienda" className="boton boton--grande">
            Ver la colección <IconoFlecha tam={20} />
          </Link>
          <Link href="/guia-de-tallas" className={`boton boton--fantasma boton--grande ${estilos.secundario}`}>
            Encuentra tu talla
          </Link>
        </div>
        <nav aria-label="Colecciones" className={estilos.colecciones}>
          <ul>
            {CATEGORIAS.map((c) => <li key={c.id}><Link href={`/tienda?categoria=${c.id}`}>{c.nombre}</Link></li>)}
          </ul>
        </nav>
      </div>
    </section>
  );
}
