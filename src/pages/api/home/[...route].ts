import { imageMetadataToImageSources } from '@/libs/api/gallery/image-path';
import { getGalleryImages } from '@/libs/api/gallery/images';

import type { APIContext, APIRoute } from 'astro';

export const getStaticPaths = async () => {
  const images = await getGalleryImages();

  // object to array of tuples
  const paths = Object.entries(images).map(([path, image]) => ({
    // matches file name [...route].ts
    params: { route: path },
    props: { image },
  }));

  return paths;
};

export const GET: APIRoute = async ({ props }: APIContext) => {
  const { image } = props;
  const imageSrc = await imageMetadataToImageSources(image);

  // generate blur, thumb and full size images, extract into separate function

  return new Response(imageSrc); // should be json
};
