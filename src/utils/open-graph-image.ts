import { OG_IMAGE_PREFIXES } from '@/constants/metadata';
import { ROUTES } from '@/constants/routes';
import { removeLeadingAndTrailingSlashes } from '@/utils/paths';

/*--------------------- getDefaultOpenGraphImagePath -------------------*/

const { OG_PAGES } = OG_IMAGE_PREFIXES;

const homePageOgImage = `${ROUTES.API.OG_IMAGES}${OG_PAGES}.png`;
const _404PageOgImage = `${ROUTES.API.OG_IMAGES}${OG_PAGES}404.png`;

export const getOpenGraphImagePath = (path: string) => {
  let trimmedPath = removeLeadingAndTrailingSlashes(path);
  let prefix = trimmedPath.split('/')[0];

  prefix = removeLeadingAndTrailingSlashes(prefix);

  // must not be in global scope
  const prefixes = Object.values(OG_IMAGE_PREFIXES) as string[];

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
