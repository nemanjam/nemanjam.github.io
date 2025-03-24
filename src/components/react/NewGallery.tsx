import { useEffect, useRef, useState } from 'react';

import type { ImageProps } from '@/libs/gallery/transform';
import type { FC } from 'react';

interface Props {
  images: ImageProps[];
}

const PAGE_SIZE = 3 as const; // Todo: make it responsive
const INITIAL_PAGE = 1 as const;

const fetchImagesUpToPage = (images: ImageProps[], nextPage: number): ImageProps[] => {
  const endIndex = nextPage * PAGE_SIZE;
  return images.slice(0, endIndex);
};

const NewGallery: FC<Props> = ({ images }) => {
  const [loadedImages, setLoadedImages] = useState<ImageProps[]>([]);
  const [page, setPage] = useState<number>(INITIAL_PAGE);
  const observerTarget = useRef(null);

  // converts page to loaded images
  useEffect(() => {
    const upToPageImages = fetchImagesUpToPage(images, page);
    setLoadedImages(upToPageImages);
  }, [page, images]);

  // sets only page
  useEffect(() => {
    const callback: IntersectionObserverCallback = (entries) => {
      if (entries[0].isIntersecting) {
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
  }, [observerTarget, page]);

  return (
    <>
      <div className="grid grid-cols-1 gap-1 md:grid-cols-2 lg:grid-cols-3">
        {loadedImages.map((image) => (
          <img key={image.xs.src} src={image.xs.src} alt="thumbnail image" className="" />
        ))}
      </div>
      {/* control threshold with margin-top */}
      <div ref={observerTarget} className="h-8 border border-red-500 mt-0"></div>
    </>
  );
};

export default NewGallery;
