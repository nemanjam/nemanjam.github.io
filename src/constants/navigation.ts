import { ROUTES } from '@/constants/routes';

/** Doesn't contain Home nav item. */
export const NAVIGATION_ITEMS = [
  {
    title: 'Blog',
    path: ROUTES.BLOG,
  },
  {
    title: 'Explore',
    path: ROUTES.CATEGORIES_AND_TAGS,
  },
  // {
  //   title: 'Tags',
  //   path: ROUTES.TAGS,
  // },
  // {
  //   title: 'Categories',
  //   path: ROUTES.CATEGORIES,
  // },
  {
    title: 'Projects',
    path: ROUTES.PROJECTS,
  },
  {
    title: 'About',
    path: ROUTES.ABOUT,
  },
  // {
  //   title: 'Resume',
  //   path: ROUTES.RESUME,
  // },
] as const;
