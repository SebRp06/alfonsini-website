import { chromium } from '@playwright/test';
const [, , url, salida, w, h, y, hover] = process.argv;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +w, height: +h }, hasTouch: +w < 600, isMobile: +w < 600 });
await p.goto(url, { waitUntil: 'networkidle' }); await p.evaluate((y) => window.scrollTo(0, y), +y); await p.waitForTimeout(1500);
if (hover) { await p.hover(hover); await p.waitForTimeout(900); }
await p.screenshot({ path: salida }); await b.close();
