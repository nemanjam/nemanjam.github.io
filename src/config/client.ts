import { PLAUSIBLE_DOMAIN, PLAUSIBLE_SCRIPT_URL, SITE_URL } from 'astro:env/client';

import { configClientSchema } from '@/schemas/config';
import { validateData } from '@/utils/validation';

import type { ConfigClientType } from '@/types/config';

const configClientData: ConfigClientType = {
  /** all urls without '/' */
  SITE_URL,
  /** same for all environments, defined here, not env var */
  SITE_URL_CANONICAL: 'https://facechuhai.com',
  SITE_TITLE: '脸哥-Shopify独立站和出海教程',
  SITE_DESCRIPTION: 'Shopify 独立站运营与出海教程。提供从建站基础、选品策略、流量获取到数据分析的全流程学习路径',
  PLAUSIBLE_SCRIPT_URL,
  PLAUSIBLE_DOMAIN,
  PAGE_SIZE_POST_CARD: 3,
  PAGE_SIZE_POST_CARD_SMALL: 6,
  PAGE_SIZE_PROJECT_CARD: 6,
  MORE_POSTS_COUNT: 3,
  BLUR_IMAGE_DELAY: 200,
  DEFAULT_MODE: 'light',
  DEFAULT_THEME: 'default-light',
  AUTHOR_NAME: '脸哥出海',
  AUTHOR_EMAIL: 'wyhshines@gmail.com',
  AUTHOR_GITHUB: 'https://github.com/nemanjam',
  AUTHOR_LINKEDIN: 'https://www.linkedin.com/in/nemanja-mitic',
  AUTHOR_TWITTER: 'https://x.com/nemanja_codes',
  AUTHOR_YOUTUBE: 'https://www.youtube.com/@nemanja_codes',
  REPO_URL: 'https://github.com/nemanjam/nemanjam.github.io',
};

export const CONFIG_CLIENT = validateData(configClientData, configClientSchema);
