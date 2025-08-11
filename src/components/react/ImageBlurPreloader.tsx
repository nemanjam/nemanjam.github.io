import { useEffect, useState } from 'react';

import useDelayed from '@/components/react/hooks/useDelayed';
import usePrevious from '@/components/react/hooks/usePrevious';
import { CONFIG_CLIENT } from '@/config/client';
import { cn } from '@/utils/styles';

import type { ImgTagAttributes } from '@/types/image';
import type { FC } from 'react';

const { BLUR_IMAGE_DELAY } = CONFIG_CLIENT;

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

  // track transition to new image
  const isMainImageChanged = !(
    prevMainAttributes?.src === mainAttributes.src &&
    prevMainAttributes.srcSet === mainAttributes.srcSet
  );

  const isDelayedBlur = useDelayed(isMainImageChanged, BLUR_IMAGE_DELAY);

  // reset isLoading on main image change
  useEffect(() => {
    if (isMainImageChanged) {
      setIsLoadingBlur(true);
      setIsLoadingMain(true);
    }
  }, [isMainImageChanged, setIsLoadingMain, setIsLoadingBlur]);

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
  };

  const blurAlt = !isLoadingBlur ? blurAttributes.alt : '';
  const mainAlt = !isLoadingMain ? mainAttributes.alt : '';

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
            alt={blurAlt}
            onLoad={() => setIsLoadingBlur(false)}
            className={cn('object-cover absolute top-0 left-0 size-full', className)}
          />

          {/* main image */}
          <img
            {...mainAttributes}
            {...commonAttributes}
            alt={mainAlt}
            onLoad={handleLoadMain}
            className={cn(
              'object-cover absolute top-0 left-0 size-full',
              // important:
              // _!isLoadingBlur - don't hide main image until next blur image is loaded
              // isMainImageChanged - don't show main image while it's transitioning - solves flickering
              // isDelayedBlur - fixed blur delay
              !isLoadingBlur && (isLoadingMain || isMainImageChanged || isDelayedBlur)
                ? 'opacity-0'
                : 'opacity-100',
              className
            )}
          />
        </>
      )}
    </div>
  );
};

export default ImageBlurPreloader;
