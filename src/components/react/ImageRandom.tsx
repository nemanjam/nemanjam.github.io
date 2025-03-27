import { useEffect, useMemo, useState } from 'react';

import ImageBlurPreloader from '@/components/react/ImageBlurPreloader';
import { getRandomElementFromArray } from '@/utils/array';
import { cn } from '@/utils/styles';

import type { HeroImage, ImgTagAttributes } from '@/types/image';
import type { FC, ImgHTMLAttributes } from 'react';

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  // Important: must pass all allImagesSrc from the server or they wont be included on client
  galleryImages: HeroImage[];
  divClassName?: string;
}

const imageAttributes: ImgTagAttributes = {
  src: '',
  width: 0,
  height: 0,
};

const initialImage: HeroImage = {
  blur: { ...imageAttributes },
  hero: { ...imageAttributes },
};

const ImageRandomReact: FC<Props> = ({ galleryImages, className, divClassName, ...props }) => {
  const randomImage = useMemo(() => getRandomElementFromArray(galleryImages), [galleryImages]);

  const [image, setImage] = useState(initialImage);

  // initial image, on mount
  useEffect(() => {
    setImage(randomImage);
  }, [setImage, randomImage]);

  const handleClick = async () => {
    const randomImage = getRandomElementFromArray(galleryImages);
    setImage(randomImage);
  };

  return (
    <ImageBlurPreloader
      {...props}
      blurAttributes={{ ...image.blur, alt: 'Blur image' }}
      mainAttributes={{ ...image.hero, onClick: handleClick, alt: 'Hero image' }}
      className={cn('cursor-pointer my-0', className)}
      divClassName={divClassName}
    />
  );
};

export default ImageRandomReact;
