import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { checkUserHasAccess, getUserAccessInfo, createAccessCode, redeemAccessCode, getAccessCodesByUser, getUserPurchases, countAccessCodesUsedByUser } from "./db";
import { PLANS, getPricePence, type BillingInterval } from "./products";
import Stripe from "stripe";
import { z } from "zod";

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Stripe not configured");
  return new Stripe(key);
};

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Subscription & access
  purchase: router({
    // Check if the current user has access (simple boolean)
    hasAccess: protectedProcedure.query(async ({ ctx }) => {
      const hasAccess = await checkUserHasAccess(ctx.user.id);
      return { hasAccess };
    }),

    // Get detailed access info including tier, status, period
    accessInfo: protectedProcedure.query(async ({ ctx }) => {
      return getUserAccessInfo(ctx.user.id);
    }),

    // Get available plans (public-ish but needs auth for checkout)
    plans: publicProcedure.query(() => {
      return Object.values(PLANS).map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        monthlyPrice: p.monthlyPricePence,
        annualPrice: p.annualPricePence,
        maxUsers: p.maxUsers,
        features: p.features,
      }));
    }),

    // Create a Stripe checkout session for a subscription
    createCheckout: protectedProcedure
      .input(z.object({
        planId: z.enum(["individual", "team", "enterprise"]),
        interval: z.enum(["month", "year"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const stripe = getStripe();
        const origin = ctx.req.headers.origin || ctx.req.headers.referer || "http://localhost:3000";
        const plan = PLANS[input.planId];
        if (!plan) throw new Error("Invalid plan");

        const pricePence = getPricePence(input.planId, input.interval as BillingInterval);

        const session = await stripe.checkout.sessions.create({
          mode: "subscription",
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: plan.currency,
                product_data: {
                  name: `BRE470 Piling Mat Designer — ${plan.name}`,
                  description: plan.description,
                },
                unit_amount: pricePence,
                recurring: {
                  interval: input.interval,
                },
              },
              quantity: 1,
            },
          ],
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            customer_email: ctx.user.email || "",
            customer_name: ctx.user.name || "",
            plan_tier: input.planId,
            billing_interval: input.interval,
          },
          customer_email: ctx.user.email || undefined,
          allow_promotion_codes: true,
          success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/?cancelled=true`,
        });

        return { checkoutUrl: session.url };
      }),

    // Create a Stripe billing portal session for managing subscription
    createPortal: protectedProcedure.mutation(async ({ ctx }) => {
      const stripe = getStripe();
      const origin = ctx.req.headers.origin || ctx.req.headers.referer || "http://localhost:3000";

      // Get user's Stripe customer ID
      const accessInfo = await getUserAccessInfo(ctx.user.id);
      const { getUserByOpenId } = await import("./db");
      const user = await getUserByOpenId(ctx.user.openId);
      if (!user?.stripeCustomerId) {
        throw new Error("No Stripe customer found. Please contact support.");
      }

      const portalSession = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${origin}/account`,
      });

      return { portalUrl: portalSession.url };
    }),

    // Get purchase/payment history
    history: protectedProcedure.query(async ({ ctx }) => {
      return getUserPurchases(ctx.user.id);
    }),
  }),

  // Access code sharing (Team and Enterprise only)
  accessCode: router({
    // Generate a new access code for sharing
    create: protectedProcedure
      .input(z.object({ companyName: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        const accessInfo = await getUserAccessInfo(ctx.user.id);
        if (!accessInfo.hasAccess) {
          throw new Error("You must have an active subscription to create access codes");
        }

        // Check if user's tier allows sharing
        const tier = accessInfo.tier || "individual";
        if (tier === "individual") {
          throw new Error("Access code sharing is available on Team and Enterprise plans. Please upgrade to share with your team.");
        }

        // Check if user has reached their sharing limit
        const usedCount = await countAccessCodesUsedByUser(ctx.user.id);
        if (usedCount >= accessInfo.maxUsers) {
          throw new Error(`You have reached the maximum of ${accessInfo.maxUsers} shared users for your ${tier} plan.`);
        }

        const code = await createAccessCode(ctx.user.id, input.companyName, tier);
        return { code };
      }),

    // Redeem an access code
    redeem: protectedProcedure
      .input(z.object({ code: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        const success = await redeemAccessCode(input.code.toUpperCase().trim(), ctx.user.id);
        return { success };
      }),

    // List codes created by the current user
    list: protectedProcedure.query(async ({ ctx }) => {
      return getAccessCodesByUser(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
