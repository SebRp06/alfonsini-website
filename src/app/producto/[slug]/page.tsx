import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Ficha } from '@/components/producto/Ficha';
import { Estanteria } from '@/components/vitrina/Estanteria';
import { CATEGORIAS, PRODUCTOS } from '@/datos/catalogo';
import { disponible } from '@/domain/tipos';
import { repositorios } from '@/lib/repositorios';
import { absoluta, SITIO } from '@/lib/sitio';

interface Props { readonly params: Promise<{ slug: string }> }

export const dynamicParams = false;
export const generateStaticParams = (): { slug: string }[] => PRODUCTOS.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await repositorios.catalogo.porSlug(slug);
  if (!p) return {};
  const titulo = `${p.nombre} · ${p.color.nombre}`;
  return {
    title: titulo,
    description: `${p.resumen} Compra en línea con envío a toda Colombia y pago contra entrega.`,
    alternates: { canonical: `/producto/${p.slug}` },
    openGraph: { type: 'website', title: titulo, description: p.resumen, url: `/producto/${p.slug}` },
  };
}

export default async function PaginaProducto({ params }: Props) {
  const { slug } = await params;
  const p = await repositorios.catalogo.porSlug(slug);
  if (!p) notFound();
  const categoria = CATEGORIAS.find((c) => c.id === p.categoriaId);
  const relacionados = await repositorios.catalogo.relacionados(p.slug, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: p.nombre,
        sku: p.referencia,
        description: p.resumen,
        color: p.color.nombre,
        image: p.imagenes.map((i) => absoluta(i.src)),
        brand: { '@type': 'Brand', name: SITIO.nombre },
        category: categoria?.nombre,
        offers: {
          '@type': 'Offer',
          url: `${SITIO.url}/producto/${p.slug}`,
          priceCurrency: 'COP',
          price: p.precio,
          availability: disponible(p) ? 'https://schema.org/InStock' : 'https://schema.org/BackOrder',
          itemCondition: 'https://schema.org/NewCondition',
          seller: { '@id': `${SITIO.url}/#organizacion` },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITIO.url },
          { '@type': 'ListItem', position: 2, name: 'Tienda', item: `${SITIO.url}/tienda` },
          { '@type': 'ListItem', position: 3, name: p.nombre, item: `${SITIO.url}/producto/${p.slug}` },
        ],
      },
    ],
  };

  return (
    <div className="contenedor" style={{ paddingBlock: '1.25rem 4rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Ruta de navegación" className="migas">
        <ol>
          <li><Link href="/">Inicio</Link></li>
          <li><Link href="/tienda">Tienda</Link></li>
          {categoria && <li><Link href={`/tienda?categoria=${categoria.id}`}>{categoria.nombre}</Link></li>}
          <li aria-current="page">{p.nombre}</li>
        </ol>
      </nav>
      <Ficha producto={p} nombreCategoria={categoria?.nombre ?? ''} />
      {relacionados.length > 0 && (
        <section aria-labelledby="relacionados" style={{ marginTop: '4rem' }}>
          <h2 id="relacionados">También te pueden gustar</h2>
          <Estanteria productos={relacionados} etiqueta="Productos relacionados" />
        </section>
      )}
    </div>
  );
}
