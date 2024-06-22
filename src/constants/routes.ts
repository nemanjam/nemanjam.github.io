export const ROUTES = {
  HOME: '/',
  BLOG: '/blog/',
  PROJECTS: '/projects/',
  ABOUT: '/about/',
  RESUME: '/resume/',
  TAGS: '/blog/tags/',
  CATEGORIES: '/blog/categories/',
  EXPLORE: '/blog/explore/',
  EXPLORE_TAGS: '/blog/explore/tags/',
  EXPLORE_CATEGORIES: '/blog/explore/categories/',
  /** maybe in future */
  DRAFTS: '/drafts/',
  _404: '/404/',
  _500: '/500/',
  STATIC: {
    IMAGES: '/images/',
    FAVICONS: '/images/favicons/',
  },
  API: {
    OG_IMAGES: '/api/open-graph/',
    FEED_JSON: '/api/feed.json',
    FEED_RSS: '/api/feed.xml',
  },
} as const;
