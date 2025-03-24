import { useEffect, useMemo, useState } from 'react';

import ImageBlurPreloader from '@/components/react/ImageBlurPreloader';
import { getRandomElementFromArray } from '@/utils/array';
import { cn } from '@/utils/styles';

import type { ImageAttributes, ImageProps } from '@/libs/gallery/transform';
import type { FC, ImgHTMLAttributes } from 'react';

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  // Important: must pass all allImagesSrc from the server or they wont be included on client
  galleryImages: ImageProps[];
}

const imageAttributes: ImageAttributes = {
  src: '',
  width: 0,
  height: 0,
};

const initialImage: ImageProps = {
  blur: { ...imageAttributes },
  xs: { ...imageAttributes },
  md: { ...imageAttributes },
  xl: { ...imageAttributes },
};

const ImageRandomReact: FC<Props> = ({ galleryImages, className, ...props }) => {
  const randomImage = useMemo(() => getRandomElementFromArray(galleryImages), [galleryImages]);

  const [image, setImage] = useState(initialImage);
  const [hasLoaded, setHasLoaded] = useState(false);

  // initial image, on mount
  useEffect(() => {
    setImage(randomImage);
  }, [setImage, randomImage]);

  const handleClick = async () => {
    const randomImage = getRandomElementFromArray(galleryImages);
    setImage(randomImage);
    setHasLoaded(false);
  };

  const imageAlt = hasLoaded ? 'Hero image' : 'Blur image';

  return (
    <ImageBlurPreloader
      {...props}
      blurSrc={image.blur.src}
      src={image.xl.src}
      onSrcLoaded={() => setHasLoaded(true)}
      alt={imageAlt}
      onClick={handleClick}
      className={cn('cursor-pointer', className)}
    />
  );
};

export default ImageRandomReact;
