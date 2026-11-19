import { chromium } from '@playwright/test';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 375, height: 812 } });
await p.goto('http://localhost:3000/producto/aurora'); await p.locator('label', { hasText: /^35/ }).first().click();
await p.locator('[data-accion="agregar-carrito"]').click(); await p.waitForTimeout(3500);
await p.goto('http://localhost:3000/checkout', { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
await p.screenshot({ path: '/tmp/co-movil.png', fullPage: true }); await b.close();
