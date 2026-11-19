import { repositoriosMaqueta } from './maqueta';
import type { Repositorios } from './puertos';

/**
 * Punto único de inyección. Para conectar la fuente real:
 * 1. Crear `src/lib/repositorios/<proveedor>.ts` que implemente `Repositorios`.
 * 2. Seleccionarlo aquí con `FUENTE_DATOS` (ver .env.example).
 */
export const repositorios: Repositorios = repositoriosMaqueta;
export type { Repositorios } from './puertos';
