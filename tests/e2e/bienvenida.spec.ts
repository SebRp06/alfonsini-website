import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/** Primera visita: tarjeta "¿Ves bien la tienda?" (HCQE™). Parte sin almacenamiento previo. */
test.use({ storageState: { cookies: [], origins: [] }, reducedMotion: 'reduce' });

const tarjeta = (page: import('@playwright/test').Page) => page.getByRole('region', { name: '¿Ves bien la tienda?' });

test('aparece en la primera visita, va primero en el orden de foco y no tapa la portada', async ({ page }) => {
  await page.goto('/');
  await expect(tarjeta(page)).toBeVisible();
  // Saltar al contenido → primer control de la tarjeta
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(tarjeta(page).getByRole('radio').first()).toBeFocused();
  const caja = await tarjeta(page).boundingBox();
  const cta = await page.getByRole('link', { name: /Ver la colección/ }).boundingBox();
  expect(caja && cta && cta.y + cta.height <= caja.y).toBe(true);
});

test('cambia letra y tema al instante y "Listo" la cierra sin volver a aparecer', async ({ page }) => {
  await page.goto('/');
  await tarjeta(page).locator('label', { hasText: 'Letra al 125 %' }).click();
  await expect(page.locator('html')).toHaveAttribute('style', /--escala-texto: 1.25/);
  await tarjeta(page).locator('label', { hasText: 'Tema claro' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-tema', 'claro');
  await tarjeta(page).getByRole('button', { name: 'Listo, a comprar' }).click();
  await expect(tarjeta(page)).toBeHidden();
  await expect(page.getByRole('button', { name: /Ver a mi manera/ })).toBeFocused();
  await page.reload();
  await expect(tarjeta(page)).toBeHidden();
  await expect(page.locator('html')).toHaveAttribute('data-tema', 'claro');
});

test('se cierra con Esc y al navegar', async ({ page }) => {
  await page.goto('/');
  await expect(tarjeta(page)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(tarjeta(page)).toBeHidden();

  await page.context().clearCookies();
  await page.evaluate(() => localStorage.clear());
  await page.goto('/');
  await expect(tarjeta(page)).toBeVisible();
  await page.getByRole('link', { name: 'Categoría 1' }).first().click();
  await expect(page).toHaveURL(/categoria-1/);
  await expect(tarjeta(page)).toBeHidden();
});

test('@a11y la tarjeta cumple WCAG 2.2 AA en ambos temas', async ({ page }) => {
  for (const tema of ['dark', 'light'] as const) {
    await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
    await page.evaluate(() => { try { localStorage.clear(); } catch { /* primera carga */ } }).catch(() => undefined);
    await page.goto('/');
    await expect(tarjeta(page)).toBeVisible();
    const r = await new AxeBuilder({ page: page as unknown as ConstructorParameters<typeof AxeBuilder>[0]['page'] })
      .include('[data-bienvenida-tarjeta]').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(r.violations.map((v) => `${tema} · ${v.id}`)).toEqual([]);
  }
});

test('en pantallas bajas (zoom 200 %) se reduce a una línea y abre el panel completo', async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 360 });
  await page.goto('/');
  const caja = await tarjeta(page).boundingBox();
  expect(caja && caja.height * caja.width <= 640 * 360 * 0.3).toBe(true);
  await tarjeta(page).getByRole('button', { name: 'Ajustar letra y tema' }).click();
  await expect(page.getByRole('dialog', { name: 'Ver a mi manera' })).toBeVisible();
  await expect(tarjeta(page)).toBeHidden();
});
