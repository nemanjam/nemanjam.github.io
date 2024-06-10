import { pageMetadata } from '@/constants/metadata';
import { getOpenGraphImagePath } from './open-graph-image';

import type { PageMetadataKey } from '@/constants/metadata';
import type { Metadata } from '@/types/common';

export const getPageMetadata = (path: PageMetadataKey): Metadata => {
  const image = getOpenGraphImagePath(path);
  const metadata: Metadata = { ...pageMetadata[path], image };

  return metadata;
};
