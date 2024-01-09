import fs from 'fs';

import dotenv from 'dotenv';
import ejs from 'ejs';
import yaml from 'js-yaml';

import type { Config } from '~/types/config';

// todo: write zod validation for env vars
const envFileName = `.env.${process.env.NODE_ENV}`;
dotenv.config({ path: envFileName });

const DEFAULT_SITE_NAME = 'Website';

// todo: write zod validation for config.yaml, or move to ts
const defaultConfig: Config = {
  site: {
    name: DEFAULT_SITE_NAME,
    site: undefined,
    base: '/',
    trailingSlash: false,
    googleSiteVerificationId: '',
  },
  metadata: {
    title: {
      default: DEFAULT_SITE_NAME,
      template: '%s',
    },
    description: '',
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      type: 'website',
    },
  },
  i18n: {
    language: 'en',
    textDirection: 'ltr',
    dateFormatter: new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    }),
  },
  apps: {
    blog: {
      isEnabled: false,
      postsPerPage: 6,
      post: {
        isEnabled: true,
        permalink: '/blog/%slug%',
        robots: {
          index: true,
          follow: true,
        },
      },
      list: {
        isEnabled: true,
        pathname: 'blog',
        robots: {
          index: true,
          follow: true,
        },
      },
      category: {
        isEnabled: true,
        pathname: 'category',
        robots: {
          index: true,
          follow: true,
        },
      },
      tag: {
        isEnabled: true,
        pathname: 'tag',
        robots: {
          index: false,
          follow: true,
        },
      },
    },
  },
  ui: {
    theme: 'system',
  },
  analytics: {
    vendors: {
      googleAnalytics: {
        id: undefined,
        partytown: true,
      },
    },
  },
} as const;

const mergeConfig = (config: Config): Config => {
  const mergedConfig: Config = {
    ...(config.site && {
      site: {
        ...defaultConfig.site,
        ...config.site,
      },
    }),
    ...(config.metadata && {
      metadata: {
        ...defaultConfig.metadata,
        ...config.metadata,
        title: {
          ...defaultConfig.metadata?.title,
          ...config.metadata.title,
          ...(config.site?.name && {
            default: config.site.name,
          }),
        },
        robots: {
          ...defaultConfig.metadata?.robots,
          ...config.metadata?.robots,
        },
        openGraph: {
          ...defaultConfig.metadata?.openGraph,
          ...config.metadata?.openGraph,
        },
      },
    }),
    ...(config.i18n && {
      i18n: {
        ...defaultConfig.i18n,
        ...config.i18n,
        dateFormatter: new Intl.DateTimeFormat(config.i18n.language, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          timeZone: 'UTC',
        }),
      },
    }),
    ...(config.apps && {
      apps: {
        blog: {
          ...defaultConfig.apps?.blog,
          ...config.apps?.blog,
          post: {
            ...defaultConfig.apps?.blog.post,
            ...config.apps?.blog.post,
            robots: {
              ...defaultConfig.apps?.blog.post.robots,
              ...config.apps?.blog.post.robots,
            },
          },
          list: {
            ...defaultConfig.apps?.blog.list,
            ...config.apps?.blog.list,
            robots: {
              ...defaultConfig.apps?.blog.list.robots,
              ...config.apps?.blog.list.robots,
            },
          },
          category: {
            ...defaultConfig.apps?.blog.category,
            ...config.apps?.blog.category,
            robots: {
              ...defaultConfig.apps?.blog.category.robots,
              ...config.apps?.blog.category.robots,
            },
          },
          tag: {
            ...defaultConfig.apps?.blog.tag,
            ...config.apps?.blog.tag,
            robots: {
              ...defaultConfig.apps?.blog.tag.robots,
              ...config.apps?.blog.tag.robots,
            },
          },
        },
      },
    }),
    ...(config.ui && {
      ui: {
        ...defaultConfig.ui,
        ...config.ui,
      },
    }),
    ...(config.analytics && {
      analytics: {
        vendors: {
          googleAnalytics: {
            ...defaultConfig.analytics.vendors.googleAnalytics,
            ...config.analytics.vendors.googleAnalytics,
          },
        },
      },
    }),
  };

  return mergedConfig;
};

const loadConfig = (): Config => {
  // merge .env vars and yaml
  const envContext = { site: { site: process.env.PUBLIC_SITE_HOSTNAME } };
  const configYamlTemplate = fs.readFileSync('src/config.yaml', 'utf8');

  const configString = ejs.render(configYamlTemplate, envContext);
  const config = yaml.load(configString) as Config;

  // console.log('config', JSON.stringify(config, null, 2));

  return config;
};

const loadedConfig = loadConfig();
export const config = mergeConfig(loadedConfig);

// todo: temporary, single config object
export const SITE = config.site;
export const I18N = config.i18n;
export const METADATA = config.metadata;
export const APP_BLOG = config.apps?.blog;
export const UI = config.ui;
export const ANALYTICS = config.analytics;
