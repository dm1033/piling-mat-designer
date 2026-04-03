/**
 * Stripe Webhook Handler
 * Processes subscription lifecycle events:
 *   - checkout.session.completed → initial subscription created
 *   - invoice.paid → subscription renewed
 *   - customer.subscription.updated → plan changes, cancellation
 *   - customer.subscription.deleted → subscription ended
 */
import type { Express } from "express";
import express from "express";
import Stripe from "stripe";
import { getDb } from "./db";
import { users, purchases } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export function registerStripeWebhook(app: Express) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey) {
    console.warn("[Stripe] STRIPE_SECRET_KEY not set, webhook disabled");
    return;
  }

  const stripe = new Stripe(stripeSecretKey, { apiVersion: "2026-03-25.dahlia" });

  // IMPORTANT: Must use raw body for signature verification
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      let event: Stripe.Event;

      try {
        if (webhookSecret) {
          const sig = req.headers["stripe-signature"] as string;
          event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        } else {
          event = JSON.parse(req.body.toString());
        }
      } catch (err: any) {
        console.error("[Stripe Webhook] Signature verification failed:", err.message);
        return res.status(400).json({ error: "Webhook signature verification failed" });
      }

      // Handle test events
      if (event.id.startsWith("evt_test_")) {
        console.log("[Stripe Webhook] Test event detected, returning verification response");
        return res.json({ verified: true });
      }

      console.log(`[Stripe Webhook] Received event: ${event.type} (${event.id})`);

      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            await handleCheckoutCompleted(session, stripe);
            break;
          }
          case "invoice.paid": {
            const invoice = event.data.object as Stripe.Invoice;
            await handleInvoicePaid(invoice);
            break;
          }
          case "customer.subscription.updated": {
            const subscription = event.data.object as Stripe.Subscription;
            await handleSubscriptionUpdated(subscription);
            break;
          }
          case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            await handleSubscriptionDeleted(subscription);
            break;
          }
          default:
            console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        }
      } catch (err) {
        console.error("[Stripe Webhook] Error processing event:", err);
        return res.status(500).json({ error: "Webhook processing failed" });
      }

      res.json({ received: true });
    }
  );
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session, stripe: Stripe) {
  const userId = session.metadata?.user_id;
  const planTier = session.metadata?.plan_tier || "individual";
  const billingInterval = session.metadata?.billing_interval || "month";

  if (!userId) {
    console.error("[Stripe Webhook] No user_id in session metadata");
    return;
  }

  const db = await getDb();
  if (!db) {
    console.error("[Stripe Webhook] Database not available");
    return;
  }

  const userIdNum = parseInt(userId, 10);
  const subscriptionId = session.subscription as string;

  // Retrieve the subscription to get period end
  let periodEnd: Date | null = null;
  if (subscriptionId) {
    try {
      const sub = await stripe.subscriptions.retrieve(subscriptionId) as any;
      periodEnd = new Date(sub.current_period_end * 1000);
    } catch (err) {
      console.warn("[Stripe Webhook] Could not retrieve subscription:", err);
    }
  }

  // Record the purchase/subscription event
  await db.insert(purchases).values({
    userId: userIdNum,
    stripePaymentIntentId: (session.payment_intent as string) || `session_${session.id}`,
    stripeSessionId: session.id,
    stripeSubscriptionId: subscriptionId || null,
    planTier,
    billingInterval,
    amountPence: session.amount_total || 0,
    currency: (session.currency || "gbp") as string,
    status: "completed",
  });

  // Update user with subscription details
  await db
    .update(users)
    .set({
      hasPurchased: true,
      subscriptionTier: planTier,
      subscriptionStatus: "active",
      stripeSubscriptionId: subscriptionId || undefined,
      stripeCustomerId: (session.customer as string) || undefined,
      subscriptionCurrentPeriodEnd: periodEnd,
    })
    .where(eq(users.id, userIdNum));

  console.log(`[Stripe Webhook] Subscription activated: user=${userId}, tier=${planTier}, interval=${billingInterval}`);
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription as string;
  if (!subscriptionId) return;

  const db = await getDb();
  if (!db) return;

  // Find user by subscription ID
  const result = await db
    .select()
    .from(users)
    .where(eq(users.stripeSubscriptionId, subscriptionId))
    .limit(1);

  if (result.length === 0) {
    console.warn(`[Stripe Webhook] No user found for subscription ${subscriptionId}`);
    return;
  }

  const user = result[0];
  const periodEnd = invoice.lines?.data?.[0]?.period?.end;

  // Update subscription period
  await db
    .update(users)
    .set({
      subscriptionStatus: "active",
      hasPurchased: true,
      subscriptionCurrentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : undefined,
    })
    .where(eq(users.id, user.id));

  // Record the renewal payment
  await db.insert(purchases).values({
    userId: user.id,
    stripePaymentIntentId: ((invoice as any).payment_intent as string) || `invoice_${invoice.id}`,
    stripeSubscriptionId: subscriptionId,
    planTier: user.subscriptionTier || "individual",
    billingInterval: "renewal",
    amountPence: invoice.amount_paid || 0,
    currency: (invoice.currency || "gbp") as string,
    status: "completed",
  });

  console.log(`[Stripe Webhook] Invoice paid: user=${user.id}, subscription=${subscriptionId}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const db = await getDb();
  if (!db) return;

  const result = await db
    .select()
    .from(users)
    .where(eq(users.stripeSubscriptionId, subscription.id))
    .limit(1);

  if (result.length === 0) return;

  const status = subscription.status; // active, past_due, canceled, etc.
  const periodEnd = new Date((subscription as any).current_period_end * 1000);

  await db
    .update(users)
    .set({
      subscriptionStatus: status === "canceled" ? "cancelled" : status,
      subscriptionCurrentPeriodEnd: periodEnd,
      hasPurchased: status === "active" || status === "trialing",
    })
    .where(eq(users.id, result[0].id));

  console.log(`[Stripe Webhook] Subscription updated: user=${result[0].id}, status=${status}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const db = await getDb();
  if (!db) return;

  const result = await db
    .select()
    .from(users)
    .where(eq(users.stripeSubscriptionId, subscription.id))
    .limit(1);

  if (result.length === 0) return;

  await db
    .update(users)
    .set({
      subscriptionStatus: "cancelled",
      hasPurchased: false,
    })
    .where(eq(users.id, result[0].id));

  console.log(`[Stripe Webhook] Subscription deleted: user=${result[0].id}`);
}
