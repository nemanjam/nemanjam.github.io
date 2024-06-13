import { getAllEntries } from '@/modules/common';
import { CATEGORIES, COLLECTIONS } from '@/constants/collections';
import { ROUTES } from '@/constants/routes';
import { CONFIG } from '@/config';
import { renderMarkdown } from '@/utils/markdown';

import type { CategoryType } from '@/constants/collections';
import type { Post, PostCollection } from '@/types/post';
import type { MarkdownProcessorRenderResult } from '@astrojs/markdown-remark';
import type { MarkdownHeading } from 'astro';

const { MORE_POSTS_COUNT } = CONFIG;

/*-------------------------------- getAllPosts ------------------------------*/

export const getAllPosts = (): Promise<PostCollection[]> => getAllEntries(COLLECTIONS.POST);

export const getPostsWithReadingTimeFromPosts = async (
  posts: PostCollection[]
): Promise<Post[]> => {
  const readingTimePromises = posts.map(async (post) => {
    const { remarkPluginFrontmatter } = await post.render();
    const { readingTime } = remarkPluginFrontmatter;
    return { readingTime };
  });
  const readingTimes = await Promise.all(readingTimePromises);

  // other frontmatter props are in post.data...
  // readingTimes is in post.readingTimes
  const postsWithReadingTime = posts.map((post, index) => ({ ...post, ...readingTimes[index] }));
  return postsWithReadingTime;
};

/*-------------------------------- random Posts ------------------------------*/

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
  renderedDescription: MarkdownProcessorRenderResult;
};

/** Don't use this, description without markdown, or myst wrap with prose. */
export const getMorePostsWithRenderedMarkdownDescription = async (
  posts: PostCollection[]
): Promise<CollectionEntryWithRenderedDescription[]> => {
  const morePosts: CollectionEntryWithRenderedDescription[] = [];

  for (const post of posts) {
    const renderedDescription = await renderMarkdown(post.data.description ?? '');
    morePosts.push({ ...post, renderedDescription });
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

export const getTagLinks = (posts: PostCollection[], pathname?: string): FilterLink[] => {
  const filterItems = getSortedUniqueTagsWithCount(posts);

  const itemLinks = filterItems.map((item) => {
    const { text, count } = item;

    const href = `${ROUTES.TAGS}${text}`;
    const textWithCount = `#${text} ${count}`;

    // unused, wont display in category and tag list
    const isActive = href === pathname;

    const link = { href, text, count, textWithCount, isActive };

    return link;
  });

  return itemLinks;
};

export const getSortedUniqueTagsWithCount = (posts: PostCollection[]): Filter[] => {
  // must have duplicated tags here to calc count
  const tags = getAllTags(posts);

  if (!(tags.length > 0)) return [];

  const tagsWithCount = tags.reduce(
    (acc, tag) => {
      const index = acc.findIndex((item) => item.text === tag);
      if (index === -1) return [...acc, { text: tag, count: 1 }];

      acc[index].count++;
      return acc;
    },
    <Filter[]>[]
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

export const getSortedUniqueCategoriesWithCount = (posts: PostCollection[]): Filter[] => {
  const categories = getAllCategories(posts);
  if (!(categories.length > 0)) return [];

  const uniqueCategories = getUniqueCategories(posts);

  const categoriesWithCount = uniqueCategories.map((category) => {
    const count = categories.filter((item) => item === category).length;
    return { text: category, count };
  });

  const sortedCategoriesWithCount = categoriesWithCount.slice().sort((a, b) => b.count - a.count);
  return sortedCategoriesWithCount;
};

export const getCategoryLinks = (posts: PostCollection[], pathname?: string): FilterLink[] => {
  const filterItems = getSortedUniqueCategoriesWithCount(posts);

  const itemLinks = filterItems.map((item) => {
    const { text, count } = item;

    const href = `${ROUTES.CATEGORIES}${text}`;
    const textWithCount = `${text} ${count}`;

    const isActive = href === pathname;

    const link = { href, text, count, textWithCount, isActive };

    return link;
  });

  return itemLinks;
};

const defaultCategory = CATEGORIES[0];

/** set default to prevent breaking build */
export const getCategoryProps = (categoryName: string): CategoryType =>
  CATEGORIES.find((item) => item.name === categoryName) ?? defaultCategory;
