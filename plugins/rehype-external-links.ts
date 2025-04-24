import rehypeExternalLinksPlugin from 'rehype-external-links';

import type { Plugin } from 'unified';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const rehypeExternalLinks: [Plugin<any[], any>, any] = [
  rehypeExternalLinksPlugin,
  { target: '_blank', rel: ['noopener', 'noreferrer'] },
];
