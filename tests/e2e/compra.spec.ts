import { expect, test } from '@playwright/test';

/** Recorrido UFF™ de punta a punta: vitrina → producto → empacar → carrito → checkout GWT™ → gracias. */
test.use({ reducedMotion: 'reduce' });

test('compra completa con teclado, autocompletado declarado y botón Atrás entre pasos', async ({ page }) => {
  await page.goto('/tienda');
  await page.getByRole('link', { name: /^Aurora/ }).first().click();
  await expect(page.getByRole('heading', { level: 1, name: 'Aurora' })).toBeVisible();

  // Sin talla: aviso amable, sin agregar
  await page.getByRole('button', { name: /Empacar en mi caja/ }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Elige tu talla' })).toBeVisible();

  await page.locator('label', { hasText: /^35/ }).first().click();
  await page.getByRole('button', { name: /Empacar talla 35/ }).click();
  await expect(page.getByText('quedó empacado')).toBeVisible();
  await expect(page.getByRole('link', { name: /Carrito, 1 producto/ })).toBeVisible();

  await page.getByRole('link', { name: 'Finalizar compra' }).first().click();
  await expect(page).toHaveURL(/\/checkout/);

  // Paso 1: errores amables y enfocados
  await page.getByRole('button', { name: /Ir al envío/ }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Faltan' })).toBeFocused();
  await expect(page.getByLabel('Nombres')).toHaveAttribute('autocomplete', 'given-name');
  await expect(page.getByLabel('Correo electrónico')).toHaveAttribute('autocomplete', 'email');
  await page.getByLabel('Nombres').fill('Ana María');
  await page.getByLabel('Apellidos').fill('Pérez');
  await page.getByLabel('Correo electrónico').fill('ana@example.com');
  await page.getByLabel('Celular').fill('310 555 0101');
  await page.getByLabel('Cédula').fill('1023456789');
  await page.getByRole('button', { name: /Ir al envío/ }).click();
  await expect(page).toHaveURL(/paso=envio/);
  await expect(page.getByRole('heading', { level: 2, name: 'Envío' })).toBeFocused();

  // Botón Atrás del navegador vuelve al paso anterior con los datos intactos
  await page.goBack();
  await expect(page.getByLabel('Nombres')).toHaveValue('Ana María');
  await page.goForward();

  await expect(page.getByLabel('Dirección')).toHaveAttribute('autocomplete', 'address-line1');
  await page.getByLabel('Departamento').selectOption('Bogotá D.C.');
  await page.getByLabel('Ciudad o municipio').fill('Bogotá');
  await page.getByLabel('Dirección').fill('Calle 12 # 34-56');
  await page.getByRole('button', { name: /Ir al pago/ }).click();
  await expect(page).toHaveURL(/paso=pago/);

  // Consentimiento sin premarcar (Ley 1581)
  await expect(page.getByRole('checkbox')).not.toBeChecked();
  await page.locator('label', { hasText: 'Transferencia Bre-B' }).click();
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: /Confirmar pedido/ }).click();

  await expect(page).toHaveURL(/\/checkout\/gracias\?pedido=ALF-/, { timeout: 15_000 });
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Gracias, Ana');
  await expect(page.getByRole('link', { name: /Carrito, vacío/ })).toBeVisible();
});

test('agotado: la acción sigue viva y lleva a la lista de espera', async ({ page }) => {
  await page.goto('/producto/eclipse');
  await expect(page.getByText('¡Este modelo voló!')).toBeVisible();
  await page.getByLabel('Tu correo').fill('correo-malo');
  await page.getByRole('button', { name: /Apartar mi turno/ }).click();
  await expect(page.getByText(/Escribe un correo como/)).toBeVisible();
  await page.getByLabel('Tu correo').fill('ana@example.com');
  await page.getByRole('button', { name: /Apartar mi turno/ }).click();
  await expect(page.getByText(/Eres el turno/)).toBeVisible();
});

test('tamaño de letra y tema cambian al instante, sin recargar', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Ver a mi manera/ }).click();
  await page.getByRole('dialog').locator('label', { hasText: '125 %' }).click();
  await expect(page.locator('html')).toHaveAttribute('style', /--escala-texto: 1.25/);
  await page.getByRole('dialog').locator('label', { hasText: 'Claro' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-tema', 'claro');
  await page.keyboard.press('Escape');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-tema', 'claro');
});

test('filtros en la URL y Atrás regresa a la página previa', async ({ page }) => {
  await page.goto('/');
  await page.goto('/tienda');
  await page.locator('label', { hasText: 'Categoría 2' }).first().click();
  await expect(page).toHaveURL(/categoria=categoria-2/);
  await expect(page.getByRole('status').filter({ hasText: 'en Categoría 2' })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
});
