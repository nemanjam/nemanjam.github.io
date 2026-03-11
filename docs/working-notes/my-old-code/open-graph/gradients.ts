// src/utils/array.ts

export const hashString = (str: string): number => {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }

  return hash;
};

/** Deterministic. Enables caching in build. */
export const getRandomElementFromArrayBySeed = <T>(arr: T[], seed: string, salt = ''): T => {
  const hash = hashString(seed + salt);

  return arr[hash % arr.length];
};


import { default as twColors } from 'tailwindcss/colors';

import { getRandomElementFromArrayBySeed as rndFn } from '@/utils/array';

import type { DefaultColors } from 'tailwindcss/types/generated/colors';

type ColorKeys = keyof DefaultColors;
type ShadeKeys = keyof DefaultColors[ColorKeys];

const colors = ['gray', 'indigo', 'yellow', 'blue', 'cyan', 'lime', 'sky', 'white'] as ColorKeys[];
const shades = [50, 100, 200] as ShadeKeys[];
const directions = ['to right', 'to bottom', '45deg'];

// to support white
// Todo: for cached build should depend on title arg
const getRandomColor = (seed: string, salt: string) => {
  const rndColor = rndFn(colors, seed, `color-${salt}`);
  return rndColor === 'white' ? rndColor : twColors[rndColor][rndFn(shades, `shade-${salt}`)];
};

export const getRandomGradient = (seed: string) =>
  `background: linear-gradient(${rndFn(directions, seed, 'direction')}, ${getRandomColor(seed, 'start')}, ${getRandomColor(seed, 'end')})`;

export const grayGradient = `background: linear-gradient(to right, ${twColors.gray[100]}, ${twColors.gray[300]})`;

