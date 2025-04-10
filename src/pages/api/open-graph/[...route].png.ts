import fs from 'fs/promises';

import satori from 'satori';
import sharp from 'sharp';

import { FILE_PATHS } from '@/constants/file-paths';
import { getPages } from '@/libs/api/open-graph/pages';
import templateHtml from '@/libs/api/open-graph/template-html';
import { getTemplatePropsBase64 } from '@/libs/api/open-graph/template-props';

import type { APIContext, APIRoute } from 'astro';

const { FONTS_FOLDER } = FILE_PATHS;

export const getStaticPaths = async () => {
  const pages = await getPages();

  // object to array of tuples
  const paths = Object.entries(pages).map(([path, page]) => ({
    params: { route: path },
    props: { page },
  }));

  return paths;
};

// endpoint to create open graph images, because they don't exist in the file system
export const GET: APIRoute = async ({ props }: APIContext) => {
  // limit number of chars
  // resize images in template in CSS only, not in sharp

  const templateProps = await getTemplatePropsBase64(props.page);

  const fontData = await fs.readFile(`${FONTS_FOLDER}inter-regular.woff`);

  const svg = await satori(templateHtml(templateProps) as React.ReactNode, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Inter',
        data: fontData,
        weight: 400,
        style: 'normal',
      },
    ],
  });

  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(pngBuffer);
};
