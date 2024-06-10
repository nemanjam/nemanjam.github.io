import { CONFIG } from '@/config';

import type { Metadata } from '@/types/common';

const { SITE_URL, SITE_DESCRIPTION, SITE_TITLE } = CONFIG;

// todo: make default og image with png logo

/** Must be url from public folder. */
export const defaultOgImage = `${SITE_URL}/images/default/default-open-graph-image.jpg`;

export const dotSeparator = '•';

export const DEFAULT_METADATA: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  image: defaultOgImage,
} as const;

export const handleTitle = (metadata: Metadata): Metadata => {
  const { title: passedTitle } = metadata;
  const { title: defaultTitle } = DEFAULT_METADATA;

  const newMetadata = {
    ...metadata,
    title: passedTitle ? `${passedTitle} ${dotSeparator} ${defaultTitle}` : defaultTitle,
  };

  return newMetadata;
};
