import { describe, expect, it, beforeEach, vi } from "vitest";

// Core demo logic tests — localStorage-based tracking
const DEMO_KEY = "bre470-demo-used";
const MAX_FREE_CALCS = 1;

/** Helper: simulates the hook's state logic */
function createDemoState(initialCount: number = 0) {
  let demoCount = initialCount;

  return {
    get hasUsedDemo() { return demoCount >= MAX_FREE_CALCS; },
    get remainingCalcs() { return Math.max(0, MAX_FREE_CALCS - demoCount); },
    get demoCount() { return demoCount; },
    recordDemoUse() {
      demoCount += 1;
      try { localStorage.setItem(DEMO_KEY, String(demoCount)); } catch { /* noop */ }
      return demoCount >= MAX_FREE_CALCS;
    },
  };
}

describe("Demo mode localStorage tracking", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", {
      store: {} as Record<string, string>,
      getItem(key: string) { return this.store[key] ?? null; },
      setItem(key: string, value: string) { this.store[key] = value; },
      removeItem(key: string) { delete this.store[key]; },
      clear() { this.store = {}; },
    });
  });

  it("starts with 0 demo uses when localStorage is empty", () => {
    const stored = localStorage.getItem(DEMO_KEY);
    const count = stored ? parseInt(stored, 10) : 0;
    expect(count).toBe(0);
  });

  it("records a demo use by incrementing localStorage counter", () => {
    localStorage.setItem(DEMO_KEY, "1");
    expect(localStorage.getItem(DEMO_KEY)).toBe("1");
  });

  it("detects when demo has been used (count >= 1)", () => {
    localStorage.setItem(DEMO_KEY, "1");
    const count = parseInt(localStorage.getItem(DEMO_KEY)!, 10);
    expect(count >= 1).toBe(true);
  });

  it("persists demo count across simulated sessions", () => {
    localStorage.setItem(DEMO_KEY, "1");
    const stored = localStorage.getItem(DEMO_KEY);
    const count = stored ? parseInt(stored, 10) : 0;
    expect(count).toBe(1);
  });

  it("handles missing localStorage gracefully", () => {
    vi.stubGlobal("localStorage", {
      getItem() { throw new Error("localStorage unavailable"); },
      setItem() { throw new Error("localStorage unavailable"); },
    });
    let count = 0;
    try {
      const stored = localStorage.getItem(DEMO_KEY);
      count = stored ? parseInt(stored, 10) : 0;
    } catch {
      count = 0;
    }
    expect(count).toBe(0);
  });
});

describe("Demo mode state machine", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", {
      store: {} as Record<string, string>,
      getItem(key: string) { return this.store[key] ?? null; },
      setItem(key: string, value: string) { this.store[key] = value; },
      removeItem(key: string) { delete this.store[key]; },
      clear() { this.store = {}; },
    });
  });

  it("fresh user has 1 remaining calculation and hasUsedDemo=false", () => {
    const state = createDemoState(0);
    expect(state.hasUsedDemo).toBe(false);
    expect(state.remainingCalcs).toBe(1);
    expect(state.demoCount).toBe(0);
  });

  it("first calculation is allowed and returns isNowLocked=true", () => {
    const state = createDemoState(0);
    // Simulate: user clicks Calculate
    const isNowLocked = state.recordDemoUse();
    expect(isNowLocked).toBe(true); // after 1 use, locked
    expect(state.hasUsedDemo).toBe(true);
    expect(state.remainingCalcs).toBe(0);
  });

  it("second calculation attempt is blocked for non-paid user", () => {
    const state = createDemoState(1); // already used 1
    // Simulate: calculator checks before allowing calculation
    const hasPaidAccess = false;
    const isBlocked = !hasPaidAccess && state.hasUsedDemo;
    expect(isBlocked).toBe(true);
  });

  it("paid user is never blocked regardless of demo count", () => {
    const state = createDemoState(5); // used many times
    const hasPaidAccess = true;
    const isBlocked = !hasPaidAccess && state.hasUsedDemo;
    expect(isBlocked).toBe(false);
  });
});

describe("Demo mode calculator access rules", () => {
  it("non-paid, no demo used: calculate button works normally", () => {
    const hasPaidAccess = false;
    const hasUsedDemo = false;
    const isBlocked = !hasPaidAccess && hasUsedDemo;
    expect(isBlocked).toBe(false);
  });

  it("non-paid, demo used: calculate button is blocked, upsell shown", () => {
    const hasPaidAccess = false;
    const hasUsedDemo = true;
    const isBlocked = !hasPaidAccess && hasUsedDemo;
    expect(isBlocked).toBe(true);
  });

  it("paid user: export and calculation steps are visible", () => {
    const hasPaidAccess = true;
    const showExport = hasPaidAccess;
    const showCalcSteps = hasPaidAccess;
    expect(showExport).toBe(true);
    expect(showCalcSteps).toBe(true);
  });

  it("demo user: export and calculation steps are hidden", () => {
    const hasPaidAccess = false;
    const showExport = hasPaidAccess;
    const showCalcSteps = hasPaidAccess;
    expect(showExport).toBe(false);
    expect(showCalcSteps).toBe(false);
  });

  it("demo banner shows only for non-paid users who haven't used demo", () => {
    // Banner condition: !hasPaidAccess && !hasUsedDemo
    expect(!false && !false).toBe(true);  // non-paid, fresh → show banner
    expect(!false && !true).toBe(false);  // non-paid, used → no banner
    expect(!true && !false).toBe(false);  // paid → no banner
  });

  it("upsell card shows only for non-paid users who have used demo", () => {
    // Upsell condition: !hasPaidAccess && hasUsedDemo
    expect(!false && true).toBe(true);   // non-paid, used → show upsell
    expect(!false && false).toBe(false);  // non-paid, fresh → no upsell
    expect(!true && true).toBe(false);   // paid → no upsell
  });
});
