/**
 * BRE470 Working Platform Design Calculator
 * Based on BR 470 (BRE 2004): Working Platforms for Tracked Plant
 * 
 * Implements Appendix A design calculations for:
 * - A2: Cohesive subgrade
 * - A3: Granular subgrade
 * With optional geosynthetic reinforcement
 */

// ─── Lookup Tables ───────────────────────────────────────────────────────

/** Table A1: N_gamma values for given phi'_d */
export const N_GAMMA_TABLE: Record<number, number> = {
  25: 10.9,
  30: 22.4,
  35: 48.0,
  40: 109.0,
  45: 272.0,
  50: 763.0,
};

/** Table A2: Kp*tan(delta) values for platform material phi'_d */
export const KP_TAN_DELTA_TABLE: Record<number, number> = {
  35: 3.1,
  40: 5.5,
  45: 10.0,
};

/** Table B1: Characteristic cu from qualitative description */
export const CU_QUALITATIVE: Record<string, { range: string; cuk: number }> = {
  'very_soft': { range: '< 20 kPa', cuk: 10 },
  'soft': { range: '20 – 40 kPa', cuk: 20 },
  'firm': { range: '40 – 75 kPa', cuk: 40 },
  'stiff': { range: '75 – 150 kPa', cuk: 80 },
};

/** Table B3: Typical phi' values for platform material */
export const PHI_TYPICAL: Record<string, { poor: number | null; heavy: number | null }> = {
  'weak': { poor: null, heavy: null },
  'medium': { poor: 35, heavy: 40 },
  'strong': { poor: 35, heavy: 45 },
};

// ─── Interpolation Helpers ──────────────────────────────────────────────

/** Interpolate N_gamma for any phi value between table entries */
export function interpolateNGamma(phi: number): number {
  const keys = Object.keys(N_GAMMA_TABLE).map(Number).sort((a, b) => a - b);
  if (phi <= keys[0]) return N_GAMMA_TABLE[keys[0]];
  if (phi >= keys[keys.length - 1]) return N_GAMMA_TABLE[keys[keys.length - 1]];

  for (let i = 0; i < keys.length - 1; i++) {
    if (phi >= keys[i] && phi <= keys[i + 1]) {
      const ratio = (phi - keys[i]) / (keys[i + 1] - keys[i]);
      return N_GAMMA_TABLE[keys[i]] + ratio * (N_GAMMA_TABLE[keys[i + 1]] - N_GAMMA_TABLE[keys[i]]);
    }
  }
  return N_GAMMA_TABLE[keys[0]];
}

/** Interpolate Kp*tan(delta) for any phi value between table entries */
export function interpolateKpTanDelta(phi: number): number {
  const keys = Object.keys(KP_TAN_DELTA_TABLE).map(Number).sort((a, b) => a - b);
  if (phi <= keys[0]) return KP_TAN_DELTA_TABLE[keys[0]];
  if (phi >= keys[keys.length - 1]) return KP_TAN_DELTA_TABLE[keys[keys.length - 1]];

  for (let i = 0; i < keys.length - 1; i++) {
    if (phi >= keys[i] && phi <= keys[i + 1]) {
      const ratio = (phi - keys[i]) / (keys[i + 1] - keys[i]);
      return KP_TAN_DELTA_TABLE[keys[i]] + ratio * (KP_TAN_DELTA_TABLE[keys[i + 1]] - KP_TAN_DELTA_TABLE[keys[i]]);
    }
  }
  return KP_TAN_DELTA_TABLE[keys[0]];
}

// ─── Types ──────────────────────────────────────────────────────────────

export type SubgradeType = 'cohesive' | 'granular';

export interface CohesiveInputs {
  subgradeType: 'cohesive';
  cu: number;          // Undrained shear strength (kPa)
  phiPlatform: number; // Angle of shearing resistance of platform material (degrees)
  gammaPlatform: number; // Bulk unit weight of platform material (kN/m³)
  W: number;           // Track width (m)
  L1: number;          // Effective track length under case 1 loading (m)
  L2: number;          // Effective track length under case 2 loading (m)
  q1k: number;         // Characteristic case 1 loading (kPa)
  q2k: number;         // Characteristic case 2 loading (kPa)
  useReinforcement: boolean;
  Tult?: number;       // Ultimate tensile strength of geosynthetic (kN/m)
}

export interface GranularInputs {
  subgradeType: 'granular';
  phiSubgrade: number;   // Angle of shearing resistance of subgrade (degrees)
  gammaSubgrade: number; // Effective unit weight of subgrade (kN/m³)
  phiPlatform: number;   // Angle of shearing resistance of platform material (degrees)
  gammaPlatform: number; // Bulk unit weight of platform material (kN/m³)
  W: number;
  L1: number;
  L2: number;
  q1k: number;
  q2k: number;
  waterTableNear: boolean; // Is water table within 2W of surface?
  useReinforcement: boolean;
  Tult?: number;
}

export type DesignInputs = CohesiveInputs | GranularInputs;

export interface CalculationStep {
  id: string;
  title: string;
  description: string;
  formula?: string;
  values: Record<string, number | string>;
  result: number | string;
  unit: string;
  status: 'pass' | 'fail' | 'warning' | 'info';
}

export interface DesignResult {
  platformRequired: boolean;
  platformMaterialAdequate: boolean;
  unreinforcedThickness: number;   // in metres
  reinforcedThickness?: number;     // in metres (if reinforcement used)
  designThickness: number;          // final recommended thickness (m)
  designThicknessMm: number;        // rounded to nearest 25mm
  steps: CalculationStep[];
  summary: string;
  status: 'pass' | 'fail' | 'warning';
}

// ─── Main Calculation Functions ─────────────────────────────────────────

export function calculateDesign(inputs: DesignInputs): DesignResult {
  if (inputs.subgradeType === 'cohesive') {
    return calculateCohesive(inputs);
  } else {
    return calculateGranular(inputs);
  }
}

function calculateCohesive(inp: CohesiveInputs): DesignResult {
  const steps: CalculationStep[] = [];
  const { cu, phiPlatform, gammaPlatform, W, L1, L2, q1k, q2k, useReinforcement, Tult } = inp;

  // Validate cu range
  if (cu < 20 || cu > 80) {
    steps.push({
      id: 'cu_range',
      title: 'Subgrade Strength Check',
      description: `cu = ${cu} kPa is outside the valid range (20-80 kPa) for this design method.`,
      values: { cu },
      result: 'OUTSIDE RANGE',
      unit: '',
      status: 'fail',
    });
    return {
      platformRequired: true,
      platformMaterialAdequate: false,
      unreinforcedThickness: 0,
      designThickness: 0,
      designThicknessMm: 0,
      steps,
      summary: `cu = ${cu} kPa is outside the valid range (20-80 kPa). This design method cannot be used. Specialist design is required.`,
      status: 'fail',
    };
  }

  // Design values (partial factors = 1.0 for cohesive)
  const cud = cu;
  const Wd = W;
  const L1d = L1;
  const L2d = L2;

  // Bearing capacity and shape factors
  const Nc = 5.14;
  const NGammaP = interpolateNGamma(phiPlatform);
  const KpTanDelta = interpolateKpTanDelta(phiPlatform);

  const sc1 = 1 + 0.2 * (Wd / L1d);
  const sc2 = 1 + 0.2 * (Wd / L2d);
  const sGamma1 = 1 - 0.3 * (Wd / L1d);
  const sGamma2 = 1 - 0.3 * (Wd / L2d);
  const sp1 = 1 + Wd / L1d;
  const sp2 = 1 + Wd / L2d;

  steps.push({
    id: 'factors',
    title: 'Bearing Capacity & Shape Factors',
    description: 'Derived from BRE470 Table A1, A2 and shape factor equations.',
    formula: 'Nc = 5.14, sc = 1 + 0.2(W/L), sp = 1 + W/L',
    values: {
      Nc, 'N_γp': round(NGammaP, 1), 'Kp·tanδ': round(KpTanDelta, 2),
      sc1: round(sc1, 3), sc2: round(sc2, 3),
      'sγ1': round(sGamma1, 3), 'sγ2': round(sGamma2, 3),
      sp1: round(sp1, 3), sp2: round(sp2, 3),
    },
    result: 'Calculated',
    unit: '',
    status: 'info',
  });

  // (d) Check subgrade alone
  const RdSubgrade1 = cud * Nc * sc1;
  const RdSubgrade2 = cud * Nc * sc2;
  const q1d_check = 2.0 * q1k;
  const q2d_check = 1.5 * q2k;

  const platformRequired = q1d_check > RdSubgrade1 || q2d_check > RdSubgrade2;

  steps.push({
    id: 'subgrade_check',
    title: 'Check Subgrade Bearing Resistance',
    description: 'Can the subgrade alone support the plant without a working platform?',
    formula: 'Rd = cu × Nc × sc',
    values: {
      'Rd (case 1)': `${round(RdSubgrade1, 1)} kPa`,
      'Rd (case 2)': `${round(RdSubgrade2, 1)} kPa`,
      'q1d = 2.0 × q1k': `${round(q1d_check, 1)} kPa`,
      'q2d = 1.5 × q2k': `${round(q2d_check, 1)} kPa`,
    },
    result: platformRequired ? 'Platform REQUIRED' : 'No platform needed',
    unit: '',
    status: platformRequired ? 'warning' : 'pass',
  });

  if (!platformRequired) {
    return {
      platformRequired: false,
      platformMaterialAdequate: true,
      unreinforcedThickness: 0,
      designThickness: 0,
      designThicknessMm: 0,
      steps,
      summary: 'The subgrade can support the plant without a working platform. A running surface may still be required for other reasons.',
      status: 'pass',
    };
  }

  // (e) Check platform material alone
  const RdPlatform1 = 0.5 * gammaPlatform * Wd * NGammaP * sGamma1;
  const RdPlatform2 = 0.5 * gammaPlatform * Wd * NGammaP * sGamma2;
  const q1d_plat = 1.6 * q1k;
  const q2d_plat = 1.2 * q2k;

  const platformMaterialAdequate = q1d_plat < RdPlatform1 && q2d_plat < RdPlatform2;
  const platformStrongerThanSubgrade = RdPlatform1 > RdSubgrade1;

  steps.push({
    id: 'platform_check',
    title: 'Check Platform Material Strength',
    description: 'Can the platform material provide sufficient bearing resistance?',
    formula: 'Rd = 0.5 × γp × W × Nγp × sγ',
    values: {
      'Rd_platform (case 1)': `${round(RdPlatform1, 1)} kPa`,
      'Rd_platform (case 2)': `${round(RdPlatform2, 1)} kPa`,
      'q1d = 1.6 × q1k': `${round(q1d_plat, 1)} kPa`,
      'q2d = 1.2 × q2k': `${round(q2d_plat, 1)} kPa`,
      'Platform > Subgrade': platformStrongerThanSubgrade ? 'Yes' : 'No',
    },
    result: platformMaterialAdequate ? 'Material ADEQUATE' : 'Check required',
    unit: '',
    status: platformMaterialAdequate ? 'pass' : (platformStrongerThanSubgrade ? 'warning' : 'fail'),
  });

  if (!platformStrongerThanSubgrade) {
    return {
      platformRequired: true,
      platformMaterialAdequate: false,
      unreinforcedThickness: 0,
      designThickness: 0,
      designThicknessMm: 0,
      steps,
      summary: 'The platform material is NOT stronger than the subgrade. A higher quality platform material with greater φ\' is required.',
      status: 'fail',
    };
  }

  if (!platformMaterialAdequate) {
    steps.push({
      id: 'platform_inadequate',
      title: 'Platform Material Warning',
      description: 'The platform material alone cannot provide sufficient bearing resistance at any thickness. Consider using a stronger material or geosynthetic reinforcement.',
      values: {},
      result: 'Higher strength material recommended',
      unit: '',
      status: 'warning',
    });
  }

  // (f) Calculate unreinforced thickness
  const numerator1 = Wd * (q1d_plat - cud * Nc * sc1);
  const denominator1 = gammaPlatform * KpTanDelta * sp1;
  const numerator2 = Wd * (q2d_plat - cud * Nc * sc2);
  const denominator2 = gammaPlatform * KpTanDelta * sp2;

  let D1_unreinf = numerator1 > 0 ? Math.sqrt(numerator1 / denominator1) : 0;
  let D2_unreinf = numerator2 > 0 ? Math.sqrt(numerator2 / denominator2) : 0;

  const minThickness = Math.min(0.5 * W, 0.3);
  let unreinforcedThickness = Math.max(D1_unreinf, D2_unreinf, minThickness);

  steps.push({
    id: 'unreinforced_thickness',
    title: 'Required Unreinforced Platform Thickness',
    description: 'Thickness based on punching shear through the platform material.',
    formula: 'D = √{W × (qd - cu·Nc·sc) / (γp·Kp·tanδ·sp)}',
    values: {
      'D1 (case 1)': `${round(D1_unreinf, 3)} m`,
      'D2 (case 2)': `${round(D2_unreinf, 3)} m`,
      'Minimum thickness': `${round(minThickness, 3)} m`,
    },
    result: round(unreinforcedThickness, 3),
    unit: 'm',
    status: 'info',
  });

  // (g) Calculate reinforced thickness if requested
  let reinforcedThickness: number | undefined;
  let designThickness = unreinforcedThickness;

  if (useReinforcement && Tult && Tult > 0) {
    const Td = Tult / 2;
    const reinforcementContribution = 2 * Td / Wd;

    const num1_reinf = Wd * (q1d_plat - cud * Nc * sc1 - reinforcementContribution);
    const num2_reinf = Wd * (q2d_plat - cud * Nc * sc2 - reinforcementContribution);

    let D1_reinf = num1_reinf > 0 ? Math.sqrt(num1_reinf / denominator1) : 0;
    let D2_reinf = num2_reinf > 0 ? Math.sqrt(num2_reinf / denominator2) : 0;

    // Minimum cover to reinforcement = 300mm
    let D_reinf = Math.max(D1_reinf, D2_reinf);
    if (D_reinf > 0 && D_reinf < 0.3) D_reinf = 0.3;

    // Additional check: ignoring reinforcement, platform must still provide adequate resistance
    const q1d_reinf_check = 1.25 * q1k;
    const q2d_reinf_check = 1.05 * q2k;

    const Rd_unreinf_at_D = (D_reinf: number) => {
      return cud * Nc * sc1 + (D_reinf * D_reinf / Wd) * gammaPlatform * KpTanDelta * sp1;
    };
    const Rd_unreinf_at_D2 = (D_reinf: number) => {
      return cud * Nc * sc2 + (D_reinf * D_reinf / Wd) * gammaPlatform * KpTanDelta * sp2;
    };

    let D_final = D_reinf;
    // Increase thickness until the unreinforced check passes
    while (D_final < 3.0) {
      const Rd1 = Rd_unreinf_at_D(D_final);
      const Rd2 = Rd_unreinf_at_D2(D_final);
      if (q1d_reinf_check <= Rd1 && q2d_reinf_check <= Rd2) break;
      D_final += 0.01;
    }

    reinforcedThickness = Math.max(D_final, minThickness);

    steps.push({
      id: 'reinforced_thickness',
      title: 'Required Reinforced Platform Thickness',
      description: 'Thickness with geosynthetic reinforcement (Td = Tult/2).',
      formula: 'D = √{W × (qd - cu·Nc·sc - 2Td/W) / (γp·Kp·tanδ·sp)}',
      values: {
        'Tult': `${Tult} kN/m`,
        'Td = Tult/2': `${round(Td, 1)} kN/m`,
        'D1 (case 1)': `${round(D1_reinf, 3)} m`,
        'D2 (case 2)': `${round(D2_reinf, 3)} m`,
        'After unreinf. check': `${round(D_final, 3)} m`,
      },
      result: round(reinforcedThickness, 3),
      unit: 'm',
      status: 'info',
    });

    designThickness = reinforcedThickness;
  }

  // Round up to nearest 25mm
  const designThicknessMm = Math.ceil((designThickness * 1000) / 25) * 25;

  steps.push({
    id: 'final_result',
    title: 'Design Platform Thickness',
    description: `Rounded up to nearest 25mm as recommended by BRE470.`,
    values: {
      'Calculated': `${round(designThickness, 3)} m`,
      'Rounded': `${designThicknessMm} mm`,
    },
    result: designThicknessMm,
    unit: 'mm',
    status: designThicknessMm > 0 ? 'pass' : 'fail',
  });

  const thicknessLabel = useReinforcement ? 'reinforced' : 'unreinforced';
  const summary = `Required ${thicknessLabel} platform thickness: ${designThicknessMm} mm (${round(designThicknessMm / 1000, 3)} m) on cohesive subgrade with cu = ${cu} kPa.`;

  return {
    platformRequired,
    platformMaterialAdequate,
    unreinforcedThickness,
    reinforcedThickness,
    designThickness: designThicknessMm / 1000,
    designThicknessMm,
    steps,
    summary,
    status: designThicknessMm > 0 ? 'pass' : 'fail',
  };
}

function calculateGranular(inp: GranularInputs): DesignResult {
  const steps: CalculationStep[] = [];
  const { phiSubgrade, gammaSubgrade, phiPlatform, gammaPlatform, W, L1, L2, q1k, q2k, useReinforcement, Tult } = inp;

  const Wd = W;
  const L1d = L1;
  const L2d = L2;
  const gammaS = gammaSubgrade; // effective unit weight (already adjusted for water table by user)

  // Bearing capacity factors
  const NGammaS = interpolateNGamma(phiSubgrade);
  const NGammaP = interpolateNGamma(phiPlatform);
  const KpTanDelta = interpolateKpTanDelta(phiPlatform);

  const sGamma1 = 1 - 0.3 * (Wd / L1d);
  const sGamma2 = 1 - 0.3 * (Wd / L2d);
  const sp1 = 1 + Wd / L1d;
  const sp2 = 1 + Wd / L2d;

  steps.push({
    id: 'factors',
    title: 'Bearing Capacity & Shape Factors',
    description: 'Derived from BRE470 Table A1, A2 and shape factor equations.',
    formula: 'sγ = 1 - 0.3(W/L), sp = 1 + W/L',
    values: {
      'Nγs': round(NGammaS, 1), 'Nγp': round(NGammaP, 1),
      'Kp·tanδ': round(KpTanDelta, 2),
      'sγ1': round(sGamma1, 3), 'sγ2': round(sGamma2, 3),
      sp1: round(sp1, 3), sp2: round(sp2, 3),
    },
    result: 'Calculated',
    unit: '',
    status: 'info',
  });

  // (d) Check subgrade alone
  const RdSubgrade1 = 0.5 * gammaS * Wd * NGammaS * sGamma1;
  const RdSubgrade2 = 0.5 * gammaS * Wd * NGammaS * sGamma2;
  const q1d_check = 2.0 * q1k;
  const q2d_check = 1.5 * q2k;

  const platformRequired = q1d_check > RdSubgrade1 || q2d_check > RdSubgrade2;

  steps.push({
    id: 'subgrade_check',
    title: 'Check Subgrade Bearing Resistance',
    description: 'Can the granular subgrade alone support the plant?',
    formula: 'Rd = 0.5 × γ\'s × W × Nγs × sγ',
    values: {
      'Rd (case 1)': `${round(RdSubgrade1, 1)} kPa`,
      'Rd (case 2)': `${round(RdSubgrade2, 1)} kPa`,
      'q1d = 2.0 × q1k': `${round(q1d_check, 1)} kPa`,
      'q2d = 1.5 × q2k': `${round(q2d_check, 1)} kPa`,
    },
    result: platformRequired ? 'Platform REQUIRED' : 'No platform needed',
    unit: '',
    status: platformRequired ? 'warning' : 'pass',
  });

  if (!platformRequired) {
    return {
      platformRequired: false,
      platformMaterialAdequate: true,
      unreinforcedThickness: 0,
      designThickness: 0,
      designThicknessMm: 0,
      steps,
      summary: 'The granular subgrade can support the plant without a working platform.',
      status: 'pass',
    };
  }

  // (e) Check platform material alone
  const RdPlatform1 = 0.5 * gammaPlatform * Wd * NGammaP * sGamma1;
  const RdPlatform2 = 0.5 * gammaPlatform * Wd * NGammaP * sGamma2;
  const q1d_plat = 1.6 * q1k;
  const q2d_plat = 1.2 * q2k;

  const platformMaterialAdequate = q1d_plat < RdPlatform1 && q2d_plat < RdPlatform2;
  const platformStronger = phiPlatform > phiSubgrade;

  steps.push({
    id: 'platform_check',
    title: 'Check Platform Material Strength',
    description: 'Can the platform material provide sufficient bearing resistance?',
    formula: 'Rd = 0.5 × γp × W × Nγp × sγ',
    values: {
      'Rd_platform (case 1)': `${round(RdPlatform1, 1)} kPa`,
      'Rd_platform (case 2)': `${round(RdPlatform2, 1)} kPa`,
      'q1d = 1.6 × q1k': `${round(q1d_plat, 1)} kPa`,
      'q2d = 1.2 × q2k': `${round(q2d_plat, 1)} kPa`,
      'φ\'p > φ\'s': platformStronger ? 'Yes' : 'No',
    },
    result: platformMaterialAdequate ? 'Material ADEQUATE' : 'Check required',
    unit: '',
    status: platformMaterialAdequate ? 'pass' : (platformStronger ? 'warning' : 'fail'),
  });

  if (!platformStronger) {
    return {
      platformRequired: true,
      platformMaterialAdequate: false,
      unreinforcedThickness: 0,
      designThickness: 0,
      designThicknessMm: 0,
      steps,
      summary: 'The platform material φ\' must be greater than the subgrade φ\'. A stronger platform material is required.',
      status: 'fail',
    };
  }

  // (f) Calculate unreinforced thickness
  const numerator1 = Wd * (q1d_plat - 0.5 * gammaS * Wd * NGammaS * sGamma1);
  const denominator1 = gammaPlatform * KpTanDelta * sp1;
  const numerator2 = Wd * (q2d_plat - 0.5 * gammaS * Wd * NGammaS * sGamma2);
  const denominator2 = gammaPlatform * KpTanDelta * sp2;

  let D1_unreinf = numerator1 > 0 ? Math.sqrt(numerator1 / denominator1) : 0;
  let D2_unreinf = numerator2 > 0 ? Math.sqrt(numerator2 / denominator2) : 0;

  const minThickness = Math.min(0.5 * W, 0.3);
  let unreinforcedThickness = Math.max(D1_unreinf, D2_unreinf, minThickness);

  steps.push({
    id: 'unreinforced_thickness',
    title: 'Required Unreinforced Platform Thickness',
    description: 'Thickness based on punching shear through the platform material.',
    formula: 'D = √{W × (qd - 0.5γ\'s·W·Nγs·sγ) / (γp·Kp·tanδ·sp)}',
    values: {
      'D1 (case 1)': `${round(D1_unreinf, 3)} m`,
      'D2 (case 2)': `${round(D2_unreinf, 3)} m`,
      'Minimum': `${round(minThickness, 3)} m`,
    },
    result: round(unreinforcedThickness, 3),
    unit: 'm',
    status: 'info',
  });

  let reinforcedThickness: number | undefined;
  let designThickness = unreinforcedThickness;

  if (useReinforcement && Tult && Tult > 0) {
    const Td = Tult / 2;
    const reinforcementContribution = 2 * Td / Wd;

    const num1_reinf = Wd * (q1d_plat - 0.5 * gammaS * Wd * NGammaS * sGamma1 - reinforcementContribution);
    const num2_reinf = Wd * (q2d_plat - 0.5 * gammaS * Wd * NGammaS * sGamma2 - reinforcementContribution);

    let D1_reinf = num1_reinf > 0 ? Math.sqrt(num1_reinf / denominator1) : 0;
    let D2_reinf = num2_reinf > 0 ? Math.sqrt(num2_reinf / denominator2) : 0;

    let D_reinf = Math.max(D1_reinf, D2_reinf);
    if (D_reinf > 0 && D_reinf < 0.3) D_reinf = 0.3;

    // Additional check: ignoring reinforcement
    const q1d_reinf_check = 1.25 * q1k;
    const q2d_reinf_check = 1.05 * q2k;

    const Rd_unreinf_at_D = (d: number) =>
      0.5 * gammaS * Wd * NGammaS * sGamma1 + (d * d / Wd) * gammaPlatform * KpTanDelta * sp1;
    const Rd_unreinf_at_D2 = (d: number) =>
      0.5 * gammaS * Wd * NGammaS * sGamma2 + (d * d / Wd) * gammaPlatform * KpTanDelta * sp2;

    let D_final = D_reinf;
    while (D_final < 3.0) {
      const Rd1 = Rd_unreinf_at_D(D_final);
      const Rd2 = Rd_unreinf_at_D2(D_final);
      if (q1d_reinf_check <= Rd1 && q2d_reinf_check <= Rd2) break;
      D_final += 0.01;
    }

    reinforcedThickness = Math.max(D_final, minThickness);

    steps.push({
      id: 'reinforced_thickness',
      title: 'Required Reinforced Platform Thickness',
      description: 'Thickness with geosynthetic reinforcement.',
      formula: 'D = √{W × (qd - 0.5γ\'s·W·Nγs·sγ - 2Td/W) / (γp·Kp·tanδ·sp)}',
      values: {
        'Tult': `${Tult} kN/m`,
        'Td = Tult/2': `${round(Td, 1)} kN/m`,
        'D1 (case 1)': `${round(D1_reinf, 3)} m`,
        'D2 (case 2)': `${round(D2_reinf, 3)} m`,
        'After unreinf. check': `${round(D_final, 3)} m`,
      },
      result: round(reinforcedThickness, 3),
      unit: 'm',
      status: 'info',
    });

    designThickness = reinforcedThickness;
  }

  const designThicknessMm = Math.ceil((designThickness * 1000) / 25) * 25;

  steps.push({
    id: 'final_result',
    title: 'Design Platform Thickness',
    description: 'Rounded up to nearest 25mm as recommended by BRE470.',
    values: {
      'Calculated': `${round(designThickness, 3)} m`,
      'Rounded': `${designThicknessMm} mm`,
    },
    result: designThicknessMm,
    unit: 'mm',
    status: designThicknessMm > 0 ? 'pass' : 'fail',
  });

  const thicknessLabel = useReinforcement ? 'reinforced' : 'unreinforced';
  const summary = `Required ${thicknessLabel} platform thickness: ${designThicknessMm} mm (${round(designThicknessMm / 1000, 3)} m) on granular subgrade with φ'_s = ${phiSubgrade}°.`;

  return {
    platformRequired,
    platformMaterialAdequate,
    unreinforcedThickness,
    reinforcedThickness,
    designThickness: designThicknessMm / 1000,
    designThicknessMm,
    steps,
    summary,
    status: designThicknessMm > 0 ? 'pass' : 'fail',
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────

function round(value: number, decimals: number): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
