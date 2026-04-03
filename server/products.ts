/**
 * Subscription tier definitions for BRE470 Piling Mat Designer
 * Three tiers: Individual, Team, Enterprise
 * Each tier has monthly and annual pricing
 */

export type BillingInterval = "month" | "year";

export interface PlanTier {
  id: string;
  name: string;
  description: string;
  monthlyPricePence: number;   // e.g. 999 = £9.99
  annualPricePence: number;    // e.g. 9900 = £99.00
  currency: "gbp";
  maxUsers: number;            // 1, 10, or Infinity
  features: string[];
}

export const PLANS: Record<string, PlanTier> = {
  individual: {
    id: "individual",
    name: "Individual",
    description: "For site engineers and small contractors",
    monthlyPricePence: 999,
    annualPricePence: 9900,
    currency: "gbp",
    maxUsers: 1,
    features: [
      "Full BRE470 calculations",
      "Cohesive & granular subgrades",
      "23-rig database with auto-fill",
      "Export / print reports",
      "Cross-section diagrams",
      "PWA mobile access",
      "All future updates",
    ],
  },
  team: {
    id: "team",
    name: "Team",
    description: "For piling subcontractors and project teams",
    monthlyPricePence: 2999,
    annualPricePence: 29900,
    currency: "gbp",
    maxUsers: 10,
    features: [
      "Everything in Individual",
      "Up to 10 users via access codes",
      "Team sharing dashboard",
      "Priority email support",
      "Geosynthetic reinforcement design",
    ],
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    description: "For principal contractors and large organisations",
    monthlyPricePence: 4999,
    annualPricePence: 49900,
    currency: "gbp",
    maxUsers: 999,
    features: [
      "Everything in Team",
      "Unlimited users",
      "Custom rig database entries",
      "Priority support",
      "1-hour consultation with David Miller",
      "Dedicated account manager",
    ],
  },
};

export const PLAN_IDS = Object.keys(PLANS) as Array<keyof typeof PLANS>;

/** Helper: get price in pence for a plan + interval */
export function getPricePence(planId: string, interval: BillingInterval): number {
  const plan = PLANS[planId];
  if (!plan) throw new Error(`Unknown plan: ${planId}`);
  return interval === "year" ? plan.annualPricePence : plan.monthlyPricePence;
}

/** Helper: format price for display */
export function formatPrice(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}
