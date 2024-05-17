import { z } from 'astro:content';

import { DEFAULTS_POST, TAGS } from '@/constants/collections';

import type { SchemaContext } from 'astro:content';

/** lowercase tags for routes */
const removeDuplicatesAndToLowerCase = (items: string[]) => {
  if (!items.length) return items;
  const lowercaseItems = items.map((str) => str.toLowerCase());
  const distinctItems = new Set(lowercaseItems);
  return Array.from(distinctItems);
};

const { DRAFT, NO_HERO, HERO_IMAGE, HERO_ALT, TOC, CATEGORY } = DEFAULTS_POST;

// schema and collection are separate
export const postSchema = ({ image }: SchemaContext) =>
  z.object({
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    title: z.string(),
    description: z.string().optional(),
    // convert img to object
    noHero: z.boolean().default(NO_HERO),
    heroImage: image().default(HERO_IMAGE),
    heroAlt: z.string().default(HERO_ALT),
    toc: z.boolean().default(TOC),
    draft: z.boolean().default(DRAFT),
    category: z.string().default(CATEGORY),
    tags: z
      .array(
        z.string().refine(
          (tag) => TAGS.includes(tag as (typeof TAGS)[number]),
          (tag) => ({ message: `Invalid tag: ${tag} in the markdown.` })
        )
      )
      // .transform(removeDuplicatesAndToLowerCase) // fix this later
      .nonempty(),
  });
