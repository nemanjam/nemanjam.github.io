import path from 'path';

/** Resolve paths relative to project root for use in API routes during build */
const resolveFromRoot = (relativePath: string) => path.join(process.cwd(), relativePath);

/** file system paths - resolved from project root */
export const FILE_PATHS = {
  FONTS_FOLDER: resolveFromRoot('public/fonts/'),
  GALLERY_FOLDER: resolveFromRoot('src/assets/images/all-images/'),
  IMAGE_404: resolveFromRoot('src/assets/images/pages/image404.jpg'),
  /** .png */
  AVATAR: resolveFromRoot('src/assets/images/avatar.png'),
  /** .png */
  AVATAR_TRANSPARENT: resolveFromRoot('src/assets/images/avatar-transparent.png'),
} as const;
