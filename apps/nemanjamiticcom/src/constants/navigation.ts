export interface NavigationItem {
  title: string;
  path: string;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    title: 'Blog',
    path: '/blog/',
  },
  {
    title: 'Projects',
    path: '/projects/',
  },
  {
    title: 'Tags',
    path: '/tags/',
  },
  {
    title: 'Categories',
    path: '/categories/',
  },
  {
    title: 'About',
    path: '/about/',
  },
  {
    title: 'Resume',
    path: '/resume/',
  },
] as const;
