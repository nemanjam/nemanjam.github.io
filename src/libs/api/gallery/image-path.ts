import { getImage } from 'astro:assets';

import { IMAGE_SIZES } from '@/constants/image';

import type { ImageMetadata } from 'astro';

// Todo: add blur, thumb, full size images

// move to types
export interface ImageSources {
  blur: string;
  color: string;
  thumbnail: string;
  fullSize: string;
}

// only for Home for now
export const imageMetadataToImageSources = async (
  imageMetadata: ImageMetadata
): Promise<string> => {
  const astroImageProps = {
    src: imageMetadata,
    format: 'webp',
  };

  const fullSizeAstroImageProps = {
    ...astroImageProps,
    // must use picture tag with srcSet
    // ...IMAGE_SIZES.RESPONSIVE.POST_HERO,
    ...IMAGE_SIZES.FIXED.MDX_XL_16_9,
    alt: 'Hero image',
  };

  const optimizedImageProps = await getImage(fullSizeAstroImageProps);
  const { src: imageSrc } = optimizedImageProps;

  return imageSrc;
};
