import { getImage } from 'astro:assets';

import { IMAGE_SIZES } from '@/constants/image';

import type { GetImageResult, ImageMetadata, UnresolvedImageTransform } from 'astro';

export interface ImageAttributes {
  src: string;
  width: number;
  height: number;
}

export interface ImageProps {
  blur: ImageAttributes;
  color?: ImageAttributes; // Todo:
  xs: ImageAttributes;
  md: ImageAttributes;
  xl: ImageAttributes; // fullSize, 1280x720
}

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

export const imageMetadataToImageProps = async (
  imagesMetadata: ImageMetadata
): Promise<ImageProps> => {
  const astroImageProps = {
    src: imagesMetadata,
    format: 'webp',
  };

  const blurImageProps = {
    ...astroImageProps,
    ...IMAGE_SIZES.FIXED.BLUR_16_9,
  };

  const xsImageProps = {
    ...astroImageProps,
    ...IMAGE_SIZES.FIXED.MDX_XS_16_9,
  };

  const mdImageProps = {
    ...astroImageProps,
    ...IMAGE_SIZES.FIXED.MDX_MD_16_9,
  };

  const xlImageProps = {
    ...astroImageProps,
    ...IMAGE_SIZES.FIXED.MDX_XL_16_9,
  };

  const optimizedBlurImageProps = await getImage(blurImageProps);
  const optimizedXsImageProps = await getImage(xsImageProps);
  const optimizedMdImageProps = await getImage(mdImageProps);
  const optimizedXlImageProps = await getImage(xlImageProps);

  const imageProps = {
    blur: getImageAttributes(optimizedBlurImageProps),
    xs: getImageAttributes(optimizedXsImageProps),
    md: getImageAttributes(optimizedMdImageProps),
    xl: getImageAttributes(optimizedXlImageProps),
  };

  return imageProps;
};

/*-------------------------------- utils ------------------------------*/

const getImageAttributes = (image: GetImageResult): ImageAttributes => ({
  src: image.src,
  width: parseInt(String(image.attributes.width)),
  height: parseInt(String(image.attributes.height)),
});
