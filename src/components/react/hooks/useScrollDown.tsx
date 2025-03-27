import { useEffect, useState } from 'react';

const useScrollDown = (): boolean => {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setIsScrollingDown(currentScroll > lastScrollTop);
      setLastScrollTop(currentScroll);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);

  return isScrollingDown;
};

export default useScrollDown;
