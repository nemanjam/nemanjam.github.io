import { CONFIG_SERVER } from '@/config/server';

export const isProd = CONFIG_SERVER.NODE_ENV === 'production';
