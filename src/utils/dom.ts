import { DEFAULT_THEMES, MODES, THEME_CONFIG, THEMES } from '@/constants/themes';

import type { Theme } from '@/types/constants';

const { MODE_CLASS, THEME_ATTRIBUTE } = THEME_CONFIG;

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

export const getNextTheme = () => {
  const currentTheme = getCurrentTheme();

  const currentIndex = THEMES.findIndex(
    (theme) => currentTheme && currentTheme.name === theme.name
  );

  if (currentIndex === -1) {
    const currentMode = getCurrentMode();
    return DEFAULT_THEMES[currentMode];
  }

  const nextIndex = (currentIndex + 1) % THEMES.length;
  return THEMES[nextIndex];
};
