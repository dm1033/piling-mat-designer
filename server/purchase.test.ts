import { describe, expect, it, vi, beforeEach } from "vitest";
import type { TrpcContext } from "./_core/context";

/**
 * Tests for the design router procedures (per-design payment model).
 * Tests product info, design list, design count, and design get procedures.
 */

// Mock database functions
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(null),
  generateCertificateRef: vi.fn().mockResolvedValue("BRE470-2026-00001"),
  createDesign: vi.fn().mockResolvedValue(1),
  getUserDesigns: vi.fn().mockResolvedValue([
    {
      id: 1,
      certificateRef: "BRE470-2026-00001",
      projectName: "Test Project",
      siteLocation: "Cambridge",
      clientName: "Test Client",
      paymentStatus: "completed",
      certificateIssued: true,
      createdAt: new Date("2026-01-15"),
    },
  ]),
  getDesignById: vi.fn().mockResolvedValue({
    id: 1,
    userId: 1,
    certificateRef: "BRE470-2026-00001",
    projectName: "Test Project",
    siteLocation: "Cambridge",
    clientName: "Test Client",
    paymentStatus: "completed",
    certificateIssued: true,
    certificateIssuedAt: new Date("2026-01-15"),
    calculationInputs: { subgradeType: "cohesive", cu: 40 },
    calculationResult: { designThicknessMm: 600, status: "pass" },
    createdAt: new Date("2026-01-15"),
  }),
  countUserDesigns: vi.fn().mockResolvedValue(3),
  markDesignPaid: vi.fn().mockResolvedValue(undefined),
  updateUserStripeCustomerId: vi.fn().mockResolvedValue(undefined),
  upsertUser: vi.fn().mockResolvedValue(undefined),
  getUserByOpenId: vi.fn().mockResolvedValue(undefined),
}));

// Mock Stripe
vi.mock("stripe", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      checkout: {
        sessions: {
          create: vi.fn().mockResolvedValue({
            id: "cs_test_123",
            url: "https://checkout.stripe.com/test",
          }),
        },
      },
    })),
  };
});

// Set env for Stripe
process.env.STRIPE_SECRET_KEY = "sk_test_fake";

// Import after mocks
const { appRouter } = await import("./routers");

function createAuthContext(userId: number = 1): TrpcContext {
  return {
    req: {
      headers: { origin: "http://localhost:3000" },
    } as any,
    res: {
      clearCookie: vi.fn(),
    } as any,
    user: {
      id: userId,
      openId: "test-open-id",
      name: "Test User",
      email: "test@example.com",
      loginMethod: "email",
      role: "user",
      stripeCustomerId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
  };
}

function createPublicContext(): TrpcContext {
  return {
    req: { headers: {} } as any,
    res: { clearCookie: vi.fn() } as any,
    user: null,
  };
}

describe("design.product (public)", () => {
  it("returns product info with £299.99 price", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.design.product();

    expect(result.name).toContain("BRE470");
    expect(result.priceGBP).toBe(29999);
    expect(result.priceFormatted).toBe("£299.99");
  });

  it("returns certificate metadata with David Miller", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.design.product();

    expect(result.certificate.designer).toBe("David Miller");
    expect(result.certificate.title).toBe("Temporary Works Designer");
    expect(result.certificate.standard).toContain("BR 470");
  });
});

describe("design.list (protected)", () => {
  it("returns list of user designs", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.design.list();

    expect(result).toHaveLength(1);
    expect(result[0].certificateRef).toBe("BRE470-2026-00001");
    expect(result[0].projectName).toBe("Test Project");
    expect(result[0].paymentStatus).toBe("completed");
  });

  it("rejects unauthenticated users", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.design.list()).rejects.toThrow();
  });
});

describe("design.count (protected)", () => {
  it("returns count of paid designs", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.design.count();

    expect(result.count).toBe(3);
  });
});

describe("design.get (protected)", () => {
  it("returns full design with certificate data", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.design.get({ designId: 1 });

    expect(result.certificateRef).toBe("BRE470-2026-00001");
    expect(result.certificate.designer).toBe("David Miller");
    expect(result.calculationInputs).toBeTruthy();
    expect(result.calculationResult).toBeTruthy();
  });

  it("rejects unauthenticated users", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.design.get({ designId: 1 })).rejects.toThrow();
  });
});

describe("design.createCheckout (protected)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a checkout session and returns URL", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.design.createCheckout({
      projectName: "Test Piling Project",
      siteLocation: "Cambridge",
      clientName: "Keller Group",
      calculationInputs: { subgradeType: "cohesive", cu: 40 },
      calculationResult: { designThicknessMm: 600 },
    });

    expect(result.checkoutUrl).toBeTruthy();
    expect(result.designId).toBe(1);
    expect(result.certificateRef).toBe("BRE470-2026-00001");
  });

  it("requires project name", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    await expect(
      caller.design.createCheckout({
        projectName: "",
        calculationInputs: {},
        calculationResult: {},
      })
    ).rejects.toThrow();
  });

  it("rejects unauthenticated users", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.design.createCheckout({
        projectName: "Test",
        calculationInputs: {},
        calculationResult: {},
      })
    ).rejects.toThrow();
  });
});
