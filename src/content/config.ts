import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

import { postSchema } from '@/schemas/post';
import { projectSchema } from '@/schemas/project';
import { BASE_FOLDERS } from '@/constants/collections';

const { POST, PROJECT } = BASE_FOLDERS;

type GenerateIdFn = Parameters<typeof glob>[0]['generateId'];

/**
 * Format id slug. Remove '/' to avoid catch all [...page].astro route.
 *
 * @example filepath: 2024/03-15-example-project-2/index.mdx -> slug: 2024-03-15-example-project-2
 */
const generateId: GenerateIdFn = ({ entry }: { entry: string }) =>
  entry.split('/').slice(0, 2).join('-');

export const postCollection = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: POST, generateId }),
  schema: postSchema,
});

export const projectCollection = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: PROJECT, generateId }),
  schema: projectSchema,
});

// _schemas folder in collections will be included in type
export const collections = { post: postCollection, project: projectCollection };
