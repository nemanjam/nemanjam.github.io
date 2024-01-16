import type { CollectionEntry } from 'astro:content';

function padTwo(num: number) {
  return `${num}`.padStart(2, '0');
}

export function getPostSlug(post: CollectionEntry<'blog'>) {
  const {
    slug,
    data: { pubDate },
  } = post;
  return `${pubDate.getFullYear()}-${padTwo(pubDate.getUTCMonth() + 1)}-${padTwo(pubDate.getUTCDate())}-${slug}`;
}

// cant handle 1 article, rewrite this
export function getRandomEntries(posts: Array<CollectionEntry<'blog'>>, count: number, excludeSlug?: string) {
  const shuffled = posts.slice(0).filter((e) => getPostSlug(e) !== excludeSlug);
  let i = shuffled.length - 1;
  const min = i - count;
  while (i > min) {
    const index = Math.floor((i + 1) * Math.random());
    const temp = shuffled[index]!;
    shuffled[index] = shuffled[i]!;
    shuffled[i] = temp;
    i -= 1;
  }
  return shuffled.slice(min);
}
