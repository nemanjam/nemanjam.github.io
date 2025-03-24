import { useEffect, useState } from 'react';

import usePrevious from '@/components/react/hooks/usePrevious';
import { cn } from '@/utils/styles';

import type { FC, ImgHTMLAttributes } from 'react';

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  blurSrc: string;
  className?: string;
  divClassName?: string;
  onSrcLoaded?: () => void;
}

const initialSrc = '' as const;

const ImageBlurPreloader: FC<Props> = ({
  blurSrc = initialSrc,
  src = initialSrc,
  onSrcLoaded,
  className,
  divClassName,
  ...props
}) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const prevSrc = usePrevious(src);

  // reset hasLoaded on src change
  useEffect(() => {
    if (prevSrc !== src) {
      setHasLoaded(false);
    }
  }, [prevSrc, src, setHasLoaded]);

  // handle blur -> xl image switch
  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setHasLoaded(true);
      onSrcLoaded?.();
    };
  }, [src, setHasLoaded]);

  const imageSrc = hasLoaded ? src : blurSrc;

  return (
    <>
      {imageSrc ? (
        <img {...props} src={imageSrc} className={cn('', className)} />
      ) : (
        <div className={cn('aspect-video', divClassName)} />
      )}
    </>
  );
};

export default ImageBlurPreloader;
