import { ROUTES } from '@/constants/routes';

export interface NavigationItem {
  title: string;
  path: string;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    title: 'Blog',
    path: ROUTES.BLOG,
  },
  {
    title: 'Explore',
    path: ROUTES.TAGS_AND_CATEGORIES,
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
