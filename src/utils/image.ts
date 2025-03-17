import { getImage } from 'astro:assets';

import { IMAGE_SIZES } from '@/constants/image';
import { getRandomElementFromArray } from '@/utils/array';

import type { ImageProps } from '@/types/common';
import type { ImageMetadata } from 'astro';

// filenames
const EXCLUDE_IMAGES = ['avatar1.jpg'];

export const getAllImagesMetadata = (): ImageMetadata[] => {
  const imageModules = import.meta.glob<{ default: ImageMetadata }>(
    // cant be even variable
    '/src/assets/images/all-images/*.jpg',
    { eager: true }
  );

  // convert map to array
  const imagesMetadata = Object.keys(imageModules)
    // filter excluded filenames
    .filter((path) => !EXCLUDE_IMAGES.some((excludedFileName) => path.endsWith(excludedFileName)))
    // return metadata array
    .map((path) => imageModules[path].default);

  return imagesMetadata;
};

// static build, call only once
export const allImagesMetadata = getAllImagesMetadata();

// used in gallery
export const imageMetadataToReactImageProps = async (
  imagesMetadata: ImageMetadata
): Promise<ImageProps> => {
  const astroImageProps = {
    src: imagesMetadata,
    format: 'webp',
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

  const optimizedThumbnailAstroImageProps = await getImage(thumbnailAstroImageProps);
  const { src, attributes } = optimizedThumbnailAstroImageProps;

  const optimizedLightboxAstroImageProps = await getImage(lightboxAstroImageProps);
  const { src: originalSrc } = optimizedLightboxAstroImageProps;

  const reactImageProps = {
    src,
    originalSrc,
    // width and height only for thumbnails
    width: parseInt(String(attributes.width)),
    height: parseInt(String(attributes.height)),
  };

  return reactImageProps;
};

/*-------------------------------- Random Hero image ------------------------------*/

export const getRandomImageMetadata = (): ImageMetadata =>
  getRandomElementFromArray(allImagesMetadata);

export const imageMetadataToHeroImageSrc = async (
  imageMetadata: ImageMetadata
): Promise<string> => {
  const astroImageProps = {
    src: imageMetadata,
    format: 'webp',
  };

  const lightboxAstroImageProps = {
    ...astroImageProps,
    // cant use responsive sizes here, must pass viewport width from client
    ...IMAGE_SIZES.FIXED.MDX_XL_16_9,
    alt: 'Hero image',
  };

  const optimizedImageProps = await getImage(lightboxAstroImageProps);
  const { src: imageSrc } = optimizedImageProps;

  return imageSrc;
};

export const getRandomImageSrc = async (): Promise<string> => {
  const imageMetadata = getRandomImageMetadata();
  const imageSrc = await imageMetadataToHeroImageSrc(imageMetadata);

  return imageSrc;
};
