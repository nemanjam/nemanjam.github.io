import React, { useEffect, useRef, useState } from 'react';

import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const fixedClasses = ['opacity-1', 'translate-y-0'];
const hiddenClasses = ['opacity-0', 'translate-y-full'];

const showLink = (linkRef: React.RefObject<HTMLAnchorElement>): void => {
  linkRef.current?.classList.add(...fixedClasses);
  linkRef.current?.classList.remove(...hiddenClasses);
};

const hideLink = (linkRef: React.RefObject<HTMLAnchorElement>): void => {
  linkRef.current?.classList.remove(...fixedClasses);
  linkRef.current?.classList.add(...hiddenClasses);
};

const getHalfViewportHeight = (window: Window) => Math.floor(window.innerHeight / 2);

const ScrollToTop: React.FC<Props> = ({ children }) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [height, setHeight] = useState(getHalfViewportHeight(window));

  useEffect(() => {
    const callback: IntersectionObserverCallback = (entries) => {
      const isAtTopOrBottom = entries.some((entry) => entry.isIntersecting);

      console.log('isAtTopOrBottom', isAtTopOrBottom);

      if (linkRef.current) {
        isAtTopOrBottom ? hideLink(linkRef) : showLink(linkRef);
      }
    };

    const intersect = new IntersectionObserver(callback);

    if (topRef.current) intersect.observe(topRef.current);
    if (bottomRef.current) intersect.observe(bottomRef.current);

    return () => {
      intersect.disconnect();
    };
  }, []);

  // on resize only, vertical...?
  useEffect(() => {
    const handleResize = () => {
      window.requestAnimationFrame(() => setHeight(getHalfViewportHeight(window)));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <div
        ref={topRef}
        className="pointer-events-none absolute top-0 w-10 bg-red-500"
        style={{ height: `${height}px` }}
      />
      <div
        ref={bottomRef}
        className="pointer-events-none absolute bottom-0 w-10 bg-blue-500"
        style={{ height: `${height}px` }}
      />
      <a
        ref={linkRef}
        id="to-top"
        href="#top"
        className="z-10 fixed bottom-6 right-6 rounded bg-base-200 border border-base-300"
        aria-label="Scroll to top"
      >
        {/* astro-icon must be passed as slot */}
        {children}
      </a>
    </>
  );
};

export default ScrollToTop;
