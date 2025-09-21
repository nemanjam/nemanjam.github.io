import { CONFIG_SERVER } from '@/config/server';

export const isProd = CONFIG_SERVER.NODE_ENV === 'production';

/** undefined is prod */
export const isDev = CONFIG_SERVER.NODE_ENV === 'development';
