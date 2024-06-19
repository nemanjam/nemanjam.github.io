import { z } from 'zod';

export const nodeEnvValues = ['development', 'test', 'production'] as const;

export const configSchema = z.object({
  NODE_ENV: z.enum(nodeEnvValues),
  // ensure no trailing slash
  SITE_URL: z.string().url().regex(/[^/]$/, 'SITE_URL should not end with a slash'),
  SITE_TITLE: z.string().min(1),
  SITE_DESCRIPTION: z.string().min(1),
  PAGE_SIZE: z.object({
    POST_CARD: z.number(),
    POST_CARD_SMALL: z.number(),
  }),
  MORE_POSTS_COUNT: z.number(),
  AUTHOR_NAME: z.string().min(1),
  AUTHOR_EMAIL: z.string().email(),
  AUTHOR_GITHUB: z.string().url(),
  AUTHOR_LINKEDIN: z.string().url(),
});
