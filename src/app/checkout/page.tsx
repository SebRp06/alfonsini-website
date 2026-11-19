import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Checkout } from '@/components/compra/Checkout';
import { Isotipo } from '@/components/Isotipo';

export const metadata: Metadata = { title: 'Finalizar compra', robots: { index: false, follow: false } };

export default function PaginaCheckout() {
  return (
    <div className="contenedor" style={{ paddingBlock: '2rem 4rem' }}>
      <Suspense fallback={<div style={{ display: 'grid', placeItems: 'center', minHeight: '50vh' }}><Isotipo etiqueta="Preparando tu compra" /></div>}>
        <Checkout />
      </Suspense>
    </div>
  );
}
