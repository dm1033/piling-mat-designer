import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { createDesign, generateCertificateRef, getUserDesigns, getDesignById, countUserDesigns } from "./db";
import { PRODUCT, CERTIFICATE, formatPrice } from "./products";
import Stripe from "stripe";
import { z } from "zod";

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Stripe not configured");
  return new Stripe(key, { apiVersion: "2025-04-30.basil" as any });
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

  // Design purchase & certificate
  design: router({
    /** Get product info (price, description) — public */
    product: publicProcedure.query(() => ({
      name: PRODUCT.name,
      description: PRODUCT.description,
      priceGBP: PRODUCT.priceGBP,
      priceFormatted: formatPrice(PRODUCT.priceGBP),
      certificate: CERTIFICATE,
    })),

    /** Create a Stripe checkout session for a design purchase */
    createCheckout: protectedProcedure
      .input(z.object({
        projectName: z.string().min(1, "Project name is required"),
        siteLocation: z.string().optional(),
        clientName: z.string().optional(),
        calculationInputs: z.any(),
        calculationResult: z.any(),
      }))
      .mutation(async ({ ctx, input }) => {
        const stripe = getStripe();
        const origin = ctx.req.headers.origin || ctx.req.headers.referer || "http://localhost:3000";

        // Generate a unique certificate reference
        const certificateRef = await generateCertificateRef();

        // Create the design record (pending payment)
        const designId = await createDesign({
          userId: ctx.user.id,
          certificateRef,
          amountPence: PRODUCT.priceGBP,
          projectName: input.projectName,
          siteLocation: input.siteLocation || undefined,
          clientName: input.clientName || undefined,
          calculationInputs: input.calculationInputs,
          calculationResult: input.calculationResult,
        });

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
          mode: "payment",
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: PRODUCT.currency,
                product_data: {
                  name: PRODUCT.name,
                  description: `Certificate Ref: ${certificateRef} — ${input.projectName}`,
                },
                unit_amount: PRODUCT.priceGBP,
              },
              quantity: 1,
            },
          ],
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            design_id: designId.toString(),
            certificate_ref: certificateRef,
            project_name: input.projectName,
            customer_email: ctx.user.email || "",
            customer_name: ctx.user.name || "",
          },
          customer_email: ctx.user.email || undefined,
          allow_promotion_codes: true,
          success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&design_id=${designId}`,
          cancel_url: `${origin}/calculator?cancelled=true`,
        });

        // Update design with session ID
        const { getDb } = await import("./db");
        const { designs } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        const db = await getDb();
        if (db) {
          await db.update(designs).set({ stripeSessionId: session.id }).where(eq(designs.id, designId));
        }

        return {
          checkoutUrl: session.url,
          designId,
          certificateRef,
        };
      }),

    /** List all designs for the current user */
    list: protectedProcedure.query(async ({ ctx }) => {
      const designsList = await getUserDesigns(ctx.user.id);
      return designsList.map(d => ({
        id: d.id,
        certificateRef: d.certificateRef,
        projectName: d.projectName,
        siteLocation: d.siteLocation,
        clientName: d.clientName,
        paymentStatus: d.paymentStatus,
        certificateIssued: d.certificateIssued,
        createdAt: d.createdAt,
      }));
    }),

    /** Get a specific design with full calculation data (for certificate) */
    get: protectedProcedure
      .input(z.object({ designId: z.number() }))
      .query(async ({ ctx, input }) => {
        const design = await getDesignById(input.designId, ctx.user.id);
        if (!design) throw new Error("Design not found");
        if (design.paymentStatus !== "completed") throw new Error("Payment not completed");
        return {
          ...design,
          certificate: CERTIFICATE,
        };
      }),

    /** Count total paid designs for the current user */
    count: protectedProcedure.query(async ({ ctx }) => {
      const count = await countUserDesigns(ctx.user.id);
      return { count };
    }),
  }),
});

export type AppRouter = typeof appRouter;
