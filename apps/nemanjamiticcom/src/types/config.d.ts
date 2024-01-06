import type { MetaData } from '~/types/models/Post';

// todo: these optional types arent optimal, this is config
// these types arent used anywhere

interface Config {
  site: SiteConfig;
  metadata: MetaDataConfig;
  i18n: I18NConfig;
  apps: { blog: AppBlogConfig };
  ui: any;
  analytics: any;
}
// interface Config extends Partial<ConfigRequired> {}

interface SiteConfigRequired {
  site: string;
  base: string;
  trailingSlash: boolean;
  googleSiteVerificationId: string;
}
interface SiteConfig extends Partial<SiteConfigRequired> {
  name: string;
}

// only title is overridden
interface MetaDataConfig extends Omit<MetaData, 'title'> {
  title?: {
    default: string;
    template: string;
  };
}

interface I18NConfig {
  language: string;
  textDirection: string;
  dateFormatter?: Intl.DateTimeFormat;
}

interface AppBlogConfig {
  isEnabled: boolean;
  postsPerPage: number;
  post: {
    isEnabled: boolean;
    permalink: string;
    robots: {
      index: boolean;
      follow: boolean;
    };
  };
  list: {
    isEnabled: boolean;
    pathname: string;
    robots: {
      index: boolean;
      follow: boolean;
    };
  };
  category: {
    isEnabled: boolean;
    pathname: string;
    robots: {
      index: boolean;
      follow: boolean;
    };
  };
  tag: {
    isEnabled: boolean;
    pathname: string;
    robots: {
      index: boolean;
      follow: boolean;
    };
  };
}

interface AnalyticsConfig {
  vendors: {
    googleAnalytics: {
      id?: string;
      partytown?: boolean;
    };
  };
}

export type { Config };
