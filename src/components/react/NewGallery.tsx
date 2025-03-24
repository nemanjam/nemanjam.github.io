import { useEffect, useMemo, useRef, useState } from 'react';

import PhotoSwipeLightbox from 'photoswipe/lightbox';

import type { ImageProps } from '@/libs/gallery/transform';
import type { FC } from 'react';

import 'photoswipe/style.css';

import { GALLERY_ID } from '@/constants/gallery';
import { cn } from '@/utils/styles';

interface Props {
  images: ImageProps[];
}

type LoadedStates = Record<string, boolean>;

// step
const PAGE_SIZE = 3 as const; // Todo: make it responsive
// page dependency in useEffect is more important
const INITIAL_PAGE = 1 as const;

const fetchImagesUpToPage = (images: ImageProps[], nextPage: number): ImageProps[] => {
  const endIndex = nextPage * PAGE_SIZE;
  return images.slice(0, endIndex);
};

const NewGallery: FC<Props> = ({ images }) => {
  const [loadedImages, setLoadedImages] = useState<ImageProps[]>([]);
  const [page, setPage] = useState<number>(INITIAL_PAGE);
  const observerTarget = useRef(null);

  const [loadedStates, setLoadedStates] = useState<LoadedStates>({});
  // calculate if new page is loaded on scroll
  // not for blur transition
  const isAllImagesLoaded = useMemo(
    () => Object.values(loadedStates).every(Boolean),
    [loadedStates, loadedImages.length]
  );

  const isEnd = loadedImages.length === images.length;

  // converts page to loaded images
  useEffect(() => {
    const upToPageImages = fetchImagesUpToPage(images, page);
    setLoadedImages(upToPageImages);
  }, [page, images]);

  // sets only page
  useEffect(() => {
    const callback: IntersectionObserverCallback = (entries) => {
      // must wait here for images to load
      if (!isEnd && isAllImagesLoaded && entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    };
    const options: IntersectionObserverInit = { threshold: 1 };
    const observer = new IntersectionObserver(callback, options);

    const observerRef = observerTarget.current;

    if (observerRef) observer.observe(observerRef);

    return () => {
      if (observerRef) observer.unobserve(observerRef);
    };
    // page dependency is important for initial load to work for all resolutions
  }, [observerTarget, page, isEnd]);

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

  const handleLoad = (src: string) => {
    setLoadedStates((prev) => ({ ...prev, [src]: true }));
  };

  return (
    <>
      <div
        id={GALLERY_ID}
        className="pswp-gallery grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3"
      >
        {loadedImages.map((image) => (
          <a
            key={`${GALLERY_ID}--${image.xl.src}`}
            href={image.xl.src}
            data-pswp-width={image.xl.width}
            data-pswp-height={image.xl.height}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={image.xs.src}
              onLoad={() => handleLoad(image.xs.src)}
              alt="Gallery image"
              className={cn(
                'w-full transition-all duration-[2s] ease-in-out',
                loadedStates[image.xs.src]
                  ? 'opacity-100 blur-0 grayscale-0'
                  : 'opacity-75 blur-sm grayscale'
              )}
            />
          </a>
        ))}
      </div>
      {/* control threshold with margin-top */}
      <div ref={observerTarget} className="mt-0"></div>
    </>
  );
};

export default NewGallery;
