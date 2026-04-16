import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { createDesign, generateCertificateRef, getUserDesigns, getDesignById, countUserDesigns, getAllUsers, getAllDesigns, getDesignByIdAdmin, getAdminStats, createCpdRequest, getAllCpdRequests, updateCpdRequestStatus } from "./db";
import { notifyOwner } from "./_core/notification";
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

  // CPD presentation requests
  cpd: router({
    /** Submit a CPD request (public — no auth required) */
    submit: publicProcedure
      .input(z.object({
        contactName: z.string().min(1, "Name is required"),
        companyName: z.string().min(1, "Company name is required"),
        email: z.string().email("Valid email is required"),
        phone: z.string().optional(),
        jobTitle: z.string().optional(),
        preferredDate: z.string().optional(),
        attendees: z.string().optional(),
        format: z.enum(["online", "in-person", "either"]).default("either"),
        additionalNotes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await createCpdRequest({
          contactName: input.contactName,
          companyName: input.companyName,
          email: input.email,
          phone: input.phone || null,
          jobTitle: input.jobTitle || null,
          preferredDate: input.preferredDate || null,
          attendees: input.attendees || null,
          format: input.format,
          additionalNotes: input.additionalNotes || null,
        });

        // Notify admin of new CPD request
        await notifyOwner({
          title: `New CPD Request from ${input.companyName}`,
          content: `${input.contactName} (${input.email}) from ${input.companyName} has requested a BRE470 CPD presentation.\n\nFormat: ${input.format}\nPreferred date: ${input.preferredDate || 'Flexible'}\nAttendees: ${input.attendees || 'Not specified'}\n\nNotes: ${input.additionalNotes || 'None'}`,
        });

        return { success: true, id };
      }),
  }),

  // Admin panel procedures (role === 'admin' only)
  admin: router({
    /** Dashboard stats: user count, design count, revenue */
    stats: adminProcedure.query(async () => {
      const stats = await getAdminStats();
      return {
        ...stats,
        totalRevenueFormatted: formatPrice(stats.totalRevenuePence),
      };
    }),

    /** List all registered users with design counts */
    users: adminProcedure.query(async () => {
      return getAllUsers();
    }),

    /** List all designs/certificates with user info */
    designs: adminProcedure.query(async () => {
      return getAllDesigns();
    }),

    /** List all CPD requests */
    cpdRequests: adminProcedure.query(async () => {
      return getAllCpdRequests();
    }),

    /** Update CPD request status */
    updateCpdStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "contacted", "confirmed", "completed", "cancelled"]),
      }))
      .mutation(async ({ input }) => {
        await updateCpdRequestStatus(input.id, input.status);
        return { success: true };
      }),

    /** Get a specific design with full data (admin — no user restriction) */
    designDetail: adminProcedure
      .input(z.object({ designId: z.number() }))
      .query(async ({ input }) => {
        const design = await getDesignByIdAdmin(input.designId);
        if (!design) throw new Error("Design not found");
        return {
          ...design,
          certificate: CERTIFICATE,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
