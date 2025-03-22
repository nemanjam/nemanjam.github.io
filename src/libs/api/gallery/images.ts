import { EXCLUDE_IMAGES } from '@/constants/gallery';

import type { ImageMetadata } from 'astro';

// must use {path: image} object instead of array for getStaticPaths()

export type GalleryImages = Record<string, ImageMetadata>;

export const getGalleryImages = async (): Promise<GalleryImages> => {
  const imageModules = import.meta.glob<{ default: ImageMetadata }>(
    // cant be even variable
    '/src/assets/images/all-images/*.jpg',
    { eager: true }
  );

  const imagesTupleArray = Object.entries(imageModules)
    // filter excluded filenames
    .filter(([path]) => !EXCLUDE_IMAGES.some((excludedFileName) => path.endsWith(excludedFileName)))
    // create [path, imageMetadata] tuple array
    .map(([path, imageModule]) => {
      // src/assets/images/all-images/riverside1.jpg -> 'gallery/riverside1'
      const fileName = path.replace(/^\/src\/assets\/images\/all-images\/|\.jpe?g|\.png$/g, '');
      const imagePath = `gallery/${fileName}`;

      return [imagePath, imageModule.default];
    });

  const imagesObject: GalleryImages = Object.fromEntries(imagesTupleArray);

  return imagesObject;
};
