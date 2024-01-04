/**
 * @type {import('prettier').Options}
 */
module.exports = {
  plugins: [require.resolve('prettier-plugin-astro'), '@ianvs/prettier-plugin-sort-imports'],
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
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
  importOrderBuiltinModulesToTop: true,
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderMergeDuplicateImports: true,
  importOrderCombineTypeAndValueImports: true,
  importOrder: [
    '^(@astrojs/(.*)$)|^(@astrojs$)',
    '^(astro/(.*)$)|^(astro$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@repo/(.*)$',
    '',
    '^[~/]',
    '^[./]',
  ],
};
