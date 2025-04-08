## Introduction

I wanted to have a simple, Instagram-like, scroll paginated gallery page on the website where I could share my everyday photos. Initially I implemented it using [benhowell/react-grid-gallery](https://github.com/benhowell/react-grid-gallery) package for gallery, and [frontend-collective/react-image-lightbox](https://github.com/frontend-collective/react-image-lightbox) for lightbox component. It worked ok, but since those are a bit legacy packages I was unable to upgrade to React 19, it loaded all images at once without scroll pagination and Lighthouse score wasn't so great.

You can see that implementation if you navigate back in Git history [e0165b](https://github.com/nemanjam/nemanjam.github.io/tree/e0165b295db2ccc72bbbb7be4bdd7eb48f7dedae):

```bash
# in git history navigate back to the old gallery commit
git checkout e0165b295db2ccc72bbbb7be4bdd7eb48f7dedae

# preview
yarn clean && yarn install && yarn dev
```

I decided to reimplement it, did a quick research and decided to make my own gallery component and use [dimsemenov/photoswipe](https://github.com/dimsemenov/photoswipe) package for lightbox. And that's how this article got created, while implementing I took notes about the most important and interesting parts from the process. Look at it as not necessarily the absolute best way to make image gallery with Astro and React but as one of the ways that is proven in practice and works well.

## What we will be building

- **Demo:** https://nemanjamitic.com/gallery
- **Github repository:** https://github.com/nemanjam/nemanjam.github.io

{% youtube BiYwyBfjaXI %}

## Image - server component, client component, slot, props

This is the first dilemma and initial decision that affects all the future code that we write. Since this is a static website example we are naturally inclined to pre-render everything we can at build time, but can this work for images too?

Astro provides `<Image />` component and it's a server component like any other Astro component. It is clear that we will need `onLoad`, `onClick` events on a image and events aren't possible on a server component. Yes, but maybe we can use client component wrapper and pass Astro `<Image />` component as a slot so we can have best from both - Astro component for image optimization and a `<div />` for events, could this work?

Not really, for any preload effects `onLoad` event needs to be on the `<img />` tag, but more important is that we can't pass any client props to the slot `<Image />` component, we can generate only a single instance at build time. For any props values we would need to pregenerate separate image HTML which in this case is highly impractical.

**Conclusion:** We will use a React client component that supports interactivity and Astro `getImage()` function to optimize the images.

## API route vs `import.meta.glob()`

We want to stick to a static website, for performance reasons and convenient deployments. What way should we use to pass the image urls to the client? We could make a static API endpoint that serves JSON array. We could even make an parametrized API endpoint that serves optimized images.

Right away, why having an extra HTTP call for JSON on client when we can pregenerate image urls at build time, it's not what we want.

For a static API endpoint, since it's static we would need to pre-render all params at build time, so we could do `http://localhost/api/gallery/xl/image1.webp` but not `http://localhost/api/gallery/300x200/image1.webp` and `http://localhost/api/gallery/301x200/image1.webp`, for that we would need to enable Astro server side rending and have Node.js runtime in production.

If we log a `src` attribute of an imported image in dev and prod mode we will see something like this:

```ts
// in dev
http://localhost:3000/_image?href=/@fs/home/username/Desktop/nemanjam.github.io/src/assets/images/all-images/morning1.jpg?origWidth=4608&origHeight=2592&origFormat=jpg&w=1280&h=720&f=webp

// in prod
http://localhost:3000/_astro/morning1.CEdGhKb3_nVk9T.webp
```

So Astro is already serving images for us, with a dedicated API endpoint we would just accomplish human friendly url rewriting, that could be useful only if some external service fetches those images, which we don't have here.

**Conclusion:** We will use `import.meta.glob('/src/assets/images/all-images/*.jpg')` from Vite to import images as modules to obtain images at build time and pass them as props into the Gallery component.

The code is as follows [src/libs/gallery/images.ts#L16](https://github.com/nemanjam/nemanjam.github.io/blob/6ef147e4b13b718d43ac24df6122dd1033e3d194/src/libs/gallery/images.ts#L16):

```ts
// src/libs/gallery/images.ts

export const getGalleryImagesMetadata = (): ImageMetadata[] => {
  const imageModules = import.meta.glob<{ default: ImageMetadata }>(
    // can't be a variable
    '/src/assets/images/all-images/*.jpg',
    { eager: true }
  );

  // convert map to array
  const imagesMetadata = Object.keys(imageModules)
    // filter excluded filenames
    .filter((path) => !EXCLUDE_IMAGES.some((excludedFileName) => path.endsWith(excludedFileName)))
    // return metadata array
    .map((path) => imageModules[path].default);

  return imagesMetadata;
};
```

## Code structure

We will structure code like this: `MDX (gallery.mdx) -> Astro component (Gallery.astro) -> React component (Gallery.jsx)`. The call stack is top-down, MDX is a declarative presentation layer, Astro component will resolve data - images, React component will handle events and define logic, it's the most complex layer.

Code (paraphrased):

```ts
// src/pages/gallery.mdx

<Gallery class="not-prose grow" />

// src/components/Gallery.astro

<ReactGallery client:only="react" images={randomizedGalleryImages} />

// src/components/react/Gallery.tsx

<div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
  {loadedImages.map((image) => (
    <img {...imageProps} />
  )}
</div>
```

## Static generation, include image urls and `map()` on the client

Again, interesting and important point that is easy to forget is that `images.map()` needs to be in React component in order to have infinite scroll pagination. For that all image urls (and other props) need to be bundled and available on client, that is passed as props from Astro to the React component.

If we placed `images.map()` in the Astro component we would we would have a single image list as is without any interactivity (pagination on scroll).

**Reminder:** Static "backend" runs only once - at build time. We have a Node.js runtime only in development, and not in production - in there we have just a webserver static folder for serving assets. Kind of obvious, but it can sometimes be overlooked when we decide whether to put certain code in a server or client component.

## Responsive, optimized images - `getImage()` and `<img srcset sizes />`

Astro provides [getImage()](https://docs.astro.build/en/guides/images/#generating-images-with-getimage) function that we will use to optimize images and generate `<img />` tag attributes for the client. It accepts the same arguments as the `<Image />` component. Note, `<img />` tag supports `srcset` and `sizes` attributes for responsive images which is sufficient for our use case. This time we don't need `<picture />` support for different images (art direction) and different formats.

We will prepare different image presets (sizes) in [src/libs/gallery/transform.ts#L7](https://github.com/nemanjam/nemanjam.github.io/blob/6ef147e4b13b718d43ac24df6122dd1033e3d194/src/libs/gallery/transform.ts#L7):

Note that only thumbnail uses responsive image, and lightbox uses a fixed size image since Photoswipe lightbox doesn't support responsive image (at least without a custom component).

```ts
// src/libs/gallery/transform.ts

// common props
const defaultAstroImageOptions = {
  format: 'webp',
};

// thumbnail preset
export const thumbnailImageOptions = {
  ...IMAGE_SIZES.RESPONSIVE.GALLERY_THUMBNAIL,
};

// lightbox preset
export const lightboxImageOptions = {
  ...IMAGE_SIZES.FIXED.MDX_2XL_16_9,
};

// getImage() wrapper
export const getCustomImage = async (options: UnresolvedImageTransform): Promise<GetImageResult> =>
  getImage({
    ...defaultAstroImageOptions,
    ...options,
  });
```

After that we use `getCustomImage()` to optimize gallery images that we previously loaded with `import.meta.glob()` in [src/libs/gallery/images.ts#L50](https://github.com/nemanjam/nemanjam.github.io/blob/6ef147e4b13b718d43ac24df6122dd1033e3d194/src/libs/gallery/images.ts#L50):

```ts
// src/libs/gallery/images.ts

export const getGalleryImages = async (): Promise<GalleryImage[]> => {
  const thumbnails = await getCustomImages(thumbnailImageOptions);
  const lightBoxes = await getCustomImages(lightboxImageOptions);

  const galleryImages = mergeArrays(thumbnails, lightBoxes).map(([thumbnail, lightbox]) => ({
    thumbnail: imageResultToImageAttributes(thumbnail),
    lightbox: imageResultToImageAttributes(lightbox),
  }));

  return galleryImages;
};

// select only needed attributes for the <img /> tag
export const imageResultToImageAttributes = (imageResult: GetImageResult): ImgTagAttributes => ({
  src: imageResult.src,
  srcSet: imageResult.srcSet?.attribute,
  ...imageResult.attributes,
});
```

Now we have the ready `<img />` attributes (props) available to pass into the React gallery client component.

Interesting part is configuring `<img />` `sizes` (`sizes` and `widths` args in `getImage()`) attribute for responsive images in [src/constants/image.ts#L86](https://github.com/nemanjam/nemanjam.github.io/blob/38a37b0e6d87f7723fac7875399ff12e128d26ac/src/constants/image.ts#L86):

```ts
// src/constants/image.ts

GALLERY_THUMBNAIL: {
  widths: [TW_SCREENS.XS, TW_SCREENS.SM],
  sizes: `(max-width: ${TW_SCREENS.SM}px) ${TW_SCREENS.SM}px, ${TW_SCREENS.XS}px`,
},

// actual <img /> tag attributes that are generated with the GALLERY_THUMBNAIL
<img
  sizes="(max-width: 640px) 640px, 475px"
  srcset="
    /_astro/river16.CcFOUvED_Z2d5kbP.webp 475w,
    /_astro/river16.CcFOUvED_Z16pb6L.webp 640w
  "
  src="/_astro/river16.CcFOUvED_Z1Dswo2.webp"
  width="4000"
  height="2252"
/>

// src/components/react/Gallery.tsx

<div
  id={GALLERY_ID}
  className="pswp-gallery grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3"
>
...
</div>
```

If you are not familiar with defining responsive images, it's not that complicated as it seems. The code above basically says, bellow `SM` screen breakpoint (`640px`) use `SM` size (width) (`640px`) image, and if screen is wider than `SM` use smaller `XS` (`475px`) image. Maybe unexpected to use smaller image for larger screen, but it makes sense when you look at responsive grid that is used for the gallery layout.

You can see in grid classes that bellow `sm:` breakpoint image uses full width of the layout and above `sm:` there are 2 images per row, above `lg:` 3 images per row, so it makes sense to use the larger image on smaller screens.

While configuring responsive images it's advisable to preview what is generated in the browser and ensure that result meets the expectation, we have sharp images at all resolutions and not too large image files.

{% youtube Gr7R9sH1rss %}

## Blur preloader, CSS transition

Large lightbox image will handle Photoswipe on its own, we won't interfere with it for now. But we can have some nice effect on thumbnail images on infinite scroll. They are already small enough to load fast so no need to use smaller resolution image for blur preloader, we can achieve the same effect with a simple CSS transition.

The following code does that [src/components/react/Gallery.tsx#L132](https://github.com/nemanjam/nemanjam.github.io/blob/38a37b0e6d87f7723fac7875399ff12e128d26ac/src/components/react/Gallery.tsx#L132)

```tsx
// src/components/react/Gallery.tsx

const [loadedImages, setLoadedImages] = useState<GalleryImage[]>([]);

const isLoadingPageImages = useMemo(
  () => !Object.values(loadedStates).every(Boolean),
  [loadedStates, loadedImages.length]
);

useEffect(() => {
  const callback: IntersectionObserverCallback = (entries) => {
    // must wait here for images to load
    if (!isEnd && !isLoadingPageImages && entries[0].isIntersecting) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // ...

  // page dependency is important for initial load to work for all resolutions
}, [observerTarget, page, isEnd, isLoadingPageImages]);

const handleLoad = (src: string) => {
  setLoadedStates((prev) => ({ ...prev, [src]: true }));
};

{
  loadedImages.map((image) => (
    // ...
    <img
      {...image.thumbnail}
      onLoad={() => handleLoad(image.thumbnail.src)}
      alt={loadedStates[image.thumbnail.src] ? 'Gallery image' : ''}
      className={cn(
        'w-full transition-all duration-[2s] ease-in-out',
        loadedStates[image.thumbnail.src]
          ? 'opacity-100 blur-0 grayscale-0'
          : 'opacity-75 blur-sm grayscale'
      )}
    />
  ));
}
```

Note that we have a `map()` call here and we are storing loading states for an array of images. This is because we want to have a smooth transition for the entire new page of images, not for each image separately because they will load randomly and that's less esthetic. Important part is `isLoadingPageImages` variable, it is used to block loading a new page until all images from the previous page are loaded. This happens in the observer callback condition `if (!isEnd && !isLoadingPageImages && entries[0].isIntersecting)`.

Another part is CSS transition, `duration-[...]` should be picked so it takes more than actual thumbnail image loading time. For the transition effect, you can play around with opacity and Tailwind's [filter](https://tailwindcss.com/docs/filter) classes and see what looks nicest to you.

## Infinite scroll

We want to implement pagination through infinite scroll like e.g. Instagram. Obviously, for this, Gallery needs to be a client component and we will use IntersectionObserver to detect the bottom of the gallery and trigger loading a new page of images. For the observer we could use ready-made hooks from utility libraries like [uidotdev/usehooks](https://usehooks.com/useintersectionobserver) or [streamich/react-use](https://streamich.github.io/react-use/?path=/story/sensors-useintersection--docs) but lets go with our own custom implementation this time.

The code for this is in [src/components/react/Gallery.tsx#L76](https://github.com/nemanjam/nemanjam.github.io/blob/38a37b0e6d87f7723fac7875399ff12e128d26ac/src/components/react/Gallery.tsx#L76):

```tsx
// src/components/react/Gallery.tsx

// sets only page
useEffect(() => {
  const callback: IntersectionObserverCallback = (entries) => {
    // must wait here for images to load
    if (!isEnd && !isLoadingPageImages && entries[0].isIntersecting) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  const debouncedCallback = debounce(callback, OBSERVER_DEBOUNCE);
  const options: IntersectionObserverInit = { threshold: 1 };

  const observer = new IntersectionObserver(debouncedCallback, options);

  const observerRef = observerTarget.current;
  if (observerRef) observer.observe(observerRef);

  return () => {
    if (observerRef) observer.unobserve(observerRef);
  };
  // page dependency is important for initial load to work for all resolutions
}, [observerTarget, page, isEnd, isLoadingPageImages]);
```

There are 3 important parts in this code:

1. We need to include `page` state variable in the `useEffect` dependencies array because we want to trigger effect execution every time new page of images loads and height of gallery increases. Also note that we read `page` state value from the state setter callback argument `setPage((prevPage) => prevPage + 1)`, that's why we must also list `page` in `useEffect` dependencies array.
2. We need to be precise about when we are loading new page of images. Note this condition `if (!isEnd && !isLoadingPageImages && entries[0].isIntersecting)`, it practically means "load new page of images whenever 1. we haven't loaded all images AND 2. previous page of images is fully loaded - for esthetics AND 3. the gallery is scrolled to the bottom - main prerequisite.
3. The observer `callback()` triggers quite often, so we need to limit the frequency by debouncing. Note `OBSERVER_DEBOUNCE` constant value needs to be fine tuned and validated through practical trial and error.

Another important and interesting part is detecting bottom of the page and displaying loader UI:

```tsx
// src/components/react/Gallery.tsx

{/* control threshold with margin-top */}
{/* must be on top so loader doesn't affect it */}
<div ref={observerTarget} className="mt-0" />

<div
  className={cn(
    // duration-500 is related to OBSERVER_DEBOUNCE: 300
    'flex items-center justify-center transition-all duration-500 ease-in-out',
    shouldShowLoader ? 'min-h-48' : 'min-h-0'
  )}
>
  {shouldShowLoader && <PiSpinnerGapBold className="size-10 sm:size-12 animate-spin mt-4" />}
</div>
```

This can be tricky because they are circularly dependent - detection triggers showing loader and displaying loader affects position of detection `<div ref={observerTarget}/>`. Another thing ot note is that detection `div` has zero height and is placed either above or bellow the loader. It is important to be the above loader because we are interested in the bottom of the images, not the loader that will disappear from the UI in a few milliseconds anyway.

Another important part is controlling and fine-tuning the threshold of the observed element `<div ref={observerTarget}/>`. We do this by adjusting the positioning with `className="mt-0"`, controlling the observers callback execution frequency with `OBSERVER_DEBOUNCE`, setting the transition timing for the loader element `duration-500`, specifying how many images we load (number of rows in the gallery) using the `pageSize` constant, and how many pages of images we load initially on the first screen `initialPage` constant.

All of these parameters are connected together and you need to fine tune them for smooth infinite scroll experience. Also note that `pageSize` and `initialPage` constants are responsive and need to be defined for each breakpoint independently for full and ergonomic control.

You can see that in the constants file in [src/constants/gallery.ts#L7](https://github.com/nemanjam/nemanjam.github.io/blob/38a37b0e6d87f7723fac7875399ff12e128d26ac/src/constants/gallery.ts#L7)

```ts
// src/constants/gallery.ts

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
```

And the mapping to translate constants into usable `pageSize` and `initialPage` values are defined in utility functions in [src/utils/gallery.ts#L8](https://github.com/nemanjam/nemanjam.github.io/blob/38a37b0e6d87f7723fac7875399ff12e128d26ac/src/utils/gallery.ts#L8):

```ts
// src/utils/gallery.ts

const { PAGE_SIZE, INITIAL_PAGE } = GALLERY;

// related to gallery grid css
const breakpointToPageKey = {
  XXS: 'XS',
  XS: 'XS',
  SM: 'SM',
  MD: 'SM',
  LG: 'LG',
  XL: 'LG',
  _2XL: 'LG',
} as const;

const defaultPageKey = 'LG' as const;

export const getPageSize = (breakpoint: Breakpoint): number => {
  const key = breakpointToPageKey[breakpoint] ?? defaultPageKey;
  const pageSize = PAGE_SIZE[key];

  return pageSize;
};

export const getInitialPage = (breakpoint: Breakpoint): number => {
  const key = breakpointToPageKey[breakpoint] ?? defaultPageKey;
  const initialPage = INITIAL_PAGE[key];

  return initialPage;
};
```

With this, we have a smooth scrolling experience on all screen sizes:

{% youtube eEH-Aszkur0 %}

Also pay attention how we "fetch" a new page of images to update:

```tsx
// src/components/react/Gallery.tsx

const fetchImagesUpToPage = (
  images: GalleryImage[],
  pageSize: number,
  nextPage: number
): GalleryImage[] => {
  const endIndex = nextPage * pageSize;
  const isLastPage = endIndex >= images.length;

  // for fetchPageImages pagination startIndex must use loadedImages and not all images and page
  const selectedImages = images.slice(0, endIndex);

  // load all images for last page
  return !isLastPage ? sliceToModN(selectedImages, pageSize) : selectedImages;
};

// converts page to loaded images
useEffect(() => {
  const upToPageImages = fetchImagesUpToPage(images, pageSize, page);
  setLoadedImages(upToPageImages);
}, [page, images, pageSize]);
```

There are 2 important moments here:

1. Since we have a static website all image urls are already included and available on the client so we don't need to calculate the starting index and can simply use zero `images.slice(0, endIndex);`. Usually pagination implies a network and database calls that require both `startIndex` and `endIndex`, and if we went that path we would need to calculate `startIndex` by finding the last element of the `loadedImages` state array in the `images` array and pass those as arguments.
2. Since the `pageSize` constant is responsive it can change when e.g. user resizes the browser window, so we call `sliceToModN(selectedImages, pageSize)` for evenly loaded new row. Note that we don't call this for the last page because, eventually, we want to load all images, and the correct `loadedImages` array length is important for calculating the `isEnd` variable.

## Cumulative layout shift

Layout shift is important web vitals parameter and it's more challenging to optimize here since we are dealing with a dynamic client components. In the Gallery component we handle this by setting `initialPage` constant to load enough images to fill the initial gallery screen.

```ts
// src/constants/gallery.ts

export const GALLERY = {
  // ...
  PAGE_SIZE: {
    XS: 1,
    SM: 2,
    LG: 3,
  },
  INITIAL_PAGE: {
    XS: 3,
    SM: 3,
    LG: 3,
  },
  // ...
} as const;
```

Another optimization we can do is to stretch the empty gallery container element with `flex grow`. For that we need to modify the Page layout and pass the required Tailwind classes via the MDX frontmatter and `articleClass` prop.

You can see that in [src/layouts/Page.astro#L38](https://github.com/nemanjam/nemanjam.github.io/blob/38a37b0e6d87f7723fac7875399ff12e128d26ac/src/layouts/Page.astro#L38):

```tsx
// src/layouts/Page.astro
---

import Centered from '@/layouts/Centered.astro';
import { getOpenGraphImagePath } from '@/libs/api/open-graph/image-path';
import { cn } from '@/utils/styles';

export interface Content {
  // ...
  class?: string;
  /** for flex flex-grow min-height to prevent layout shift for client components */
  articleClass?: string;
}

// ...

const { title, description, class: className, articleClass } = content;

// ...

---

<Centered {metadata} class={cn(className)}>
  {/* in general must not have flex, it will disable margin collapsing in MDX */}
  <article class={cn('my-prose', articleClass)}>
    <slot />
  </article>
</Centered>
```

Flex class is passed from MDX frontmatter in [src/pages/gallery.mdx#L7](https://github.com/nemanjam/nemanjam.github.io/blob/38a37b0e6d87f7723fac7875399ff12e128d26ac/src/pages/gallery.mdx#L7):

```md
# src/pages/gallery.mdx

---

layout: '../layouts/Page.astro'
...
class: 'max-w-5xl'
articleClass: 'grow flex flex-col'

---

import Gallery from '../components/Gallery.astro';

# Gallery

<Gallery class="not-prose grow" />
```

This will reduce the shift of DOM elements size, it won't make it perfect like in fully static page but for our use case it's good enough.

Another point to make is that `flex` container will disable margin collapsing which is important for proper vertical spacings in MDX generated HTML. So if you do that you will need to add an additional `<div>` wrapper element without flex to re-enable proper margin collapsing.

**Lighthouse score, old gallery:**

![Lighthouse score, old gallery](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/96p1qv2byaexanq5f5cr.png)

**Lighthouse score, new gallery:**

![Lighthouse score, new gallery](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9t4z508rsbxtmb5d3pem.png)

Please ignore the "Accessibility" score above, since the accessibility attributes aren't yet tackled on the entire website.

## Lightbox with Photoswipe

For previewing images in full screen lightbox we will use ready made library [Photoswipe](https://github.com/dimsemenov/photoswipe) that looks solid, reliable and flexible. We will use a basic [React example](https://photoswipe.com/react-image-gallery/) from the documentation.

This is the code [src/components/react/Gallery.tsx#L98](https://github.com/nemanjam/nemanjam.github.io/blob/38a37b0e6d87f7723fac7875399ff12e128d26ac/src/components/react/Gallery.tsx#L98)

```tsx
// src/components/react/Gallery.tsx

// lightbox
useEffect(() => {
  let lightbox: PhotoSwipeLightbox | null = new PhotoSwipeLightbox({
    gallery: '#' + GALLERY_ID,
    children: 'a',
    pswpModule: () => import('photoswipe'),
  });
  lightbox.init();

  return () => {
    lightbox?.destroy();
    lightbox = null;
  };
}, []);

return (
  <>
    <div
      id={GALLERY_ID}
      className="pswp-gallery grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3"
    >
      {loadedImages.map((image) => (
        <a
          key={`${GALLERY_ID}--${image.lightbox.src}`}
          // lightbox doesn't support responsive image
          href={image.lightbox.src}
          data-pswp-width={image.lightbox.width}
          data-pswp-height={image.lightbox.height}
          target="_blank"
          rel="noreferrer"
        >
          <img
              {...image.thumbnail}
            // ...
          />
        </a>
      ))}
    </div>
  {/* ... */}
  <>
```

Note that for a simplicity sake we are using a simple fixed image and Photoswipe implements scale transition on its own. By default it uses a simple link `<a href={image.lightbox.src}>` to load the `<img src />` in the full page lightbox.

This is a tradeoff for simplicity. Loading a responsive image with `srcset` would require integrating a custom component which could be a topic for another article. Another possible improvement is to enable closing lightbox on backdrop click on mobile which is not the case with the default config.

Lightbox image size is defined in [src/libs/gallery/transform.ts#L24](https://github.com/nemanjam/nemanjam.github.io/blob/6ef147e4b13b718d43ac24df6122dd1033e3d194/src/libs/gallery/transform.ts#L24)

```ts
// src/libs/gallery/transform.ts

export const lightboxImageOptions = {
  ...IMAGE_SIZES.FIXED.MDX_2XL_16_9,
};

// src/constants/image.ts

export const IMAGE_SIZES = {
  FIXED: {
    // ...
    MDX_2XL_16_9: { width: TW_SCREENS._2XL, height: TW_SCREENS.HEIGHTS._2XL },
  },
  // ...
};
```

## Completed code and demo

- **Demo:** https://nemanjamitic.com/gallery
- **Github repository:** https://github.com/nemanjam/nemanjam.github.io

The relevant files:

```bash
# new gallery https://github.com/nemanjam/nemanjam.github.io/tree/c1e105847d8e7b4ab4aaffad3078726c37f67528
git checkout c1e105847d8e7b4ab4aaffad3078726c37f67528

src/pages/gallery.mdx
src/components/Gallery.astro
src/components/react/Gallery.tsx
src/libs/gallery/images.ts
src/libs/gallery/transform.ts
src/utils/gallery.ts
src/constants/gallery.ts
src/constants/image.ts
src/components/react/hooks/useScrollDown.tsx
src/components/react/hooks/useWidth.tsx

# old gallery https://github.com/nemanjam/nemanjam.github.io/tree/e0165b295db2ccc72bbbb7be4bdd7eb48f7dedae
git checkout e0165b295db2ccc72bbbb7be4bdd7eb48f7dedae
```

## Outro

That was a pretty long read, thank you for your attention and dedication. Have you implemented an Astro image gallery yourself and used a different approach? Do you have suggestions for improvements or spotted anything incorrect? Don't hesitate to leave a comment below.

## References

- Astro gallery example, inspiration to take Photoswipe for a lightbox component https://github.com/EmaSuriano/astro-art-portfolio
- Photoswipe documentation https://photoswipe.com/getting-started
- Astro documentation, tutorial how to use `getImage()` function https://docs.astro.build/en/recipes/build-custom-img-component/
- Infinite scroll with React and IntersectionObserver tutorial https://blog.logrocket.com/react-infinite-scroll/ and Codesandbox example https://codesandbox.io/p/github/Elijah-trillionz/react-infinite-scroll/master
- Images in Astro as client components, useful Reddit discussion https://www.reddit.com/r/astrojs/comments/1bia6lq/how\_to\_utilize\_image\_with\_react\_component
