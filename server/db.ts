import { eq, desc, sql, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, designs, cpdRequests, InsertCpdRequest } from "../drizzle/schema";
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

// ─── Admin helpers ────────────────────────────────────────────────────

/** Get all users with their design counts (admin only) */
export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];

  const allUsers = await db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt));

  // Get design counts per user
  const designCounts = await db
    .select({
      userId: designs.userId,
      total: sql<number>`count(*)`,
      paid: sql<number>`SUM(CASE WHEN ${designs.paymentStatus} = 'completed' THEN 1 ELSE 0 END)`,
    })
    .from(designs)
    .groupBy(designs.userId);

  const countMap = new Map(designCounts.map(d => [d.userId, { total: d.total, paid: d.paid }]));

  return allUsers.map(u => ({
    id: u.id,
    openId: u.openId,
    name: u.name,
    email: u.email,
    role: u.role,
    stripeCustomerId: u.stripeCustomerId,
    createdAt: u.createdAt,
    lastSignedIn: u.lastSignedIn,
    designsTotal: countMap.get(u.id)?.total ?? 0,
    designsPaid: countMap.get(u.id)?.paid ?? 0,
  }));
}

/** Get all designs with user info (admin only) */
export async function getAllDesigns() {
  const db = await getDb();
  if (!db) return [];

  const allDesigns = await db
    .select({
      id: designs.id,
      userId: designs.userId,
      certificateRef: designs.certificateRef,
      stripePaymentIntentId: designs.stripePaymentIntentId,
      stripeSessionId: designs.stripeSessionId,
      amountPence: designs.amountPence,
      currency: designs.currency,
      paymentStatus: designs.paymentStatus,
      projectName: designs.projectName,
      siteLocation: designs.siteLocation,
      clientName: designs.clientName,
      certificateIssued: designs.certificateIssued,
      certificateIssuedAt: designs.certificateIssuedAt,
      createdAt: designs.createdAt,
      userName: users.name,
      userEmail: users.email,
    })
    .from(designs)
    .leftJoin(users, eq(designs.userId, users.id))
    .orderBy(desc(designs.createdAt));

  return allDesigns;
}

/** Get a specific design by ID (admin — no user restriction) */
export async function getDesignByIdAdmin(designId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(designs)
    .where(eq(designs.id, designId))
    .limit(1);

  if (result.length === 0) return undefined;

  // Also fetch the user info
  const design = result[0];
  const userResult = await db
    .select()
    .from(users)
    .where(eq(users.id, design.userId))
    .limit(1);

  return {
    ...design,
    user: userResult.length > 0 ? {
      id: userResult[0].id,
      name: userResult[0].name,
      email: userResult[0].email,
      role: userResult[0].role,
    } : null,
  };
}

// ─── CPD Request helpers ──────────────────────────────────────────────

/** Create a new CPD request */
export async function createCpdRequest(data: Omit<InsertCpdRequest, 'id' | 'status' | 'createdAt'>): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(cpdRequests).values({
    ...data,
    status: "new",
  });

  return (result as any)[0].insertId;
}

/** Get all CPD requests (admin only) */
export async function getAllCpdRequests() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(cpdRequests)
    .orderBy(desc(cpdRequests.createdAt));
}

/** Update CPD request status (admin only) */
export async function updateCpdRequestStatus(id: number, status: 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled') {
  const db = await getDb();
  if (!db) return;

  await db.update(cpdRequests).set({ status }).where(eq(cpdRequests.id, id));
}

/** Get admin dashboard stats */
export async function getAdminStats() {
  const db = await getDb();
  if (!db) return { totalUsers: 0, totalDesigns: 0, paidDesigns: 0, pendingDesigns: 0, totalRevenuePence: 0 };

  const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
  const [designCount] = await db.select({ count: sql<number>`count(*)` }).from(designs);
  const [paidCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(designs)
    .where(eq(designs.paymentStatus, "completed"));
  const [pendingCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(designs)
    .where(eq(designs.paymentStatus, "pending"));
  const [revenue] = await db
    .select({ total: sql<number>`COALESCE(SUM(${designs.amountPence}), 0)` })
    .from(designs)
    .where(eq(designs.paymentStatus, "completed"));

  return {
    totalUsers: userCount?.count ?? 0,
    totalDesigns: designCount?.count ?? 0,
    paidDesigns: paidCount?.count ?? 0,
    pendingDesigns: pendingCount?.count ?? 0,
    totalRevenuePence: revenue?.total ?? 0,
  };
}
