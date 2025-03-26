import { useEffect, useRef } from 'react';

import type { RefObject } from 'react';

const usePrevious = function <T>(value: T): RefObject<T | null>['current'] {
  const ref = useRef<T>(null);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export default usePrevious;
