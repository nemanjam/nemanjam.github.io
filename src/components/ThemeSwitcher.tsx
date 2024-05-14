import debounce from 'debounce';
import { createEffect, createSignal, onCleanup, onMount } from 'solid-js';

import type { Component } from 'solid-js';

type Theme = 'light' | 'dark' | 'auto' | 'auto-dark' | 'auto-light';

const query = '(prefers-color-scheme: dark)';
const dark = 'dark';
const light = 'light';
const themes: Array<Partial<Theme>> = [light, dark];
const trueString = 'true';
const falseString = 'false';

function callApi(theme: Theme, auto: boolean) {
  const params = new URLSearchParams({ theme, auto: auto ? trueString : falseString });
  fetch(`/api/theme/?${params.toString()}`);
}

export const ThemeSwitcher: Component = () => {
  const [theme, setTheme] = createSignal<Theme>(light);
  const [auto, setAuto] = createSignal<boolean>(true);
  const save = debounce(callApi, 300);

  onMount(() => {
    const doc = document.documentElement;
    const isAuto = doc.dataset.autoTheme === trueString;
    const isDark = doc.classList.contains(dark);
    setAuto(isAuto);
    setTheme(isDark ? dark : light);
  });

  createEffect(() => {
    const doc = document.documentElement;
    const newTheme = theme();
    const newAuto = auto();

    const currentThemeDark = doc.classList.contains(dark) ? dark : light;
    const currentAuto = doc.dataset.autoTheme === trueString;

    if (currentThemeDark === newTheme && currentAuto === newAuto) {
      return;
    }

    doc.dataset.autoTheme = newAuto ? trueString : falseString;
    if (newTheme === dark) {
      // todo: handle data-theme="dark" attribute too
      doc.classList.add(dark);
    } else {
      doc.classList.remove(dark);
    }

    save(newTheme, newAuto);
  });

  const toggle = (event: KeyboardEvent | MouseEvent) => {
    const currTheme = theme();
    const currAuto = auto();
    if (!currTheme || ('key' in event && event.key.toLowerCase() !== 'enter')) {
      return;
    }

    if (currTheme === dark && !currAuto) {
      setAuto(true);
      return;
    }

    setAuto(false);
    let idx = themes.indexOf(currTheme);
    idx = idx === themes.length - 1 ? 0 : idx + 1;
    setTheme(themes[idx] as Theme);
  };

  createEffect(() => {
    if (!auto()) {
      return;
    }

    if (window.matchMedia && window.matchMedia(query).matches) {
      setTheme(dark);
    } else {
      setTheme(light);
    }

    const listener = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? dark : light);
    };

    window.matchMedia(query).addEventListener('change', listener);

    onCleanup(() => {
      window.matchMedia(query).removeEventListener('change', listener);
    });
  });

  return (
    <div
      role="button"
      aria-label={`Toggle site theme. Currently: ${
        auto() ? 'Auto' : theme() === dark ? 'Dark' : 'Light'
      }`}
      aria-live="polite"
      class="inline-flex items-center gap-1 whitespace-nowrap rounded p-2 font-bold text-blue-600 shadow-none outline-none ring-4 ring-transparent transition-all duration-200 hover:bg-blue-500/30 hover:text-blue-800 focus-visible:ring-4 focus-visible:ring-blue-500 active:shadow-inner active:ring-4 active:ring-blue-200/70 dark:text-blue-100 dark:hover:bg-blue-500/30 dark:hover:text-blue-50 dark:focus-visible:ring-blue-500/50 dark:active:ring-blue-500/30"
      onClick={toggle}
      onKeyDown={toggle}
      tabindex={0}
    >
      {auto() ? (
        <div class="relative flex w-6 flex-row items-center justify-center overflow-hidden">
          <div class="absolute shape-half-tl">
            <Moon />
          </div>
          <div class="absolute h-8 w-px origin-center rotate-45 overflow-hidden bg-blue-800 dark:bg-blue-200" />
          <div class="shape-half-br">
            <Sun />
          </div>
        </div>
      ) : theme() === dark ? (
        <Moon />
      ) : (
        <Sun />
      )}
    </div>
  );
};

const Sun: Component = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-6 w-6">
    <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
  </svg>
);

const Moon: Component = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-6 w-6">
    <path
      fill-rule="evenodd"
      d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z"
      clip-rule="evenodd"
    />
  </svg>
);
