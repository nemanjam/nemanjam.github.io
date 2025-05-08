import expressiveCode from 'astro-expressive-code';

import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';

// prevent multiple shiki instances in dev mode
let cachedIntegration: ReturnType<typeof expressiveCode> | undefined;

export const expressiveCodeIntegration = () => {
  if (cachedIntegration) return cachedIntegration;

  return (cachedIntegration = expressiveCode({
    themes: ['light-plus', 'dark-plus'],
    useDarkModeMediaQuery: true,
    themeCssRoot: ':root',
    themeCssSelector: (theme) => {
      let themeSelector: string;

      switch (theme.type) {
        case 'light':
          // matches mode selector THEME_CONFIG.MODE_CLASS in src/constants/themes.ts
          themeSelector = '[class=""]';
          break;
        case 'dark':
          themeSelector = '[class="dark"]';
          break;

        default:
          themeSelector = '[class=""]';
          break;
      }

      return themeSelector;
    },
    tabWidth: 2,
    styleOverrides: {
      codeFontSize: 'var(--expressive-code-font-size)',
      codeLineHeight: '1.4',
      frames: {
        frameBoxShadowCssValue: 'none',
      },
    },
    plugins: [pluginCollapsibleSections()],
  }));
};
