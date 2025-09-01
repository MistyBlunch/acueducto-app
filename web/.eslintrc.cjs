/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        args: 'after-used',
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'no-console': 'warn',
    'prettier/prettier': 'error',
  },
  overrides: [
    {
      files: ['**/*.config.{js,cjs,mjs,ts}', 'scripts/**/*.{js,ts}'],
      env: { node: true },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
    },
  ],
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'build/',
    'dist/',
    'coverage/',
    'public/_generated/**',
  ],
};
