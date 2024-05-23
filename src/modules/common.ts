import { getCollection } from 'astro:content';

import type { CollectionEntry, CollectionKey } from 'astro:content';

// todo: replace this
export const padTwo = (num: number) => `${num}`.padStart(2, '0');

/*-------------------------------- all entries ------------------------------*/

export interface GetAllEntriesOptions {
  skipSort?: boolean;
}

/** Sorts by publishDate desc by default. Newest on top. */
export const getAllEntries = async <T extends CollectionKey>(
  collectionName: T,
  options?: GetAllEntriesOptions
): Promise<CollectionEntry<T>[]> => {
  const { skipSort = false } = options ?? {};

  const entries = await getCollection<T>(collectionName, ({ data }) => {
    const isProdAndDraft = import.meta.env.PROD && data.draft;
    return !isProdAndDraft;
  });

  if (skipSort) return entries;

  const sortedEntries = sortEntriesByDateDesc(entries);
  return sortedEntries;
};

/*-------------------------------- sort by publishDate ------------------------------*/

export const sortEntriesByDateDesc = <T extends CollectionKey>(entries: CollectionEntry<T>[]) =>
  entries.slice().sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());

/*------------------------ get slug, same for Post and Project ----------------------*/

export const geSlugFromEntry = (entry: CollectionEntry<'post' | 'project'>): string => {
  const { slug, data } = entry;
  const { publishDate } = data;

  const year = publishDate.getFullYear();
  const month = padTwo(publishDate.getUTCMonth() + 1);
  const day = padTwo(publishDate.getUTCDate());

  const resultSlug = `${year}-${month}-${day}-${slug}`;
  console.log('resultSlug', resultSlug);

  return resultSlug;
};
