import { ROUTES } from '@/constants/routes';

export const getRandomInt = (max: number, min = 0) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const getRandomLengthSubstring = (inputString: string, length: number, margin = 0) =>
  inputString.substring(0, length + getRandomInt(margin));

export const trimHttpProtocol = (url: string) => {
  const trailingSlashRegex = /\/$/;
  const protocolRegex = /^(https?:\/\/)/i;

  const withoutSlash = url.replace(trailingSlashRegex, '');
  const withoutProtocol = withoutSlash.replace(protocolRegex, '');

  return withoutProtocol;
};

export const isActiveNavItem = ({
  routePathname,
  navItemHref,
}: {
  routePathname: string;
  navItemHref: string;
}): boolean => {
  let isActive: boolean;

  switch (true) {
    // navItemHref identifies button, routePathname is route
    case navItemHref === ROUTES.BLOG && routePathname === ROUTES.BLOG:
    case navItemHref === ROUTES.ABOUT && routePathname === ROUTES.ABOUT:
    case navItemHref === ROUTES.HOME && routePathname === ROUTES.HOME:
    case navItemHref === ROUTES.RESUME && routePathname === ROUTES.RESUME:
    case navItemHref === ROUTES.PROJECTS && routePathname.startsWith(ROUTES.PROJECTS):
    case navItemHref === ROUTES.TAGS && routePathname.startsWith(ROUTES.TAGS):
    case navItemHref === ROUTES.CATEGORIES && routePathname.startsWith(ROUTES.CATEGORIES):
    case navItemHref === ROUTES.BLOG &&
      !routePathname.startsWith(ROUTES.TAGS) &&
      !routePathname.startsWith(ROUTES.CATEGORIES) &&
      routePathname.startsWith(ROUTES.BLOG):
      isActive = true;
      break;

    default:
      isActive = false;
      break;
  }

  return isActive;
};

/**
 * Example article 3 reprehenderit ipsum qui tempor - 48 chars
 * h2 text-2xl
 */
export const isSingleLineTitle = (title: string): boolean => {
  const SINGLE_LINE_TITLE_CHARS_LENGTH = 48 as const;

  const result = title.length <= SINGLE_LINE_TITLE_CHARS_LENGTH;

  return result;
};
