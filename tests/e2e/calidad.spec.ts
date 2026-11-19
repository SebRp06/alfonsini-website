import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const RUTAS = ['/', '/tienda', '/producto/aurora', '/producto/eclipse', '/carrito', '/checkout', '/guia-de-tallas', '/legal/privacidad'] as const;

const sinDesborde = async (page: Page): Promise<number> => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

for (const ruta of RUTAS) {
  test.describe(`${ruta}`, () => {
    test(`@a11y sin violaciones WCAG 2.2 AA (tema oscuro y claro)`, async ({ page }) => {
      for (const tema of ['dark', 'light'] as const) {
        await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
        await page.goto(ruta);
        await page.waitForLoadState('networkidle');
        // @axe-core/playwright trae su propio playwright-core: mismo objeto, otra versión de tipos
        const r = await new AxeBuilder({ page: page as unknown as ConstructorParameters<typeof AxeBuilder>[0]['page'] }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
        expect(r.violations.map((v) => `${tema} · ${v.id}: ${v.nodes.length} nodo(s) · ${v.nodes[0]?.target.join(' ')}`)).toEqual([]);
      }
    });

    test('@a11y cero desborde horizontal al 100 % y al 125 % / 150 % de letra', async ({ page }) => {
      await page.goto(ruta);
      expect(await sinDesborde(page)).toBeLessThanOrEqual(0);
      for (const escala of ['1.25', '1.5']) {
        await page.evaluate((e) => document.documentElement.style.setProperty('--escala-texto', e), escala);
        await page.waitForTimeout(150);
        expect(await sinDesborde(page), `desborde con letra al ${Number(escala) * 100} %`).toBeLessThanOrEqual(0);
      }
    });

    test('@a11y objetivos táctiles de al menos 44 px', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(ruta);
      const pequenos = await page.evaluate(() => Array.from(document.querySelectorAll<HTMLElement>('a[href], button, input:not([type=hidden]), select, summary, [role=button]'))
        .filter((n) => {
          const r = n.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) return false;
          const s = getComputedStyle(n);
          if (s.visibility === 'hidden' || n.closest('dialog:not([open])')) return false;
          // Entradas ocultas sobre su etiqueta: cuenta la etiqueta (que sí mide 44 px)
          const caja = n.matches('input[type=radio], input[type=checkbox]') && s.opacity === '0' ? n.parentElement?.getBoundingClientRect() ?? r : r;
          // Enlaces dentro de un párrafo (WCAG 2.5.8 los exceptúa)
          if (n.tagName === 'A' && getComputedStyle(n).display === 'inline') return false;
          return caja.height < 43.5 || caja.width < 23.5;
        })
        .map((n) => `${n.tagName.toLowerCase()} "${(n.textContent ?? n.getAttribute('aria-label') ?? '').trim().slice(0, 30)}"`));
      expect(pequenos).toEqual([]);
    });
  });
}

test('SEO: título, descripción, canónica y datos estructurados de producto', async ({ page }) => {
  await page.goto('/producto/aurora');
  await expect(page).toHaveTitle(/Aurora/);
  expect(await page.locator('meta[name=description]').getAttribute('content')).toBeTruthy();
  expect(await page.locator('link[rel=canonical]').getAttribute('href')).toContain('/producto/aurora');
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(ld.some((t) => t.includes('"@type":"Product"') && t.includes('"priceCurrency":"COP"'))).toBe(true);
  expect(await page.locator('h1').count()).toBe(1);
});
