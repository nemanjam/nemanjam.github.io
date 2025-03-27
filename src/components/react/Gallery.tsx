import { useEffect, useMemo, useRef, useState } from 'react';

import debounce from 'lodash.debounce';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import { PiSpinnerGapBold } from 'react-icons/pi';

import { GALLERY } from '@/constants/gallery';
import { cn } from '@/utils/styles';

import type { GalleryImage } from '@/types/image';
import type { FC } from 'react';

import 'photoswipe/style.css';

import useScrollDown from './hooks/useScrollDown';

interface Props {
  images: GalleryImage[];
}

type LoadedStates = Record<string, boolean>;

const { PAGE_SIZE, INITIAL_PAGE, OBSERVER_DEBOUNCE, GALLERY_ID } = GALLERY;

const fetchImagesUpToPage = (images: GalleryImage[], nextPage: number): GalleryImage[] => {
  const endIndex = nextPage * PAGE_SIZE;
  return images.slice(0, endIndex);
};

const Gallery: FC<Props> = ({ images }) => {
  const [loadedImages, setLoadedImages] = useState<GalleryImage[]>([]);
  const [page, setPage] = useState<number>(INITIAL_PAGE);
  const observerTarget = useRef(null);

  const isScrollingDown = useScrollDown();

  const [loadedStates, setLoadedStates] = useState<LoadedStates>({});

  // calculate if new page is loaded on scroll
  // not for blur transition
  const isLoadingPageImages = useMemo(
    () => !Object.values(loadedStates).every(Boolean),
    [loadedStates, loadedImages.length]
  );

  const isEnd = loadedImages.length === images.length;

  const shouldShowLoader = isScrollingDown && !isEnd && !isLoadingPageImages;

  // converts page to loaded images
  useEffect(() => {
    const upToPageImages = fetchImagesUpToPage(images, page);
    setLoadedImages(upToPageImages);
  }, [page, images]);

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
              onLoad={() => handleLoad(image.thumbnail.src)}
              alt={loadedStates[image.thumbnail.src] ? 'Gallery image' : ''}
              className={cn(
                'w-full transition-all duration-[2s] ease-in-out',
                loadedStates[image.thumbnail.src]
                  ? 'opacity-100 blur-0 grayscale-0'
                  : 'opacity-75 blur-sm grayscale'
              )}
            />
          </a>
        ))}
      </div>

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
    </>
  );
};

export default Gallery;
