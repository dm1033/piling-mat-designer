import { describe, expect, it, vi, beforeEach } from "vitest";
import type { TrpcContext } from "./_core/context";

/**
 * Tests for the admin panel procedures.
 * Verifies role-based access control and data retrieval for:
 * - admin.stats
 * - admin.users
 * - admin.designs
 * - admin.designDetail
 */

// Mock database functions
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(null),
  generateCertificateRef: vi.fn().mockResolvedValue("BRE470-2026-00001"),
  createDesign: vi.fn().mockResolvedValue(1),
  getUserDesigns: vi.fn().mockResolvedValue([]),
  getDesignById: vi.fn().mockResolvedValue(null),
  countUserDesigns: vi.fn().mockResolvedValue(0),
  markDesignPaid: vi.fn().mockResolvedValue(undefined),
  updateUserStripeCustomerId: vi.fn().mockResolvedValue(undefined),
  upsertUser: vi.fn().mockResolvedValue(undefined),
  getUserByOpenId: vi.fn().mockResolvedValue(undefined),
  getAllUsers: vi.fn().mockResolvedValue([
    {
      id: 1,
      openId: "admin-open-id",
      name: "David Miller",
      email: "admin@twc.com",
      role: "admin",
      stripeCustomerId: null,
      createdAt: new Date("2026-01-01"),
      lastSignedIn: new Date("2026-04-05"),
      designsTotal: 5,
      designsPaid: 3,
    },
    {
      id: 2,
      openId: "user-open-id",
      name: "John Smith",
      email: "john@example.com",
      role: "user",
      stripeCustomerId: "cus_test_123",
      createdAt: new Date("2026-02-15"),
      lastSignedIn: new Date("2026-04-01"),
      designsTotal: 2,
      designsPaid: 2,
    },
  ]),
  getAllDesigns: vi.fn().mockResolvedValue([
    {
      id: 1,
      userId: 2,
      certificateRef: "BRE470-2026-00001",
      stripePaymentIntentId: "pi_test_123",
      stripeSessionId: "cs_test_123",
      amountPence: 29999,
      currency: "gbp",
      paymentStatus: "completed",
      projectName: "A14 Piling Works",
      siteLocation: "Cambridge",
      clientName: "Keller Group",
      certificateIssued: true,
      certificateIssuedAt: new Date("2026-03-01"),
      createdAt: new Date("2026-03-01"),
      userName: "John Smith",
      userEmail: "john@example.com",
    },
    {
      id: 2,
      userId: 2,
      certificateRef: "BRE470-2026-00002",
      stripePaymentIntentId: null,
      stripeSessionId: "cs_test_456",
      amountPence: 29999,
      currency: "gbp",
      paymentStatus: "pending",
      projectName: "M25 Bridge Works",
      siteLocation: "London",
      clientName: "Balfour Beatty",
      certificateIssued: false,
      certificateIssuedAt: null,
      createdAt: new Date("2026-03-15"),
      userName: "John Smith",
      userEmail: "john@example.com",
    },
  ]),
  getDesignByIdAdmin: vi.fn().mockImplementation(async (designId: number) => {
    if (designId === 1) {
      return {
        id: 1,
        userId: 2,
        certificateRef: "BRE470-2026-00001",
        stripePaymentIntentId: "pi_test_123",
        stripeSessionId: "cs_test_123",
        amountPence: 29999,
        currency: "gbp",
        paymentStatus: "completed",
        projectName: "A14 Piling Works",
        siteLocation: "Cambridge",
        clientName: "Keller Group",
        certificateIssued: true,
        certificateIssuedAt: new Date("2026-03-01"),
        createdAt: new Date("2026-03-01"),
        calculationInputs: { subgradeType: "cohesive", cu: 40, phiP: 40, gammaP: 20 },
        calculationResult: { designThicknessMm: 600, status: "pass" },
        user: { id: 2, name: "John Smith", email: "john@example.com", role: "user" },
      };
    }
    return null;
  }),
  getAdminStats: vi.fn().mockResolvedValue({
    totalUsers: 15,
    totalDesigns: 8,
    paidDesigns: 5,
    pendingDesigns: 3,
    totalRevenuePence: 149995,
  }),
}));

// Mock Stripe
vi.mock("stripe", () => ({
  default: vi.fn().mockImplementation(() => ({
    checkout: { sessions: { create: vi.fn().mockResolvedValue({ id: "cs_test", url: "https://checkout.stripe.com/test" }) } },
  })),
}));

process.env.STRIPE_SECRET_KEY = "sk_test_fake";

const { appRouter } = await import("./routers");

function createAdminContext(): TrpcContext {
  return {
    req: { headers: { origin: "http://localhost:3000" } } as any,
    res: { clearCookie: vi.fn() } as any,
    user: {
      id: 1,
      openId: "admin-open-id",
      name: "David Miller",
      email: "admin@twc.com",
      loginMethod: "email",
      role: "admin",
      stripeCustomerId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
  };
}

function createUserContext(): TrpcContext {
  return {
    req: { headers: { origin: "http://localhost:3000" } } as any,
    res: { clearCookie: vi.fn() } as any,
    user: {
      id: 2,
      openId: "user-open-id",
      name: "John Smith",
      email: "john@example.com",
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

// ─── admin.stats ─────────────────────────────────────────────────────────

describe("admin.stats", () => {
  it("returns dashboard stats for admin users", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.admin.stats();

    expect(result.totalUsers).toBe(15);
    expect(result.totalDesigns).toBe(8);
    expect(result.paidDesigns).toBe(5);
    expect(result.pendingDesigns).toBe(3);
    expect(result.totalRevenuePence).toBe(149995);
    expect(result.totalRevenueFormatted).toBe("£1499.95");
  });

  it("rejects non-admin users", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.admin.stats()).rejects.toThrow();
  });

  it("rejects unauthenticated users", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.admin.stats()).rejects.toThrow();
  });
});

// ─── admin.users ─────────────────────────────────────────────────────────

describe("admin.users", () => {
  it("returns all users with design counts for admin", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.admin.users();

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("David Miller");
    expect(result[0].role).toBe("admin");
    expect(result[0].designsTotal).toBe(5);
    expect(result[0].designsPaid).toBe(3);
    expect(result[1].name).toBe("John Smith");
    expect(result[1].role).toBe("user");
    expect(result[1].designsPaid).toBe(2);
  });

  it("rejects non-admin users", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.admin.users()).rejects.toThrow();
  });

  it("rejects unauthenticated users", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.admin.users()).rejects.toThrow();
  });
});

// ─── admin.designs ───────────────────────────────────────────────────────

describe("admin.designs", () => {
  it("returns all designs with user info for admin", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.admin.designs();

    expect(result).toHaveLength(2);
    expect(result[0].certificateRef).toBe("BRE470-2026-00001");
    expect(result[0].projectName).toBe("A14 Piling Works");
    expect(result[0].userName).toBe("John Smith");
    expect(result[0].paymentStatus).toBe("completed");
    expect(result[0].amountPence).toBe(29999);
    expect(result[1].certificateRef).toBe("BRE470-2026-00002");
    expect(result[1].paymentStatus).toBe("pending");
  });

  it("rejects non-admin users", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.admin.designs()).rejects.toThrow();
  });

  it("rejects unauthenticated users", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.admin.designs()).rejects.toThrow();
  });
});

// ─── admin.designDetail ──────────────────────────────────────────────────

describe("admin.designDetail", () => {
  it("returns full design detail with user and certificate info", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.admin.designDetail({ designId: 1 });

    expect(result.certificateRef).toBe("BRE470-2026-00001");
    expect(result.projectName).toBe("A14 Piling Works");
    expect(result.user?.name).toBe("John Smith");
    expect(result.user?.email).toBe("john@example.com");
    expect(result.certificate.designer).toBe("David Miller");
    expect(result.calculationInputs).toBeTruthy();
    expect(result.calculationResult).toBeTruthy();
  });

  it("throws error for non-existent design", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    await expect(caller.admin.designDetail({ designId: 999 })).rejects.toThrow("Design not found");
  });

  it("rejects non-admin users", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.admin.designDetail({ designId: 1 })).rejects.toThrow();
  });

  it("rejects unauthenticated users", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.admin.designDetail({ designId: 1 })).rejects.toThrow();
  });
});
