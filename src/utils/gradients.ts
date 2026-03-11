import { default as twColors } from 'tailwindcss/colors';

import { getRandomElementFromArray as rndFn } from '@/utils/array';

import type { DefaultColors } from 'tailwindcss/types/generated/colors';

type ColorKeys = keyof DefaultColors;
type ShadeKeys = keyof DefaultColors[ColorKeys];

const colors = ['gray', 'indigo', 'yellow', 'blue', 'cyan', 'lime', 'sky', 'white'] as ColorKeys[];
const shades = [50, 100, 200] as ShadeKeys[];
const directions = ['to right', 'to bottom', '45deg'];

// to support white
// Todo: for cached build should depend on title arg, deterministic random. Won't work. Satori renders each time, no caching, outside of Astro build caching.
const getRandomColor = () => {
  const rndColor = rndFn(colors);
  return rndColor === 'white' ? rndColor : twColors[rndColor][rndFn(shades)];
};

export const getRandomGradient = () =>
  `background: linear-gradient(${rndFn(directions)}, ${getRandomColor()}, ${getRandomColor()})`;

export const grayGradient = `background: linear-gradient(to right, ${twColors.gray[100]}, ${twColors.gray[300]})`;
