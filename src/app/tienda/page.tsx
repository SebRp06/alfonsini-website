import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Estanteria } from '@/components/vitrina/Estanteria';
import { VitrinaFiltrable } from '@/components/vitrina/VitrinaFiltrable';
import { PRODUCTOS } from '@/datos/catalogo';
import { SITIO } from '@/lib/sitio';

export const metadata: Metadata = {
  title: 'Tienda',
  description: 'Toda la colección de calzado Alfonsini: busca por talla, color o categoría y compra con pago contra entrega.',
  alternates: { canonical: '/tienda' },
};

const LISTA_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: PRODUCTOS.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITIO.url}/producto/${p.slug}`, name: p.nombre })),
};

export default function PaginaTienda() {
  return (
    <div className="contenedor seccion" style={{ paddingTop: '2rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LISTA_JSONLD) }} />
      <p className="antetitulo">La estantería</p>
      <h1 style={{ fontSize: 'var(--t-3xl)' }}>Toda la colección</h1>
      <p style={{ maxWidth: '52ch', color: 'var(--texto-2)' }}>Cada modelo vive en su caja. Pasa el cursor o desliza para abrirlas y entra al que te guste.</p>
      <h2 className="visualmente-oculto">Modelos de la colección</h2>
      {/* El HTML inicial ya trae todos los productos (indexable); los filtros se activan al hidratar */}
      <Suspense fallback={<Estanteria productos={PRODUCTOS} etiqueta="Colección completa" prioridad={4} />}>
        <VitrinaFiltrable />
      </Suspense>
    </div>
  );
}
