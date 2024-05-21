import { getCollection } from 'astro:content';

import type { CollectionEntry, CollectionKey } from 'astro:content';

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
