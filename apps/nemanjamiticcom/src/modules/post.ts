import { renderMarkdown } from '../utils/markdown';

import type { MarkdownProcessorRenderResult } from '@astrojs/markdown-remark';
import type { MarkdownHeading } from 'astro';
import type { CollectionEntry } from 'astro:content';

const padTwo = (num: number) => `${num}`.padStart(2, '0');

/*-------------------------------- Post slug ------------------------------*/

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

/*-------------------------------- random Posts ------------------------------*/

/** Must handle empty array. */
export const getRandomPosts = (
  posts: CollectionEntry<'blog'>[],
  count: number,
  excludeSlug?: string
): CollectionEntry<'blog'>[] => {
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

/*-------------------------------- Toc headings ------------------------------*/

export interface Heading extends Pick<MarkdownHeading, 'slug' | 'text'> {
  headings: Heading[];
}

export const getHeadingsForTableOfContents = (postHeadings: MarkdownHeading[]): Heading[] => {
  // get subtitles for TOC
  const headings: Heading[] = [];

  for (let index = 0; index < postHeadings.length; index++) {
    const { slug, text, depth } = postHeadings[index];

    if (depth !== 2) continue;

    // get subsequent depth 3 subheadings
    // handle 2
    const subHeadings: Heading[] = [];

    // handle 3+
    while (index + 1 < postHeadings.length && postHeadings[index + 1].depth > 2) {
      index++;

      // take only depth 3
      if (postHeadings[index].depth !== 3) continue;

      subHeadings.push({
        slug: postHeadings[index].slug,
        text: postHeadings[index].text,
        headings: [],
      });
    }

    headings.push({ slug, text, headings: subHeadings });
  }

  return headings;
};

/*-------------------------------- More posts ------------------------------*/

// more posts with rendered md description
export type CollectionEntryWithRenderedDescription = CollectionEntry<'blog'> & {
  description: MarkdownProcessorRenderResult;
};

export const getMorePostsWithRenderedMarkdownDescription = async (
  posts: CollectionEntry<'blog'>[]
): Promise<CollectionEntryWithRenderedDescription[]> => {
  const morePosts: CollectionEntryWithRenderedDescription[] = [];

  for (const post of posts) {
    const description = await renderMarkdown(post.data.description ?? '');
    morePosts.push({ ...post, description });
  }

  return morePosts;
};

/*-------------------------------- tags ------------------------------*/

export const getAllTags = (posts: Array<CollectionEntry<'blog'>>): string[] => {
  const allTags = posts.flatMap((post) => [...(post.data.tags ?? [])]);
  return allTags;
};

export const getUniqueTags = (posts: Array<CollectionEntry<'blog'>>): string[] => {
  const uniqueTags = [...new Set([...getAllTags(posts)])];
  return uniqueTags;
};

export interface TagWithCount {
  tag: string;
  count: number;
}

export const getSortedUniqueTagsWithCount = (
  posts: Array<CollectionEntry<'blog'>>
): TagWithCount[] => {
  // must have duplicated tags here to calc count
  const allTags = getAllTags(posts);

  if (!(allTags.length > 0)) return [];

  const tagsMap = allTags.reduce(
    (acc, tag) => {
      const index = acc.findIndex((item) => item.tag === tag);
      if (index === -1) return [...acc, { tag, count: 0 }];

      acc[index].count++;
      return acc;
    },
    <TagWithCount[]>[]
  );

  const sortedTagsMap = tagsMap.slice().sort((a, b) => b.count - a.count);
  return sortedTagsMap;
};
