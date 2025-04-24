import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';

// must use relative imports, and their entire import subtrees
import { rehypeExternalLinks } from './plugins/rehype-external-links';
import { remarkReadingTime } from './plugins/remark-reading-time.mjs';
//
// all relative imports in subtree
// any of these files must not import CONFIG with env vars
import { envSchema, PROCESS_ENV } from './src/config/process-env';
import { expressiveCodeIntegration } from './src/libs/integrations/expressive-code';
import { sitemapIntegration } from './src/libs/integrations/sitemap';

const { SITE_URL } = PROCESS_ENV;

const remarkPlugins = [remarkReadingTime];
const rehypePlugins = [rehypeExternalLinks];

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'ignore',
  env: envSchema,
  // default
  compressHTML: true,
  server: { port: 3000 },
  devToolbar: { enabled: false },
  integrations: [
    expressiveCodeIntegration(),
    sitemapIntegration(),
    react(),
    mdx({ rehypePlugins }),
    // applyBaseStyles: false prevents double loading of tailwind
    tailwind({ applyBaseStyles: false }),
    icon({ iconDir: 'src/assets/icons' }),
    partytown({
      config: { forward: ['dataLayer.push'] },
    }),
  ],
  markdown: { remarkPlugins, rehypePlugins },
  vite: {
    build: {
      sourcemap: false,
    },
    server: {
      // applies only to Vite dev server
      allowedHosts: ['localhost', 'preview1.amd1.nemanjamitic.com'],
    },
  },
});
