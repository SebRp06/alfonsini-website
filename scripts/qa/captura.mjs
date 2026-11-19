// Utilidad de QA visual: node scripts/captura.mjs <url> <salida.png> [ancho] [alto] [completa=1] [esperaMs]
import { chromium } from '@playwright/test';
const [, , url, salida, ancho = '1440', alto = '900', completa = '1', espera = '3200', tema = 'dark'] = process.argv;
const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: +ancho, height: +alto }, colorScheme: tema, deviceScaleFactor: 1 });
const errores = [];
pagina.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
pagina.on('pageerror', (e) => errores.push(e.message));
await pagina.goto(url, { waitUntil: 'networkidle' });
await pagina.waitForTimeout(+espera);
const desborde = await pagina.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
await pagina.screenshot({ path: salida, fullPage: completa === '1' });
console.log(JSON.stringify({ desborde, errores }));
await navegador.close();
