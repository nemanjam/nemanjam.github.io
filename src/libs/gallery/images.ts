import { EXCLUDE_IMAGES } from '@/constants/gallery';
import { imageMetadataToImageProps } from '@/libs/gallery/transform';

import type { GalleryImageProps, HeroImageProps, ImageProps } from '@/libs/gallery/transform';
import type { ImageMetadata } from 'astro';

// no need for API route, image server already exists, it will only rewrite url

export const getGalleryImagesMetadata = (): ImageMetadata[] => {
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

export const getImagesProps = async (): Promise<ImageProps[]> =>
  Promise.all(getGalleryImagesMetadata().map(imageMetadataToImageProps));
