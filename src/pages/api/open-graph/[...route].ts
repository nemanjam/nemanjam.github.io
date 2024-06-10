import { OGImageRoute } from 'astro-og-canvas';

import { getAllPosts } from '@/modules/post';
import { getAllProjects } from '@/modules/project';
import { DEFAULT_METADATA, OG_IMAGE_PREFIXES, pageMetadata } from '@/constants/metadata';

const OG_FOLDER = './src/assets/images/open-graph/' as const;

/*-------------------------------- list pages ------------------------------*/

const { image: _, ...defaultTitleAndDescription } = DEFAULT_METADATA;

// add defaults for empty values
const listPages = Object.fromEntries(
  Object.entries(pageMetadata).map(([path, metadata]) => {
    return [
      // 'lists/blog'
      path,
      { ...defaultTitleAndDescription, ...metadata },
    ];
  })
);

/*-------------------------------- pages/page.mdx ------------------------------*/

// only path, title and description are important
const mdxPagesObject = import.meta.glob('/src/pages/**/*.{md,mdx}', { eager: true });
const mdxPages = Object.fromEntries(
  Object.entries(mdxPagesObject).map(([path, page]) => [
    // '/src/pages/about.mdx' -> 'pages/about'
    // pages/index.mdx -> pages.png
    path.replace(/^\/src\/|\.mdx?$/g, ''),
    (page as any).frontmatter,
  ])
);

/*-------------------------------- collections ------------------------------*/

// ! 1. must be object, not array of objects
// ! 2. must not start with '/' blog/slug <- correct, /blog/slug <- incorrect
const allPosts = await getAllPosts();
const posts = Object.fromEntries(
  allPosts.map((post) => [`${OG_IMAGE_PREFIXES.OG_BLOG}/${post.slug}`, post.data])
);

const allProjects = await getAllProjects();
const projects = Object.fromEntries(
  allProjects.map((project) => [`${OG_IMAGE_PREFIXES.OG_PROJECTS}/${project.slug}`, project.data])
);

const pages = { ...posts, ...projects, ...mdxPages, ...listPages };

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
