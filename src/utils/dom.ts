import { SELECTORS } from '@/constants/dom';
import { DEFAULT_THEMES, MODES, THEME_CONFIG, THEMES } from '@/constants/themes';

import type { Mode, Theme } from '@/types/constants';

const { MODE_CLASS, DATA_ATTRIBUTE } = THEME_CONFIG;

export const getCurrentMode = () =>
  document.documentElement.classList.contains(MODE_CLASS) ? MODES.dark : MODES.light;

export const getCurrentTheme = () => {
  const themeName = document.documentElement.getAttribute(DATA_ATTRIBUTE);
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

/*-------------------------------- giscus dark/light mode ------------------------------*/

const { GISCUS_WIDGET_SELECTOR, GISCUS_IFRAME_SELECTOR } = SELECTORS;

export const sendModeToGiscus = (mode: Mode): void => {
  const giscusIframeUrl = 'https://giscus.app';

  const shadowHost = document.querySelector(GISCUS_WIDGET_SELECTOR);
  const shadowRoot = shadowHost?.shadowRoot;
  if (!shadowRoot) return;

  const iframe = shadowRoot.querySelector(GISCUS_IFRAME_SELECTOR) as HTMLIFrameElement;
  if (!iframe?.contentWindow) return;

  iframe.contentWindow.postMessage({ giscus: { setConfig: { theme: mode } } }, giscusIframeUrl);
};
