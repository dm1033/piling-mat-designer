import {
  calculateDesign,
  type DesignInputs,
  type DesignResult,
} from "../../client/src/lib/bre470-calc";
export type Form = {
  name: string;
  subgradeType: "cohesive" | "granular";
  cu: string;
  phiSubgrade: string;
  gammaSubgrade: string;
  phiPlatform: string;
  gammaPlatform: string;
  W: string;
  L1: string;
  L2: string;
  q1k: string;
  q2k: string;
  Tult: string;
  useReinforcement: boolean;
  waterTableNear: boolean;
};
export const defaults: Form = {
  name: "",
  subgradeType: "cohesive",
  cu: "40",
  phiSubgrade: "30",
  gammaSubgrade: "20",
  phiPlatform: "40",
  gammaPlatform: "20",
  W: "0.7",
  L1: "3.6",
  L2: "3.1",
  q1k: "140",
  q2k: "190",
  Tult: "30",
  useReinforcement: false,
  waterTableNear: false,
};
export type Calculation = {
  inputs: DesignInputs;
  result: DesignResult;
  calculatedAt: string;
};
export function runCalculation(form: Form): Calculation {
  const number = (
    key: keyof Form,
    label: string,
    min: number,
    max = Infinity
  ): number => {
    const raw = form[key];
    const n = typeof raw === "string" && raw.trim() !== "" ? Number(raw) : NaN;
    if (!Number.isFinite(n) || n < min || n > max)
      throw new Error(
        `${label}: enter a finite value ${max === Infinity ? `of at least ${min}` : `between ${min} and ${max}`}.`
      );
    return n;
  };
  const common = {
    phiPlatform: number("phiPlatform", "Platform friction angle (°)", 35, 45),
    gammaPlatform: number(
      "gammaPlatform",
      "Platform unit weight (kN/m³)",
      1,
      30
    ),
    W: number("W", "Track width (m)", 0.01),
    L1: number("L1", "Case 1 effective length (m)", 0.01),
    L2: number("L2", "Case 2 effective length (m)", 0.01),
    q1k: number("q1k", "Case 1 pressure (kPa)", 0.01),
    q2k: number("q2k", "Case 2 pressure (kPa)", 0.01),
    useReinforcement: form.useReinforcement,
    Tult: form.useReinforcement
      ? number("Tult", "Reinforcement ultimate strength (kN/m)", 0.01)
      : undefined,
  };
  if (common.W > common.L1 || common.W > common.L2)
    throw new Error(
      "Track width must not exceed either effective loaded length. Check the plant load case data."
    );
  const inputs: DesignInputs =
    form.subgradeType === "cohesive"
      ? {
          ...common,
          subgradeType: "cohesive",
          cu: number("cu", "Undrained shear strength (kPa)", 20, 80),
        }
      : {
          ...common,
          subgradeType: "granular",
          phiSubgrade: number(
            "phiSubgrade",
            "Subgrade friction angle (°)",
            25,
            45
          ),
          gammaSubgrade: number(
            "gammaSubgrade",
            "Subgrade unit weight (kN/m³)",
            1,
            30
          ),
          waterTableNear: form.waterTableNear,
        };
  const result = calculateDesign(inputs);
  if (
    !Number.isFinite(result.designThicknessMm) ||
    result.designThicknessMm < 0
  )
    throw new Error(
      "Calculation returned an invalid thickness. Seek specialist review."
    );
  // The legacy granular engine can report pass even after an inadequate-material check.
  // Preserve its numerical outputs but never present that case as a satisfactory result.
  if (
    !result.platformMaterialAdequate ||
    result.steps.some(step => step.status === "fail")
  ) {
    result.status = "fail";
    result.summary =
      "No usable design: a material or calculation check failed. Review the calculation trace and obtain specialist assessment.";
  }
  if (result.designThicknessMm >= 3000) {
    result.status = "fail";
    result.summary =
      "Outside the mobile tool scope: thickness reaches or exceeds 3 m. Specialist assessment required.";
  }
  return { inputs, result, calculatedAt: new Date().toISOString() };
}
export const STORAGE_KEY = "twcd.pilingmat.projects.v1";
export type Project = { id: string; savedAt: string; form: Form };
export function decodeProjects(raw: string | null): Project[] {
  if (raw === null) return [];
  const parsed = JSON.parse(raw);
  if (parsed?.version !== 1 || !Array.isArray(parsed.projects))
    throw new Error("Unsupported saved-project format.");
  return parsed.projects.map((p: Project) => {
    if (
      typeof p.id !== "string" ||
      typeof p.savedAt !== "string" ||
      !p.form ||
      typeof p.form.name !== "string" ||
      !["cohesive", "granular"].includes(p.form.subgradeType)
    )
      throw new Error("Saved project data is damaged.");
    for (const [key, value] of Object.entries(defaults))
      if (typeof p.form[key as keyof Form] !== typeof value)
        throw new Error("Saved project data is incomplete.");
    return p;
  });
}
