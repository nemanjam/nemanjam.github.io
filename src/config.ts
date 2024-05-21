// all relative imports in config subtree

import { configSchema } from './schemas/config';
import { validateConfig } from './utils/config';

import type { ConfigType } from './types/config';

const configData: ConfigType = {
  NODE_ENV: process.env.NODE_ENV,
  SITE_URL: process.env.SITE_URL,
  SITE_TITLE: 'John Doe',
  SITE_DESCRIPTION: 'I am John Doe, eat at Joe',
  PAGE_SIZE: 2,
  AUTHOR_NAME: 'Nemanja Mitic',
  AUTHOR_EMAIL: 'email@email.com',
  // github, linkedin...
};

// todo: Config should go into import.meta.env in astro.config.ts
export const CONFIG = validateConfig(configData, configSchema);
