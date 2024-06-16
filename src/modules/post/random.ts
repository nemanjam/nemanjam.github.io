import { CONFIG } from '@/config';

import type { Post } from '@/types/post';

const { MORE_POSTS_COUNT } = CONFIG;

export interface RandomPostsArgs {
  posts: Post[];
  count?: number;
  excludeSlug?: string;
}

/** Must handle empty array. */
export const getRandomPosts = ({
  posts,
  count = MORE_POSTS_COUNT,
  excludeSlug,
}: RandomPostsArgs): Post[] => {
  if (!(posts.length > 0)) return [];

  const filteredPosts = posts.filter((post) => post.slug !== excludeSlug);

  if (!(filteredPosts.length > 0)) return [];

  const shuffledPosts = filteredPosts
    .map((post) => ({ post, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ post }) => post);

  if (shuffledPosts.length < count) return shuffledPosts;

  return shuffledPosts.slice(0, count);
};
