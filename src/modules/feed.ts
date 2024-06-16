import { createMarkdownProcessor } from '@astrojs/markdown-remark';

import { Feed } from 'feed';

import { getAllPosts } from '@/modules/post/common';
import { ROUTES } from '@/constants/routes';
import { CONFIG } from '@/config';

import type { Item } from 'feed';

const { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } = CONFIG;

const author = {
  name: 'Nemanja Mitic',
  email: 'email@email.com',
  link: `${SITE_URL}/about`,
};
const copyright = (date: Date) => `&copy;${date.getFullYear()} copyright text`;

export const feed = new Feed({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  id: SITE_URL,
  link: SITE_URL,
  language: 'en',
  image: `${SITE_URL}/images/favicons/favicon-32x32.png`,
  favicon: `${SITE_URL}/favicon.ico`,
  copyright: copyright(new Date()),
  updated: new Date(),
  feedLinks: {
    json: `${SITE_URL}/feed.json`,
    rss: `${SITE_URL}/feed.xml`,
  },
  author,
});

const sortedRawPosts = await getAllPosts();

const { render: renderMarkdown } = await createMarkdownProcessor({});

for (const post of sortedRawPosts) {
  const match = post.slug.match(/^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})-(?<slug>.+)/);
  if (!match || !post.slug || post.data.draft) {
    continue;
  }
  const slug = Object.values(match.groups!).join('/');

  const url = `${SITE_URL}${ROUTES.BLOG}${slug}/`;
  const { code: description } = await renderMarkdown(
    `${post.data.description || ''}\n\n[Continue reading…](${url})`
  );
  const { code: content } = await renderMarkdown(post.body);

  const item: Item = {
    title: post.data.title,
    description,
    id: url,
    link: url,
    date: post.data.publishDate,
    published: post.data.publishDate,
    author: [author],
    copyright: copyright(post.data.publishDate),
    content,
  };
  if (post.data.heroImage?.src) {
    item.image = `${SITE_URL}${post.data.heroImage.src}`;
  }

  feed.addItem(item);
}
