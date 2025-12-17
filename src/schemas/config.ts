import { z } from 'zod';

import { baked } from '../utils/baked';

export const nodeEnvValues = ['development', 'test', 'production'] as const;
export const booleanValues = ['true', 'false', ''] as const;

export const modeValues = ['light', 'dark'] as const;
export const themeValues = ['default-light', 'default-dark', 'green-light', 'green-dark'] as const;

const domainSubdomainRegex =
  /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.(?!-)[A-Za-z0-9-]{1,63}(?<!-))*\.[A-Za-z]{2,}$/;

/** runs after astro:env check in astro.config.ts */
export const processEnvSchema = z.object({
  NODE_ENV: z.enum(nodeEnvValues),
  // Note: string union, not boolean, for baked
  PREVIEW_MODE: z
    .enum(booleanValues)
    .or(z.literal(baked('PREVIEW_MODE')))
    .default('false'),
  SITE_URL: z.url().regex(/[^/]$/, 'SITE_URL should not end with a slash "/"'), // ensure no trailing slash
  PLAUSIBLE_SCRIPT_URL: z.url().or(z.literal('')).optional(),
  PLAUSIBLE_DOMAIN: z
    .string()
    .or(z.enum(['', 'localhost'])) // for types
    .or(z.literal(baked('PLAUSIBLE_DOMAIN')))
    .optional()
    .refine(
      // check regex this way
      (value) =>
        value === undefined ||
        value === '' ||
        value === 'localhost' || // astro:env default
        value === baked('PLAUSIBLE_DOMAIN') ||
        domainSubdomainRegex.test(value),
      { message: 'Invalid hostname for PLAUSIBLE_DOMAIN 1' }
    ),
});

export const configServerSchema = processEnvSchema.omit({
  SITE_URL: true,
  PLAUSIBLE_SCRIPT_URL: true,
  PLAUSIBLE_DOMAIN: true,
});

export const configClientSchema = processEnvSchema
  .pick({ SITE_URL: true, PLAUSIBLE_SCRIPT_URL: true, PLAUSIBLE_DOMAIN: true })
  .extend({
    SITE_URL_CANONICAL: z.string().min(1),
    SITE_TITLE: z.string().min(1),
    SITE_DESCRIPTION: z.string().min(1),
    PAGE_SIZE_POST_CARD: z.number(),
    PAGE_SIZE_POST_CARD_SMALL: z.number(),
    PAGE_SIZE_PROJECT_CARD: z.number(),
    MORE_POSTS_COUNT: z.number(),
    BLUR_IMAGE_DELAY: z.number(),
    DEFAULT_MODE: z.enum(modeValues), // check that theme and mode match
    DEFAULT_THEME: z.enum(themeValues),
    AUTHOR_NAME: z.string().min(1),
    AUTHOR_EMAIL: z.email(),
    AUTHOR_GITHUB: z.url(),
    AUTHOR_LINKEDIN: z.url(),
    AUTHOR_TWITTER: z.url(),
    AUTHOR_YOUTUBE: z.url(),
    REPO_URL: z.url(),
  });
