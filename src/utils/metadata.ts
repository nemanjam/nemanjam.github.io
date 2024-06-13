import { DEFAULT_METADATA, dotSeparator, pageMetadata } from '@/constants/metadata';
import { getOpenGraphImagePath } from './open-graph-image';

import type { PageMetadataKey } from '@/constants/metadata';
import type { Metadata } from '@/types/common';

export const getPageMetadata = (path: PageMetadataKey): Metadata => {
  const image = getOpenGraphImagePath(path);
  const metadata: Metadata = { ...pageMetadata[path], image };

  return metadata;
};

export const handleTitle = (metadata: Metadata): Metadata => {
  const { title: passedTitle } = metadata;
  const { title: defaultTitle } = DEFAULT_METADATA;

  const newMetadata = {
    ...metadata,
    title: passedTitle ? `${passedTitle} ${dotSeparator} ${defaultTitle}` : defaultTitle,
  };

  return newMetadata;
};
