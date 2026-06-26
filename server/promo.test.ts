/**
 * Tests for promo code validation logic
 * Tests the pure business logic (discount calculations, description building)
 * without requiring a live Stripe connection.
 */
import { describe, it, expect } from "vitest";

// ── Pure logic helpers (mirrors server/routers.ts promo.validate procedure) ──

const DESIGN_PRICE_PENCE = 29999; // £299.99
const CPD_PRICE_PENCE = 1999;     // £19.99

function buildDiscountDescription(percentOff: number | null, amountOff: number | null): string {
  if (percentOff != null) return `${percentOff}% off`;
  if (amountOff != null) return `£${(amountOff / 100).toFixed(2)} off`;
  return "Discount applied";
}

function calcDiscountedPrice(basePrice: number, percentOff: number | null, amountOff: number | null): number {
  if (percentOff != null) return Math.round(basePrice * (1 - percentOff / 100));
  if (amountOff != null) return Math.max(0, basePrice - amountOff);
  return basePrice;
}

// ── Tests ─────────────────────────────────────────────────────────────────────
describe("promo code discount calculation logic", () => {
  it("calculates discounted design price for 20% off", () => {
    const result = calcDiscountedPrice(DESIGN_PRICE_PENCE, 20, null);
    expect(result).toBe(23999); // £239.99
  });

  it("calculates discounted CPD price for 50% off", () => {
    const result = calcDiscountedPrice(CPD_PRICE_PENCE, 50, null);
    expect(result).toBe(1000); // £10.00 (rounded)
  });

  it("calculates discounted design price for £50 amount_off", () => {
    const result = calcDiscountedPrice(DESIGN_PRICE_PENCE, null, 5000);
    expect(result).toBe(24999); // £249.99
  });

  it("clamps discounted CPD price to 0 for large amount_off", () => {
    const result = calcDiscountedPrice(CPD_PRICE_PENCE, null, 5000);
    expect(result).toBe(0); // £19.99 - £50 = 0 (clamped)
  });

  it("returns base price when no discount fields are set", () => {
    const result = calcDiscountedPrice(DESIGN_PRICE_PENCE, null, null);
    expect(result).toBe(DESIGN_PRICE_PENCE);
  });

  it("builds correct description for percent_off", () => {
    expect(buildDiscountDescription(25, null)).toBe("25% off");
    expect(buildDiscountDescription(100, null)).toBe("100% off");
    expect(buildDiscountDescription(10, null)).toBe("10% off");
  });

  it("builds correct description for amount_off", () => {
    expect(buildDiscountDescription(null, 3000)).toBe("£30.00 off");
    expect(buildDiscountDescription(null, 5000)).toBe("£50.00 off");
    expect(buildDiscountDescription(null, 100)).toBe("£1.00 off");
  });

  it("falls back to generic description when both are null", () => {
    expect(buildDiscountDescription(null, null)).toBe("Discount applied");
  });

  it("prefers percent_off over amount_off when both are set", () => {
    // Stripe should never send both, but if it does, percent_off takes priority
    expect(buildDiscountDescription(20, 5000)).toBe("20% off");
    expect(calcDiscountedPrice(DESIGN_PRICE_PENCE, 20, 5000)).toBe(23999);
  });

  it("correctly formats pence to pounds in description", () => {
    // 1999 pence = £19.99
    const amountOff = 1999;
    const desc = buildDiscountDescription(null, amountOff);
    expect(desc).toBe("£19.99 off");
  });

  it("100% off results in 0 price for design", () => {
    const result = calcDiscountedPrice(DESIGN_PRICE_PENCE, 100, null);
    expect(result).toBe(0);
  });

  it("100% off results in 0 price for CPD", () => {
    const result = calcDiscountedPrice(CPD_PRICE_PENCE, 100, null);
    expect(result).toBe(0);
  });
});
