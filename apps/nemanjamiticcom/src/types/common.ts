import type { CollectionEntry } from 'astro:content';
import type { COLLECTIONS } from 'constants/collections';

export type CollectionType = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

export type AnyCollection = CollectionEntry<CollectionType>;
