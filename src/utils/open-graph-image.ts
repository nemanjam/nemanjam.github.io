import { OG_IMAGE_PREFIXES } from '@/constants/metadata';
import { ROUTES } from '@/constants/routes';
import { removeFirstPathSegment, removeLeadingAndTrailingSlashes } from '@/utils/paths';

import type { OgImagePrefixType } from '@/constants/metadata';

/*--------------------- getOpenGraphImagePath -------------------*/

export const getOpenGraphImagePath = (path: string): string => {
  // only to throw for invalid path
  const _prefix = getPagePrefix(path);

  const trimmedPath = removeLeadingAndTrailingSlashes(path);

  const imagePath = `${ROUTES.API.OG_IMAGES}${trimmedPath}.png`;

  return imagePath;
};

export const getPagePrefix = (path: string): OgImagePrefixType => {
  const trimmedPath = removeLeadingAndTrailingSlashes(path);
  let prefix = trimmedPath.split('/')[0];

  prefix = removeLeadingAndTrailingSlashes(prefix);

  // must not be in global scope
  const prefixes = Object.values(OG_IMAGE_PREFIXES) as string[];

  if (!prefixes.includes(prefix)) {
    const message = `Unknown path prefix requested: ${prefix}`;
    console.error(message);
    throw new Error(message);
  }

  return prefix as OgImagePrefixType;
};

/** not needed function, wrong */
export const getPathForGetStaticPaths = (path: string): string => {
  const prefix = getPagePrefix(path);

  let staticPath: string;

  switch (prefix) {
    case OG_IMAGE_PREFIXES.OG_BLOG:
    case OG_IMAGE_PREFIXES.OG_PROJECTS:
      staticPath = path;
      break;
    case OG_IMAGE_PREFIXES.OG_PAGES:
    case OG_IMAGE_PREFIXES.OG_LISTS:
      staticPath = removeFirstPathSegment(path);
      break;

    default:
      throw new Error(`Unknown static path prefix requested: ${prefix}`);
  }

  return staticPath;
};
