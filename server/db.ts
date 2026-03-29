import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, purchases, accessCodes } from "../drizzle/schema";
import { ENV } from './_core/env';
import { nanoid } from "nanoid";

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

// ─── Purchase helpers ────────────────────────────────────────────────

export async function checkUserHasAccess(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db
    .select({ hasPurchased: users.hasPurchased, role: users.role })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (result.length === 0) return false;
  // Admin always has access, or user has purchased, or user redeemed an access code
  return result[0].role === "admin" || result[0].hasPurchased === true;
}

export async function getUserPurchases(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(purchases).where(eq(purchases.userId, userId));
}

// ─── Access code helpers ─────────────────────────────────────────────

export async function createAccessCode(createdByUserId: number, companyName?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const code = nanoid(12).toUpperCase();

  await db.insert(accessCodes).values({
    code,
    createdByUserId,
    companyName: companyName || null,
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

  // Mark code as used
  await db
    .update(accessCodes)
    .set({ isUsed: true, usedByUserId: userId, usedAt: new Date() })
    .where(eq(accessCodes.id, result[0].id));

  // Grant access to the user
  await db
    .update(users)
    .set({ hasPurchased: true })
    .where(eq(users.id, userId));

  return true;
}

export async function getAccessCodesByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(accessCodes).where(eq(accessCodes.createdByUserId, userId));
}
