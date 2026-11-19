// Mide si los controles principales quedan en la primera pantalla del celular (375×812)
import { chromium } from '@playwright/test';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 375, height: 812 } });
await p.goto('http://localhost:3000/producto/aurora'); await p.locator('label', { hasText: /^35/ }).first().click();
await p.locator('[data-accion="agregar-carrito"]').click(); await p.waitForTimeout(3500);
for (const [u, sel] of [['/producto/aurora', '[data-accion="agregar-carrito"], [data-confirmacion-agregado]'], ['/carrito', '[data-accion="iniciar-compra"]'], ['/checkout', 'form[data-formulario="checkout"] button[type="submit"]']]) {
  await p.goto('http://localhost:3000' + u, { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
  const r = await p.locator(sel).first().boundingBox(); console.log(u, r ? Math.round(r.y + r.height) : 'no', '/ 812');
}
await b.close();
