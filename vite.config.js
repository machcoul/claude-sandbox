/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // Configuration Vitest (tests unitaires + composants)
  test: {
    // Environnement DOM pour monter les composants Vue
    environment: 'jsdom',
    // Expose describe/it/expect/vi sans import explicite
    globals: true,
    // Ne ramasse que les tests unitaires/composants, jamais l'E2E Playwright
    include: ['src/**/*.{test,spec}.js', 'tests/unit/**/*.{test,spec}.js'],
    exclude: ['node_modules/**', 'e2e/**', 'dist/**'],
    // Couverture (npm run test:coverage) : provider v8.
    // lcov -> coverage/lcov.info consommé par Codecov ; text/html pour le local.
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{js,vue}'],
    },
  },
})
