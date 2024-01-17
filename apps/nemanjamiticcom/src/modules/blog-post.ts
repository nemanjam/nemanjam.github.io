import type { CollectionEntry } from 'astro:content';

const padTwo = (num: number) => `${num}`.padStart(2, '0');

export const getPostSlug = (post: CollectionEntry<'blog'>) => {
  const {
    slug,
    data: { pubDate },
  } = post;

  const year = pubDate.getFullYear();
  const month = padTwo(pubDate.getUTCMonth() + 1);
  const day = padTwo(pubDate.getUTCDate());

  const resultSlug = `${year}-${month}-${day}-${slug}`;
  return resultSlug;
};

/** Must handle empty array. */
export const getRandomEntries = (
  posts: Array<CollectionEntry<'blog'>>,
  count: number,
  excludeSlug?: string
) => {
  if (!(posts.length > 0)) return [];

  const filteredPosts = posts.filter((post) => getPostSlug(post) !== excludeSlug);

  if (!(filteredPosts.length > 0)) return [];

  const shuffledPosts = filteredPosts
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  if (shuffledPosts.length < count) return shuffledPosts;

  return shuffledPosts.slice(0, count);
};
