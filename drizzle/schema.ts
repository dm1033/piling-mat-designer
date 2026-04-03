import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 128 }),
  // Subscription fields
  subscriptionTier: varchar("subscriptionTier", { length: 32 }), // individual, team, enterprise
  subscriptionStatus: varchar("subscriptionStatus", { length: 32 }), // active, cancelled, past_due, trialing
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 128 }),
  subscriptionCurrentPeriodEnd: timestamp("subscriptionCurrentPeriodEnd"),
  // Legacy one-off purchase flag (kept for backward compatibility)
  hasPurchased: boolean("hasPurchased").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Purchases / subscription events table
 * Records each successful payment (initial and renewals)
 */
export const purchases = mysqlTable("purchases", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 128 }).notNull(),
  stripeSessionId: varchar("stripeSessionId", { length: 128 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 128 }),
  planTier: varchar("planTier", { length: 32 }),
  billingInterval: varchar("billingInterval", { length: 16 }), // month or year
  amountPence: int("amountPence").notNull(),
  currency: varchar("currency", { length: 8 }).default("gbp").notNull(),
  status: varchar("status", { length: 32 }).default("completed").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = typeof purchases.$inferInsert;

/**
 * Access codes - shareable codes that grant access to the tool
 * Team and Enterprise subscribers can generate codes for their team members
 */
export const accessCodes = mysqlTable("accessCodes", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 32 }).notNull().unique(),
  createdByUserId: int("createdByUserId").notNull(),
  usedByUserId: int("usedByUserId"),
  isUsed: boolean("isUsed").default(false).notNull(),
  companyName: varchar("companyName", { length: 256 }),
  planTier: varchar("planTier", { length: 32 }), // tier inherited from creator
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  usedAt: timestamp("usedAt"),
});

export type AccessCode = typeof accessCodes.$inferSelect;
export type InsertAccessCode = typeof accessCodes.$inferInsert;
