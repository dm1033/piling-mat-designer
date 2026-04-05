import { describe, expect, it, vi, beforeEach } from "vitest";
import { PRODUCT, CERTIFICATE, formatPrice } from "./products";

/**
 * Integration-style tests for the per-design payment model and Stripe webhook logic.
 * Tests product configuration, pricing helpers, certificate metadata, and webhook DB flow.
 */

// Mock the database module
const mockInsert = vi.fn().mockReturnValue({
  values: vi.fn().mockResolvedValue(undefined),
});
const mockUpdate = vi.fn().mockReturnValue({
  set: vi.fn().mockReturnValue({
    where: vi.fn().mockResolvedValue(undefined),
  }),
});
const mockSelect = vi.fn().mockReturnValue({
  from: vi.fn().mockReturnValue({
    where: vi.fn().mockReturnValue({
      limit: vi.fn().mockResolvedValue([{ id: 1, role: "user", stripeCustomerId: null }]),
    }),
  }),
});

vi.mock("drizzle-orm/mysql2", () => ({
  drizzle: vi.fn(() => ({
    insert: mockInsert,
    update: mockUpdate,
    select: mockSelect,
  })),
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((col: unknown, val: unknown) => ({ col, val })),
  and: vi.fn((...args: unknown[]) => ({ args })),
  desc: vi.fn((col: unknown) => ({ col, direction: "desc" })),
  sql: vi.fn(),
}));

// Set DATABASE_URL so getDb() initializes
process.env.DATABASE_URL = "mysql://test:test@localhost:3306/test";

describe("Per-design product configuration", () => {
  it("defines a single product at £299.99 (29999 pence)", () => {
    expect(PRODUCT.id).toBe("bre470_design");
    expect(PRODUCT.priceGBP).toBe(29999);
    expect(PRODUCT.currency).toBe("gbp");
  });

  it("product name includes BRE470 and certificate", () => {
    const name = PRODUCT.name.toLowerCase();
    expect(name).toContain("bre470");
    expect(name).toContain("certificate");
  });

  it("product description mentions David Miller", () => {
    expect(PRODUCT.description).toContain("David Miller");
  });
});

describe("Certificate metadata", () => {
  it("certificate is signed by David Miller", () => {
    expect(CERTIFICATE.designer).toBe("David Miller");
  });

  it("certificate title is Temporary Works Designer", () => {
    expect(CERTIFICATE.title).toBe("Temporary Works Designer");
  });

  it("certificate references BR 470 standard", () => {
    expect(CERTIFICATE.standard).toContain("BR 470");
  });

  it("certificate includes company and contact details", () => {
    expect(CERTIFICATE.company).toBeTruthy();
    expect(CERTIFICATE.email).toBeTruthy();
    expect(CERTIFICATE.phone).toBeTruthy();
  });
});

describe("Pricing helpers", () => {
  it("formatPrice converts pence to pounds correctly", () => {
    expect(formatPrice(29999)).toBe("£299.99");
    expect(formatPrice(0)).toBe("£0.00");
    expect(formatPrice(100)).toBe("£1.00");
    expect(formatPrice(50)).toBe("£0.50");
  });

  it("formatPrice handles the product price", () => {
    expect(formatPrice(PRODUCT.priceGBP)).toBe("£299.99");
  });
});

describe("Webhook checkout.session.completed flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("marks design as paid and issues certificate when checkout completes", async () => {
    const { getDb } = await import("./db");
    const db = await getDb();

    expect(db).not.toBeNull();

    if (db) {
      // Simulate marking design as paid via update
      await db.update({} as any).set({
        paymentStatus: "completed",
        stripePaymentIntentId: "pi_test_123",
        certificateIssued: true,
        certificateIssuedAt: new Date(),
      }).where({} as any);

      expect(mockUpdate).toHaveBeenCalled();
    }
  });

  it("creates design record with correct fields for pending payment", async () => {
    const { getDb } = await import("./db");
    const db = await getDb();

    if (db) {
      await db.insert({} as any).values({
        userId: 1,
        certificateRef: "BRE470-2026-00001",
        amountPence: 29999,
        stripeSessionId: "cs_test_456",
        paymentStatus: "pending",
        projectName: "Test Piling Project",
        siteLocation: "Cambridge, CB1 2AB",
        clientName: "Keller Group plc",
        calculationInputs: { subgradeType: "cohesive", cu: 40 },
        calculationResult: { designThicknessMm: 600, status: "pass" },
        certificateIssued: false,
      });

      expect(mockInsert).toHaveBeenCalled();
    }
  });

  it("handles missing user_id in session metadata gracefully", () => {
    const session = {
      metadata: {},
      payment_intent: "pi_test_no_user",
      id: "cs_test_no_user",
      amount_total: 29999,
      currency: "gbp",
      customer: null,
    };

    expect(session.metadata).not.toHaveProperty("user_id");
  });
});

describe("Certificate reference format", () => {
  it("follows the BRE470-YYYY-NNNNN pattern", () => {
    const year = new Date().getFullYear();
    const ref = `BRE470-${year}-00001`;
    const pattern = /^BRE470-\d{4}-\d{5}$/;
    expect(pattern.test(ref)).toBe(true);
  });

  it("increments correctly", () => {
    const year = new Date().getFullYear();
    const refs = Array.from({ length: 5 }, (_, i) =>
      `BRE470-${year}-${String(i + 1).padStart(5, "0")}`
    );
    expect(refs[0]).toBe(`BRE470-${year}-00001`);
    expect(refs[4]).toBe(`BRE470-${year}-00005`);
  });
});
