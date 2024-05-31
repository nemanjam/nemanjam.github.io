export const ROUTES = {
  HOME: '/',
  BLOG: '/blog/',
  PROJECTS: '/projects/',
  ABOUT: '/about/',
  RESUME: '/resume/',
  TAGS: '/blog/tags/',
  CATEGORIES: '/blog/categories/',
  CATEGORIES_AND_TAGS: '/blog/categories-and-tags/',
  DRAFTS: '/drafts/',
  _404: '/404/',
  _500: '/500/',
  STATIC: {
    IMAGES: '/images/',
  },
  API: {
    OG_BLOG: '/api/open-graph/blog/',
    OG_PROJECTS: '/api/open-graph/projects/',
  },
} as const;
