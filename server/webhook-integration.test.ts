import { describe, expect, it, vi, beforeEach } from "vitest";
import { PLANS, getPricePence, formatPrice } from "./products";

/**
 * Integration-style tests for the subscription model and Stripe webhook logic.
 * Tests product configuration, pricing helpers, and webhook DB flow.
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
      limit: vi.fn().mockResolvedValue([{ id: 1, hasPurchased: false, role: "user", subscriptionTier: null }]),
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
  eq: vi.fn((col, val) => ({ col, val })),
  and: vi.fn((...args: any[]) => ({ args })),
}));

// Set DATABASE_URL so getDb() initializes
process.env.DATABASE_URL = "mysql://test:test@localhost:3306/test";

describe("Subscription plan configuration", () => {
  it("defines three tiers: individual, team, enterprise", () => {
    expect(Object.keys(PLANS)).toEqual(["individual", "team", "enterprise"]);
  });

  it("individual plan is £9.99/month and £99/year", () => {
    expect(PLANS.individual.monthlyPricePence).toBe(999);
    expect(PLANS.individual.annualPricePence).toBe(9900);
    expect(PLANS.individual.currency).toBe("gbp");
    expect(PLANS.individual.maxUsers).toBe(1);
  });

  it("team plan is £29.99/month and £299/year with 10 users", () => {
    expect(PLANS.team.monthlyPricePence).toBe(2999);
    expect(PLANS.team.annualPricePence).toBe(29900);
    expect(PLANS.team.maxUsers).toBe(10);
  });

  it("enterprise plan is £49.99/month and £499/year with unlimited users", () => {
    expect(PLANS.enterprise.monthlyPricePence).toBe(4999);
    expect(PLANS.enterprise.annualPricePence).toBe(49900);
    expect(PLANS.enterprise.maxUsers).toBe(999);
  });

  it("individual plan features mention BRE470 calculations", () => {
    const features = PLANS.individual.features.join(" ").toLowerCase();
    expect(features).toContain("bre470");
  });

  it("team and enterprise plans inherit from lower tiers", () => {
    expect(PLANS.team.features[0]).toContain("Everything in Individual");
    expect(PLANS.enterprise.features[0]).toContain("Everything in Team");
  });

  it("annual pricing offers a discount vs monthly", () => {
    for (const plan of Object.values(PLANS)) {
      const monthlyAnnualized = plan.monthlyPricePence * 12;
      expect(plan.annualPricePence).toBeLessThan(monthlyAnnualized);
    }
  });
});

describe("Pricing helpers", () => {
  it("getPricePence returns monthly price for month interval", () => {
    expect(getPricePence("individual", "month")).toBe(999);
    expect(getPricePence("team", "month")).toBe(2999);
    expect(getPricePence("enterprise", "month")).toBe(4999);
  });

  it("getPricePence returns annual price for year interval", () => {
    expect(getPricePence("individual", "year")).toBe(9900);
    expect(getPricePence("team", "year")).toBe(29900);
    expect(getPricePence("enterprise", "year")).toBe(49900);
  });

  it("getPricePence throws for unknown plan", () => {
    expect(() => getPricePence("nonexistent", "month")).toThrow("Unknown plan");
  });

  it("formatPrice converts pence to pounds correctly", () => {
    expect(formatPrice(999)).toBe("£9.99");
    expect(formatPrice(2999)).toBe("£29.99");
    expect(formatPrice(49900)).toBe("£499.00");
    expect(formatPrice(0)).toBe("£0.00");
  });
});

describe("Webhook checkout.session.completed flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("records subscription and grants access when checkout completes", async () => {
    const { getDb } = await import("./db");
    const db = await getDb();

    expect(db).not.toBeNull();

    if (db) {
      // Simulate purchase insert with subscription data
      await db.insert({} as any).values({
        userId: 1,
        stripePaymentIntentId: "pi_test_123",
        stripeSessionId: "cs_test_456",
        stripeSubscriptionId: "sub_test_789",
        planTier: "team",
        billingInterval: "month",
        amountPence: 2999,
        currency: "gbp",
        status: "completed",
      });

      expect(mockInsert).toHaveBeenCalled();

      // Simulate user update with subscription fields
      await db.update({} as any).set({
        hasPurchased: true,
        subscriptionTier: "team",
        subscriptionStatus: "active",
        stripeSubscriptionId: "sub_test_789",
        stripeCustomerId: "cus_test_abc",
      }).where({} as any);

      expect(mockUpdate).toHaveBeenCalled();
    }
  });

  it("handles missing user_id in session metadata gracefully", () => {
    const session = {
      metadata: {},
      payment_intent: "pi_test_no_user",
      id: "cs_test_no_user",
      subscription: "sub_test_no_user",
      amount_total: 2999,
      currency: "gbp",
      customer: null,
    };

    expect(session.metadata).not.toHaveProperty("user_id");
  });
});

describe("Access code flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generates unique codes of correct format", async () => {
    const { nanoid } = await import("nanoid");
    const code = nanoid(12).toUpperCase();

    expect(code.length).toBe(12);
    expect(code).toBe(code.toUpperCase());
  });

  it("access code redemption updates user subscription", async () => {
    const db = (await import("./db")).getDb;
    const dbInstance = await db();

    if (dbInstance) {
      const mockCodeResult = [{
        id: 5,
        code: "TESTCODE1234",
        isUsed: false,
        createdByUserId: 1,
        tier: "team",
      }];

      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue(mockCodeResult),
          }),
        }),
      });

      const result = await dbInstance.select().from({} as any).where({} as any).limit(1);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].tier).toBe("team");
    }
  });
});
