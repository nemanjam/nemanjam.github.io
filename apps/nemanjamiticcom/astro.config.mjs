import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import solid from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

import rehypePrettyCode from 'rehype-pretty-code';

import { remarkReadingTime } from './plugins/remark-reading-time.mjs';
import { SITE_URL } from './src/config';

const remarkPlugins = [remarkReadingTime];
const rehypePlugins = [
  [
    rehypePrettyCode,
    {
      // this is shiki theme, not editor theme
      theme: JSON.parse(
        readFileSync(
          path.join(
            fileURLToPath(import.meta.url),
            '..',
            './config/theme/moonlight-ii-custom.json'
          ),
          'utf-8'
        )
      ),
      onVisitLine(node) {
        // Prevent lines from collapsing in `display: grid` mode, and
        // allow empty lines to be copy/pasted
        if (node.children.length === 0) {
          node.children = [{ type: 'text', value: ' ' }];
        }
        if (!node.properties.className) {
          node.properties.className = [''];
        }
        node.properties.className.push(
          'inline-block',
          'w-full',
          'px-4',
          'lg:px-8',
          'border-l-4',
          'border-transparent'
        );
      },
      onVisitHighlightedLine(node) {
        if (!node.properties.className) {
          node.properties.className = [''];
        }
        node.properties.className.push('bg-pink-500/20', 'py-px', 'border-l-pink-500/80');
      },
      onVisitHighlightedWord(node) {
        if (!node.properties.className) {
          node.properties.className = [''];
        }
        node.properties.className = ['bg-pink-700/40', 'rounded', 'p-1', '-m-1'];
      },
    },
  ],
];

/** @type {import('@types/astro').AstroUserConfig} */
export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
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
    tailwind(),
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
