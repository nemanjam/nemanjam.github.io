/** @jsxImportSource react */
import { useEffect, useState } from 'react';

// This is intentionally slow
// Do not optimize
function slowFibonacci(num: number): number {
  if (num < 2) {
    return num;
  }

  return slowFibonacci(num - 1) + slowFibonacci(num - 2);
}

function getRandomFib() {
  return slowFibonacci(Math.ceil(Math.random() * 3) + 30);
}

export function SlowMount() {
  // Running a slow calculation on mount and update
  const fib = getRandomFib();
  return <div>Random Fibonnaci number: {fib}</div>;
}

export function SlowUpdate() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [mounted]);

  return <div>Random Fibonnaci number: {mounted ? getRandomFib() : 1}</div>;
}

export function SlowUnmount() {
  useEffect(() => {
    return () => {
      getRandomFib();
    };
  }, []);

  return <div>I unmount slowly…</div>;
}
