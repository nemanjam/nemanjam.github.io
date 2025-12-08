import { defineStackbitConfig } from '@stackbit/types';
import { GitContentSource } from '@stackbit/cms-git';

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0',
  ssgName: 'custom',
  nodeVersion: '18',
  devCommand: 'node_modules/.bin/astro dev --port {PORT} --hostname 127.0.0.1',
  experimental: {
    ssg: {
      name: 'Astro',
      logPatterns: {
        up: ['is ready', 'astro'],
      },
      directRoutes: {
        'socket.io': 'socket.io',
      },
      passthrough: ['/vite-hmr/**'],
    },
  },
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ['src/content/post', 'src/content/project'],
      models: [
        // Post content model
        {
          name: 'post',
          type: 'page',
          urlPath: '/blog/{slug}',
          filePath: 'src/content/post/{year}/{slug}/index.mdx',
          fields: [
            {
              name: 'title',
              type: 'string',
              required: true,
              default: 'New Post',
            },
            {
              name: 'description',
              type: 'text',
              required: false,
              default: 'Post description',
            },
            {
              name: 'publishDate',
              type: 'date',
              required: true,
            },
            {
              name: 'updatedDate',
              type: 'date',
              required: false,
            },
            {
              name: 'heroImage',
              type: 'image',
              required: false,
            },
            {
              name: 'heroAlt',
              type: 'string',
              required: false,
              default: 'Hero image',
            },
            {
              name: 'noHero',
              type: 'boolean',
              required: false,
              default: false,
            },
            {
              name: 'toc',
              type: 'boolean',
              required: false,
              default: true,
              label: 'Table of Contents',
            },
            {
              name: 'draft',
              type: 'boolean',
              required: false,
              default: false,
            },
            {
              name: 'category',
              type: 'enum',
              required: false,
              default: 'tutorials',
              options: [
                'tutorials',
                'homelab',
                'tips-and-tricks',
                'news',
                'showcases',
                'video',
                'tools',
                'resources',
              ],
            },
            {
              name: 'tags',
              type: 'list',
              required: true,
              items: {
                type: 'enum',
                options: [
                  'next.js',
                  'react',
                  'astro',
                  'node.js',
                  'javascript',
                  'css',
                  'python',
                  'devops',
                  'docker',
                  'self-hosting',
                  'algorithms',
                  'computer-science',
                ],
              },
            },
          ],
        },
        // Project content model
        {
          name: 'project',
          type: 'page',
          urlPath: '/projects/{slug}',
          filePath: 'src/content/project/{year}/{slug}/index.mdx',
          fields: [
            {
              name: 'title',
              type: 'string',
              required: true,
              default: 'New Project',
            },
            {
              name: 'description',
              type: 'text',
              required: false,
              default: 'Project description',
            },
            {
              name: 'publishDate',
              type: 'date',
              required: true,
            },
            {
              name: 'updatedDate',
              type: 'date',
              required: false,
            },
            {
              name: 'heroImage',
              type: 'image',
              required: false,
            },
            {
              name: 'heroAlt',
              type: 'string',
              required: false,
              default: 'Hero image',
            },
            {
              name: 'draft',
              type: 'boolean',
              required: false,
              default: false,
            },
          ],
        },
      ],
      assetsConfig: {
        referenceType: 'static',
        staticDir: 'src/content',
        uploadDir: '_images',
        publicPath: '/src/content/',
      },
    }),
  ],
});
