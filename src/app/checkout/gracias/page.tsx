import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Gracias } from '@/components/compra/Gracias';
import { Isotipo } from '@/components/Isotipo';

export const metadata: Metadata = { title: '¡Gracias por tu compra!', robots: { index: false, follow: false } };

export default function PaginaGracias() {
  return (
    <div className="contenedor" style={{ paddingBlock: '2rem 4rem' }}>
      <Suspense fallback={<div style={{ display: 'grid', placeItems: 'center', minHeight: '50vh' }}><Isotipo etiqueta="Confirmando" /></div>}>
        <Gracias />
      </Suspense>
    </div>
  );
}
