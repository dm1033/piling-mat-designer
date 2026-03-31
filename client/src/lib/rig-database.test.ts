import { describe, expect, it } from "vitest";
import {
  PILING_RIGS,
  getManufacturers,
  getRigsByManufacturer,
  getRigById,
  getRigsByCategory,
  searchRigs,
  type PilingRig,
} from "./rig-database";

describe("rig-database", () => {
  describe("PILING_RIGS data integrity", () => {
    it("contains rigs from all three manufacturers", () => {
      const manufacturers = getManufacturers();
      expect(manufacturers).toContain("Liebherr");
      expect(manufacturers).toContain("Bauer");
      expect(manufacturers).toContain("Soilmec");
    });

    it("has at least 20 rigs total", () => {
      expect(PILING_RIGS.length).toBeGreaterThanOrEqual(20);
    });

    it("every rig has unique id", () => {
      const ids = PILING_RIGS.map((r) => r.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("every rig has valid numeric values", () => {
      for (const rig of PILING_RIGS) {
        expect(rig.operatingWeight).toBeGreaterThan(0);
        expect(rig.W).toBeGreaterThan(0);
        expect(rig.W).toBeLessThanOrEqual(2);
        expect(rig.L1).toBeGreaterThan(0);
        expect(rig.L2).toBeGreaterThan(0);
        expect(rig.L1).toBeGreaterThanOrEqual(rig.L2); // L1 >= L2 always
        expect(rig.q1k).toBeGreaterThan(0);
        expect(rig.q2k).toBeGreaterThan(0);
        expect(rig.q2k).toBeGreaterThanOrEqual(rig.q1k); // Case 2 >= Case 1
      }
    });

    it("every rig has a valid category", () => {
      const validCategories: PilingRig["category"][] = [
        "Light",
        "Medium",
        "Heavy",
        "Super Heavy",
      ];
      for (const rig of PILING_RIGS) {
        expect(validCategories).toContain(rig.category);
      }
    });

    it("every rig has a non-empty description", () => {
      for (const rig of PILING_RIGS) {
        expect(rig.description.length).toBeGreaterThan(5);
      }
    });
  });

  describe("getManufacturers", () => {
    it("returns exactly 3 manufacturers", () => {
      expect(getManufacturers()).toHaveLength(3);
    });
  });

  describe("getRigsByManufacturer", () => {
    it("returns only Liebherr rigs when filtered", () => {
      const rigs = getRigsByManufacturer("Liebherr");
      expect(rigs.length).toBeGreaterThan(0);
      for (const rig of rigs) {
        expect(rig.manufacturer).toBe("Liebherr");
      }
    });

    it("returns only Bauer rigs when filtered", () => {
      const rigs = getRigsByManufacturer("Bauer");
      expect(rigs.length).toBeGreaterThan(0);
      for (const rig of rigs) {
        expect(rig.manufacturer).toBe("Bauer");
      }
    });

    it("returns only Soilmec rigs when filtered", () => {
      const rigs = getRigsByManufacturer("Soilmec");
      expect(rigs.length).toBeGreaterThan(0);
      for (const rig of rigs) {
        expect(rig.manufacturer).toBe("Soilmec");
      }
    });

    it("returns empty array for unknown manufacturer", () => {
      expect(getRigsByManufacturer("Unknown")).toHaveLength(0);
    });
  });

  describe("getRigById", () => {
    it("finds the Liebherr LB 20-230 by id", () => {
      const rig = getRigById("lb20");
      expect(rig).toBeDefined();
      expect(rig!.model).toBe("LB 20-230");
      expect(rig!.manufacturer).toBe("Liebherr");
      expect(rig!.W).toBe(0.7);
    });

    it("finds the Bauer BG 28 H by id", () => {
      const rig = getRigById("bg28");
      expect(rig).toBeDefined();
      expect(rig!.model).toBe("BG 28 H");
      expect(rig!.manufacturer).toBe("Bauer");
      expect(rig!.q1k).toBe(130);
      expect(rig!.q2k).toBe(180);
    });

    it("finds the Soilmec SR-75 by id", () => {
      const rig = getRigById("sr75");
      expect(rig).toBeDefined();
      expect(rig!.model).toBe("SR-75");
      expect(rig!.manufacturer).toBe("Soilmec");
    });

    it("returns undefined for unknown id", () => {
      expect(getRigById("nonexistent")).toBeUndefined();
    });
  });

  describe("getRigsByCategory", () => {
    it("returns light rigs", () => {
      const rigs = getRigsByCategory("Light");
      expect(rigs.length).toBeGreaterThan(0);
      for (const rig of rigs) {
        expect(rig.category).toBe("Light");
        expect(rig.operatingWeight).toBeLessThanOrEqual(70);
      }
    });

    it("returns super heavy rigs", () => {
      const rigs = getRigsByCategory("Super Heavy");
      expect(rigs.length).toBeGreaterThan(0);
      for (const rig of rigs) {
        expect(rig.category).toBe("Super Heavy");
        expect(rig.operatingWeight).toBeGreaterThanOrEqual(100);
      }
    });
  });

  describe("searchRigs", () => {
    it("finds rigs by model number", () => {
      const results = searchRigs("BG 28");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.model === "BG 28 H")).toBe(true);
    });

    it("finds rigs by manufacturer name", () => {
      const results = searchRigs("soilmec");
      expect(results.length).toBeGreaterThan(0);
      for (const rig of results) {
        expect(rig.manufacturer).toBe("Soilmec");
      }
    });

    it("finds rigs by description keyword", () => {
      const results = searchRigs("compact");
      expect(results.length).toBeGreaterThan(0);
      for (const rig of results) {
        expect(rig.description.toLowerCase()).toContain("compact");
      }
    });

    it("returns empty for no match", () => {
      expect(searchRigs("nonexistent_rig_xyz")).toHaveLength(0);
    });

    it("is case insensitive", () => {
      const upper = searchRigs("LIEBHERR");
      const lower = searchRigs("liebherr");
      expect(upper.length).toBe(lower.length);
      expect(upper.length).toBeGreaterThan(0);
    });
  });

  describe("specific rig data validation", () => {
    it("Liebherr LB 36-410 has correct specs", () => {
      const rig = getRigById("lb36");
      expect(rig).toBeDefined();
      expect(rig!.operatingWeight).toBe(115);
      expect(rig!.W).toBe(0.9);
      expect(rig!.L1).toBe(5.2);
      expect(rig!.L2).toBe(4.4);
      expect(rig!.q1k).toBe(125);
      expect(rig!.q2k).toBe(175);
      expect(rig!.category).toBe("Heavy");
    });

    it("Bauer BG 46 is the largest Bauer rig", () => {
      const rig = getRigById("bg46");
      expect(rig).toBeDefined();
      expect(rig!.category).toBe("Super Heavy");
      expect(rig!.operatingWeight).toBe(155);
      expect(rig!.W).toBe(1.0);
    });

    it("Soilmec SR-30 is the lightest Soilmec rig", () => {
      const rig = getRigById("sr30");
      expect(rig).toBeDefined();
      expect(rig!.category).toBe("Light");
      expect(rig!.operatingWeight).toBe(35);
    });
  });
});
