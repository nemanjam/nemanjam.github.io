import type { ImgHTMLAttributes } from 'react';

export interface HeroImage {
  blur: ImgTagAttributes;
  hero: ImgTagAttributes;
}
export interface GalleryImage {
  thumbnail: ImgTagAttributes;
  lightbox: ImgTagAttributes;
}

export interface ImgTagAttributes extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}
