import { useEffect, useMemo, useState } from 'react';

import { getRandomElementFromArray } from '@/utils/array';
import { cn } from '@/utils/styles';

import type { HeroImageProps } from '@/libs/gallery/transform';
import type { FC, ImgHTMLAttributes } from 'react';

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  // Important: must pass all allImagesSrc from the server or they wont be included on client
  galleryImages: HeroImageProps[];
}

const initialImage: HeroImageProps = {
  blur: {
    src: '',
    width: 0,
    height: 0,
  },
  hero: {
    src: '',
    width: 0,
    height: 0,
  },
};

const ImageRandomReact: FC<Props> = ({ galleryImages, className, ...props }) => {
  const randomImage = useMemo(() => getRandomElementFromArray(galleryImages), [galleryImages]);

  const [image, setImage] = useState(initialImage);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setImage(randomImage);
  }, [setImage, randomImage]);

  const handleClick = async () => {
    const randomImage = getRandomElementFromArray(galleryImages);
    setImage(randomImage);
    setIsLoading(true);
  };

  // Todo: use <picture srcSet> for responsive images

  return (
    <>
      {image.blur.src && (
        <img
          {...props}
          src={image.blur.src}
          onClick={handleClick}
          className={cn('cursor-pointer hidden', { block: isLoading }, className)}
          alt="Blur image"
        />
      )}

      {image.hero.src && (
        <img
          {...props}
          src={image.hero.src}
          onClick={handleClick}
          onLoad={() => setIsLoading(false)}
          className={cn(
            'cursor-pointer transition-opacity duration-500 ease-in-out opacity-100 block',
            { 'hidden opacity-0': isLoading },
            className
          )}
          alt="Hero image"
        />
      )}

      {!image.blur.src && !image.hero.src && <div className={cn('', className)}>placeholder</div>}
    </>
  );
};

export default ImageRandomReact;
