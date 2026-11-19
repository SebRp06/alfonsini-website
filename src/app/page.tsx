import Link from 'next/link';
import { IconoBillete, IconoCambio, IconoCamion, IconoFlecha, IconoHilo } from '@/components/Iconos';
import { Portada } from '@/components/inicio/Portada';
import { TallaRapida } from '@/components/inicio/TallaRapida';
import { Estanteria } from '@/components/vitrina/Estanteria';
import { CATEGORIAS, PRODUCTOS } from '@/datos/catalogo';
import { cop, ENVIO } from '@/domain/dinero';
import estilos from './inicio.module.css';

const BENEFICIOS = [
  { icono: IconoCamion, titulo: 'Envío a toda Colombia', texto: `Gratis desde ${cop(ENVIO.umbralGratis)}` },
  { icono: IconoBillete, titulo: 'Paga al recibir', texto: 'Contra entrega o Bre-B' },
  { icono: IconoCambio, titulo: 'Cambio de talla', texto: 'Gratis durante 30 días' },
  { icono: IconoHilo, titulo: 'Hecho en Colombia', texto: 'Fabricación propia' },
] as const;

const OFICIO = [
  { n: '01', titulo: 'Diseño y horma', texto: 'Cada modelo nace sobre una horma pensada para el pie colombiano.' },
  { n: '02', titulo: 'Corte del cuero', texto: 'Se elige la mejor parte de la piel para que el zapato envejezca bonito.' },
  { n: '03', titulo: 'Costura y armado', texto: 'Manos expertas unen capellada, forro y suela punto por punto.' },
  { n: '04', titulo: 'Acabado y caja', texto: 'Se pule, se revisa y se empaca en su caja, lista para ti.' },
] as const;

export default function Inicio() {
  const destacados = [...PRODUCTOS].sort((a, b) => Number(b.destacado) - Number(a.destacado)).slice(0, 8);
  return (
    <>
      <Portada />

      <section aria-label="Beneficios" className={estilos.beneficios}>
        <ul className={`contenedor ${estilos.listaBeneficios}`}>
          {BENEFICIOS.map(({ icono: Icono, titulo, texto }) => (
            <li key={titulo}>
              <span className={estilos.iconoBeneficio}><Icono /></span>
              <span><strong>{titulo}</strong><small>{texto}</small></span>
            </li>
          ))}
        </ul>
      </section>

      <section className="seccion" aria-labelledby="destacados">
        <div className="contenedor">
          <div className={estilos.cabezaSeccion}>
            <div>
              <p className="antetitulo">Recién salidos de la caja</p>
              <h2 id="destacados">Abre una caja y descubre tu próximo par</h2>
            </div>
            <Link href="/tienda" className="boton boton--fantasma">Ver todo <IconoFlecha tam={18} /></Link>
          </div>
          <Estanteria productos={destacados} etiqueta="Modelos destacados" />
        </div>
      </section>

      <section className={`seccion ${estilos.franjaOscura}`} aria-labelledby="categorias">
        <div className="contenedor">
          <p className="antetitulo">Colecciones</p>
          <h2 id="categorias">Encuentra tu estilo</h2>
          <ul className={estilos.categorias}>
            {CATEGORIAS.map((c, i) => (
              <li key={c.id} style={{ ['--i' as string]: i }}>
                <Link href={`/tienda?categoria=${c.id}`} className={estilos.categoria}>
                  <span className={estilos.categoriaGeo} aria-hidden="true" />
                  <span className={estilos.categoriaNombre}>{c.nombre}</span>
                  <span className={estilos.categoriaTexto}>{c.descripcion}</span>
                  <span className={estilos.categoriaIr} aria-hidden="true"><IconoFlecha tam={18} /></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="seccion" aria-labelledby="oficio">
        <div className="contenedor">
          <p className="antetitulo">El oficio</p>
          <h2 id="oficio">De nuestras manos a tus pasos</h2>
          <p className={estilos.introOficio}>Texto de muestra: aquí va la historia de Alfonsini, el taller, los años de oficio y la gente que hace cada par.</p>
          <ol className={estilos.oficio}>
            {OFICIO.map((o) => (
              <li key={o.n}>
                <span className={estilos.numeroOficio} aria-hidden="true">{o.n}</span>
                <h3>{o.titulo}</h3>
                <p>{o.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`seccion ${estilos.talla}`} aria-labelledby="talla-rapida">
        <div className={`contenedor ${estilos.tallaRejilla}`}>
          <div>
            <p className="antetitulo">Sin adivinar</p>
            <h2 id="talla-rapida">Tu talla exacta en 10 segundos</h2>
            <p>Mide tu pie con una regla y te mostramos solo los modelos que tenemos en tu talla.</p>
            <Link href="/guia-de-tallas">Ver la tabla completa de tallas</Link>
          </div>
          <TallaRapida />
        </div>
      </section>
    </>
  );
}
