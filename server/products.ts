/**
 * BRE470 Piling Mat Designer — Product Configuration
 * Per-design payment model: £299.99 per design certificate
 */

export const PRODUCT = {
  id: "bre470_design",
  name: "BRE470 Working Platform Design & Certificate",
  description: "Full BRE470 compliant working platform design with interpretive calculations and check certificate signed by David Miller, Temporary Works Designer.",
  priceGBP: 29999, // £299.99 in pence
  currency: "gbp" as const,
};

/**
 * Certificate metadata
 */
export const CERTIFICATE = {
  designer: "David Miller",
  title: "Temporary Works Designer",
  company: "Temporary Works Consulting Ltd",
  email: "temporaryworksconsultingltd@outlook.com",
  phone: "07900 984900",
  standard: "BR 470 (BRE 2004)",
  standardTitle: "Working Platforms for Tracked Plant — Good Practice Guide to the Design, Installation, Maintenance and Repair of Ground-supported Working Platforms",
};

/** Helper: format price for display */
export function formatPrice(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}
