import { COLLECTIONS } from 'constants/collections';

import { renderMarkdown } from '../utils/markdown';
import { getAllEntries } from './common';

import type { MarkdownProcessorRenderResult } from '@astrojs/markdown-remark';
import type { MarkdownHeading } from 'astro';
import type { PostCollection } from '../types/post';

const padTwo = (num: number) => `${num}`.padStart(2, '0');

/*-------------------------------- getAllPosts ------------------------------*/

export const getAllPosts = () => getAllEntries(COLLECTIONS.POST);

/*-------------------------------- Post slug ------------------------------*/

export const getPostSlug = (post: PostCollection) => {
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
  posts: PostCollection[],
  count: number,
  excludeSlug?: string
): PostCollection[] => {
  if (!(posts.length > 0)) return [];

  const filteredPosts = posts.filter((post) => getPostSlug(post) !== excludeSlug);

  if (!(filteredPosts.length > 0)) return [];

  const shuffledPosts = filteredPosts
    .map((post) => ({ post, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ post }) => post);

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
export type CollectionEntryWithRenderedDescription = PostCollection & {
  description: MarkdownProcessorRenderResult;
};

export const getMorePostsWithRenderedMarkdownDescription = async (
  posts: PostCollection[]
): Promise<CollectionEntryWithRenderedDescription[]> => {
  const morePosts: CollectionEntryWithRenderedDescription[] = [];

  for (const post of posts) {
    const description = await renderMarkdown(post.data.description ?? '');
    morePosts.push({ ...post, description });
  }

  return morePosts;
};

/*-------------------------------- tags ------------------------------*/

export const getAllTags = (posts: PostCollection[]): string[] => {
  const tags = posts.flatMap((post) => [...post.data.tags]);
  return tags;
};

export const getUniqueTags = (posts: PostCollection[]): string[] => {
  const uniqueTags = [...new Set([...getAllTags(posts)])];
  return uniqueTags;
};

export interface TagWithCount {
  tag: string;
  count: number;
}

export const getSortedUniqueTagsWithCount = (posts: PostCollection[]): TagWithCount[] => {
  // must have duplicated tags here to calc count
  const tags = getAllTags(posts);

  if (!(tags.length > 0)) return [];

  const tagsWithCount = tags.reduce(
    (acc, tag) => {
      const index = acc.findIndex((item) => item.tag === tag);
      if (index === -1) return [...acc, { tag, count: 1 }];

      acc[index].count++;
      return acc;
    },
    <TagWithCount[]>[]
  );

  const sortedTagsWithCount = tagsWithCount.slice().sort((a, b) => b.count - a.count);
  return sortedTagsWithCount;
};

/*-------------------------------- categories ------------------------------*/

export const getAllCategories = (posts: PostCollection[]): string[] =>
  posts.map((post) => post.data.category).filter(Boolean) as string[];

export const getUniqueCategories = (posts: PostCollection[]): string[] => {
  const uniqueCategories = [...new Set([...getAllCategories(posts)])];
  return uniqueCategories;
};

export interface CategoryWithCount {
  category: string;
  count: number;
}

export const getSortedUniqueCategoriesWithCount = (
  posts: PostCollection[]
): CategoryWithCount[] => {
  const categories = getAllCategories(posts);
  if (!(categories.length > 0)) return [];

  const uniqueCategories = getUniqueCategories(posts);

  const categoriesWithCount = uniqueCategories.map((category) => {
    const count = categories.filter((item) => item === category).length;
    return { category, count };
  });

  const sortedCategoriesWithCount = categoriesWithCount.slice().sort((a, b) => b.count - a.count);
  return sortedCategoriesWithCount;
};
