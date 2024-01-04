import path from 'path';
import { fileURLToPath } from 'url';

import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import { defineConfig, squooshImageService } from 'astro/config';

import tasks from './src/integrations/tasks';
import { ANALYTICS, SITE } from './src/utils/config.ts';
import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin } from './src/utils/frontmatter.mjs';

import type { AstroIntegration } from 'astro';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

type ItemsType = () => AstroIntegration | Array<() => AstroIntegration>;

const whenExternalScripts = (items: ItemsType) =>
  ANALYTICS.vendors.googleAnalytics.id && ANALYTICS.vendors.googleAnalytics.partytown
    ? Array.isArray(items)
      ? items.map((item) => item())
      : [items()]
    : [];

export default defineConfig({
  site: SITE.site, //  must have https:// or http://
  base: SITE.base,
  trailingSlash: SITE.trailingSlash ? 'always' : 'never',
  server: { port: 3000 },

  output: 'static',

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),

    tasks(),
  ],

  image: {
    service: squooshImageService(),
  },

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
    rehypePlugins: [responsiveTablesRehypePlugin],
  },

  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
