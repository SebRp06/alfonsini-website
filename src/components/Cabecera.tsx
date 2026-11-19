'use client';
import { useAlmacen } from '@/estado/almacen';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { carrito, unidadesEnCarrito } from '@/estado/carrito';
import { IconoAccesibilidad, IconoBolsa, IconoBuscar, IconoCerrar, IconoMenu } from './Iconos';
import { Logo } from './Logo';
import { PanelAccesibilidad } from './PanelAccesibilidad';
import estilos from './Cabecera.module.css';

const ENLACES = [
  { href: '/tienda', texto: 'Tienda' },
  { href: '/tienda?categoria=categoria-1', texto: 'Categoría 1' },
  { href: '/tienda?categoria=categoria-2', texto: 'Categoría 2' },
  { href: '/guia-de-tallas', texto: 'Guía de tallas' },
] as const;

export function Cabecera() {
  const lineas = useAlmacen(carrito);
  const unidades = unidadesEnCarrito(lineas);
  const ruta = usePathname();
  const menu = useRef<HTMLDialogElement>(null);
  const a11y = useRef<HTMLDialogElement>(null);

  // Cerrar el menú al navegar (el botón "Atrás" también lo cierra)
  useEffect(() => {
    if (menu.current?.open) menu.current.close();
  }, [ruta]);

  const etiquetaCarrito = unidades === 0 ? 'Carrito, vacío' : `Carrito, ${unidades} ${unidades === 1 ? 'producto' : 'productos'}`;

  return (
    <header className={estilos.cabecera}>
      <div className={`contenedor ${estilos.fila}`}>
        <button type="button" className={`icono-boton ${estilos.soloMovil}`} aria-label="Abrir menú" aria-haspopup="dialog"
          onClick={() => menu.current?.showModal()}>
          <IconoMenu />
        </button>

        <Logo />

        <nav aria-label="Principal" className={estilos.nav}>
          <ul>
            {ENLACES.map((e) => (
              <li key={e.href}>
                <Link href={e.href} aria-current={ruta === e.href ? 'page' : undefined}>{e.texto}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={estilos.acciones}>
          <Link href="/tienda#buscar" className={`icono-boton ${estilos.soloEscritorio}`} aria-label="Buscar en la tienda">
            <IconoBuscar />
          </Link>
          <button type="button" className={`icono-boton ${estilos.botonA11y}`} aria-haspopup="dialog" data-boton-a11y=""
            onClick={() => a11y.current?.showModal()}>
            <IconoAccesibilidad />
            <span className={estilos.etiquetaA11y}>Ver a mi manera</span>
            <span className="visualmente-oculto">: tamaño de letra y tema</span>
          </button>
          <Link href="/carrito" className={`icono-boton ${estilos.carrito}`} aria-label={etiquetaCarrito} data-destino-carrito="">
            <IconoBolsa />
            {unidades > 0 && <span className={estilos.contador} aria-hidden="true" key={unidades}>{unidades}</span>}
          </Link>
        </div>
      </div>

      <dialog ref={menu} className={estilos.menuMovil} aria-label="Menú" onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }}>
        <div className={estilos.menuInterior}>
          <div className={estilos.menuCabeza}>
            <Logo />
            <button type="button" className="icono-boton" aria-label="Cerrar menú" onClick={() => menu.current?.close()}>
              <IconoCerrar />
            </button>
          </div>
          <nav aria-label="Menú móvil">
            <ul>
              {[...ENLACES, { href: '/tienda?categoria=categoria-3', texto: 'Categoría 3' }, { href: '/tienda?categoria=categoria-4', texto: 'Categoría 4' }, { href: '/carrito', texto: 'Mi carrito' }].map((e) => (
                <li key={e.href}><Link href={e.href} onClick={() => menu.current?.close()}>{e.texto}</Link></li>
              ))}
            </ul>
          </nav>
        </div>
      </dialog>

      <PanelAccesibilidad referencia={a11y} />
    </header>
  );
}
