import type { z } from 'zod';
import type { configSchema, processEnvSchema } from '../schemas/config';

export type ConfigSchemaType = typeof configSchema;
export type ConfigType = z.infer<ConfigSchemaType>;

export type ProcessEnvSchemaType = typeof processEnvSchema;
export type ProcessEnvType = z.infer<ProcessEnvSchemaType>;
