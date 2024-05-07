import { z } from 'zod';

export const nodeEnvValues = ['development', 'test', 'production'] as const;

export const configSchema = z.object({
  NODE_ENV: z.enum(nodeEnvValues),
  SITE_URL: z.string().url(),
  SITE_TITLE: z.string().min(1),
  SITE_DESCRIPTION: z.string().min(1),
  PAGE_SIZE: z.number(),
  AUTHOR_NAME: z.string().min(1),
  AUTHOR_EMAIL: z.string().email(),
});
