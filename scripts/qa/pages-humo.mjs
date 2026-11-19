// Prueba de humo de la vista previa estática con subruta: node scripts/qa/pages-humo.mjs <urlBase>
import { chromium } from '@playwright/test';
const base = process.argv[2] ?? 'http://localhost:8091/alfonsini-website';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 375, height: 812 } });
const errores = []; const rotas = [];
p.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
p.on('response', (r) => { if (r.status() >= 400) rotas.push(`${r.status()} ${r.url()}`); });
await p.goto(`${base}/`, { waitUntil: 'networkidle' });
await p.getByRole('link', { name: 'Categoría 1' }).first().click(); await p.waitForURL(/tienda/);
await p.locator('[data-caja] a').first().click(); await p.waitForURL(/producto/);
await p.locator('label:has(input[name="talla"]):not(:has(input[data-agotada]))').first().click();
await p.locator('[data-accion="agregar-carrito"]').click();
await p.locator('[data-confirmacion-agregado]').waitFor({ timeout: 8000 });
await p.locator('[data-accion="finalizar-compra"]').click(); await p.waitForURL(/checkout/);
await p.locator('form[data-formulario="checkout"]').waitFor();
const imgs = await p.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length);
console.log(JSON.stringify({ url: p.url(), imagenesRotas: imgs, errores, rotas: rotas.filter((r) => !r.includes('.txt')) }, null, 1));
await b.close();
