import { useEffect, useState } from 'react';

import { getRandomElementFromArray } from '@/utils/array';
import { cn } from '@/utils/styles';

import type { FC, ImgHTMLAttributes } from 'react';

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  // Important: must pass all allImagesSrc from the server or they wont be included on client
  allImagesSrc: string[];
}

const ImageRandomReact: FC<Props> = ({ allImagesSrc, className, ...props }) => {
  const [imageSrc, setImageSrc] = useState(allImagesSrc[0]);

  useEffect(() => {
    const run = async () => {
      setImageSrc(getRandomElementFromArray(allImagesSrc));
    };

    run();
  }, [setImageSrc]);

  const handleClick = async () => {
    setImageSrc(getRandomElementFromArray(allImagesSrc));
  };

  // Todo: use <picture srcSet> for responsive images

  return (
    <img
      {...props}
      src={imageSrc}
      onClick={handleClick}
      className={cn('cursor-pointer', className)}
      alt="Random Hero image"
    />
  );
};

export default ImageRandomReact;
