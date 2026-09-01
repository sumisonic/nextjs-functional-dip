import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'
import neostandard from 'neostandard'
import pluginImport from 'eslint-plugin-import'
import pluginJs from '@eslint/js'
import pluginJsxA11y from 'eslint-plugin-jsx-a11y'
import pluginNext from '@next/eslint-plugin-next'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const config = [
  // Files to lint
  { name: 'files', files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },

  // Files to ignore
  {
    name: 'ignores',
    ignores: ['node_modules/**', '.next/**', 'out/**', 'eslint.config.mjs', 'next-env.d.ts'],
  },

  // Language options (globals and the TypeScript parser)
  {
    name: 'languageOptions',
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
  },

  // Base JavaScript rules
  { name: '@eslint/js', ...pluginJs.configs.recommended },

  // TypeScript rules
  ...tseslint.configs.recommended,

  // React rules
  {
    name: 'eslint-plugin-react',
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect'
      }
    }
  },

  // neostandard rules
  ...neostandard(),

  // Next.js rules
  {
    name: '@next/eslint-plugin-next',
    plugins: {
      '@next/next': pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
    },
  },

  // import rules
  {
    name: 'eslint-plugin-import',
    plugins: {
      import: pluginImport,
    },
    rules: {
      ...pluginImport['flatConfigs']['recommended']['rules'],
    },
  },

  // eslint-import-resolver-typescript
  {
    name: 'eslint-import-resolver-typescript',
    settings: {
      'import/resolver': {
        typescript: {},
      },
    },
  },

  // JSX accessibility rules
  {
    name: 'eslint-plugin-jsx-a11y',
    plugins: {
      'jsx-a11y': pluginJsxA11y,
    },
    rules: pluginJsxA11y.configs.recommended.rules,
  },

  // React Hooks rules
  {
    name: 'eslint-plugin-react-hooks',
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      'react-hooks/exhaustive-deps': 'off',
    },
  },

  // Custom rules
  {
    name: 'custom rules',
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-empty-pattern': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'no-use-before-define': 'off',
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'off',
      // Core no-unused-vars fires twice alongside @typescript-eslint/no-unused-vars, so turn it off
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },

  // Keep Prettier and ESLint from fighting
  { name: 'eslint-config-prettier', ...eslintConfigPrettier },
]

export default config
