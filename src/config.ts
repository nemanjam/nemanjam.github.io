// all relative imports in config subtree
import dotenv from 'dotenv';

import { configSchema, nodeEnvValues } from './schemas/config';
import { validateConfig } from './utils/config';

import type { ConfigType } from './types/config';

/*------------------ load .env file -----------------*/

// import.meta.env is not available in astro.config.mjs, only after the config is loaded.
// ! MUST use process.env for vars used in astro.config.mjs.
// https://github.com/withastro/astro/issues?q=.env+file+not+loaded

const NODE_ENV = process.env.NODE_ENV;

if (!nodeEnvValues.includes(NODE_ENV)) {
  console.error('Invalid process.env.NODE_ENV: ', NODE_ENV);
  throw new Error('Invalid process.env.NODE_ENV');
}

const envFileName = `.env.${NODE_ENV}`;
dotenv.config({ path: envFileName });

/*-------------------- configData -------------------*/

/** SSG - all env vars are build time only. */
const configData: ConfigType = {
  NODE_ENV: process.env.NODE_ENV,
  PREVIEW_MODE: process.env.PREVIEW_MODE,
  /** without '/' */
  SITE_URL: process.env.SITE_URL,
  SITE_TITLE: 'Nemanja Mitic',
  SITE_DESCRIPTION: 'I am John Doe, eat at Joe',
  PAGE_SIZE: { POST_CARD: 3, POST_CARD_SMALL: 10 },
  MORE_POSTS_COUNT: 3,
  AUTHOR_NAME: 'Nemanja Mitic',
  AUTHOR_EMAIL: 'email@email.com',
  AUTHOR_GITHUB: 'https://github.com/nemanjam',
  AUTHOR_LINKEDIN: 'https://www.linkedin.com/in/nemanja-mitic',
};

// todo: Config should go into import.meta.env in astro.config.ts
export const CONFIG = validateConfig(configData, configSchema);
