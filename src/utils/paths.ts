import { defaultOgImage } from '@/constants/metadata';
import { ROUTES } from '@/constants/routes';

export type OpenGraphImageType = 'blog' | 'projects' | 'pages';

export const getDefaultOpenGraphImagePath = (type: OpenGraphImageType, path: string) => {
  let trimmedPath = removeLeadingAndTrailingSlashes(path);

  // index.mdx
  const homePageOgImage = `${removeTrailingSlash(ROUTES.API.OG_PAGES)}.png`;
  // all unknown pages
  const _404PageOgImage = `${ROUTES.API.OG_PAGES}404.png`;

  // this is not perfect
  if (type === 'pages' && !isKnownRoute(trimmedPath)) return _404PageOgImage;
  if (trimmedPath === '') return homePageOgImage;

  let imagePath: string;

  switch (type) {
    case 'blog':
      imagePath = `${ROUTES.API.OG_BLOG}${trimmedPath}.png`; // pass pathname, not just slug, can omit type arg
      break;
    case 'projects':
      imagePath = `${ROUTES.API.OG_PROJECTS}${trimmedPath}.png`;
      break;
    case 'pages':
      imagePath = `${ROUTES.API.OG_PAGES}${trimmedPath}.png`;
      break;
    default:
      imagePath = defaultOgImage;
  }

  return imagePath;
};

export const removeLeadingSlash = (path: string) => path.replace(/^\/+/g, '');

export const removeTrailingSlash = (path: string) => path.replace(/\/+$/g, '');

export const removeLeadingAndTrailingSlashes = (path: string) => path.replace(/^\/+|\/+$/g, '');

// these 3 functions are for detecting unknown routes
const extractFirstLevelStringValues = (obj: Record<string, any>): Record<string, string> =>
  Object.fromEntries(Object.entries(obj).filter(([key, value]) => typeof value === 'string'));

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
