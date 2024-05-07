import { z } from 'astro:content';

import type { SchemaContext } from 'astro:content';

export const projectSchema = ({ image }: SchemaContext) =>
  z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string().optional(),
    heroImage: image(),
    herAlt: z.string().optional(),
    draft: z.boolean().optional(),
  });
