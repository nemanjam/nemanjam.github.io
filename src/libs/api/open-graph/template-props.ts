import fs from 'fs/promises';
import path from 'path';

import { FILE_PATHS } from '@/constants/file-paths';
import { CONFIG_CLIENT } from '@/config/client';
import { getRandomElementFromArray } from '@/utils/array';
import { removeTrailingSlash } from '@/utils/paths';
import { trimHttpProtocol } from '@/utils/strings';

import type { FrontmatterProps, TemplateProps } from '@/types/open-graph';

import avatarImage from '@/assets/images/avatar.png';
import image404 from '@/assets/images/pages/image404.jpg';

const { SITE_URL } = CONFIG_CLIENT;
const { AVATAR, GALLERY_FOLDER, IMAGE_404 } = FILE_PATHS;

// original base64 implementation
export const getTemplatePropsBase64 = async (
  frontmatterProps: FrontmatterProps
): Promise<TemplateProps> => {
  const { title, heroImage, pageId } = frontmatterProps;

  // avatarImage
  const avatarImageBase64Url = await getBase64Image(AVATAR);

  // heroImage
  let heroImagePath: string | undefined;

  switch (true) {
    // Check for valid fsPath (non-empty string)
    case Boolean(heroImage?.fsPath && typeof heroImage.fsPath === 'string' && heroImage.fsPath.trim() !== ''):
      heroImagePath = heroImage.fsPath;
      break;
    // hardcoded in 404.mdx frontmatter
    case pageId === 'page404':
      heroImagePath = IMAGE_404;
      break;

    // fallback to random default image
    default:
      heroImagePath = await getRandomImagePath(GALLERY_FOLDER);
      break;
  }

  // getBase64Image handles undefined/empty paths with fallback
  const heroImageBase64Url = await getBase64Image(heroImagePath);

  const templateProps = {
    title,
    heroImageUrl: heroImageBase64Url,
    avatarImageUrl: avatarImageBase64Url,
    siteUrl: trimHttpProtocol(SITE_URL),
  };

  return templateProps;
};

/*-------------------------------- base64 utils ------------------------------*/

export const getBase64Image = async (imagePath: string | undefined): Promise<string> => {
  // Validate that we have a non-empty path
  if (!imagePath || imagePath.trim() === '') {
    console.warn('getBase64Image: Empty or undefined image path provided, using fallback');
    // Use the gallery folder fallback
    const fallbackPath = await getRandomImagePath(GALLERY_FOLDER);
    return getBase64Image(fallbackPath);
  }

  try {
    const imageData = await fs.readFile(imagePath);

    const imageType = getImageType(imagePath);
    const imageBase64 = Buffer.from(imageData).toString('base64');
    const imageBase64Url = `data:image/${imageType};base64,${imageBase64}`;

    return imageBase64Url;
  } catch (err) {
    console.warn(`getBase64Image: Failed to read image at "${imagePath}", using fallback:`, err);
    // Use the gallery folder fallback
    const fallbackPath = await getRandomImagePath(GALLERY_FOLDER);
    return getBase64Image(fallbackPath);
  }
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

export const getRandomImagePath = async (folderPath: string): Promise<string> => {
  const trimmedFolderPath = removeTrailingSlash(folderPath);

  const files = await fs.readdir(trimmedFolderPath);

  // omit ./, ../
  const imageFiles = files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return ext === '.jpg' || ext === '.jpeg' || ext === '.png';
  });

  if (imageFiles.length === 0) throw new Error(`No default og images found in: ${folderPath}`);

  const randomIndex = Math.floor(Math.random() * imageFiles.length);
  const randomImage = imageFiles[randomIndex];

  const randomImageWithPath = `${trimmedFolderPath}/${randomImage}`;

  return randomImageWithPath;
};

/*-------------------------------- unused code bellow ------------------------------*/

// todo: this cant work, no urls at build time
// ! must use absolute file paths
export const getTemplatePropsUrl = (frontmatterProps: FrontmatterProps): TemplateProps => {
  const { title, heroImage, pageId } = frontmatterProps;

  // avatarImage
  const avatarImageUrl = avatarImage.src;

  // heroImage
  let heroImageUrl: string;

  switch (true) {
    // from mdx frontmatter
    case Boolean(heroImage.src):
      heroImageUrl = `${SITE_URL}${heroImage.src}`; // todo: fix this, path from mdx frontmatter
      break;
    // hardcoded in 404.mdx frontmatter
    case pageId === 'page404':
      heroImageUrl = image404.src;
      break;

    // fallback to random default image
    default:
      heroImageUrl = `${SITE_URL}${getRandomImageUrl()}`;
      break;
  }

  const templateProps = {
    title,
    heroImageUrl: heroImageUrl,
    avatarImageUrl: avatarImageUrl,
    siteUrl: trimHttpProtocol(SITE_URL),
  };

  return templateProps;
};

/*-------------------------------- url utils (ImageMetadata) ------------------------------*/

export const getOpenGraphImagesMetadata = (): ImageMetadata[] => {
  const imageModules = import.meta.glob<{ default: ImageMetadata }>(
    // cant be even variable
    '/src/assets/images/default/open-graph/*.jpg',
    { eager: true }
  );

  // convert map to array
  const imagesMetadata = Object.keys(imageModules).map((path) => imageModules[path].default);

  return imagesMetadata;
};

export const getRandomImageUrl = () => getRandomElementFromArray(getOpenGraphImagesMetadata()).src;
