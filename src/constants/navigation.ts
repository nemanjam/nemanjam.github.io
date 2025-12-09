import { ROUTES } from '@/constants/routes';

interface NavItem {
  title: string;
  path: string;
  icon?: string;
  noUnderline?: boolean; // Added for '关于'
}

/** Doesn't contain Home nav item. */
export const NAVIGATION_ITEMS: NavItem[] = [
  {
    title: 'Shopify独立站',
    path: ROUTES.BLOG,
    icon: 'mdi:shopify', // Added for demonstration
  },
  {
    title: '收款',
    path: ROUTES.EXPLORE,
    icon: 'mdi:credit-card-check-outline',
  },
  {
    title: '建站',
    path: ROUTES.PROJECTS,
    icon: 'mdi:web',
  },
  {
    title: '所有教程',
    path: ROUTES.ABOUT,
    icon: 'mdi:book-open-blank-variant-outline',
  },
  {
    title: '关于',
    path: ROUTES.GALLERY,
    icon: 'mdi:clipboard-account-outline',
  },
] as const;
