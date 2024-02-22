import defaultTheme from 'tailwindcss/defaultTheme';

import sharedConfig from '@repo/tailwind-config/tailwind.config.ts';

import type { Config } from 'tailwindcss';

const config: Config = {
  presets: [sharedConfig],
  content: ['src/**/*.{astro,md,mdx,tsx}', 'astro.config.mjs'],
  darkMode: ['class', '[data-theme="dark"]'],
  // from sharedConfig packages/tailwind-config/tailwind.config.ts
  // plugins: [require('@tailwindcss/typography')],
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
      colors: {
        // background
        'base-100': 'var(--base-100)',
        'base-200': 'var(--base-200)',
        'base-300': 'var(--base-300)',
        'base-code': 'var(--base-code)',
        // text
        content: 'var(--content)',
        headings: 'var(--headings)',
        captions: 'var(--captions)',
        links: {
          DEFAULT: 'var(--links)',
          hover: 'var(--links-hover)',
          visited: 'var(--links-visited)',
        },
        // brand
        primary: {
          DEFAULT: 'var(--primary)',
          content: 'var(--primary-content)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          content: 'var(--secondary-content)',
        },
      },
      typography: ({ theme }) => ({
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
