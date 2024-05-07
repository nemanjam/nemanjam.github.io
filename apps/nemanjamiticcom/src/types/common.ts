import { COLLECTIONS } from '@/constants/collections';

import type { CollectionEntry } from 'astro:content';

export type CollectionType = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

export type AnyCollection = CollectionEntry<CollectionType>;
