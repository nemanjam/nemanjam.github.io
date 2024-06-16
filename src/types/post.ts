import type { CollectionEntry } from 'astro:content';

export type PostCollection = CollectionEntry<'post'>;

// other frontmatter props are in post.data...
// readingTimes is in post.readingTimes
export type Post = PostCollection & {
  readingTime: number;
};

export interface PostsByYear {
  years: string[];
  posts: Record<string, Post[]>;
}

export type FilterType = 'tag' | 'category';

/** For both tags and categories. */
export interface Filter {
  text: string;
  count: number;
}

export interface FilterLink {
  href: string;
  text: string;
  count: number;
  textWithCount: string;
  isActive: boolean;
}
