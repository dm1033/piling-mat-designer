/**
 * Stripe Webhook Handler — Handles both design (£299.99) and CPD (£19.99) purchases
 * Payment methods: Card (inc. Google Pay / Apple Pay) + PayPal
 */
import type { Express } from "express";
import express from "express";
import Stripe from "stripe";
import { markDesignPaid, updateUserStripeCustomerId, markCpdPaid, getDesignBySessionId, updateDesignPackDelivery } from "./db";
import { notifyOwner } from "./_core/notification";
import { generateDesignPackPdf } from "./pdf";
import { sendDesignPackEmail } from "./email";

/**
 * Fulfil a paid design: generate the official PDF pack and email it to the
 * customer. Never throws — a fulfilment failure must not fail the webhook;
 * instead the owner is notified so the pack can be sent manually.
 */
export async function fulfilDesignPack(stripeSessionId: string): Promise<void> {
  const design = await getDesignBySessionId(stripeSessionId);
  if (!design) {
    console.error(`[Fulfilment] No design found for session ${stripeSessionId}`);
    return;
  }

  const to = design.customerEmail || "";
  try {
    const pdf = await generateDesignPackPdf(design);
    const outcome = await sendDesignPackEmail(to, design, pdf);

    if (outcome.sent) {
      await updateDesignPackDelivery(design.id, "sent");
      console.log(`[Fulfilment] Design pack ${design.certificateRef} emailed to ${to}`);
    } else {
      await updateDesignPackDelivery(design.id, "manual", outcome.error);
      console.warn(`[Fulfilment] Design pack ${design.certificateRef} needs manual delivery: ${outcome.error}`);
    }

    await notifyOwner({
      title: `Design pack ${outcome.sent ? "emailed" : "NEEDS MANUAL SENDING"} — ${design.certificateRef}`,
      content:
        `£${(design.amountPence / 100).toFixed(2)} received for "${design.projectName || "—"}".\n` +
        `Customer email: ${to || "unknown"}\n` +
        `PDF pack (drawings, calculations, risk assessment): ${
          outcome.sent
            ? "sent automatically."
            : `NOT sent automatically (${outcome.error}). Open the admin panel, review design #${design.id}, and email the pack manually.`
        }`,
    }).catch(() => {});
  } catch (err: any) {
    console.error(`[Fulfilment] Failed to generate/send pack for ${design.certificateRef}:`, err);
    await updateDesignPackDelivery(design.id, "failed", err?.message || String(err)).catch(() => {});
    await notifyOwner({
      title: `Design pack generation FAILED — ${design.certificateRef}`,
      content: `Payment received but PDF generation failed: ${err?.message || err}. Fulfil manually from the admin panel (design #${design.id}).`,
    }).catch(() => {});
  }
}

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
            const purchaseType = session.metadata?.purchase_type;
            const paymentIntentId = typeof session.payment_intent === "string"
              ? session.payment_intent
              : (session.payment_intent as any)?.id || `session_${session.id}`;

            if (purchaseType === "cpd") {
              // ─── CPD Purchase (£19.99) ───
              await markCpdPaid(session.id, paymentIntentId);

              const contactName = session.metadata?.contact_name || "Unknown";
              const companyName = session.metadata?.company_name || "Unknown";
              const email = session.metadata?.customer_email || "Unknown";

              await notifyOwner({
                title: `CPD Payment Received — ${companyName}`,
                content: `${contactName} (${email}) from ${companyName} has paid £19.99 for a BRE470 CPD presentation.\n\nPayment method: ${session.payment_method_types?.join(", ") || "unknown"}\nSession: ${session.id}\n\nPlease review and schedule the presentation in the admin panel.`,
              });

              console.log(`[Stripe Webhook] CPD payment completed for session ${session.id} — ${companyName}`);
            } else {
              // ─── Design Purchase (£299.99) — default ───
              const customerEmail =
                session.customer_details?.email ||
                session.customer_email ||
                session.metadata?.customer_email ||
                "";
              await markDesignPaid(session.id, paymentIntentId, customerEmail);

              // Update user's Stripe customer ID if available
              const userId = session.metadata?.user_id;
              const customerId = typeof session.customer === "string"
                ? session.customer
                : (session.customer as any)?.id;

              if (userId && customerId) {
                await updateUserStripeCustomerId(parseInt(userId, 10), customerId);
              }

              console.log(`[Stripe Webhook] Design paid for session ${session.id} — generating official PDF pack`);

              // Generate the official PDF pack (certificate, calcs, drawings,
              // risk assessment) and email it to the customer.
              await fulfilDesignPack(session.id);
            }
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
