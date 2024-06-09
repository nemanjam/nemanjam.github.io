import { defaultOgImage } from '@/constants/metadata';
import { ROUTES } from '@/constants/routes';

export type OpenGraphImageType = 'blog' | 'projects' | 'pages';

export const getDefaultOpenGraphImagePath = (type: OpenGraphImageType, path: string) => {
  let trimmedPath = removeLeadingAndTrailingSlashes(path);
  // recursion for 404??
  if (trimmedPath === '404') return defaultOgImage;

  if (trimmedPath === '') trimmedPath = 'index';

  let imagePath: string;

  switch (type) {
    case 'blog':
      imagePath = `${ROUTES.API.OG_BLOG}${trimmedPath}.png`;
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

  console.log('imagePath', imagePath);

  return imagePath;
};

export const removeLeadingSlash = (path: string) => path.replace(/^\/+/g, '');

export const removeTrailingSlash = (path: string) => path.replace(/\/+$/g, '');

export const removeLeadingAndTrailingSlashes = (path: string) => path.replace(/^\/+|\/+$/g, '');
