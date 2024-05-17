import { MODE_CLASS, MODES, THEME_ATTRIBUTE, THEMES } from '@/constants/themes';

import type { Theme } from '@/constants/themes';

export const getCurrentMode = () =>
  document.documentElement.classList.contains(MODE_CLASS) ? MODES.dark : MODES.light;

export const getCurrentTheme = () => {
  const themeName = document.documentElement.getAttribute(THEME_ATTRIBUTE);
  const isValidThemeName =
    Boolean(themeName) && THEMES.map((theme) => theme.name).includes(themeName as Theme['name']);

  if (!isValidThemeName) return null;

  const currentTheme = THEMES.find((theme) => theme.name === themeName) as Theme;
  return currentTheme;
};
