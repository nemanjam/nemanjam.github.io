import { useEffect, useState } from 'react';

import usePrevious from '@/components/react/hooks/usePrevious';
import { cn } from '@/utils/styles';

import type { ImgTagAttributes } from '@/types/image';
import type { FC } from 'react';

interface Props {
  blurAttributes: ImgTagAttributes;
  mainAttributes: ImgTagAttributes;
  className?: string;
  divClassName?: string;
  onMainLoaded?: () => void;
}

const initialAttributes: ImgTagAttributes = { src: '' } as const;

const ImageBlurPreloader: FC<Props> = ({
  blurAttributes = initialAttributes,
  mainAttributes = initialAttributes,
  onMainLoaded,
  className,
  divClassName,
}) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const prevMainAttributes = usePrevious(mainAttributes);

  // reset hasLoaded on main image change
  useEffect(() => {
    // store var in useMemo
    if (prevMainAttributes !== mainAttributes) {
      setHasLoaded(false);
    }
  }, [prevMainAttributes, mainAttributes, setHasLoaded]);

  // important: main image must be in DOM for onLoad to work
  // unmount and display: none will fail
  const handleLoad = () => {
    setHasLoaded(true); // check if new image
    onMainLoaded?.();
  };

  const commonAttributes = {
    // blur image must use size from main image
    width: mainAttributes.width,
    height: mainAttributes.height,
  };

  const hasImage = hasLoaded
    ? mainAttributes.src || mainAttributes.srcSet
    : blurAttributes.src || blurAttributes.srcSet;

  return (
    <div className={cn('relative size-full', divClassName)}>
      {hasImage && (
        <>
          {/* blur image */}
          <img
            {...blurAttributes}
            {...commonAttributes}
            className={cn('object-cover absolute top-0 left-0 size-full', className)}
          />

          {/* main image */}
          <img
            {...mainAttributes}
            {...commonAttributes}
            onLoad={handleLoad}
            className={cn(
              'object-cover absolute top-0 left-0 size-full',
              hasLoaded ? 'opacity-100' : 'opacity-0',
              className
            )}
          />
        </>
      )}
    </div>
  );
};

export default ImageBlurPreloader;
