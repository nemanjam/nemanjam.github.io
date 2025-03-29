export const EXCLUDE_IMAGES = ['avatar1.jpg', 'square-night1.jpg'] as const;

export const GALLERY = {
  GALLERY_ID: 'my-gallery',
  // Todo: make it responsive
  /** step. */
  PAGE_SIZE: {
    XS: 1,
    SM: 2,
    LG: 3,
  },
  /** page dependency in useEffect is more important. To load first screen quickly, set to 3 pages */
  INITIAL_PAGE: {
    XS: 3,
    SM: 3,
    LG: 3,
  },
  /** fine tuned for scroll */
  OBSERVER_DEBOUNCE: 300,
} as const;
