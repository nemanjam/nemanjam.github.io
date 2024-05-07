import { z } from 'astro:content';

import type { SchemaContext } from 'astro:content';

const validTags = [
  'next.js',
  'react',
  'astro',
  'node',
  'javascript',
  'css',
  'python',
  'devops',
  'self-hosting',
];

const validCategories = ['tutorials', 'tips-and-tricks', 'news', 'showcases', 'tools', 'resources'];

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
    pubDate: z.coerce.date(),
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
          (tag) => validTags.includes(tag),
          (tag) => ({
            message: `'${tag}' is not a valid tag.\nAllowed tags are [ ${validTags.join(', ')} ]\nYou can add more tags in ${import.meta.filename}`,
          })
        )
      )
      // .transform(removeDuplicatesAndToLowerCase) // fix this later
      .nonempty(),
  });
