import { useEffect, useMemo, useState } from 'react';

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

  // handle blur -> xl image switch
  useEffect(() => {
    const img = new Image();
    img.src = image.xl.src;

    img.onload = () => {
      setHasLoaded(true);
    };
  }, [image, setHasLoaded]);

  const handleClick = async () => {
    const randomImage = getRandomElementFromArray(galleryImages);
    setImage(randomImage);
    setHasLoaded(false);
  };

  const imageSrc = hasLoaded ? image.xl.src : image.blur.src;
  const imageAlt = hasLoaded ? 'Hero image' : 'Blur image';

  // Todo: use <picture srcSet> for responsive images

  return (
    <>
      {imageSrc ? (
        <img
          {...props}
          src={imageSrc}
          alt={imageAlt}
          onClick={handleClick}
          className={cn('cursor-pointer', className)}
        />
      ) : (
        <div className={cn('aspect-video', className)} />
      )}
    </>
  );
};

export default ImageRandomReact;
