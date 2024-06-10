import { OG_IMAGE_PREFIXES } from '@/constants/metadata';
import { ROUTES } from '@/constants/routes';

/*--------------------- getDefaultOpenGraphImagePath -------------------*/

export const getDefaultOpenGraphImagePath = (path: string) => {
  // must not be in global scope
  const prefixes = Object.values(OG_IMAGE_PREFIXES) as string[];
  const { OG_PAGES } = OG_IMAGE_PREFIXES;

  const homePageOgImage = `${ROUTES.API.OG_IMAGES}${OG_PAGES}.png`;
  const _404PageOgImage = `${ROUTES.API.OG_IMAGES}${OG_PAGES}404.png`;

  /*--------------------- data ready -------------------*/

  let trimmedPath = removeLeadingAndTrailingSlashes(path);
  let prefix = trimmedPath.split('/')[0];

  prefix = removeLeadingAndTrailingSlashes(prefix);

  console.log('trimmedPath', trimmedPath);
  console.log('prefix', prefix);

  if (!prefixes.includes(prefix)) {
    console.error(`Unknown path prefix requested: ${prefix}`);
    return _404PageOgImage;
  }

  // prevents recursion on 404
  // if (prefix === 'pages' && !isKnownRoute(trimmedPath)) return _404PageOgImage; // about -> pages/about
  if (trimmedPath === '') return homePageOgImage;

  const imagePath = `${ROUTES.API.OG_IMAGES}${trimmedPath}.png`;

  return imagePath;
};

/*-------------------------------- utils ------------------------------*/

export const removeLeadingSlash = (path: string) => path.replace(/^\/+/g, '');

export const removeTrailingSlash = (path: string) => path.replace(/\/+$/g, '');

export const removeLeadingAndTrailingSlashes = (path: string) => path.replace(/^\/+|\/+$/g, '');

/*----------------------------- detect unknown routes ---------------------------*/

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
