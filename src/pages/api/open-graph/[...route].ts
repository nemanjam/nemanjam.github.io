import { OGImageRoute } from 'astro-og-canvas';

import { getPages } from '@/modules/open-graph-image';

const OG_FOLDER = './src/assets/images/open-graph/' as const;

const pages = await getPages();

// todo: combine with heroImage from frontmatter

export const { getStaticPaths, GET } = OGImageRoute({
  param: 'route',
  pages,
  getImageOptions: (_path, page) => {
    return {
      title: page.title,
      description: page.description,
      logo: {
        path: `${OG_FOLDER}logo.jpg`,
      },
      bgImage: {
        path: `${OG_FOLDER}background.jpg`,
        fit: 'cover',
      },
      font: {
        title: {
          weight: 'Bold',
          size: 56,
          color: [96, 165, 250],
        },
        description: {
          weight: 'Medium',
          size: 32,
        },
      },
    };
  },
});
