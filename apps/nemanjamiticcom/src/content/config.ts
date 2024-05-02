import { defineCollection, z } from 'astro:content';

/** lowercase tags for routes */
const removeDuplicatesAndToLowerCase = (items: string[]) => {
  if (!items.length) return items;
  const lowercaseItems = items.map((str) => str.toLowerCase());
  const distinctItems = new Set(lowercaseItems);
  return Array.from(distinctItems);
};

export const collections = {
  blog: defineCollection({
    schema: ({ image }) =>
      z.object({
        description: z.string().optional(),
        draft: z.boolean().optional(),
        noHero: z.boolean().optional(),
        heroImage: image().optional(),
        heroAlt: z.string().optional(),
        pubDate: z.coerce.date(),
        title: z.string(),
        toc: z.boolean().optional(),
        updatedDate: z.coerce.date().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).default([]).transform(removeDuplicatesAndToLowerCase),
      }),
  }),
  project: defineCollection({
    schema: ({ image }) =>
      z.object({
        description: z.string().optional(),
        heroImage: image(),
        herAlt: z.string().optional(),
        title: z.string(),
        pubDate: z.coerce.date(),
      }),
  }),
};
