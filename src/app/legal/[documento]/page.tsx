import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

/** Documentos legales y de ayuda. TEXTO DE MUESTRA: lo redacta @LEGAL con los datos reales del cliente. */
const DOCUMENTOS = {
  terminos: { titulo: 'Términos y condiciones', resumen: 'Condiciones de uso de la tienda en línea de Alfonsini.' },
  privacidad: { titulo: 'Política de tratamiento de datos personales', resumen: 'Cómo tratamos tus datos según la Ley 1581 de 2012 y el Decreto 1377 de 2013.' },
  envios: { titulo: 'Envíos y tiempos de entrega', resumen: 'Cobertura, costos y tiempos de entrega en Colombia.' },
  'cambios-y-devoluciones': { titulo: 'Cambios y devoluciones', resumen: 'Cómo cambiar la talla o devolver un producto, y el derecho de retracto.' },
  garantia: { titulo: 'Garantía', resumen: 'Garantía legal de calidad según el Estatuto del Consumidor (Ley 1480 de 2011).' },
  pqrs: { titulo: 'Peticiones, quejas, reclamos y sugerencias', resumen: 'Canal para radicar tu PQRS y tiempos de respuesta.' },
} as const;

type Documento = keyof typeof DOCUMENTOS;
interface Props { readonly params: Promise<{ documento: string }> }

export const dynamicParams = false;
export const generateStaticParams = (): { documento: string }[] => Object.keys(DOCUMENTOS).map((documento) => ({ documento }));

const buscar = (d: string): (typeof DOCUMENTOS)[Documento] | null => (d in DOCUMENTOS ? DOCUMENTOS[d as Documento] : null);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doc = buscar((await params).documento);
  return doc ? { title: doc.titulo, description: doc.resumen, alternates: { canonical: `/legal/${(await params).documento}` } } : {};
}

export default async function PaginaLegal({ params }: Props) {
  const doc = buscar((await params).documento);
  if (!doc) notFound();
  return (
    <article className="contenedor seccion texto-legal" style={{ paddingTop: '2rem' }}>
      <p className="antetitulo">Información</p>
      <h1 style={{ fontSize: 'var(--t-3xl)' }}>{doc.titulo}</h1>
      <p><strong>{doc.resumen}</strong></p>
      <p>Este es un texto de muestra para la maqueta. El documento definitivo lo prepara el equipo legal con los datos de Alfonsini (razón social, NIT, domicilio y canales de atención) antes de publicar el sitio.</p>
      <h2>Contenido previsto</h2>
      <ul>
        <li>Responsable y datos de contacto.</li>
        <li>Alcance, condiciones y plazos.</li>
        <li>Derechos de quien compra y cómo ejercerlos.</li>
        <li>Vigencia y fecha de la última actualización.</li>
      </ul>
    </article>
  );
}
