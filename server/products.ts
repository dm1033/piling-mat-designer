/**
 * BRE470 Piling Mat Designer — Product Configuration
 * Per-design payment model: £299.99 per design certificate
 */

export const CPD_PRODUCT = {
  id: "bre470_cpd",
  name: "BRE470 CPD Presentation — 1 Hour Structured CPD",
  description: "1-hour CPD presentation on BRE470 working platform design. Covers methodology, compliance under CDM 2015 & BS 5975:2024, common failure modes, and live design tool demonstration. Certificate of attendance included.",
  priceGBP: 1999, // £19.99 in pence
  currency: "gbp" as const,
};

export const PRODUCT = {
  id: "bre470_design",
  name: "BRE470 Official Design Pack",
  description:
    "Official BRE470 working platform design pack, emailed to you as a PDF: design drawings (cross-section & plan), full interpretive calculations, working platform risk assessment, and check certificate signed by David Miller, Temporary Works Designer. Designing on the site is free — you pay only for the official deliverables.",
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
