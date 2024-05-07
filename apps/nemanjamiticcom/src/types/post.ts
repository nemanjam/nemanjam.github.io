import { postSchema } from '@/schemas/post';

import type { CollectionEntry, z } from 'astro:content';

export type Post = z.infer<ReturnType<typeof postSchema>> & {
  readingTime: string;
  lastDateModified: string;
};

export type PostCollection = CollectionEntry<'post'>;
