import { z } from 'astro:content';

import { DEFAULTS_PROJECT } from '@/constants/collections';

import type { SchemaContext } from 'astro:content';

const { DRAFT, HERO_IMAGE, HERO_ALT } = DEFAULTS_PROJECT;

export const projectSchema = ({ image }: SchemaContext) =>
  z.object({
    title: z.string(),
    publishDate: z.coerce.date(),
    description: z.string().optional(),
    heroImage: image().default(HERO_IMAGE),
    heroAlt: z.string().default(HERO_ALT),
    draft: z.boolean().default(DRAFT),
  });
