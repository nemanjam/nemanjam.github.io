import { useEffect, useState } from 'react';

const useDelayed = (tracked: boolean, delayMs: number) => {
  const [delayed, setDelayed] = useState(false);

  useEffect(() => {
    if (!tracked) {
      // No delay, set immediately
      if (delayMs === 0) {
        setDelayed(false);
        return;
      }

      setDelayed(true);

      const timeout = setTimeout(() => {
        setDelayed(false);
      }, delayMs);

      return () => clearTimeout(timeout);
    }
  }, [tracked, delayMs]);

  return delayed;
};

export default useDelayed;
