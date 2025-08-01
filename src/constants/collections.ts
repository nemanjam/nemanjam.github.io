import { DEFAULT_METADATA } from '@/constants/metadata';

import DefaultPostHeroImage from '@/assets/images/default/default-post-hero-image.jpg';
import DefaultProjectHeroImage from '@/assets/images/default/default-project-hero-image.jpg';

export const BASE_FOLDERS = {
  POST: 'src/content/post',
  PROJECT: 'src/content/project',
} as const;

export const COLLECTIONS = {
  POST: 'post',
  PROJECT: 'project',
} as const;

export const TAGS = [
  'next.js',
  'react',
  'astro',
  'node.js',
  'javascript',
  'css',
  'python',
  'devops',
  'docker',
  'self-hosting',
  'algorithms',
] as const;

/** adjust this later */
export const CATEGORIES = [
  // add color here
  // extract find function
  {
    name: 'tutorials',
    icon: 'mdi:teach',
  },
  {
    name: 'computer-science',
    icon: 'mdi:cpu-64-bit',
  },
  {
    name: 'homelab',
    icon: 'mdi:flask-empty-outline',
  },
  {
    name: 'tips-and-tricks',
    icon: 'mdi:lightbulb-outline',
  },
  {
    name: 'news',
    icon: 'mdi:announcement-outline',
  },
  {
    name: 'showcases',
    icon: 'mdi:presentation',
  },
  {
    name: 'video',
    icon: 'mdi:video-outline',
  },
  {
    name: 'tools',
    icon: 'mdi:tools',
  },
  {
    name: 'resources',
    icon: 'mdi:book-open-variant-outline',
  },
] as const;

// use imported images here
export const DEFAULTS_POST = {
  TITLE: DEFAULT_METADATA.title,
  DESCRIPTION: DEFAULT_METADATA.description,
  NO_HERO: false,
  HERO_IMAGE: DefaultPostHeroImage,
  HERO_ALT: 'Hero image',
  DRAFT: false,
  CATEGORY: CATEGORIES[0].name,
  TOC: true,
} as const;

export const DEFAULTS_PROJECT = {
  TITLE: DEFAULT_METADATA.title,
  DESCRIPTION: DEFAULT_METADATA.description,
  NO_HERO: false,
  HERO_IMAGE: DefaultProjectHeroImage,
  HERO_ALT: 'Hero image',
  DRAFT: false,
  CATEGORY: CATEGORIES[0].name,
  TOC: true,
} as const;
