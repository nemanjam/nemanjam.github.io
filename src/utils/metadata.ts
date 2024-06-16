import { DEFAULT_METADATA, dotSeparator, PAGE_METADATA } from '@/constants/metadata';
import { getOpenGraphImagePath } from './open-graph-image';

import type { Metadata } from '@/types/common';
import type { PageMetadataKey } from '@/types/constants';

export const getPageMetadata = (path: PageMetadataKey): Metadata => {
  const image = getOpenGraphImagePath(path);
  const metadata: Metadata = { ...PAGE_METADATA[path], image };

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
