import { useEffect, useState } from 'react';

import { getRandomImageSrc } from '@/utils/image';
import { cn } from '@/utils/styles';

import type { FC } from 'react';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {}

const ImageRandom: FC<Props> = ({ className, ...props }) => {
  const [imageSrc, setImageSrc] = useState(''); // use loader image

  useEffect(() => {
    const run = async () => {
      setImageSrc(await getRandomImageSrc());
    };

    run();
  }, [setImageSrc]);

  const handleClick = async () => {
    setImageSrc(await getRandomImageSrc());
  };

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

export default ImageRandom;
