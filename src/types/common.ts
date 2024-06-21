import { COLLECTIONS } from '@/constants/collections';

import type { Page } from 'astro';
import type { CollectionEntry } from 'astro:content';

export type CollectionType = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

export type AnyCollection = CollectionEntry<CollectionType>;

/** add more maybe */
export interface Metadata {
  title: string;
  description?: string;
  /** Must be url. */
  image?: string;
}

export interface PaginationProps
  extends Pick<
    Page<AnyCollection>,
    'url' | 'currentPage' | 'lastPage' | 'start' | 'end' | 'total'
  > {}
