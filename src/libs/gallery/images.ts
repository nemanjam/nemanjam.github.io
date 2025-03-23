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

export const getHeroImagesProps = (): Promise<HeroImageProps[]> =>
  getImagesProps().then((imagesProps) =>
    imagesProps.map((imageProps) => ({
      blur: imageProps.blur,
      hero: imageProps.hero,
    }))
  );

export const getGalleryImagesProps = (): Promise<GalleryImageProps[]> =>
  getImagesProps().then((imagesProps) =>
    imagesProps.map((imageProps) => ({
      blur: imageProps.blur,
      thumbnail: imageProps.thumbnail,
      lightbox: imageProps.lightbox,
    }))
  );
