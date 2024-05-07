import { ROUTES } from './routes';

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
    title: 'Projects',
    path: ROUTES.PROJECTS,
  },
  {
    title: 'Tags',
    path: ROUTES.TAGS,
  },
  {
    title: 'Categories',
    path: ROUTES.CATEGORIES,
  },
  {
    title: 'About',
    path: ROUTES.ABOUT,
  },
  {
    title: 'Resume',
    path: ROUTES.RESUME,
  },
] as const;
