import { OGImageRoute } from 'astro-og-canvas';

import { getAllPosts } from '@/modules/post';
import { getAllProjects } from '@/modules/project';
import { ROUTES } from '@/constants/routes';
import { removeLeadingSlash } from '@/utils/paths';

const OG_FOLDER = './src/assets/images/open-graph/' as const;

// add pages too
// only path, title and description are important
const mdxPagesObject = import.meta.glob('/src/pages/**/*.{md,mdx}', { eager: true });
const mdxPages = Object.fromEntries(
  Object.entries(mdxPagesObject).map(([path, page]) => [
    // must match ROUTES.API.OG_PAGES
    path.replace(/^\/src\/|\.mdx?$/g, ''),
    (page as any).frontmatter,
  ])
);

// index.mdx goes to page.png by default by lib, see in yarn build log

// console.log('mdxPages', mdxPages);

// ! 1. must be object, not array of objects
// ! 2. must not start with '/' blog/slug <- correct, /blog/slug <- incorrect
const allPosts = await getAllPosts();
const posts = Object.fromEntries(
  allPosts.map((post) => [`${removeLeadingSlash(ROUTES.BLOG)}${post.slug}`, post.data])
);

const allProjects = await getAllProjects();
const projects = Object.fromEntries(
  allProjects.map((project) => [
    `${removeLeadingSlash(ROUTES.PROJECTS)}${project.slug}`,
    project.data,
  ])
);

const pages = { ...posts, ...projects, ...mdxPages };

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
