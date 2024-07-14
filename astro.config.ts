import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';

// must use relative imports, and their entire import subtrees
import { remarkReadingTime } from './plugins/remark-reading-time.mjs';
// all relative imports in subtree
import { CONFIG } from './src/config';
import { expressiveCodeIntegration } from './src/libs/integrations/expressive-code';
import { sitemapIntegration } from './src/libs/integrations/sitemap';

const { SITE_URL } = CONFIG;
const remarkPlugins = [remarkReadingTime];

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'ignore',
  // default
  compressHTML: true,
  server: {
    port: 3000,
  },
  devToolbar: {
    enabled: false,
  },
  integrations: [
    expressiveCodeIntegration(),
    sitemapIntegration(),
    react(),
    // applyBaseStyles: false prevents double loading of tailwind
    tailwind({
      applyBaseStyles: false,
    }),
    mdx(),
    icon({
      iconDir: 'src/assets/icons',
    }),
  ],
  markdown: {
    remarkPlugins,
  },
  vite: {
    build: {
      sourcemap: false,
    },
  },
});
