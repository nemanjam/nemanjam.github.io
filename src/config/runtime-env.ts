import { CONFIG_CLIENT } from '@/config/client';
import { defaultRuntimeEnvData } from '@/config/default';
import { isDev } from '@/utils/environment';
import { prettyPrintObject } from '@/utils/log';

import type { RuntimeEnvType } from '@/types/config';

const { SITE_URL, PLAUSIBLE_SCRIPT_URL, PLAUSIBLE_DOMAIN } = CONFIG_CLIENT;

/*------------------ runtime env vars -----------------*/

/**
 * Only available on client, at runtime.
 * In development uses env vars from .env file.
 * In production uses env.js or default fallbacks.
 * At build-time uses default fallbacks.
 * Must be a function.
 */
export const getRuntimeEnv = (): RuntimeEnvType => {
  const runtimeEnvDataDev: RuntimeEnvType = { SITE_URL, PLAUSIBLE_SCRIPT_URL, PLAUSIBLE_DOMAIN };

  const runtimeEnvDataProd: RuntimeEnvType = {
    // hardcoded defaults
    ...defaultRuntimeEnvData,
    // loaded overrides from env.js
    SITE_URL: window.__ENV__.SITE_URL,
    PLAUSIBLE_SCRIPT_URL: window.__ENV__.PLAUSIBLE_SCRIPT_URL,
    PLAUSIBLE_DOMAIN: window.__ENV__.PLAUSIBLE_DOMAIN,
  };

  const runtimeEnvData: RuntimeEnvType = isDev ? runtimeEnvDataDev : runtimeEnvDataProd;

  return runtimeEnvData;
};

prettyPrintObject(getRuntimeEnv(), 'runtime CONFIG');
