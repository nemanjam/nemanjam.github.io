import type { z } from 'zod';
import type { configSchema } from '../schemas/config';

export type ConfigSchemaType = typeof configSchema;
export type ConfigType = z.infer<ConfigSchemaType>;
