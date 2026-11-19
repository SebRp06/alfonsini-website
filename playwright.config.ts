import { defineConfig, devices } from '@playwright/test';

/**
 * Compuerta de calidad AccedIT del sitio (HCQE™ / UFF™ / HSS™ / GWT™).
 * Corre contra el build de producción (`next start`), nunca contra `next dev`.
 */
const PUERTO = Number(process.env.PUERTO ?? 3000);

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL: `http://localhost:${PUERTO}`, trace: 'retain-on-failure', locale: 'es-CO', timezoneId: 'America/Bogota' },
  projects: [
    { name: 'movil-375', use: { ...devices['iPhone 13'], viewport: { width: 375, height: 812 }, browserName: 'chromium' } },
    { name: 'escritorio', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  ],
  webServer: { command: `npx next start -p ${PUERTO}`, url: `http://localhost:${PUERTO}`, reuseExistingServer: !process.env.CI, timeout: 60_000 },
});
