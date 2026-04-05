import { eq, desc, sql, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, designs } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

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

// ─── User helpers ──────────────────────────────────────────────────────

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
    const values: InsertUser = { openId: user.openId };
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
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserStripeCustomerId(userId: number, stripeCustomerId: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ stripeCustomerId }).where(eq(users.id, userId));
}

// ─── Design / Certificate helpers ──────────────────────────────────────

/** Generate the next certificate reference number: BRE470-YYYY-NNNNN */
export async function generateCertificateRef(): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const year = new Date().getFullYear();
  const prefix = `BRE470-${year}-`;

  const latest = await db
    .select({ certificateRef: designs.certificateRef })
    .from(designs)
    .where(sql`${designs.certificateRef} LIKE ${prefix + '%'}`)
    .orderBy(desc(designs.id))
    .limit(1);

  let nextNum = 1;
  if (latest.length > 0) {
    const lastRef = latest[0].certificateRef;
    const lastNum = parseInt(lastRef.replace(prefix, ""), 10);
    if (!isNaN(lastNum)) nextNum = lastNum + 1;
  }

  return `${prefix}${String(nextNum).padStart(5, "0")}`;
}

/** Create a new design record (pending payment) */
export async function createDesign(data: {
  userId: number;
  certificateRef: string;
  amountPence: number;
  stripeSessionId?: string;
  projectName?: string;
  siteLocation?: string;
  clientName?: string;
  calculationInputs?: unknown;
  calculationResult?: unknown;
}): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(designs).values({
    userId: data.userId,
    certificateRef: data.certificateRef,
    amountPence: data.amountPence,
    stripeSessionId: data.stripeSessionId || null,
    paymentStatus: "pending",
    projectName: data.projectName || null,
    siteLocation: data.siteLocation || null,
    clientName: data.clientName || null,
    calculationInputs: data.calculationInputs || null,
    calculationResult: data.calculationResult || null,
    certificateIssued: false,
  });

  return (result as any)[0].insertId;
}

/** Mark a design as paid and issue the certificate */
export async function markDesignPaid(stripeSessionId: string, paymentIntentId: string): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(designs).set({
    paymentStatus: "completed",
    stripePaymentIntentId: paymentIntentId,
    certificateIssued: true,
    certificateIssuedAt: new Date(),
  }).where(eq(designs.stripeSessionId, stripeSessionId));
}

/** Get all designs for a user */
export async function getUserDesigns(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(designs)
    .where(eq(designs.userId, userId))
    .orderBy(desc(designs.createdAt));
}

/** Get a specific design by ID and user */
export async function getDesignById(designId: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(designs)
    .where(and(eq(designs.id, designId), eq(designs.userId, userId)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/** Get a design by certificate reference */
export async function getDesignByCertRef(certificateRef: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(designs)
    .where(eq(designs.certificateRef, certificateRef))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/** Count paid designs for a user */
export async function countUserDesigns(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(designs)
    .where(and(eq(designs.userId, userId), eq(designs.paymentStatus, "completed")));

  return result[0]?.count ?? 0;
}
