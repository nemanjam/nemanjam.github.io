'use strict';

import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'src/**/*.{astro,md,mdx,tsx}',
    'blog/**/*.{md,mdx}',
    'labs/**/*.{mdx,tsx,ts}',
    'astro.config.mjs',
  ],
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/typography'),
    function ({ addBase, theme }) {
      addBase({
        '[id]': {
          position: 'relative',
          zIndex: 1,
        },
        '*:not(main):target::before': {
          content: '" "',
          position: 'absolute',
          backgroundColor: theme('colors.purple.400'),
          borderRadius: theme('borderRadius.DEFAULT'),
          opacity: 0.2,
          zIndex: -1,
          inset: `-${theme('spacing.2')}`,
        },
        '[data-line-numbers]': {
          counterReset: 'line',
          '& [data-line]::before': {
            counterIncrement: 'line',
            content: 'counter(line)',
            display: 'inline-block',
            width: theme('width.5'),
            marginRight: theme('spacing.6'),
            textAlign: 'right',
            color: theme('colors.slate.400'),
          },
        },
        '.prose :where(div[data-rehype-pretty-code-fragment]):not(:where([class~="no-bustout"] *))':
          {
            [`@media screen and (min-width: ${theme('screens.xl')})`]: {
              marginLeft: 'calc(50% - 50vw)',
              marginRight: 'calc(50% - 50vw)',
              width: '60vw',
              maxWidth: '1280px',
              transform: 'translateX(calc(50vw - 50%))',
            },
          },
        '[data-rehype-pretty-code-title]': {
          width: 'max-content',
          borderWidth: theme('spacing.px'),
          borderBottomWidth: '0',
          borderColor: theme('colors.slate.300'),
          borderTopLeftRadius: theme('borderRadius.md'),
          borderTopRightRadius: theme('borderRadius.md'),
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          fontFamily: theme('fontFamily.mono'),
          color: theme('colors.slate.900'),
          backgroundColor: theme('colors.slate.200'),
          fontSize: theme('fontSize.sm'),
          '.dark &': {
            borderColor: theme('colors.slate.800'),
            backgroundColor: theme('colors.slate.900'),
            color: theme('colors.slate.100'),
          },
          '+ pre': {
            borderTopLeftRadius: theme('borderRadius.none'),
            marginTop: theme('spacing.0'),
          },
        },
        '[data-rehype-pretty-code-caption]': {
          marginTop: `-${theme('spacing.6')}`,
          marginBottom: theme('spacing.8'),
          fontSize: theme('fontSize.xs'),
          textAlign: 'center',
        },
        '@media (min-width:1280px)': {
          '[data-rehype-pretty-code-caption]': {
            marginTop: `-${theme('spacing.9')}`,
          },
        },
      });
    },
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
    function ({ addUtilities }) {
      addUtilities({
        '.no-bustout': {},
        '.bustout': {
          marginLeft: 'calc(50% - 50vw)',
          marginRight: 'calc(50% - 50vw)',
          width: '80vw',
          maxWidth: '1280px',
          transform: 'translateX(calc(50vw - 50%))',
        },
        '.bustout-sm': {
          marginLeft: 'calc(50% - 50vw)',
          marginRight: 'calc(50% - 50vw)',
          width: '60vw',
          maxWidth: '1024px',
          transform: 'translateX(calc(50vw - 50%))',
        },
        '.shape-circle': {
          aspectRatio: 1,
          shapeOutside: 'circle(50%)',
          clipPath: 'circle(50%)',
          shapeMargin: '1.25rem',
          marginLeft: '1.25rem',
          marginBottom: '1.25rem',
          overflow: 'hidden',
        },
        '.shape-half-tl': {
          clipPath: 'polygon(0 0, 0 100%, 100% 0)',
        },
        '.shape-half-br': {
          clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
        },
      });
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
        'a-img': {
          css: {
            'a:hover img': {
              outline: `4px solid ${theme('colors.blue.500')}aa`,
            },
          },
        },
      }),
    },
  },
};
