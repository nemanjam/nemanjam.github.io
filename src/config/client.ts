import { PLAUSIBLE_DOMAIN, PLAUSIBLE_SCRIPT_URL, SITE_URL } from 'astro:env/client';

import { configClientSchema } from '@/schemas/config';
import { validateData } from '@/utils/validation';

import type { ConfigClientType } from '@/types/config';

const configClientData: ConfigClientType = {
  /** all urls without '/' */
  SITE_URL,
  /** same for all environments, defined here, not env var */
  SITE_URL_CANONICAL: 'https://nemanjamitic.com',
  SITE_TITLE: 'Nemanja Mitic',
  SITE_DESCRIPTION: 'I am Nemanja, a full stack developer',
  PLAUSIBLE_SCRIPT_URL,
  PLAUSIBLE_DOMAIN,
  PAGE_SIZE_POST_CARD: 3,
  PAGE_SIZE_POST_CARD_SMALL: 6,
  PAGE_SIZE_PROJECT_CARD: 6,
  MORE_POSTS_COUNT: 3,
  BLUR_IMAGE_DELAY: 200,
  DEFAULT_MODE: 'light',
  DEFAULT_THEME: 'default-light',
  AUTHOR_NAME: 'Nemanja Mitic',
  AUTHOR_EMAIL: 'nemanja.mitic.elfak@hotmail.com',
  AUTHOR_GITHUB: 'https://github.com/nemanjam',
  AUTHOR_LINKEDIN: 'https://www.linkedin.com/in/nemanja-mitic',
  AUTHOR_TWITTER: 'https://x.com/nemanja_codes',
  AUTHOR_YOUTUBE: 'https://www.youtube.com/@nemanja_codes',
  REPO_URL: 'https://github.com/nemanjam/nemanjam.github.io',
};

/** env vars in app must be accessed only through CLIENT_CONFIG, CONFIG_SERVER, MERGED_CONFIG */
export const CONFIG_CLIENT = validateData(configClientData, configClientSchema);
