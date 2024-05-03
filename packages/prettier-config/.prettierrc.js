/**
 * @type {import('prettier').Options}
 */
module.exports = {
  plugins: ['prettier-plugin-astro', '@ianvs/prettier-plugin-sort-imports'],
  printWidth: 100,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,
  overrides: [
    {
      files: ['**/*.astro'],
      options: { parser: 'astro' },
    },
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrder: [
    '<BUILTIN_MODULES>',
    '',
    '^astro$',
    '^@astrojs',
    '^astro(.+)$',
    '^(react/(.*)$)|^(react$)',
    '',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@repo/(.*)$',
    '',
    '^@/modules',
    '^@/pages',
    '^@/content',
    '^@/layouts',
    '^@/components',
    '^@/config',
    '^@/utils',
    '^[./]', // all relative imports
    '',
    '<TYPES>',
    '<TYPES>^[.]',
    '',
    '^@/images',
    '^@/icons',
    '^@/styles',
  ],
};
