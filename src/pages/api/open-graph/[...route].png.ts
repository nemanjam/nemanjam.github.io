import fs from 'fs/promises';
import path from 'path';

import satori from 'satori';
import sharp from 'sharp';

import { CONFIG } from '@/config';
import { getPages } from '@/libs/api/open-graph/pages';
import templateHtml from '@/libs/api/open-graph/template-html';
import { trimHttpProtocol } from '@/utils/strings';

import type { APIContext, APIRoute } from 'astro';

const { SITE_URL } = CONFIG;

const OG_FOLDER = './src/assets/images/open-graph/' as const;
const FONTS_FOLDER = './public/fonts/' as const;

const avatarPath = `${OG_FOLDER}avatar-white.jpg`;
const defaultHeroImagePath = `${OG_FOLDER}hero-image.jpg`;

export const getStaticPaths = async () => {
  const pages = await getPages();

  // object to array of tuples
  const paths = Object.entries(pages).map(([path, page]) => ({
    params: { route: path }, // home page '/' path fixed to '/page/index/ in src/layouts/Page.astro
    props: { page },
  }));

  return paths;
};

export const GET: APIRoute = async ({ props }: APIContext) => {
  // limit number of chars
  const { title, heroImage } = props.page;

  // no need to resize any image

  // avatarImage
  const avatarImageBase64Url = await getResizedBase64Image({
    imagePath: avatarPath,
  });

  // heroImage
  const heroImagePath = heroImage?.fsPath ?? defaultHeroImagePath;
  const heroImageBase64Url = await getResizedBase64Image({ imagePath: heroImagePath });

  const templateProps = {
    title,
    heroImageUrl: heroImageBase64Url,
    avatarImageUrl: avatarImageBase64Url,
    siteUrl: trimHttpProtocol(SITE_URL),
  };

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

/*-------------------------------- utils ------------------------------*/

interface ResizeImageArgs {
  imagePath: string;
  width?: number;
  height?: number;
}

const getResizedBase64Image = async (resizeImageArgs: ResizeImageArgs): Promise<string> => {
  const { imagePath, width, height } = resizeImageArgs;

  const heroImageData = await fs.readFile(imagePath);

  const resizedHeroImage = await sharp(heroImageData)
    .resize({
      ...(width ? { width } : {}),
      ...(height ? { height } : {}),
      withoutEnlargement: true,
    })
    .toBuffer();

  const imageType = getImageType(imagePath);
  const heroImageBase64 = Buffer.from(resizedHeroImage).toString('base64');
  const heroImageBase64Url = `data:image/${imageType};base64,${heroImageBase64}`;

  return heroImageBase64Url;
};

const getImageType = (imagePath: string) => {
  const extension = path.extname(imagePath).toLowerCase();

  let imageType: string;
  switch (extension) {
    case '.png':
      imageType = 'png';
      break;
    case '.jpg':
    case '.jpeg':
      imageType = 'jpeg';
      break;
    default:
      throw new Error('Unsupported heroImage file extension');
  }

  return imageType;
};
