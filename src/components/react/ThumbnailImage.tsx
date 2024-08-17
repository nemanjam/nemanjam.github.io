import { Fragment } from 'react';

import type { ReactNode } from 'react';
import type { ThumbnailImageProps } from 'react-grid-gallery';

interface Props {
  imageProps: ThumbnailImageProps['imageProps'];
  children?: ReactNode;
}

const ThumbnailImage: React.FC<Props> = ({ imageProps, children }) => (
  <Fragment>
    {children ?? <img {...{ ...imageProps, title: imageProps.title ?? undefined }} />}
  </Fragment>
);

export default ThumbnailImage;
