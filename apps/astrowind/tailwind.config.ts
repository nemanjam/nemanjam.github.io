import sharedConfig from '@repo/tailwind-config';

import type { Config } from 'tailwindcss';

const config: Pick<Config, 'presets' | 'content'> = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  presets: [sharedConfig],
};

export default config;
