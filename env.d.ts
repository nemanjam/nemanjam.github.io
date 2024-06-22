declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    SITE_URL: string;
    /** Optional in .env file but always defined in type. Default: false. */
    PREVIEW_MODE: boolean;
  }
}
