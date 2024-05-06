import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import solid from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';

import { rehypePlugins } from './plugins/rehype-pretty-code.mjs';
import { remarkReadingTime } from './plugins/remark-reading-time.mjs';
import Config from './src/config';

const { SITE_URL } = Config;

const remarkPlugins = [remarkReadingTime];

/** @type {import('@types/astro').AstroUserConfig} */
export default defineConfig({
  site: SITE_URL,
  // trailingSlash: 'always', // default 'ignore'
  compressHTML: true,
  server: { port: 3000 },
  integrations: [
    solid({
      include: ['src/**'],
      exclude: ['**/*react*/**'],
    }),
    react({
      include: ['**/*react*/**'],
    }),
    // applyBaseStyles: false prevents double loading of tailwind
    tailwind({ applyBaseStyles: false }),
    mdx({
      remarkPlugins,
      rehypePlugins,
      extendPlugins: 'astroDefaults',
    }),
    sitemap({
      serialize(item) {
        if (item.url.endsWith(SITE_URL)) {
          item.priority = 1.0;
        } else if (item.url.endsWith(`${SITE_URL}/blog/`)) {
          item.changefreq = 'daily';
          item.priority = 0.9;
        }

        return item;
      },
    }),
    icon(),
  ],
  markdown: {
    remarkPlugins,
    rehypePlugins,
    syntaxHighlight: false,
    extendDefaultPlugins: true,
  },
  vite: {
    build: {
      sourcemap: true,
    },
    ssr: {
      noExternal: ['react-component-benchmark'],
    },
  },
});
