import { cloneElement, useState } from 'react';

import { Gallery as ReactGridGallery } from 'react-grid-gallery';
import Lightbox from 'react-image-lightbox';

import type { ImageProps } from '@/types/common';
import type { ReactElement } from 'react';
import type { ThumbnailImageComponentImageProps } from 'react-grid-gallery';

import 'react-image-lightbox/style.css';

import ThumbnailImage from '@/components/react/ThumbnailImage';

interface Props {
  children?: ReactElement;
  images: ImageProps[];
}

const Gallery: React.FC<Props> = ({ images, children: thumbnailImageComponent }) => {
  const [index, setIndex] = useState(-1);

  const currentImage = images[index];
  const nextIndex = (index + 1) % images.length;
  const nextImage = images[nextIndex] || currentImage;
  const prevIndex = (index + images.length - 1) % images.length;
  const prevImage = images[prevIndex] || currentImage;

  const handleClick = (index: number, _item: ImageProps) => setIndex(index);
  const handleClose = () => setIndex(-1);
  const handleMovePrev = () => setIndex(prevIndex);
  const handleMoveNext = () => setIndex(nextIndex);

  console.log('currentImage', currentImage);

  return (
    <div>
      <ReactGridGallery
        images={images}
        thumbnailImageComponent={(props) => {
          const imageProps: ThumbnailImageComponentImageProps = props.imageProps;

          // key, src, alt, title, style
          const { key: _, ...astroImageProps } = imageProps;

          console.log('imageProps', imageProps);

          return (
            <ThumbnailImage {...props}>
              {cloneElement(thumbnailImageComponent ?? <></>, {
                ...astroImageProps,
              })}
            </ThumbnailImage>
          );
        }}
        onClick={handleClick}
        enableImageSelection={false}
      />
      {!!currentImage && (
        <Lightbox
          imageTitle={currentImage.caption}
          mainSrc={currentImage.originalSrc}
          mainSrcThumbnail={currentImage.src}
          nextSrc={nextImage.originalSrc}
          nextSrcThumbnail={nextImage.src}
          prevSrc={prevImage.originalSrc}
          prevSrcThumbnail={prevImage.src}
          onCloseRequest={handleClose}
          onMovePrevRequest={handleMovePrev}
          onMoveNextRequest={handleMoveNext}
        />
      )}
    </div>
  );
};

export default Gallery;
