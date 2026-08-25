/**
 * Tests for the Official Design Pack: risk assessment generator and PDF output.
 */
import { describe, it, expect } from "vitest";
import { generateRiskAssessment, riskBand, riskRating } from "../shared/risk-assessment";
import { generateDesignPackPdf } from "./pdf";
import type { Design } from "../drizzle/schema";

const cohesiveInputs = {
  subgradeType: "cohesive" as const,
  cu: 40,
  useReinforcement: true,
  W: 0.7,
  q1k: 140,
  q2k: 190,
};

const passResult = {
  platformRequired: true,
  designThicknessMm: 450,
  status: "pass" as const,
};

function makeDesign(overrides: Partial<Design> = {}): Design {
  return {
    id: 1,
    userId: 1,
    certificateRef: "BRE470-2026-00001",
    stripePaymentIntentId: null,
    stripeSessionId: "cs_test_123",
    amountPence: 29999,
    currency: "gbp",
    paymentStatus: "completed",
    projectName: "Test Project",
    siteLocation: "Test Site",
    clientName: "Test Client",
    calculationInputs: { ...cohesiveInputs, phiPlatform: 40, gammaPlatform: 20, L1: 3.6, L2: 3.1, Tult: 30 },
    calculationResult: {
      ...passResult,
      platformMaterialAdequate: true,
      unreinforcedThickness: 0.62,
      reinforcedThickness: 0.45,
      designThickness: 0.45,
      summary: "A 450 mm reinforced platform is required.",
      steps: [
        {
          id: "factors",
          title: "Bearing Capacity & Shape Factors",
          description: "Derived from BRE470 tables.",
          formula: "Nc = 5.14",
          values: { Nc: 5.14, "N_γp": 109 },
          result: "OK",
          unit: "",
          status: "info",
        },
      ],
    },
    certificateIssued: true,
    certificateIssuedAt: new Date("2026-08-01"),
    customerEmail: "buyer@example.com",
    packEmailStatus: "pending",
    packEmailedAt: null,
    packEmailError: null,
    createdAt: new Date("2026-08-01"),
    ...overrides,
  } as Design;
}

describe("Risk rating helpers", () => {
  it("multiplies likelihood by severity", () => {
    expect(riskRating(4, 5)).toBe(20);
  });

  it("bands ratings into Low/Medium/High", () => {
    expect(riskBand(5)).toBe("Low");
    expect(riskBand(6)).toBe("Low");
    expect(riskBand(8)).toBe("Medium");
    expect(riskBand(12)).toBe("Medium");
    expect(riskBand(15)).toBe("High");
    expect(riskBand(25)).toBe("High");
  });
});

describe("Risk assessment generator", () => {
  it("always includes the core platform hazards", () => {
    const ra = generateRiskAssessment(cohesiveInputs, passResult);
    const ids = ra.items.map(i => i.id);
    expect(ids).toContain("RA-01"); // bearing failure
    expect(ids).toContain("RA-02"); // subgrade deterioration
    expect(ids).toContain("RA-05"); // edge failure
    expect(ids).toContain("RA-06"); // degradation
    expect(ids).toContain("RA-07"); // buried services
  });

  it("includes the reinforcement hazard only when reinforcement is used", () => {
    const withReinf = generateRiskAssessment(cohesiveInputs, passResult);
    expect(withReinf.items.some(i => i.id === "RA-04")).toBe(true);

    const without = generateRiskAssessment({ ...cohesiveInputs, useReinforcement: false }, passResult);
    expect(without.items.some(i => i.id === "RA-04")).toBe(false);
  });

  it("includes the groundwater hazard for granular subgrades with high water table", () => {
    const granular = {
      subgradeType: "granular" as const,
      phiSubgrade: 35,
      waterTableNear: true,
      useReinforcement: false,
      W: 0.7,
      q1k: 140,
      q2k: 190,
    };
    const ra = generateRiskAssessment(granular, passResult);
    expect(ra.items.some(i => i.id === "RA-03")).toBe(true);

    const dry = generateRiskAssessment({ ...granular, waterTableNear: false }, passResult);
    expect(dry.items.some(i => i.id === "RA-03")).toBe(false);
  });

  it("adds a do-not-construct hazard when the design failed", () => {
    const ra = generateRiskAssessment(cohesiveInputs, { ...passResult, status: "fail" });
    const item = ra.items.find(i => i.id === "RA-08");
    expect(item).toBeDefined();
    expect(item!.controls.join(" ")).toContain("DO NOT construct");
  });

  it("embeds the design thickness and track pressures into the controls", () => {
    const ra = generateRiskAssessment(cohesiveInputs, passResult);
    const bearing = ra.items.find(i => i.id === "RA-01")!;
    const allControls = bearing.controls.join(" ");
    expect(allControls).toContain("450 mm");
    expect(allControls).toContain("q1k = 140 kPa");
  });

  it("residual risk never exceeds initial risk", () => {
    const ra = generateRiskAssessment(cohesiveInputs, passResult);
    for (const item of ra.items) {
      expect(riskRating(item.residualLikelihood, item.residualSeverity))
        .toBeLessThanOrEqual(riskRating(item.likelihood, item.severity));
    }
  });
});

describe("Design pack PDF generation", () => {
  it("generates a valid multi-page PDF for a paid design", async () => {
    const pdf = await generateDesignPackPdf(makeDesign());
    expect(pdf.length).toBeGreaterThan(10_000);
    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
    // Cover + certificate + calcs + 2 drawings + RA + notes ≥ 7 pages
    const pageCount = (pdf.toString("latin1").match(/\/Type \/Page[^s]/g) || []).length;
    expect(pageCount).toBeGreaterThanOrEqual(7);
  });

  it("generates a PDF even for a granular design without reinforcement", async () => {
    const design = makeDesign({
      calculationInputs: {
        subgradeType: "granular",
        phiSubgrade: 35,
        gammaSubgrade: 20,
        phiPlatform: 40,
        gammaPlatform: 20,
        W: 0.8,
        L1: 4.0,
        L2: 3.5,
        q1k: 150,
        q2k: 200,
        waterTableNear: true,
        useReinforcement: false,
      } as any,
    });
    const pdf = await generateDesignPackPdf(design);
    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
  });
});
