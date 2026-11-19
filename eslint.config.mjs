import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

/**
 * Gobernanza AccedIT: sin `any`, sin `!`, accesibilidad (jsx-a11y vía Next) y
 * frontera de dominio: `src/domain` y `src/lib/repositorios/puertos` no importan React ni Next.
 */
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      'jsx-a11y/no-autofocus': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['src/domain/**/*.ts', 'src/lib/repositorios/puertos.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{ group: ['react', 'react-dom', 'next', 'next/*'], message: 'El dominio es agnóstico: sin React ni Next (Doctrina 80/20).' }],
      }],
    },
  },
  { files: ['scripts/**'], rules: { 'no-console': 'off' } },
  globalIgnores(['.next/**', 'out/**', 'vista-previa/**', 'node_modules/**', 'next-env.d.ts', 'test-results/**', 'playwright-report/**']),
]);
