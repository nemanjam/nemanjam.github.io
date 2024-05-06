import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import rehypePrettyCode from 'rehype-pretty-code';

export const rehypePlugins = [
  [
    rehypePrettyCode,
    {
      // this is shiki theme, not editor theme
      theme: JSON.parse(
        readFileSync(
          path.join(fileURLToPath(import.meta.url), '../../config/theme/moonlight-ii-custom.json'),
          'utf-8'
        )
      ),
      onVisitLine(node) {
        // Prevent lines from collapsing in `display: grid` mode, and
        // allow empty lines to be copy/pasted
        if (node.children.length === 0) {
          node.children = [{ type: 'text', value: ' ' }];
        }
        if (!node.properties.className) {
          node.properties.className = [''];
        }
        node.properties.className.push(
          'inline-block',
          'w-full',
          'px-4',
          'lg:px-8',
          'border-l-4',
          'border-transparent'
        );
      },
      onVisitHighlightedLine(node) {
        if (!node.properties.className) {
          node.properties.className = [''];
        }
        node.properties.className.push('bg-pink-500/20', 'py-px', 'border-l-pink-500/80');
      },
      onVisitHighlightedWord(node) {
        if (!node.properties.className) {
          node.properties.className = [''];
        }
        node.properties.className = ['bg-pink-700/40', 'rounded', 'p-1', '-m-1'];
      },
    },
  ],
];
