import { Feed } from 'feed';

import { getAllPosts } from '@/modules/post/common';
import { ROUTES } from '@/constants/routes';
import { CONFIG } from '@/config';
import { renderMarkdown } from '@/utils/markdown';
import { isPreviewMode } from '@/utils/preview';

import type { Item } from 'feed';

const { SITE_DESCRIPTION, SITE_TITLE, SITE_URL, AUTHOR_NAME, AUTHOR_EMAIL } = CONFIG;

export const getFeed = async (): Promise<Feed> => {
  const author = {
    name: AUTHOR_NAME,
    email: AUTHOR_EMAIL,
    link: `${SITE_URL}${ROUTES.ABOUT}`,
  };

  const copyright = (date: Date) =>
    `&copy;${date.getFullYear()} ${AUTHOR_NAME}. All rights reserved.`;

  const feed = new Feed({
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
      json: `${SITE_URL}${ROUTES.API.FEED_JSON}`,
      rss: `${SITE_URL}${ROUTES.API.FEED_RSS}`,
    },
    author,
  });

  const sortedPosts = await getAllPosts();

  for (const post of sortedPosts) {
    const { data, body, slug } = post;
    const { title, description, publishDate, heroImage, noHero, draft } = data;

    const includeDrafts = isPreviewMode() && draft;

    // omit drafts
    if (!includeDrafts) continue;

    const url = `${SITE_URL}${ROUTES.BLOG}${slug}/`;
    const { code: content } = await renderMarkdown(body);

    const item: Item = {
      title,
      description,
      id: url,
      link: url,
      date: publishDate,
      published: publishDate,
      author: [author],
      copyright: copyright(publishDate),
      content,
      ...(noHero ? { image: `${SITE_URL}${heroImage.src}` } : {}),
    };

    feed.addItem(item);
  }

  return feed;
};

export const feed = await getFeed();
