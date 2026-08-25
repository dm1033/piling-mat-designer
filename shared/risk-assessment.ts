/**
 * Working Platform Risk Assessment generator.
 *
 * Produces a structured, site-specific risk assessment for a BRE470 working
 * platform design from the calculation inputs and result. Shared between the
 * client (on-screen draft preview) and the server (official PDF pack).
 *
 * Scoring: likelihood (1-5) x severity (1-5) = risk rating.
 *   1-6 Low, 8-12 Medium, 15-25 High.
 */

/** Minimal structural view of the calculation inputs the RA needs. */
export interface RaInputs {
  subgradeType: "cohesive" | "granular";
  cu?: number;
  phiSubgrade?: number;
  waterTableNear?: boolean;
  useReinforcement: boolean;
  W: number;
  q1k: number;
  q2k: number;
}

/** Minimal structural view of the calculation result the RA needs. */
export interface RaResult {
  platformRequired: boolean;
  designThicknessMm: number;
  status: "pass" | "fail" | "warning";
}

export interface RiskItem {
  id: string;
  hazard: string;
  persons: string;
  /** Initial (uncontrolled) likelihood 1-5 */
  likelihood: number;
  /** Severity 1-5 */
  severity: number;
  controls: string[];
  /** Residual likelihood after controls, 1-5 */
  residualLikelihood: number;
  residualSeverity: number;
}

export interface RiskAssessment {
  title: string;
  scope: string;
  items: RiskItem[];
  generalControls: string[];
}

export function riskRating(likelihood: number, severity: number): number {
  return likelihood * severity;
}

export function riskBand(rating: number): "Low" | "Medium" | "High" {
  if (rating >= 15) return "High";
  if (rating >= 8) return "Medium";
  return "Low";
}

/**
 * Build the site-specific risk assessment for a working platform design.
 */
export function generateRiskAssessment(inputs: RaInputs, result: RaResult): RiskAssessment {
  const items: RiskItem[] = [];
  const isCohesive = inputs.subgradeType === "cohesive";
  const softClay = isCohesive && (inputs.cu ?? 0) <= 40;
  const maxPressure = Math.max(inputs.q1k || 0, inputs.q2k || 0);

  items.push({
    id: "RA-01",
    hazard:
      "Bearing failure of the working platform or subgrade under tracked plant, leading to rig instability or overturning",
    persons: "Rig operator, banksman, site operatives, visitors",
    likelihood: softClay ? 4 : 3,
    severity: 5,
    controls: [
      `Platform constructed to the certified BRE470 design thickness of ${result.designThicknessMm} mm (minimum) in well-graded granular fill, compacted in layers not exceeding 250 mm`,
      "Platform material to achieve the design angle of shearing resistance — verify by supplier declaration and/or in-situ testing",
      `Plant limited to track pressures not exceeding the design values (q1k = ${inputs.q1k} kPa, q2k = ${inputs.q2k} kPa); any change of rig requires a design check`,
      "Working Platform Certificate (WPC) issued and signed before plant tracks onto the platform",
      "Exclusion zone maintained around operating plant",
    ],
    residualLikelihood: 1,
    residualSeverity: 5,
  });

  items.push({
    id: "RA-02",
    hazard: softClay
      ? `Softening or deterioration of the ${isCohesive ? "cohesive" : ""} subgrade (cu = ${inputs.cu} kPa) due to water ingress, remoulding or trafficking, reducing bearing capacity below the design assumption`
      : "Deterioration of the subgrade due to water ingress or trafficking, reducing bearing capacity below the design assumption",
    persons: "Rig operator, site operatives",
    likelihood: softClay ? 4 : 2,
    severity: 4,
    controls: [
      "Subgrade proof-rolled and inspected by a competent person before platform construction; soft spots excavated and replaced",
      "Verify design subgrade strength on site (hand shear vane / plate test as appropriate); if lower than the design value, stop and re-design",
      "Maintain surface water drainage; do not allow ponding on or beside the platform",
      "Platform surface maintained free of ruts deeper than 50 mm; repair with compacted granular fill",
    ],
    residualLikelihood: 1,
    residualSeverity: 4,
  });

  if (inputs.subgradeType === "granular" && inputs.waterTableNear) {
    items.push({
      id: "RA-03",
      hazard:
        "High groundwater within the influence depth reduces effective stress in the granular subgrade, reducing bearing capacity (allowed for in the design, but rising water invalidates it)",
      persons: "Rig operator, site operatives",
      likelihood: 3,
      severity: 4,
      controls: [
        "Design assumes the water table within the influence depth — monitor groundwater level; if it rises above the design assumption, stop work and seek designer review",
        "Provide and maintain drainage/dewatering as required by the temporary works coordinator",
        "Inspect platform after heavy rainfall before plant re-commences work",
      ],
      residualLikelihood: 1,
      residualSeverity: 4,
    });
  }

  if (inputs.useReinforcement) {
    items.push({
      id: "RA-04",
      hazard:
        "Incorrect installation of geosynthetic reinforcement (wrong grade, damage, inadequate laps) so the reinforced design thickness is not achieved in practice",
      persons: "Rig operator, site operatives",
      likelihood: 3,
      severity: 5,
      controls: [
        "Geosynthetic to match the specified ultimate tensile strength on the design certificate — check delivery tickets against the specification",
        "Minimum 300 mm laps (or per manufacturer's instructions); reinforcement laid flat, free of damage, and covered promptly",
        "Installation inspected and recorded by the temporary works supervisor before filling",
        "If the specified geosynthetic is unavailable, revert to the unreinforced design thickness or obtain a design check",
      ],
      residualLikelihood: 1,
      residualSeverity: 5,
    });
  }

  items.push({
    id: "RA-05",
    hazard:
      "Platform edge failure — plant tracking too close to the platform edge, unsupported edges, or excavations adjacent to the platform",
    persons: "Rig operator, banksman, operatives in adjacent areas",
    likelihood: 3,
    severity: 5,
    controls: [
      "Platform to extend at least 2 m (or one platform thickness, whichever is greater) beyond the plant footprint in all working positions",
      "Physical demarcation (bunting/barriers) of the platform working extent and edges",
      "No excavation within the zone of influence of the platform without designer review",
      "Banksman to control plant movements near platform edges",
    ],
    residualLikelihood: 1,
    residualSeverity: 5,
  });

  items.push({
    id: "RA-06",
    hazard:
      "Degradation of the platform over time (rutting, contamination with site arisings, loss of material) so the as-built thickness no longer matches the certified design",
    persons: "Rig operator, site operatives",
    likelihood: 3,
    severity: 4,
    controls: [
      "Platform inspected by a competent person at the start of each shift and after adverse weather, in accordance with BRE470 and the WPC",
      "Formal re-inspection and re-certification after any repair, alteration or period of disuse",
      "Keep the platform surface clean; do not mix arisings or spoil into the platform material",
      "Maintain inspection records with the Working Platform Certificate",
    ],
    residualLikelihood: 1,
    residualSeverity: 4,
  });

  items.push({
    id: "RA-07",
    hazard:
      "Buried services, obstructions or voids beneath the platform footprint causing local collapse or service strike during platform construction or piling",
    persons: "Site operatives, rig operator, public (off-site services)",
    likelihood: 2,
    severity: 5,
    controls: [
      "Service drawings reviewed and CAT & Genny survey completed over the platform footprint before construction",
      "Known services protected, diverted or bridged per the temporary works design; voids/obstructions grouted or excavated and replaced",
      "Permit to dig in place for any intrusive works",
    ],
    residualLikelihood: 1,
    residualSeverity: 5,
  });

  if (result.status !== "pass") {
    items.push({
      id: "RA-08",
      hazard:
        "The entered design parameters did not produce a satisfactory design (see calculation output). Constructing a platform from a failed or warning-status calculation",
      persons: "All site personnel",
      likelihood: 5,
      severity: 5,
      controls: [
        "DO NOT construct this platform. Specialist geotechnical design is required",
        "Refer the design to a competent temporary works designer with full site investigation data",
      ],
      residualLikelihood: 3,
      residualSeverity: 5,
    });
  }

  return {
    title: "Working Platform Risk Assessment — BRE470",
    scope:
      "Construction, use, maintenance and repair of a ground-supported working platform for tracked plant, designed in accordance with BR 470 (BRE 2004). " +
      "This assessment covers platform-specific hazards only; it must be read alongside the principal contractor's construction phase plan, the piling contractor's " +
      "safe system of work, and rig-specific risk assessments.",
    items,
    generalControls: [
      "All works under CDM 2015; temporary works managed in accordance with BS 5975:2024 with an appointed Temporary Works Coordinator (TWC)",
      "A Working Platform Certificate (WPC, FPS format) must be completed and signed by the platform installer before piling plant is accepted onto the platform",
      "The platform design is valid only for the rig, track pressures and ground conditions stated on the design certificate — any change requires a design review",
      "The design assumes the site investigation information provided is representative; verify ground conditions during construction",
      "Emergency arrangements, first aid and rescue plan per the site construction phase plan",
    ],
  };
}
