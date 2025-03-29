import { useEffect, useState } from 'react';

import { TW_WIDTHS } from '@/constants/image';

import type { Breakpoint } from '@/types/constants';

export const useWidth = (): number => {
  const [width, setWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
};

export const getActiveBreakpoint = (width: number): Breakpoint =>
  (Object.entries(TW_WIDTHS)
    .reverse()
    .find(([_, value]) => width >= value)?.[0] as Breakpoint) ?? ('XXS' as const);

export const useActiveBreakpoint = (): Breakpoint => {
  const width = useWidth();
  return getActiveBreakpoint(width);
};
