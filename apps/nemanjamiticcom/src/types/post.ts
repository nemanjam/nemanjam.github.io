import type { CollectionEntry, z } from 'astro:content';

export type PostCollection = CollectionEntry<'post'>;

// other frontmatter props are in post.data...
// readingTimes is in post.readingTimes
export type Post = PostCollection & {
  readingTime: number;
};
