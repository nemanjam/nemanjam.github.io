import rehypeExternalLinksPlugin from 'rehype-external-links';

import type { Plugin } from 'unified';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const rehypeExternalLinks: [Plugin<any[], any>, any] = [
  rehypeExternalLinksPlugin,
  {
    target: '_blank',
    rel: ['noopener', 'noreferrer'],
    // filter out expressive-code, important
    // skip <a> tags inside <pre> or <code>
    selectors: 'a:not(pre a):not(code a)',
  },
];
