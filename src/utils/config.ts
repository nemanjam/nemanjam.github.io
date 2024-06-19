// @ts-expect-error, js lib
import treeify from 'object-treeify';

import type { ConfigSchemaType, ConfigType } from '../types/config';

/*------------------ validation -----------------*/

export const validateConfig = (
  config: ConfigType,
  schema: ConfigSchemaType,
  isDebug = true
): ConfigType => {
  const parsedConfig = schema.safeParse(config);

  if (!parsedConfig.success) {
    console.error('Invalid config: ', parsedConfig.error.flatten().fieldErrors);
    throw new Error('Invalid config');
  }

  const { data: parsedConfigData } = parsedConfig;

  if (isDebug) {
    const stringData = treeify(parsedConfigData);
    console.log('parsedConfigData:\n\n' + stringData);
  }

  return parsedConfigData;
};
