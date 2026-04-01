import { useState, useCallback } from "react";

const DEMO_KEY = "bre470-demo-used";
const MAX_FREE_CALCS = 1;

/**
 * Hook to manage the free demo mode.
 * Allows one free calculation before requiring purchase.
 * Tracks usage in localStorage so it persists across sessions.
 */
export function useDemoMode() {
  const [demoCount, setDemoCount] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(DEMO_KEY);
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });

  const hasUsedDemo = demoCount >= MAX_FREE_CALCS;
  const remainingCalcs = Math.max(0, MAX_FREE_CALCS - demoCount);

  const recordDemoUse = useCallback(() => {
    const newCount = demoCount + 1;
    setDemoCount(newCount);
    try {
      localStorage.setItem(DEMO_KEY, String(newCount));
    } catch {
      // localStorage might be unavailable
    }
    return newCount >= MAX_FREE_CALCS;
  }, [demoCount]);

  return {
    demoCount,
    hasUsedDemo,
    remainingCalcs,
    recordDemoUse,
    maxFreeCalcs: MAX_FREE_CALCS,
  };
}
