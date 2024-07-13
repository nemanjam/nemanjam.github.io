import { OG_IMAGE_PREFIXES } from '@/constants/metadata';
import { ROUTES } from '@/constants/routes';
import { removeLeadingAndTrailingSlashes } from '@/utils/paths';

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
