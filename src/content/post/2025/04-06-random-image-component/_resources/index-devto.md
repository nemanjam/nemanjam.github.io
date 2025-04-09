## Introduction

For the sake of practice and fun let's build a component that displays a random image on mouse click. It looks more fun and interactive than a static hero image. You can see it in action on the Home page of the my website.

This functionality shares some common parts with the image gallery described in the previous article, such as the component hierarchy and including urls in the client. However, it also introduces some new elements, like a proper blur preloader.

## What we will be building

- **Demo:** https://nemanjamitic.com/
- **Github repository:** https://github.com/nemanjam/nemanjam.github.io

{% youtube mMlD-0Ixw4c %}

## Component hierarchy

Again, we will use the similar structure `MDX (index.mdx) -> Astro component (ImageRandom.astro) -> React components (ImageRandomReact.jsx and ImageBlurPreloader.jsx)`, and again, the client React components contain the most complexity.

Code (paraphrased):

```tsx
// src/pages/index.mdx

<ImageRandom />

// src/components/ImageRandom.astro

<ImageRandomReact {galleryImages} client:load />

// src/components/react/ImageRandomReact.tsx

<ImageBlurPreloader {...props} />
```

## Responsive image

This is the functionality shared with the image gallery. This time, we’ll use a fixed low-resolution image for the blur effect and a responsive, high-resolution hero image as the main one. The blur and main images will have different resolutions but share the same `16:9` aspect ratio.

The code is as follows:

```ts
// src/constants/image.ts

export const IMAGE_SIZES = {
  FIXED: {
    // blur image
    BLUR_16_9: {
      width: 64,
      height: 36,
    },
  // ...
  },
  RESPONSIVE: {
    // main image
    POST_HERO: {
      widths: [TW_SCREENS.XS, TW_SCREENS.SM, TW_SCREENS.MD, TW_SCREENS.LG],
      sizes: `(max-width: ${TW_SCREENS.XS}px) ${TW_SCREENS.XS}px, (max-width: ${TW_SCREENS.SM}px) ${TW_SCREENS.SM}px, (max-width: ${TW_SCREENS.MD}px) ${TW_SCREENS.MD}px, ${TW_SCREENS.LG}px`,
    },
    // ...
  },
};

// actual <img /> tag attributes that are generated with the POST_HERO

<img
  sizes="(max-width: 475px) 475px, (max-width: 640px) 640px, (max-width: 768px) 768px, 1024px"
  width="3264"
  height="1836"
  srcset="
    /_astro/amfi1.Cv2xkJ5B_1Lofkq.webp 475w,
    /_astro/amfi1.Cv2xkJ5B_Oxmi8.webp 640w,
    /_astro/amfi1.Cv2xkJ5B_X0wXS.webp 768w,
    /_astro/amfi1.Cv2xkJ5B_Z1u01H4.webp 1024w
  "
  src="/_astro/amfi1.Cv2xkJ5B_26HGs8.webp"
/>

// src/libs/gallery/transform.ts

export const heroImageOptions = {
  ...IMAGE_SIZES.RESPONSIVE.POST_HERO,
};

// src/libs/gallery/images.ts

export const getHeroImages = async (): Promise<HeroImage[]> => {
  const blur = await getCustomImages(blurImageOptions);
  const hero = await getCustomImages(heroImageOptions);

  const heroImages = mergeArrays(blur, hero).map(([blur, hero]) => ({
    blur: imageResultToImageAttributes(blur),
    hero: imageResultToImageAttributes(hero),
  }));

  return heroImages;
};

// src/components/ImageRandom.astro

const galleryImages = await getHeroImages();
```

**Responsive main image in action:**

{% youtube _a8j9HeLLnk %}

## Random image in a static website

Again, we have the same situation as in the image gallery. The key point is to include all image urls in the client and execute `getRandomElementFromArray()` in the client React component to display a random image at runtime. If we called the random function on the server, in the Astro component, we would end up with a single image that was randomly picked at build time - which is not what we want.

This is the code:

```tsx
---
// src/components/ImageRandom.astro

const galleryImages = await getHeroImages();
---

{/* include all the images in the client and let the client pick the random image */}

<div  {...props}>
  <ImageRandomReact {galleryImages} client:load />
</div>

// src/components/react/ImageRandom.tsx

const ImageRandomReact: FC<Props> = ({ galleryImages, className, divClassName, ...props }) => {
  // cache randomized images
  const randomImage = useMemo(() => getRandomElementFromArray(galleryImages), [galleryImages]);

  const [image, setImage] = useState(initialImage);

  // pick initial random image on mount
  useEffect(() => {
    setImage(randomImage);
  }, [setImage, randomImage]);

  // pick random image onClick
  const handleClick = async () => {
    const randomImage = getRandomElementFromArray(galleryImages);
    setImage(randomImage);
  };

  return (
    <ImageBlurPreloader
      {...props}
      blurAttributes={{ ...image.blur, alt: 'Blur image' }}
      mainAttributes={{ ...image.hero, onClick: handleClick, alt: 'Hero image' }}
      className={cn('cursor-pointer my-0', className)}
      divClassName={divClassName}
    />
  );
};

```

## Blur preloader

This is the most interesting part of the feature. The first instinct when swapping the blur and main images might be to use a ternary operator to mount or unmount the appropriate image. But we actually can’t do that here. Why? Because both images need to remain mounted in the DOM to ensure the `onLoad` event works correctly for both the blur and main images. So instead of unmounting, we will use absolute positioning to place the main image above the blur image and toggle its opacity to show or hide it.

But there is more. Note that with the `onLoad` event, we have three possible values for the image’s src attribute (although the main image actually uses the `srcset` and `sizes` attributes). These are:

1. An empty string `''` when both blur and main images are still loading. In this case we will show an empty `<div />` of the same size as the main image.
2. The `src` attribute of the blur image, when the blur image is loaded but the main image is still loading.
3. The `srcset` and `sizes` attributes of the main image, once the main image has fully loaded.

This is the code [src/components/react/ImageBlurPreloader.tsx](https://github.com/nemanjam/nemanjam.github.io/blob/c1e105847d8e7b4ab4aaffad3078726c37f67528/src/components/react/ImageBlurPreloader.tsx):

```tsx
// src/components/react/ImageBlurPreloader.tsx

const initialAttributes: ImgTagAttributes = { src: '' } as const;

const ImageBlurPreloader: FC<Props> = ({
  blurAttributes = initialAttributes,
  mainAttributes = initialAttributes,
  onMainLoaded,
  className,
  divClassName,
}) => {
  const [isLoadingMain, setIsLoadingMain] = useState(true);
  const [isLoadingBlur, setIsLoadingBlur] = useState(true);

  const prevMainAttributes = usePrevious(mainAttributes);

  const isNewImage = !(
    prevMainAttributes?.src === mainAttributes.src &&
    prevMainAttributes.srcSet === mainAttributes.srcSet
  );

  // reset isLoading on main image change
  useEffect(() => {
    if (isNewImage) {
      setIsLoadingBlur(true);
      setIsLoadingMain(true);
    }
  }, [isNewImage, setIsLoadingMain, setIsLoadingBlur]);

  // important: main image must be in DOM for onLoad to work
  // unmount and display: none; will fail
  const handleLoadMain = () => {
    setIsLoadingMain(false);
    onMainLoaded?.();
  };

  const commonAttributes = {
    // blur image must use size from main image
    width: mainAttributes.width,
    height: mainAttributes.height,
  };

  const blurAlt = !isLoadingBlur ? blurAttributes.alt : '';
  const mainAlt = !isLoadingMain ? mainAttributes.alt : '';

  const hasImage = Boolean(
    isLoadingMain
      ? mainAttributes.src || mainAttributes.srcSet
      : blurAttributes.src || blurAttributes.srcSet
  );

  return (
    <div className={cn('relative size-full', divClassName)}>
      {hasImage && (
        <>
          {/* blur image */}
          <img
            {...blurAttributes}
            {...commonAttributes}
            alt={blurAlt}
            onLoad={() => setIsLoadingBlur(false)}
            className={cn('object-cover absolute top-0 left-0 size-full', className)}
          />

          {/* main image */}
          <img
            {...mainAttributes}
            {...commonAttributes}
            alt={mainAlt}
            onLoad={handleLoadMain}
            className={cn(
              'object-cover absolute top-0 left-0 size-full',
              // important: don't hide main image until next blur image is loaded
              isLoadingMain && !isLoadingBlur ? 'opacity-0' : 'opacity-100',
              className
            )}
          />
        </>
      )}
    </div>
  );
};
```

That is a lot of code, so let’s break it down. First, note the use of `relative` and `absolute` classes to position the images on top of each other.

We set the initial `src` to an empty string in the `initialAttributes` variable. This sets the `hasImage` flag to `true`, unmounts the images, and displays an empty `<div>` that fills the parent container thanks to the `size-full` class (which is needed to prevent layout shift).

Next, note that we track the separate states `isLoadingMain` and `isLoadingBlur` for the main and blur images. Both are necessary so we can correctly show/hide the main image by changing its opacity from `opacity-0` to `opacity-100`. The general idea is this: "Always keep the blur image below, just show or hide the main image above."

Additionally, we track the previous main image, `prevMainAttributes`, to detect when a new image is selected via the `onClick` event passed from the parent component.

Finally, while an image is loading, we set its `alt` attribute (using the `blurAlt` and `mainAlt` variables) to an empty string to avoid rendering text in place of an empty image, as it doesn't look nice.

**Bonus tip:** You can also experiment with the `<img style={{imageRendering: 'pixelated'}} />` scaling style on the blur image if you find it more aesthetically pleasing.

## Cumulative layout shift

This is also an interesting part. In general, the server always sends images with their sizes (at least it should), which makes handling layout shifts easier, so we should be able to solve it properly.

The key point is this: Set the component's actual size **in the server component** `ImageRandom.astro` and use `w-full h-full` (`size-full`) in the client `ImageRandom.tsx` React component to stretch it to fill the parent. This way, the size is resolved on the server, and there is no shift when hydrating the client component.

Lets see it in practice [src/components/ImageRandom.astro#L21](https://github.com/nemanjam/nemanjam.github.io/blob/cb36b621ebae583dee693dd6ef6e6ece0028c468/src/components/ImageRandom.astro#L21)

```tsx
// src/components/ImageRandom.astro"

---
// add 'px' suffix or styles will fail
const { width, height } = Object.fromEntries(
  Object.entries(IMAGE_SIZES.FIXED.MDX_XL_16_9).map(([key, value]) => [key, `${value}px`])
);
---

{/* height and width MUST be defined ON SERVER component to prevent layout shift */}
{/* set height and width to image size but set real size with max-height and max-width */}

<div
  class={cn('max-w-full max-h-64 md:max-h-96 my-8', className)}
  style={{ width, height }}
  {...props}
>
  <ImageRandomReact {galleryImages} client:load />
</div>
```

We use the `max-w-...` and `max-h-...` classes to set the actual (responsive) size for the server component, which the client component will fill.

The `my-8` margin is there to override the vertical margin styles for the image component in the markdown (`prose` class). Remember, we have two actual, absolutely positioned `<img />` tags in the DOM, so `prose` will add double margins, and we need to correct that.

Client component [src/components/react/ImageBlurPreloader.tsx](https://github.com/nemanjam/nemanjam.github.io/blob/c1e105847d8e7b4ab4aaffad3078726c37f67528/src/components/react/ImageBlurPreloader.tsx):

```tsx
// src/components/react/ImageBlurPreloader.tsx

const ImageBlurPreloader: FC<Props> = ({
  // ...
  className,
  divClassName,
}) => {
  // ...

  return (
    <div className={cn('relative size-full', divClassName)}>
      {hasImage && (
        <>
          {/* blur image */}
          <img className={cn('object-cover absolute top-0 left-0 size-full', className)} />

          {/* main image */}
          <img className={cn('object-cover absolute top-0 left-0 size-full')} />
        </>
      )}
    </div>
  );
};
```

In the client component, we simply stretch all elements with `size-full` to fill the parent server component.

With this in place, we achieve the following score for the cumulative layout shift:

![Lighthouse score layout shift](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/v7vkqymd2q602pyai2gl.png)

## Completed code and demo

- **Demo:** https://nemanjamitic.com/
- **Github repository:** https://github.com/nemanjam/nemanjam.github.io

The relevant files:

```bash
# https://github.com/nemanjam/nemanjam.github.io/tree/c1e105847d8e7b4ab4aaffad3078726c37f67528
git checkout c1e105847d8e7b4ab4aaffad3078726c37f67528

# random image code
src/pages/index.mdx
src/components/ImageRandom.astro
src/components/react/ImageRandom.tsx
src/components/react/ImageBlurPreloader.tsx

# common code with gallery
src/libs/gallery/images.ts
src/libs/gallery/transform.ts
src/constants/image.ts
```

## Outro

Once again, we played around with images, Astro, and React. Have you implemented any similar components yourself, maybe a carousel? What was your approach? Do you have suggestions for improvements or have you spotted anything incorrect? Don’t hesitate to leave a comment below.

## References

- React image preloader tutorial https://benhoneywill.com/progressive-image-loading-with-react-hooks/
- Astro documentation, tutorial how to use `getImage()` function https://docs.astro.build/en/recipes/build-custom-img-component/
- "Squared" image scaling algorithm styles https://www.w3schools.com/cssref/css3_pr_image-rendering.php
