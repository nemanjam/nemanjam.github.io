import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

import { postSchema } from '@/schemas/post';
import { projectSchema } from '@/schemas/project';
import { BASE_FOLDERS } from '@/constants/collections';

const { POST, PROJECT } = BASE_FOLDERS;

export const postCollection = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: POST }),
  schema: postSchema,
});

export const projectCollection = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: PROJECT }),
  schema: projectSchema,
});

// _schemas folder in collections will be included in type
export const collections = { post: postCollection, project: projectCollection };
