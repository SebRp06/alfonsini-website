// Tarjeta en pantalla baja (arquetipo zoom 200 %: 640×360 a 2x): porcentaje de pantalla cubierto
import { chromium } from '@playwright/test';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 640, height: 360 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
const r = await p.evaluate(() => { const t = document.querySelector('[data-bienvenida-tarjeta]').getBoundingClientRect(); return { alto: Math.round(t.height), cubre: Math.round((t.width * t.height) / (innerWidth * innerHeight) * 100) }; });
console.log(JSON.stringify(r)); await p.screenshot({ path: '/tmp/bienv-baja.png' }); await b.close();
