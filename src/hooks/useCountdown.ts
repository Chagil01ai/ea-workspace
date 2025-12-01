import { useEffect, useState } from "react";

export function useCountdown(
  endTime: string | null,
  onExpire?: () => void
): number | null {
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (!endTime) {
      setRemainingSeconds(null);
      return;
    }

    const target = new Date(endTime).getTime();
    if (Number.isNaN(target)) {
      setRemainingSeconds(null);
      return;
    }

    const tick = () => {
      const now = Date.now();
      const diffMs = target - now;
      const diffSeconds = Math.max(0, Math.floor(diffMs / 1000));

      setRemainingSeconds(diffSeconds);

      if (diffSeconds <= 0) {
        clearInterval(intervalId);
        if (onExpire) {
          onExpire();
        }
      }
    };

    // initial call
    tick();
    const intervalId = window.setInterval(tick, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [endTime, onExpire]);

  return remainingSeconds;
}
