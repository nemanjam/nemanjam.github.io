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
  plugins: [require('@tailwindcss/typography')],
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
        background: 'var(--theme-color-page-background)',
        primary: 'var(--theme-color-primary)',
        secondary: 'var(--theme-color-secondary)',
        link: 'var(--theme-color-link)',
        'link-hover': 'var(--theme-color-link-hover)',
        quote: 'var(--theme-color-quote)',
        muted: 'var(--theme-color-text-muted)',
        'dark-muted': 'var(--theme-color-text-dark-muted)',
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
