import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createUserContext(overrides: Partial<AuthenticatedUser> = {}): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-1",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    hasPurchased: false,
    stripeCustomerId: null,
    subscriptionTier: null,
    subscriptionStatus: null,
    stripeSubscriptionId: null,
    subscriptionCurrentPeriodEnd: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    ...overrides,
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: { origin: "https://test.example.com" },
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createUnauthContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

// Mock the db module with all required exports
vi.mock("./db", () => ({
  checkUserHasAccess: vi.fn(),
  getUserAccessInfo: vi.fn(),
  getUserPurchases: vi.fn(),
  createAccessCode: vi.fn(),
  redeemAccessCode: vi.fn(),
  getAccessCodesByUser: vi.fn(),
  countAccessCodesUsedByUser: vi.fn(),
  getUserByOpenId: vi.fn(),
}));

// Mock stripe
vi.mock("stripe", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      checkout: {
        sessions: {
          create: vi.fn().mockResolvedValue({
            url: "https://checkout.stripe.com/test-session",
            id: "cs_test_123",
          }),
        },
      },
      billingPortal: {
        sessions: {
          create: vi.fn().mockResolvedValue({
            url: "https://billing.stripe.com/test-portal",
          }),
        },
      },
    })),
  };
});

// Set env for Stripe
process.env.STRIPE_SECRET_KEY = "sk_test_fake";

import {
  checkUserHasAccess,
  getUserAccessInfo,
  getUserPurchases,
  createAccessCode,
  redeemAccessCode,
  getAccessCodesByUser,
  countAccessCodesUsedByUser,
} from "./db";

describe("purchase.hasAccess", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns hasAccess true when user has active subscription", async () => {
    vi.mocked(checkUserHasAccess).mockResolvedValue(true);
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.purchase.hasAccess();
    expect(result).toEqual({ hasAccess: true });
    expect(checkUserHasAccess).toHaveBeenCalledWith(1);
  });

  it("returns hasAccess false when user has no subscription", async () => {
    vi.mocked(checkUserHasAccess).mockResolvedValue(false);
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.purchase.hasAccess();
    expect(result).toEqual({ hasAccess: false });
  });

  it("throws for unauthenticated users", async () => {
    const ctx = createUnauthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.purchase.hasAccess()).rejects.toThrow();
  });
});

describe("purchase.accessInfo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns detailed access info for authenticated users", async () => {
    vi.mocked(getUserAccessInfo).mockResolvedValue({
      hasAccess: true,
      tier: "team",
      status: "active",
      maxUsers: 10,
      periodEnd: new Date("2026-05-01"),
    });
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.purchase.accessInfo();
    expect(result.hasAccess).toBe(true);
    expect(result.tier).toBe("team");
    expect(result.maxUsers).toBe(10);
  });
});

describe("purchase.createCheckout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a checkout URL for individual monthly plan", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.purchase.createCheckout({
      planId: "individual",
      interval: "month",
    });
    expect(result.checkoutUrl).toBe("https://checkout.stripe.com/test-session");
  });

  it("returns a checkout URL for team annual plan", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.purchase.createCheckout({
      planId: "team",
      interval: "year",
    });
    expect(result.checkoutUrl).toBe("https://checkout.stripe.com/test-session");
  });

  it("throws for unauthenticated users", async () => {
    const ctx = createUnauthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.purchase.createCheckout({ planId: "individual", interval: "month" })
    ).rejects.toThrow();
  });
});

describe("purchase.history", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns purchase history for authenticated users", async () => {
    const mockPurchases = [
      {
        id: 1,
        userId: 1,
        stripePaymentIntentId: "pi_123",
        planTier: "team",
        billingInterval: "month",
        amountPence: 2999,
        currency: "gbp",
        status: "completed",
        createdAt: new Date(),
      },
    ];
    vi.mocked(getUserPurchases).mockResolvedValue(mockPurchases as any);
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.purchase.history();
    expect(result).toEqual(mockPurchases);
    expect(getUserPurchases).toHaveBeenCalledWith(1);
  });
});

describe("accessCode.create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates an access code for team plan subscribers", async () => {
    vi.mocked(getUserAccessInfo).mockResolvedValue({
      hasAccess: true,
      tier: "team",
      status: "active",
      maxUsers: 10,
      periodEnd: new Date("2026-05-01"),
    });
    vi.mocked(countAccessCodesUsedByUser).mockResolvedValue(2);
    vi.mocked(createAccessCode).mockResolvedValue("ABC123DEF456");
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.accessCode.create({ companyName: "Test Co" });
    expect(result.code).toBe("ABC123DEF456");
    expect(createAccessCode).toHaveBeenCalledWith(1, "Test Co", "team");
  });

  it("throws for individual plan subscribers trying to share", async () => {
    vi.mocked(getUserAccessInfo).mockResolvedValue({
      hasAccess: true,
      tier: "individual",
      status: "active",
      maxUsers: 1,
      periodEnd: new Date("2026-05-01"),
    });
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.accessCode.create({})).rejects.toThrow(
      "Access code sharing is available on Team and Enterprise plans"
    );
  });

  it("throws for users without an active subscription", async () => {
    vi.mocked(getUserAccessInfo).mockResolvedValue({
      hasAccess: false,
      tier: null,
      status: null,
      maxUsers: 0,
      periodEnd: null,
    });
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.accessCode.create({})).rejects.toThrow(
      "You must have an active subscription to create access codes"
    );
  });

  it("throws when team plan reaches max users", async () => {
    vi.mocked(getUserAccessInfo).mockResolvedValue({
      hasAccess: true,
      tier: "team",
      status: "active",
      maxUsers: 10,
      periodEnd: new Date("2026-05-01"),
    });
    vi.mocked(countAccessCodesUsedByUser).mockResolvedValue(10);
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.accessCode.create({})).rejects.toThrow(
      "You have reached the maximum of 10 shared users"
    );
  });
});

describe("accessCode.redeem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redeems a valid access code", async () => {
    vi.mocked(redeemAccessCode).mockResolvedValue(true);
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.accessCode.redeem({ code: "ABC123DEF456" });
    expect(result.success).toBe(true);
    expect(redeemAccessCode).toHaveBeenCalledWith("ABC123DEF456", 1);
  });

  it("returns false for invalid access code", async () => {
    vi.mocked(redeemAccessCode).mockResolvedValue(false);
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.accessCode.redeem({ code: "INVALID" });
    expect(result.success).toBe(false);
  });

  it("uppercases and trims the code before redeeming", async () => {
    vi.mocked(redeemAccessCode).mockResolvedValue(true);
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await caller.accessCode.redeem({ code: "  abc123def456  " });
    expect(redeemAccessCode).toHaveBeenCalledWith("ABC123DEF456", 1);
  });
});

describe("accessCode.list", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns access codes created by the user", async () => {
    const mockCodes = [
      { id: 1, code: "ABC123", createdByUserId: 1, isUsed: false, tier: "team", companyName: "Test Co", createdAt: new Date() },
    ];
    vi.mocked(getAccessCodesByUser).mockResolvedValue(mockCodes as any);
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.accessCode.list();
    expect(result).toEqual(mockCodes);
    expect(getAccessCodesByUser).toHaveBeenCalledWith(1);
  });
});
