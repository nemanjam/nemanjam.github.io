import { EXCLUDE_IMAGES } from '@/constants/gallery';
import {
  blurImageOptions,
  getCustomImage,
  heroImageOptions,
  lightboxImageOptions,
  thumbnailImageOptions,
} from '@/libs/gallery/transform';
import { mergeArrays } from '@/utils/array';

import type { GalleryImage, HeroImage, ImgTagAttributes } from '@/types/image';
import type { GetImageResult, ImageMetadata, UnresolvedImageTransform } from 'astro';

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

export const getCustomImages = async (
  options: Omit<UnresolvedImageTransform, 'src'>
): Promise<GetImageResult[]> =>
  Promise.all(getGalleryImagesMetadata().map((src) => getCustomImage({ ...options, src })));

export const getHeroImages = async (): Promise<HeroImage[]> => {
  const blur = await getCustomImages(blurImageOptions);
  const hero = await getCustomImages(heroImageOptions);

  const heroImages = mergeArrays(blur, hero).map(([blur, hero]) => ({
    blur: imageResultToImageAttributes(blur),
    hero: imageResultToImageAttributes(hero),
  }));

  return heroImages;
};

export const getGalleryImages = async (): Promise<GalleryImage[]> => {
  const thumbnails = await getCustomImages(thumbnailImageOptions);
  const lightBoxes = await getCustomImages(lightboxImageOptions);

  const galleryImages = mergeArrays(thumbnails, lightBoxes).map(([thumbnail, lightbox]) => ({
    thumbnail: imageResultToImageAttributes(thumbnail),
    lightbox: imageResultToImageAttributes(lightbox),
  }));

  return galleryImages;
};

export const imageResultToImageAttributes = (imageResult: GetImageResult): ImgTagAttributes => ({
  src: imageResult.src,
  srcSet: imageResult.srcSet?.attribute,
  ...imageResult.attributes,
});
