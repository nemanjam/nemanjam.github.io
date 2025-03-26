import { getImage } from 'astro:assets';

import { IMAGE_SIZES } from '@/constants/image';

import type { GetImageResult, UnresolvedImageTransform } from 'astro';

const defaultAstroImageOptions = {
  format: 'webp',
};

export const blurImageOptions = {
  ...IMAGE_SIZES.FIXED.BLUR_16_9,
};

export const thumbnailImageOptions = {
  ...IMAGE_SIZES.RESPONSIVE.GALLERY_THUMBNAIL,
};

export const heroImageOptions = {
  ...IMAGE_SIZES.RESPONSIVE.POST_HERO,
};

/**  Photoswipe lightbox doesn't support responsive image, must use custom component */
export const lightboxImageOptions = {
  ...IMAGE_SIZES.FIXED.MDX_2XL_16_9,
};

export const getCustomImage = async (options: UnresolvedImageTransform): Promise<GetImageResult> =>
  getImage({
    ...defaultAstroImageOptions,
    ...options,
  });
