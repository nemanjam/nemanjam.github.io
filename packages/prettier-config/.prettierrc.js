/**
 * @type {import('prettier').Options}
 */
module.exports = {
  plugins: [require.resolve('prettier-plugin-astro')],
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
};
