import type { Metadata } from 'next';
import { Carrito } from '@/components/compra/Carrito';

export const metadata: Metadata = { title: 'Carrito', robots: { index: false, follow: true }, alternates: { canonical: '/carrito' } };

export default function PaginaCarrito() {
  return <div className="contenedor" style={{ paddingBlock: '2rem 4rem' }}><Carrito /></div>;
}
