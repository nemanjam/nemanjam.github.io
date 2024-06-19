import type { AnyCollection, PaginationProps } from '@/types/common';
import type { Page } from 'astro';

export const pickPaginationPropsFromPage = (page: Page<AnyCollection>): PaginationProps => ({
  url: page.url,
  currentPage: page.currentPage,
  lastPage: page.lastPage,
});
