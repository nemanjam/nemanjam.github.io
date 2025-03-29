import { GALLERY } from '@/constants/gallery';

import type { Breakpoint } from '@/types/constants';

const { PAGE_SIZE, INITIAL_PAGE } = GALLERY;

// related to gallery grid css
const breakpointToPageKey = {
  XXS: 'XS',
  XS: 'XS',
  SM: 'SM',
  MD: 'SM',
  LG: 'LG',
  XL: 'LG',
  _2XL: 'LG',
} as const;

const defaultPageKey = 'LG' as const;

export const getPageSize = (breakpoint: Breakpoint): number => {
  const key = breakpointToPageKey[breakpoint] ?? defaultPageKey;
  const pageSize = PAGE_SIZE[key];

  return pageSize;
};

export const getInitialPage = (breakpoint: Breakpoint): number => {
  const key = breakpointToPageKey[breakpoint] ?? defaultPageKey;
  const initialPage = INITIAL_PAGE[key];

  return initialPage;
};
