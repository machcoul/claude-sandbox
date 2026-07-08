import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import globals from 'globals'

export default [
  // Fichiers/dossiers à ne pas linter
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },

  // Règles JS de base recommandées
  js.configs.recommended,

  // Config officielle Vue 3 (flat/recommended)
  ...pluginVue.configs['flat/recommended'],

  // Globals selon le contexte d'exécution
  {
    files: ['**/*.{js,mjs,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
  },

  // Fichiers Node (config, scripts) : globals Node
  {
    files: ['*.config.js', 'playwright.config.js', 'vite.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Tests Vitest : globals de test + Node
  {
    files: ['**/*.{test,spec}.js', 'tests/**', 'e2e/**'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.vitest,
      },
    },
  },

  // Règles projet spécifiques aux composants Vue
  {
    files: ['**/*.vue'],
    rules: {
      // Interdit v-html (risque XSS) : erreur, pas simple avertissement
      'vue/no-v-html': 'error',
    },
  },

  // Désactive les règles ESLint qui entrent en conflit avec Prettier
  // (doit rester en dernier)
  skipFormatting,
]
