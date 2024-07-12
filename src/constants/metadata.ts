import { CONFIG } from '@/config';

import type { Metadata } from '@/types/common';
import type { ValueUnion } from '@/types/utils';

// can't import getDefaultOpenGraphImagePath here, circular dependency

const { SITE_URL, SITE_DESCRIPTION, SITE_TITLE } = CONFIG;

// todo: make default og image with png logo

/** Must be url from public folder. */
export const defaultOgImage = `${SITE_URL}/images/default/default-open-graph-image.jpg`;

export const dotSeparator = '•';

export const DEFAULT_METADATA: Required<Metadata> = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  image: defaultOgImage,
} as const;

/**
 * Metadata for all pages that aren't defined in markdown.
 * Add it here for every new page.
 * Reused for ogImage api route.
 */
export const PAGE_METADATA = {
  // list pages
  // must have 'list' prefix to omit type arg
  'lists/blog': {
    title: 'Blog',
    description:
      'Est aliquip reprehenderit eu esse duis laboris cillum adipisicing reprehenderitvoluptate ex aute voluptate.',
  },
  'lists/blog/tags': {
    title: 'Tags',
  },
  // 'src/pages/blog/tags/[tag]/[...page].astro' // dynamic tag param
  'lists/blog/explore': {
    title: 'Explore',
  },
  'lists/blog/categories': {
    title: 'Categories',
  },
  // src/pages/blog/categories/[category]/[...page].astro
  'lists/projects': {
    title: 'Projects',
    description: 'A showcase of experiments and projects.',
  },
} as const;

export type PageMetadataKey = keyof typeof PAGE_METADATA;

export const OG_IMAGE_PREFIXES = {
  OG_BLOG: 'blog',
  OG_PROJECTS: 'projects',
  OG_PAGES: 'pages',
  OG_LISTS: 'lists',
} as const;

export type OgImagePrefixType = ValueUnion<typeof OG_IMAGE_PREFIXES>;
