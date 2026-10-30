import { describe, it, expect } from "vitest";
import { defaults, runCalculation, decodeProjects } from "./model";
import { calculateDesign } from "../../client/src/lib/bre470-calc";

describe("Android calculation boundary", () => {
  it("reproduces the existing default cohesive calculation, including trace", () => {
    const mobile = runCalculation(defaults);
    expect(mobile.result).toEqual(calculateDesign(mobile.inputs));
    expect(mobile.result.designThicknessMm).toBe(300);
  });
  it.each(["", "NaN", "Infinity", "-1", "0"])(
    "rejects invalid track width %s",
    W => {
      expect(() => runCalculation({ ...defaults, W })).toThrow();
    }
  );
  it.each(["19.9", "80.1"])("rejects unsupported cohesive strength %s", cu => {
    expect(() => runCalculation({ ...defaults, cu })).toThrow();
  });
  it("rejects angle clamping and reversed loaded dimensions", () => {
    expect(() => runCalculation({ ...defaults, phiPlatform: "50" })).toThrow();
    expect(() => runCalculation({ ...defaults, L2: "0.1" })).toThrow();
  });
  it("requires positive reinforcement strength when enabled", () => {
    expect(() =>
      runCalculation({ ...defaults, useReinforcement: true, Tult: "" })
    ).toThrow();
  });
  it("does not turn inadequate granular material into a passing thickness", () => {
    const mobile = runCalculation({
      ...defaults,
      subgradeType: "granular",
      phiSubgrade: "25",
      phiPlatform: "35",
      q1k: "1000",
      q2k: "1000",
    });
    const legacy = calculateDesign(mobile.inputs);
    expect(legacy.platformMaterialAdequate).toBe(false);
    expect(legacy.status).toBe("pass");
    expect(mobile.result.status).toBe("fail");
  });
  it.each([
    { subgradeType: "cohesive" as const, useReinforcement: true },
    { subgradeType: "granular" as const, useReinforcement: false },
    { subgradeType: "granular" as const, useReinforcement: true },
  ])(
    "preserves numerical outputs for $subgradeType reinforced=$useReinforcement",
    variant => {
      const mobile = runCalculation({ ...defaults, ...variant });
      expect(mobile.result.designThicknessMm).toBe(
        calculateDesign(mobile.inputs).designThicknessMm
      );
    }
  );
  it("records groundwater without silently double-reducing unit weight", () => {
    const dry = runCalculation({
      ...defaults,
      subgradeType: "granular",
      gammaSubgrade: "10",
    });
    const wet = runCalculation({
      ...defaults,
      subgradeType: "granular",
      gammaSubgrade: "10",
      waterTableNear: true,
    });
    expect(wet.result.designThicknessMm).toBe(dry.result.designThicknessMm);
  });
  it("accepts zero required thickness only as an explicit no-platform bearing result", () => {
    const outcome = runCalculation({
      ...defaults,
      cu: "80",
      q1k: "10",
      q2k: "10",
    });
    expect(outcome.result.designThicknessMm).toBe(0);
    expect(outcome.result.platformRequired).toBe(false);
  });
});
describe("Device project storage", () => {
  it("round-trips named inputs, and stores no certificate or trusted result", () => {
    const projects = [
      {
        id: "test-1",
        savedAt: "2026-10-30T12:00:00Z",
        form: { ...defaults, name: "Site A" },
      },
    ];
    expect(decodeProjects(JSON.stringify({ version: 1, projects }))).toEqual(
      projects
    );
  });
  it("returns an empty list on a fresh installation", () =>
    expect(decodeProjects(null)).toEqual([]));
  it.each([
    "broken",
    '{"version":2,"projects":[]}',
    '{"version":1,"projects":[{}]}',
  ])("rejects corrupt or unsupported storage", raw => {
    expect(() => decodeProjects(raw)).toThrow();
  });
});
