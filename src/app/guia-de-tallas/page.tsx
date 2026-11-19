import type { Metadata } from 'next';
import { TallaRapida } from '@/components/inicio/TallaRapida';
import { TABLA_TALLAS } from '@/domain/tallas';

export const metadata: Metadata = {
  title: 'Guía de tallas',
  description: 'Tabla de tallas de calzado Alfonsini: equivalencias Colombia, Europa, Estados Unidos y centímetros, y cómo medir tu pie en casa.',
  alternates: { canonical: '/guia-de-tallas' },
};

export default function GuiaTallas() {
  return (
    <div className="contenedor seccion" style={{ paddingTop: '2rem', maxWidth: '52rem' }}>
      <p className="antetitulo">Sin adivinar</p>
      <h1 style={{ fontSize: 'var(--t-3xl)' }}>Guía de tallas</h1>
      <p style={{ color: 'var(--texto-2)' }}>Tabla referencial de muestra: se reemplaza con la horma real de Alfonsini.</p>
      <h2>Cómo medir tu pie</h2>
      <ol>
        <li>Pon una hoja en el piso, contra la pared.</li>
        <li>Párate con el talón tocando la pared y marca la punta del dedo más largo.</li>
        <li>Mide en centímetros y escribe la medida aquí abajo.</li>
      </ol>
      <div style={{ margin: '1.5rem 0 2.5rem' }}><TallaRapida /></div>
      <h2>Tabla de equivalencias</h2>
      <div className="tabla-desplazable" role="region" aria-label="Tabla de tallas" tabIndex={0}>
        <table className="tabla">
          <caption className="visualmente-oculto">Equivalencias de talla de calzado</caption>
          <thead><tr><th scope="col">Colombia</th><th scope="col">Europa</th><th scope="col">EE. UU.</th><th scope="col">Largo del pie (cm)</th></tr></thead>
          <tbody>
            {TABLA_TALLAS.map((t) => (
              <tr key={t.co}><th scope="row">{t.co}</th><td>{t.eu}</td><td>{t.us}</td><td>{t.cm.toLocaleString('es-CO', { minimumFractionDigits: 1 })}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
