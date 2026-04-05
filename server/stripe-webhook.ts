/**
 * Stripe Webhook Handler — Per-design payment model
 * Handles checkout.session.completed for one-off £299.99 design purchases
 */
import type { Express } from "express";
import express from "express";
import Stripe from "stripe";
import { markDesignPaid, updateUserStripeCustomerId } from "./db";

export function registerStripeWebhook(app: Express) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey) {
    console.warn("[Stripe] STRIPE_SECRET_KEY not set, webhook disabled");
    return;
  }

  const stripe = new Stripe(stripeSecretKey, { apiVersion: "2025-04-30.basil" as any });

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
            const paymentIntentId = typeof session.payment_intent === "string"
              ? session.payment_intent
              : (session.payment_intent as any)?.id || `session_${session.id}`;

            // Mark the design as paid and issue the certificate
            await markDesignPaid(session.id, paymentIntentId);

            // Update user's Stripe customer ID if available
            const userId = session.metadata?.user_id;
            const customerId = typeof session.customer === "string"
              ? session.customer
              : (session.customer as any)?.id;

            if (userId && customerId) {
              await updateUserStripeCustomerId(parseInt(userId, 10), customerId);
            }

            console.log(`[Stripe Webhook] Design certificate issued for session ${session.id}`);
            break;
          }

          case "payment_intent.succeeded": {
            const pi = event.data.object as Stripe.PaymentIntent;
            console.log(`[Stripe Webhook] Payment succeeded: ${pi.id}, amount: ${pi.amount}`);
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
