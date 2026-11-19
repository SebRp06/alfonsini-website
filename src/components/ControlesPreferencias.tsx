'use client';
import { useAlmacen, useHidratado } from '@/estado/almacen';
import { cambiarPreferencias, ESCALAS, preferencias, type Escala, type Tema } from '@/estado/preferencias';
import { IconoLuna, IconoSol } from './Iconos';
import estilos from './PanelAccesibilidad.module.css';

const ETIQUETA_ESCALA: Record<Escala, string> = { 1: '100 %', 1.125: '112 %', 1.25: '125 %', 1.5: '150 %' };
const TEMAS: readonly { valor: Tema; texto: string; icono?: 'sol' | 'luna' }[] = [
  { valor: 'sistema', texto: 'Como mi dispositivo' },
  { valor: 'claro', texto: 'Claro', icono: 'sol' },
  { valor: 'oscuro', texto: 'Oscuro', icono: 'luna' },
];

/**
 * Controles de tamaño de letra y tema. Se aplican al instante, sin recargar, y se recuerdan en el dispositivo.
 * - `grupo` diferencia los nombres de los radios cuando hay dos instancias en la página (panel y bienvenida).
 * - `compacto`: una sola fila de botones de 44 px (bienvenida en celular); los nombres completos siguen
 *   disponibles para el lector de pantalla.
 */
export function ControlesPreferencias({ grupo, compacto = false }: { readonly grupo: string; readonly compacto?: boolean }) {
  const p = useAlmacen(preferencias);
  const hidratado = useHidratado();
  // En la versión compacta no está "Como mi dispositivo": se marca el tema que se está viendo ahora
  const temaVisto = hidratado ? document.documentElement.dataset.tema : undefined;
  const temas = compacto ? TEMAS.filter((t) => t.valor !== 'sistema') : TEMAS;
  const leyenda = compacto ? 'visualmente-oculto' : undefined;

  return (
    <div className={compacto ? estilos.filaCompacta : undefined}>
      <fieldset className={estilos.grupo}>
        <legend className={leyenda}>Tamaño de letra</legend>
        <div className={estilos.opciones}>
          {ESCALAS.map((e) => (
            <label key={e} className={`${estilos.opcion} ${compacto ? estilos.opcionCompacta : ''}`}>
              <input type="radio" name={`${grupo}-escala`} value={e} checked={p.escala === e} onChange={() => cambiarPreferencias({ escala: e })} />
              <span style={{ fontSize: `${0.85 + (e - 1) * 1.4}rem` }} aria-hidden="true">A</span>
              <span className={compacto ? 'visualmente-oculto' : estilos.valor}>{compacto ? `Letra al ${ETIQUETA_ESCALA[e]}` : ETIQUETA_ESCALA[e]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={estilos.grupo}>
        <legend className={leyenda}>Tema</legend>
        <div className={estilos.opciones}>
          {temas.map((t) => (
            <label key={t.valor} className={`${estilos.opcion} ${compacto ? estilos.opcionCompacta : estilos.opcionTexto}`}>
              <input type="radio" name={`${grupo}-tema`} value={t.valor}
                checked={compacto && p.tema === 'sistema' ? temaVisto === t.valor : p.tema === t.valor}
                onChange={() => cambiarPreferencias({ tema: t.valor })} />
              <span className={estilos.textoTema}>
                {t.icono === 'sol' && <IconoSol tam={18} />}
                {t.icono === 'luna' && <IconoLuna tam={18} />}
                <span className={compacto ? 'visualmente-oculto' : undefined}>{compacto ? `Tema ${t.texto.toLowerCase()}` : t.texto}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
