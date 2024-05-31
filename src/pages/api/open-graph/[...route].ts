import { OGImageRoute } from 'astro-og-canvas';

import { getAllPosts } from '@/modules/post';
import { getAllProjects } from '@/modules/project';
import { ROUTES } from '@/constants/routes';

const OG_FOLDER = './src/assets/images/open-graph/' as const;

// add pages too

// ! 1. must be object, not array of objects
// ! 2. must not start with '/' blog/slug <- correct, /blog/slug <- incorrect
const allPosts = await getAllPosts();
const posts = Object.fromEntries(
  allPosts.map((post) => [`${ROUTES.BLOG.substring(1)}${post.slug}`, post.data])
);

const allProjects = await getAllProjects();
const projects = Object.fromEntries(
  allProjects.map((project) => [`${ROUTES.PROJECTS.substring(1)}${project.slug}`, project.data])
);

const pages = { ...posts, ...projects };

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
