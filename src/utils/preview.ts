import { CONFIG } from '@/config';

/** independent from prod or dev */
export const isPreviewMode = () => CONFIG.PREVIEW_MODE === true;
