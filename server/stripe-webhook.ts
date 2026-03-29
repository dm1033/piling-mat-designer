/**
 * Stripe Webhook Handler
 * Processes checkout.session.completed events to grant access
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
            await handleCheckoutCompleted(session);
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

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  const paymentIntentId = session.payment_intent as string;

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

  // Record the purchase
  await db.insert(purchases).values({
    userId: userIdNum,
    stripePaymentIntentId: paymentIntentId || `session_${session.id}`,
    stripeSessionId: session.id,
    amountPence: session.amount_total || 30000,
    currency: (session.currency || "gbp") as string,
    status: "completed",
  });

  // Grant access to the user
  await db
    .update(users)
    .set({
      hasPurchased: true,
      stripeCustomerId: session.customer as string || undefined,
    })
    .where(eq(users.id, userIdNum));

  console.log(`[Stripe Webhook] Purchase recorded and access granted for user ${userId}`);
}
