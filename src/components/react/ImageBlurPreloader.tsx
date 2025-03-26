import { useEffect, useMemo, useState } from 'react';

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
  const [isLoadingMain, setIsLoadingMain] = useState(true);
  const [isLoadingBlur, setIsLoadingBlur] = useState(true);

  const prevMainAttributes = usePrevious(mainAttributes);

  const isNewImage = !(
    prevMainAttributes?.src === mainAttributes.src &&
    prevMainAttributes.srcSet === mainAttributes.srcSet
  );

  // reset isLoading on main image change
  useEffect(() => {
    if (isNewImage) {
      setIsLoadingBlur(true);
      setIsLoadingMain(true);
    }
  }, [isNewImage, setIsLoadingMain, setIsLoadingBlur]);

  // important: main image must be in DOM for onLoad to work
  // unmount and display: none will fail
  const handleLoadMain = () => {
    setIsLoadingMain(false);
    onMainLoaded?.();
  };

  const commonAttributes = {
    // blur image must use size from main image
    width: mainAttributes.width,
    height: mainAttributes.height,
    alt: !isLoadingMain ? mainAttributes.alt : '',
  };

  const hasImage = Boolean(
    isLoadingMain
      ? mainAttributes.src || mainAttributes.srcSet
      : blurAttributes.src || blurAttributes.srcSet
  );

  return (
    <div className={cn('relative size-full', divClassName)}>
      {hasImage && (
        <>
          {/* blur image */}
          <img
            {...blurAttributes}
            {...commonAttributes}
            onLoad={() => setIsLoadingBlur(false)}
            className={cn('object-cover absolute top-0 left-0 size-full', className)}
          />

          {/* main image */}
          <img
            {...mainAttributes}
            {...commonAttributes}
            onLoad={handleLoadMain}
            className={cn(
              'object-cover absolute top-0 left-0 size-full',
              // important: dont hide main image until next blur image is loaded
              isLoadingMain && !isLoadingBlur ? 'opacity-0' : 'opacity-100',
              className
            )}
          />
        </>
      )}
    </div>
  );
};

export default ImageBlurPreloader;
