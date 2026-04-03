import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, purchases, accessCodes } from "../drizzle/schema";
import { ENV } from './_core/env';
import { nanoid } from "nanoid";
import { PLANS } from "./products";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ─── Subscription & access helpers ──────────────────────────────────

export interface AccessInfo {
  hasAccess: boolean;
  tier: string | null;
  status: string | null;
  periodEnd: Date | null;
  maxUsers: number;
}

export async function checkUserHasAccess(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db
    .select({
      hasPurchased: users.hasPurchased,
      role: users.role,
      subscriptionStatus: users.subscriptionStatus,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (result.length === 0) return false;
  const u = result[0];
  // Admin always has access
  if (u.role === "admin") return true;
  // Active subscription
  if (u.subscriptionStatus === "active" || u.subscriptionStatus === "trialing") return true;
  // Legacy one-off purchase or redeemed access code
  if (u.hasPurchased) return true;
  return false;
}

export async function getUserAccessInfo(userId: number): Promise<AccessInfo> {
  const db = await getDb();
  if (!db) return { hasAccess: false, tier: null, status: null, periodEnd: null, maxUsers: 0 };

  const result = await db
    .select({
      hasPurchased: users.hasPurchased,
      role: users.role,
      subscriptionTier: users.subscriptionTier,
      subscriptionStatus: users.subscriptionStatus,
      subscriptionCurrentPeriodEnd: users.subscriptionCurrentPeriodEnd,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (result.length === 0) {
    return { hasAccess: false, tier: null, status: null, periodEnd: null, maxUsers: 0 };
  }

  const u = result[0];
  const hasAccess = u.role === "admin" ||
    u.subscriptionStatus === "active" ||
    u.subscriptionStatus === "trialing" ||
    u.hasPurchased === true;

  const tier = u.subscriptionTier || null;
  const plan = tier ? PLANS[tier] : null;

  return {
    hasAccess,
    tier,
    status: u.subscriptionStatus || (u.hasPurchased ? "active" : null),
    periodEnd: u.subscriptionCurrentPeriodEnd || null,
    maxUsers: plan?.maxUsers || (u.role === "admin" ? 999 : 1),
  };
}

export async function getUserPurchases(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(purchases).where(eq(purchases.userId, userId));
}

// ─── Access code helpers ─────────────────────────────────────────────

export async function createAccessCode(createdByUserId: number, companyName?: string, planTier?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const code = nanoid(12).toUpperCase();

  await db.insert(accessCodes).values({
    code,
    createdByUserId,
    companyName: companyName || null,
    planTier: planTier || null,
  });

  return code;
}

export async function redeemAccessCode(code: string, userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  // Find the code
  const result = await db
    .select()
    .from(accessCodes)
    .where(and(eq(accessCodes.code, code), eq(accessCodes.isUsed, false)))
    .limit(1);

  if (result.length === 0) return false;

  const codeRecord = result[0];

  // Mark code as used
  await db
    .update(accessCodes)
    .set({ isUsed: true, usedByUserId: userId, usedAt: new Date() })
    .where(eq(accessCodes.id, codeRecord.id));

  // Grant access to the user — inherit the tier from the code creator
  await db
    .update(users)
    .set({
      hasPurchased: true,
      subscriptionTier: codeRecord.planTier || undefined,
      subscriptionStatus: "active",
    })
    .where(eq(users.id, userId));

  return true;
}

export async function getAccessCodesByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(accessCodes).where(eq(accessCodes.createdByUserId, userId));
}

export async function countAccessCodesUsedByUser(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select()
    .from(accessCodes)
    .where(and(eq(accessCodes.createdByUserId, userId), eq(accessCodes.isUsed, true)));

  return result.length;
}
