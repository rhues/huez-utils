// ESLint 9 flat config; replaces .eslintrc.json (which ESLint 9 no longer reads)
// with the same rules, so `npm run lint` and the release gate work again.
import js from '@eslint/js'
import globals from 'globals'

export default [
  // tlds.js is generated data (scripts/), not hand-written code.
  { ignores: ['dist/', 'coverage/', 'node_modules/', 'release/', 'src/data/tlds.js'] },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node }
    },
    rules: {
      semi: ['error', 'never'],
      quotes: ['error', 'single']
    }
  },
  { files: ['spec/**'], languageOptions: { globals: globals.jasmine } }
]
