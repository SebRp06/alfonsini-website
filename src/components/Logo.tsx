import Link from 'next/link';
import estilos from './Logo.module.css';

/** Logotipo: palabra "Alfonsini" en la fuente de marca (Flexing cuando llegue su licencia web). */
export function Logo({ comoEnlace = true }: { readonly comoEnlace?: boolean }) {
  const contenido = (
    <>
      <svg className={estilos.marca} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <rect x="3" y="3" width="42" height="42" rx="12" fill="none" stroke="currentColor" strokeOpacity=".35" strokeWidth="2" />
        <path d="M12 37 L24 10 L36 37" fill="none" stroke="var(--acento)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15.5 29.5 Q24 34 32.5 29.5" fill="none" stroke="var(--acento)" strokeWidth="5" strokeLinecap="round" />
      </svg>
      <span className={estilos.palabra}>Alfonsini</span>
    </>
  );
  return comoEnlace ? (
    <Link href="/" className={estilos.logo} aria-label="Alfonsini, ir al inicio">
      {contenido}
    </Link>
  ) : (
    <span className={estilos.logo}>{contenido}</span>
  );
}
