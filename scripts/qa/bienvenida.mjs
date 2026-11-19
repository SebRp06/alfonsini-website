// Mide la tarjeta de bienvenida y qué controles de la primera pantalla tapa (375 y 1440, letra 100 % y 150 %)
import { chromium } from '@playwright/test';
const b = await chromium.launch();
for (const [w, h] of [[375, 812], [1440, 900]]) {
  for (const escala of ['1', '1.5']) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.addInitScript((e) => { try { localStorage.setItem('alfonsini:preferencias:v1', JSON.stringify({ tema: 'sistema', escala: Number(e) })); } catch {} }, escala);
    await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1400);
    const r = await p.evaluate(() => {
      const t = document.querySelector('[data-bienvenida-tarjeta]').getBoundingClientRect();
      const tapados = [...document.querySelectorAll('main a, main button')].filter((n) => { const c = n.getBoundingClientRect(); return c.height > 0 && c.bottom > t.top && c.top < t.bottom && c.top < innerHeight; }).map((n) => n.textContent.trim().slice(0, 25));
      return { alto: Math.round(t.height), top: Math.round(t.top), tapados, desborde: document.documentElement.scrollWidth - innerWidth };
    });
    console.log(w, escala, JSON.stringify(r));
    if (escala === '1') await p.screenshot({ path: `/tmp/bienv-${w}.png` });
    await p.close();
  }
}
await b.close();
