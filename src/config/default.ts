// imported in process-env.ts, ONLY relative imports subtree

import type { ProcessEnvType, RuntimeEnvType } from '../types/config';

export const defaultRuntimeEnvData: RuntimeEnvType = {
  SITE_URL: 'https://nemanjamitic.com',
  PLAUSIBLE_SCRIPT_URL: 'https://plausible.arm1.nemanjamitic.com/js/script.js',
  PLAUSIBLE_DOMAIN: 'nemanjamitic.com',
} as const;

export const defaultProcessEnvData: ProcessEnvType = {
  ...defaultRuntimeEnvData,
  NODE_ENV: 'production',
  PREVIEW_MODE: false,
} as const;
