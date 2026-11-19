'use client';
import { useRouter } from 'next/navigation';
import { MedidorPie } from '../producto/MedidorPie';

/** En la portada, el medidor lleva directo a la vitrina filtrada por la talla sugerida (menos pasos: UFF™). */
export function TallaRapida() {
  const router = useRouter();
  return <MedidorPie alElegir={(t) => router.push(`/tienda?talla=${t}&disponibles=1`)} />;
}
