import type { configSchema } from '@/utils/config';
import type { z } from 'zod';

export type ConfigSchemaType = typeof configSchema;
export type ConfigType = z.infer<ConfigSchemaType>;
