import { chromium } from '@playwright/test';
const b = await chromium.launch(); const c = await b.newContext({ viewport: { width: 640, height: 360 }, deviceScaleFactor: 2, reducedMotion: 'reduce' }); const p = await c.newPage();
await p.addInitScript(() => { window.__cls = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__cls.push({ v: e.value, src: e.sources.map((s) => (s.node?.outerHTML || '').slice(0, 120) + ' ' + JSON.stringify(s.previousRect) + '→' + JSON.stringify(s.currentRect)) }); }).observe({ type: 'layout-shift', buffered: true }); });
for (const u of ['/', '/tienda']) { await p.goto('http://localhost:3000' + u, { waitUntil: 'networkidle' }); await p.waitForTimeout(2500); console.log(u, JSON.stringify(await p.evaluate(() => window.__cls), null, 1).slice(0, 2500)); }
await b.close();
