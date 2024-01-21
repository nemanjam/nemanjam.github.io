import defaultTheme from 'tailwindcss/defaultTheme';

import sharedConfig from '@repo/tailwind-config/tailwind.config.ts';

import type { Config } from 'tailwindcss';

const config: Config = {
  presets: [sharedConfig],
  content: [
    'src/**/*.{astro,md,mdx,tsx}',
    'blog/**/*.{md,mdx}',
    'projects/**/*.{mdx,tsx,ts}',
    'astro.config.mjs',
  ],
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/typography'),
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          tab: (value) => ({
            tabSize: value,
          }),
        },
        { values: theme('tabSize') }
      );
    },
  ],
  theme: {
    tabSize: {
      1: '1',
      2: '2',
      4: '4',
      8: '8',
    },
    extend: {
      fontFamily: {
        sans: ['Inter Variable', 'Inter', ...defaultTheme.fontFamily.sans],
      },
      // not important, just share button
      keyframes: (theme) => ({
        'ring-ping': {
          '0%': {
            'box-shadow': `0 0 0 0 ${theme('colors.slate.100')}ff, 0 0 0 0 ${theme(
              'colors.blue.500'
            )}00`,
          },
          '5%': {
            'box-shadow': `0 0 0 0px ${theme('colors.slate.100')}ff, 0 0 0 4px ${theme(
              'colors.blue.500'
            )}aa`,
          },
          '20%, 100%': {
            'box-shadow': `0 0 0 4px ${theme('colors.slate.100')}ff, 0 0 0 8px ${theme(
              'colors.blue.500'
            )}00`,
          },
        },
        'ring-ping-dark': {
          '0%': {
            'box-shadow': `0 0 0 0 ${theme('colors.slate.900')}ff, 0 0 0 0 ${theme(
              'colors.blue.500'
            )}00`,
          },
          '5%': {
            'box-shadow': `0 0 0 0px ${theme('colors.slate.900')}ff, 0 0 0 4px ${theme(
              'colors.blue.500'
            )}aa`,
          },
          '20%, 100%': {
            'box-shadow': `0 0 0 4px ${theme('colors.slate.900')}ff, 0 0 0 8px ${theme(
              'colors.blue.500'
            )}00`,
          },
        },
      }),
      animation: {
        'ring-ping': 'ring-ping 2s linear infinite',
        'ring-ping-dark': 'ring-ping-dark 2s linear infinite',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            'code::before': { content: '""' },
            'code::after': { content: '""' },
          },
        },
        // nonsense
        'a-img': {
          css: {
            'a:hover img': {
              outline: `4px solid ${theme('colors.blue.500')}`,
            },
          },
        },
      }),
    },
  },
};

export default config;
