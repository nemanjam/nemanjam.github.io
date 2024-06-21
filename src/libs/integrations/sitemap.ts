import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';

import { CONFIG } from '../../config';
import { ROUTES } from '../../constants/routes';

const { SITE_URL } = CONFIG;

export const sitemapIntegration = () =>
  sitemap({
    serialize: (item) => {
      if (item.url.endsWith(SITE_URL)) {
        item.priority = 1.0;
        // google can access it with '/'
      } else if (item.url.endsWith(`${SITE_URL}${ROUTES.BLOG}`)) {
        item.changefreq = 'daily' as ChangeFreqEnum;
        item.priority = 0.9;
      }
      return item;
    },
  });
