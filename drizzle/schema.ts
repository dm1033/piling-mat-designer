import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

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
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Design purchases — each row is a paid BRE470 design with certificate
 * £299.99 per design, includes full calculation data and signed certificate
 */
export const designs = mysqlTable("designs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Unique certificate reference number e.g. BRE470-2026-00001 */
  certificateRef: varchar("certificateRef", { length: 64 }).notNull().unique(),
  /** Stripe payment tracking */
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 128 }),
  stripeSessionId: varchar("stripeSessionId", { length: 128 }),
  amountPence: int("amountPence").notNull(),
  currency: varchar("currency", { length: 8 }).default("gbp").notNull(),
  paymentStatus: varchar("paymentStatus", { length: 32 }).default("pending").notNull(),
  /** Project / site details entered by the user */
  projectName: varchar("projectName", { length: 256 }),
  siteLocation: varchar("siteLocation", { length: 256 }),
  clientName: varchar("clientName", { length: 256 }),
  /** Full calculation inputs and results stored as JSON */
  calculationInputs: json("calculationInputs"),
  calculationResult: json("calculationResult"),
  /** Certificate status */
  certificateIssued: boolean("certificateIssued").default(false).notNull(),
  certificateIssuedAt: timestamp("certificateIssuedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Design = typeof designs.$inferSelect;
export type InsertDesign = typeof designs.$inferInsert;

/**
 * CPD presentation requests — companies requesting a BRE470 CPD talk
 */
export const cpdRequests = mysqlTable("cpd_requests", {
  id: int("id").autoincrement().primaryKey(),
  /** Requester details */
  contactName: varchar("contactName", { length: 256 }).notNull(),
  companyName: varchar("companyName", { length: 256 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 64 }),
  jobTitle: varchar("jobTitle", { length: 256 }),
  /** Presentation details */
  preferredDate: varchar("preferredDate", { length: 128 }),
  attendees: varchar("attendees", { length: 64 }),
  format: mysqlEnum("format", ["online", "in-person", "either"]).default("either").notNull(),
  additionalNotes: text("additionalNotes"),
  /** Payment tracking */
  amountPence: int("amountPence").default(1999).notNull(),
  currency: varchar("currency", { length: 8 }).default("gbp").notNull(),
  paymentStatus: varchar("paymentStatus", { length: 32 }).default("pending").notNull(),
  stripeSessionId: varchar("stripeSessionId", { length: 128 }),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 128 }),
  /** Status tracking */
  status: mysqlEnum("status", ["new", "contacted", "confirmed", "completed", "cancelled"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CpdRequest = typeof cpdRequests.$inferSelect;
export type InsertCpdRequest = typeof cpdRequests.$inferInsert;
