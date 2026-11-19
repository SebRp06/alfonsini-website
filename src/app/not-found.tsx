import Link from 'next/link';

export default function NoEncontrado() {
  return (
    <div className="contenedor seccion" style={{ textAlign: 'center', display: 'grid', justifyItems: 'center', gap: '0.75rem' }}>
      <p className="antetitulo">Error 404</p>
      <h1 style={{ fontSize: 'var(--t-3xl)' }}>Esta caja está vacía</h1>
      <p style={{ color: 'var(--texto-2)', maxWidth: '40ch' }}>La página que buscas no existe o cambió de lugar. Te llevamos de vuelta a la estantería.</p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/tienda" className="boton boton--grande">Ir a la tienda</Link>
        <Link href="/" className="boton boton--fantasma boton--grande">Inicio</Link>
      </div>
    </div>
  );
}
