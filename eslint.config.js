import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
  },
  {
    // Data access rule: only src/data may touch localStorage (see CLAUDE.md).
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/data/**'],
    rules: {
      'no-restricted-globals': [
        'error',
        { name: 'localStorage', message: 'Use the data layer (src/data) instead.' },
        { name: 'sessionStorage', message: 'Use the data layer (src/data) instead.' },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/data/mock/*', '**/data/mock/*', '@/data/supabase/*', '**/data/supabase/*'],
              message: 'Use the hooks in src/hooks/queries, never a data-layer implementation.',
            },
            {
              group: ['@supabase/*'],
              message: 'Only src/data may talk to Supabase.',
            },
          ],
        },
      ],
    },
  },
)
