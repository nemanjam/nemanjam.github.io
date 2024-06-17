import { ROUTES } from '@/constants/routes';

import type { FilterParams } from '@/types/post';

/*-------------------------------- utils ------------------------------*/

export const removeLeadingSlash = (path: string) => path.replace(/^\/+/g, '');

export const removeTrailingSlash = (path: string) => path.replace(/\/+$/g, '');

export const removeLeadingAndTrailingSlashes = (path: string) => path.replace(/^\/+|\/+$/g, '');

/*----------------------------- detect unknown routes ---------------------------*/

// maybe remove
const extractFirstLevelStringValues = (obj: Record<string, any>): Record<string, string> =>
  Object.fromEntries(Object.entries(obj).filter(([_key, value]) => typeof value === 'string'));

const getUniqueFirstPathSegments = (obj: Record<string, string>): string[] => {
  const segments = Object.entries(obj)
    // Extract the first path segment
    .map(([_key, value]) => value.split('/')[1])
    .filter(Boolean);

  return [...new Set(segments)];
};

// export only this
export const isKnownRoute = (path: string): boolean => {
  const sitePaths = extractFirstLevelStringValues(ROUTES);
  const uniquePaths = getUniqueFirstPathSegments(sitePaths);

  return uniquePaths.includes(path);
};

export const getPathnameFromFilterParams = (filterParams: FilterParams): string | undefined => {
  const { filterType, filterSlug } = filterParams;

  if (!(filterType && ['tags', 'categories'].includes(filterType) && filterSlug)) return undefined;

  const pathSegment = filterType === 'tags' ? ROUTES.CAT_TAGS : ROUTES.CAT_CATEGORIES;
  const pathname = `${pathSegment}${filterSlug}`;

  return pathname;
};
