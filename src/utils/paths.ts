import { ROUTES } from '@/constants/routes';

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
