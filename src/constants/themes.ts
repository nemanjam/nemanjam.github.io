export const MODES = {
  dark: 'dark',
  light: 'light',
} as const;

export const DEFAULT_THEMES = {
  light: {
    mode: MODES.light,
    name: 'default-light',
  },
  dark: {
    mode: MODES.dark,
    name: 'default-dark',
  },
} as const;

export const THEMES = [
  DEFAULT_THEMES.light,
  DEFAULT_THEMES.dark,
  {
    mode: MODES.light,
    name: 'green-light',
  },
  {
    mode: MODES.dark,
    name: 'green-dark',
  },
] as const;

export const THEME_CONFIG = {
  MODE_CLASS: 'dark',
  THEME_ATTRIBUTE: 'data-theme',
  THEME_CHANGE_EVENT: 'theme-change',
  LOCAL_STORAGE_THEME_KEY: 'theme',
} as const;
