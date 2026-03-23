import { useEffect, useState } from "react";

export function useCountUp(target: number, duration: number, started: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * target));

      if (progress >= 1) {
        clearInterval(interval);
        setCount(target);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [target, duration, started]);

  return count;
}
