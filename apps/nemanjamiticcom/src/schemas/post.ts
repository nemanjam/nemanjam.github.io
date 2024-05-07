import { z } from 'astro:content';

import { TAGS } from '../constants/collections';

import type { SchemaContext } from 'astro:content';

/** lowercase tags for routes */
const removeDuplicatesAndToLowerCase = (items: string[]) => {
  if (!items.length) return items;
  const lowercaseItems = items.map((str) => str.toLowerCase());
  const distinctItems = new Set(lowercaseItems);
  return Array.from(distinctItems);
};

// schema and collection are separate
export const postSchema = ({ image }: SchemaContext) =>
  z.object({
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    title: z.string(),
    description: z.string().optional(),
    draft: z.boolean().optional(),
    // convert img to object
    noHero: z.boolean().optional(),
    heroImage: image().optional(),
    heroAlt: z.string().optional(),
    toc: z.boolean().optional(),
    category: z.string().optional(),
    tags: z
      .array(
        z.string().refine(
          (tag) => TAGS.includes(tag),
          (tag) => ({ message: `Invalid tag: ${tag} in the markdown.` })
        )
      )
      // .transform(removeDuplicatesAndToLowerCase) // fix this later
      .nonempty(),
  });
