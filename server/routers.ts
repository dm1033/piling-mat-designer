import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { checkUserHasAccess, createAccessCode, redeemAccessCode, getAccessCodesByUser, getUserPurchases } from "./db";
import { PRODUCT } from "./products";
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

  // Purchase & access
  purchase: router({
    // Check if the current user has purchased / has access
    hasAccess: protectedProcedure.query(async ({ ctx }) => {
      const hasAccess = await checkUserHasAccess(ctx.user.id);
      return { hasAccess };
    }),

    // Create a Stripe checkout session for the £300 one-off purchase
    createCheckout: protectedProcedure.mutation(async ({ ctx }) => {
      const stripe = getStripe();
      const origin = ctx.req.headers.origin || ctx.req.headers.referer || "http://localhost:3000";

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: PRODUCT.currency,
              product_data: {
                name: PRODUCT.name,
                description: PRODUCT.description,
              },
              unit_amount: PRODUCT.priceAmountPence,
            },
            quantity: 1,
          },
        ],
        client_reference_id: ctx.user.id.toString(),
        metadata: {
          user_id: ctx.user.id.toString(),
          customer_email: ctx.user.email || "",
          customer_name: ctx.user.name || "",
        },
        customer_email: ctx.user.email || undefined,
        allow_promotion_codes: true,
        success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/?cancelled=true`,
      });

      return { checkoutUrl: session.url };
    }),

    // Get purchase history
    history: protectedProcedure.query(async ({ ctx }) => {
      return getUserPurchases(ctx.user.id);
    }),
  }),

  // Access code sharing
  accessCode: router({
    // Generate a new access code for sharing
    create: protectedProcedure
      .input(z.object({ companyName: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        // Only users who have purchased can create codes
        const hasAccess = await checkUserHasAccess(ctx.user.id);
        if (!hasAccess) {
          throw new Error("You must purchase the tool before creating access codes");
        }
        const code = await createAccessCode(ctx.user.id, input.companyName);
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
