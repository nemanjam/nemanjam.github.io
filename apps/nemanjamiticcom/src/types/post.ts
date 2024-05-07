import type { CollectionEntry, z } from 'astro:content';
import type { postSchema } from '../schemas/post';

export type Post = z.infer<ReturnType<typeof postSchema>> & {
  readingTime: string;
  lastDateModified: string;
};

export type PostCollection = CollectionEntry<'post'>;
