import { getImage } from 'astro:assets';

import { IMAGE_SIZES } from '@/constants/image';

import type { GetImageResult, ImageMetadata } from 'astro';

export interface ImageAttributes {
  src: string;
  width: number;
  height: number;
}

export interface ImageProps {
  blur: ImageAttributes;
  color?: ImageAttributes;
  thumbnail: ImageAttributes;
  lightbox: ImageAttributes; // fullSize, 1280x720
  hero: ImageAttributes;
}

export type HeroImageProps = Pick<ImageProps, 'blur' | 'hero'>;

export type GalleryImageProps = Pick<ImageProps, 'blur' | 'thumbnail' | 'lightbox'>;

export const imageMetadataToImageProps = async (
  imagesMetadata: ImageMetadata
): Promise<ImageProps> => {
  const astroImageProps = {
    src: imagesMetadata,
    format: 'webp',
  };

  const blurAstroImageProps = {
    ...astroImageProps,
    ...IMAGE_SIZES.FIXED.BLUR,
    alt: 'Blur image',
  };

  const thumbnailAstroImageProps = {
    ...astroImageProps,
    ...IMAGE_SIZES.FIXED.MDX_XS_16_9,
    alt: 'Thumbnail image',
  };

  const lightboxAstroImageProps = {
    ...astroImageProps,
    ...IMAGE_SIZES.FIXED.MDX_XL_16_9,
    alt: 'Lightbox image',
  };

  const heroAstroImageProps = {
    ...lightboxAstroImageProps,
    alt: 'Hero image',
  };

  const optimizedBlurAstroImageProps = await getImage(blurAstroImageProps);
  const optimizedThumbnailAstroImageProps = await getImage(thumbnailAstroImageProps);
  const optimizedLightboxAstroImageProps = await getImage(lightboxAstroImageProps);
  const optimizedHeroAstroImageProps = await getImage(heroAstroImageProps);

  const imageProps = {
    blur: getImageAttributes(optimizedBlurAstroImageProps),
    thumbnail: getImageAttributes(optimizedThumbnailAstroImageProps),
    lightbox: getImageAttributes(optimizedLightboxAstroImageProps),
    hero: getImageAttributes(optimizedHeroAstroImageProps),
  };

  return imageProps;
};

/*-------------------------------- utils ------------------------------*/

const getImageAttributes = (image: GetImageResult): ImageAttributes => ({
  src: image.src,
  width: parseInt(String(image.attributes.width)),
  height: parseInt(String(image.attributes.height)),
});
