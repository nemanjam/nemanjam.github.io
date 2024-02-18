import type { CollectionEntry } from 'astro:content';

export const sortPostsByDateDesc = (posts: CollectionEntry<'blog'>[]) =>
  posts.slice().sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
