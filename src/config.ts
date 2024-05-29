// all relative imports in config subtree

import { configSchema } from './schemas/config';
import { validateConfig } from './utils/config';

import type { ConfigType } from './types/config';

const configData: ConfigType = {
  NODE_ENV: process.env.NODE_ENV,
  SITE_URL: process.env.SITE_URL,
  SITE_TITLE: 'Nemanja Mitic',
  SITE_DESCRIPTION: 'I am John Doe, eat at Joe',
  PAGE_SIZE: 3,
  MORE_POSTS_COUNT: 3,
  AUTHOR_NAME: 'Nemanja Mitic',
  AUTHOR_EMAIL: 'email@email.com',
  AUTHOR_GITHUB: 'https://github.com/nemanjam',
  AUTHOR_LINKEDIN: 'https://www.linkedin.com/in/nemanja-mitic',
};

// todo: Config should go into import.meta.env in astro.config.ts
export const CONFIG = validateConfig(configData, configSchema);
