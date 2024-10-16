import { PLAUSIBLE_DOMAIN, PLAUSIBLE_SCRIPT_URL, SITE_URL } from 'astro:env/client';

import { configClientSchema } from '@/schemas/config';
import { validateData } from '@/utils/validation';

import type { ConfigClientType } from '@/types/config';

const configClientData: ConfigClientType = {
  /** all urls without '/' */
  SITE_URL,
  SITE_TITLE: 'Marc Andreu',
  SITE_DESCRIPTION: 'I am a full stack web developer.',
  PLAUSIBLE_SCRIPT_URL,
  PLAUSIBLE_DOMAIN,
  PAGE_SIZE_POST_CARD: 3,
  PAGE_SIZE_POST_CARD_SMALL: 6,
  MORE_POSTS_COUNT: 3,
  DEFAULT_MODE: 'light',
  DEFAULT_THEME: 'default-light',
  AUTHOR_NAME: 'Marc Andreu',
  AUTHOR_EMAIL: 'marcandreuf@gmail.com',
  AUTHOR_GITHUB: 'https://github.com/marcandreuf',
  AUTHOR_LINKEDIN: 'https://www.linkedin.com/in/marcandreuf',
  AUTHOR_TWITTER: 'https://x.com/marcandreuf',
  AUTHOR_YOUTUBE: 'https://www.youtube.com/@marcandreuf',
  REPO_URL: 'https://github.com/marcandreuf/marcandeuf.github.io',
};

export const CONFIG_CLIENT = validateData(configClientData, configClientSchema);
