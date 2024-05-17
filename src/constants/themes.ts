export type ThemeNames = (typeof themes)[number]['name'];
export type ThemeModes = (typeof themes)[number]['mode'];
export type Theme = (typeof themes)[number];

export const themes = [
  {
    mode: 'light',
    name: 'default-light',
  },
  {
    mode: 'dark',
    name: 'default-dark',
  },
  {
    mode: 'light',
    name: 'blue-light',
  },
  {
    mode: 'dark',
    name: 'blue-dark',
  },
] as const;
