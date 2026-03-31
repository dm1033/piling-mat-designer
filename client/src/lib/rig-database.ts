/**
 * Piling Rig Database
 * Common models from Liebherr, Bauer, and Soilmec with EN 996 track dimensions
 * and typical loading values for BRE470 platform design calculations.
 *
 * Sources: Manufacturer data sheets (Liebherr LB series, Bauer BG series, Soilmec SR series)
 *
 * Notes on loading values:
 * - q1k (Case 1): Operator unlikely to aid recovery (travelling, crane mode, lifting)
 * - q2k (Case 2): Operator can control load (drilling, extracting)
 * - EN 996 ground bearing pressures are calculated from operating weight / (2 × W × L)
 * - Values are conservative estimates from manufacturer data sheets
 * - Always verify against the specific rig's EN 996 data sheet for the actual configuration
 */

export interface PilingRig {
  id: string;
  manufacturer: "Liebherr" | "Bauer" | "Soilmec";
  model: string;
  /** Operating weight in tonnes (typical configuration) */
  operatingWeight: number;
  /** Track shoe width in metres */
  W: number;
  /** Track contact length - Case 1 in metres */
  L1: number;
  /** Track contact length - Case 2 in metres */
  L2: number;
  /** EN 996 Case 1 bearing pressure in kPa */
  q1k: number;
  /** EN 996 Case 2 bearing pressure in kPa */
  q2k: number;
  /** Short description / application */
  description: string;
  /** Machine class / weight category */
  category: "Light" | "Medium" | "Heavy" | "Super Heavy";
}

/**
 * Comprehensive piling rig database.
 * Track contact lengths (L1, L2) and bearing pressures (q1k, q2k) are
 * derived from manufacturer data sheets and EN 996 calculations.
 * L1 is typically the full crawler contact length.
 * L2 is typically a reduced effective length for Case 2 conditions.
 */
export const PILING_RIGS: PilingRig[] = [
  // ─── LIEBHERR LB SERIES ──────────────────────────────────────────────
  {
    id: "lb16",
    manufacturer: "Liebherr",
    model: "LB 16-180",
    operatingWeight: 50,
    W: 0.6,
    L1: 3.8,
    L2: 3.2,
    q1k: 110,
    q2k: 150,
    description: "Compact rotary drilling rig, CFA & Kelly drilling",
    category: "Light",
  },
  {
    id: "lb20",
    manufacturer: "Liebherr",
    model: "LB 20-230",
    operatingWeight: 69,
    W: 0.7,
    L1: 4.2,
    L2: 3.6,
    q1k: 120,
    q2k: 165,
    description: "Versatile rotary drilling rig, Kelly & CFA",
    category: "Medium",
  },
  {
    id: "lb24",
    manufacturer: "Liebherr",
    model: "LB 24-270",
    operatingWeight: 80,
    W: 0.8,
    L1: 4.5,
    L2: 3.8,
    q1k: 115,
    q2k: 160,
    description: "Medium rotary drilling rig, Kelly drilling",
    category: "Medium",
  },
  {
    id: "lb28",
    manufacturer: "Liebherr",
    model: "LB 28-320",
    operatingWeight: 92,
    W: 0.9,
    L1: 4.8,
    L2: 4.1,
    q1k: 110,
    q2k: 155,
    description: "Large rotary drilling rig, deep foundations",
    category: "Heavy",
  },
  {
    id: "lb36",
    manufacturer: "Liebherr",
    model: "LB 36-410",
    operatingWeight: 115,
    W: 0.9,
    L1: 5.2,
    L2: 4.4,
    q1k: 125,
    q2k: 175,
    description: "Heavy rotary drilling rig, large diameter piles",
    category: "Heavy",
  },
  {
    id: "lb44",
    manufacturer: "Liebherr",
    model: "LB 44-510",
    operatingWeight: 155,
    W: 1.0,
    L1: 5.8,
    L2: 5.0,
    q1k: 135,
    q2k: 190,
    description: "Super-heavy rotary drilling rig, max depth/diameter",
    category: "Super Heavy",
  },
  {
    id: "lrb155",
    manufacturer: "Liebherr",
    model: "LRB 155",
    operatingWeight: 55,
    W: 0.6,
    L1: 3.8,
    L2: 3.2,
    q1k: 120,
    q2k: 165,
    description: "Piling & drilling rig, vibrator/hammer/auger",
    category: "Light",
  },
  {
    id: "lrb255",
    manufacturer: "Liebherr",
    model: "LRB 255",
    operatingWeight: 85,
    W: 0.8,
    L1: 4.5,
    L2: 3.8,
    q1k: 120,
    q2k: 170,
    description: "Heavy piling & drilling rig, multi-purpose",
    category: "Medium",
  },

  // ─── BAUER BG SERIES ─────────────────────────────────────────────────
  {
    id: "bg15",
    manufacturer: "Bauer",
    model: "BG 15 H",
    operatingWeight: 45,
    W: 0.6,
    L1: 3.6,
    L2: 3.0,
    q1k: 105,
    q2k: 145,
    description: "Compact Kelly drilling rig, urban sites",
    category: "Light",
  },
  {
    id: "bg20",
    manufacturer: "Bauer",
    model: "BG 20 H",
    operatingWeight: 55,
    W: 0.6,
    L1: 3.8,
    L2: 3.2,
    q1k: 120,
    q2k: 165,
    description: "Versatile Kelly drilling rig",
    category: "Light",
  },
  {
    id: "bg24",
    manufacturer: "Bauer",
    model: "BG 24 H",
    operatingWeight: 82,
    W: 0.7,
    L1: 4.5,
    L2: 3.8,
    q1k: 130,
    q2k: 180,
    description: "Medium Kelly drilling rig, CFA capable",
    category: "Medium",
  },
  {
    id: "bg28",
    manufacturer: "Bauer",
    model: "BG 28 H",
    operatingWeight: 84,
    W: 0.7,
    L1: 4.6,
    L2: 3.9,
    q1k: 130,
    q2k: 180,
    description: "Medium-heavy Kelly drilling rig",
    category: "Medium",
  },
  {
    id: "bg33",
    manufacturer: "Bauer",
    model: "BG 33",
    operatingWeight: 102,
    W: 0.8,
    L1: 5.0,
    L2: 4.2,
    q1k: 130,
    q2k: 180,
    description: "Heavy Kelly drilling rig, deep foundations",
    category: "Heavy",
  },
  {
    id: "bg36",
    manufacturer: "Bauer",
    model: "BG 36",
    operatingWeight: 114,
    W: 0.8,
    L1: 5.7,
    L2: 4.8,
    q1k: 125,
    q2k: 175,
    description: "Heavy rotary drilling rig, large diameter",
    category: "Heavy",
  },
  {
    id: "bg36h",
    manufacturer: "Bauer",
    model: "BG 36 H",
    operatingWeight: 112,
    W: 0.8,
    L1: 5.7,
    L2: 4.8,
    q1k: 125,
    q2k: 170,
    description: "Heavy H-kinematics drilling rig",
    category: "Heavy",
  },
  {
    id: "bg40",
    manufacturer: "Bauer",
    model: "BG 40",
    operatingWeight: 130,
    W: 0.9,
    L1: 6.0,
    L2: 5.1,
    q1k: 120,
    q2k: 170,
    description: "Super-heavy Kelly drilling rig",
    category: "Super Heavy",
  },
  {
    id: "bg46",
    manufacturer: "Bauer",
    model: "BG 46",
    operatingWeight: 155,
    W: 1.0,
    L1: 6.5,
    L2: 5.5,
    q1k: 120,
    q2k: 170,
    description: "Largest Bauer drilling rig, max capacity",
    category: "Super Heavy",
  },

  // ─── SOILMEC SR SERIES ───────────────────────────────────────────────
  {
    id: "sr30",
    manufacturer: "Soilmec",
    model: "SR-30",
    operatingWeight: 35,
    W: 0.6,
    L1: 3.4,
    L2: 2.9,
    q1k: 90,
    q2k: 125,
    description: "Compact hydraulic rotary rig, CFA & Kelly",
    category: "Light",
  },
  {
    id: "sr45",
    manufacturer: "Soilmec",
    model: "SR-45",
    operatingWeight: 41,
    W: 0.6,
    L1: 4.7,
    L2: 4.0,
    q1k: 75,
    q2k: 105,
    description: "Medium hydraulic rotary rig, CFA & Kelly",
    category: "Light",
  },
  {
    id: "sr50",
    manufacturer: "Soilmec",
    model: "SR-50",
    operatingWeight: 54,
    W: 0.7,
    L1: 5.2,
    L2: 4.4,
    q1k: 75,
    q2k: 110,
    description: "Medium hydraulic rotary rig, versatile",
    category: "Medium",
  },
  {
    id: "sr65",
    manufacturer: "Soilmec",
    model: "SR-65",
    operatingWeight: 56,
    W: 0.7,
    L1: 5.7,
    L2: 4.8,
    q1k: 70,
    q2k: 105,
    description: "Medium-heavy hydraulic rotary rig",
    category: "Medium",
  },
  {
    id: "sr75",
    manufacturer: "Soilmec",
    model: "SR-75",
    operatingWeight: 71,
    W: 0.75,
    L1: 5.5,
    L2: 4.7,
    q1k: 90,
    q2k: 130,
    description: "Heavy hydraulic rotary rig, large diameter",
    category: "Medium",
  },
  {
    id: "sr100",
    manufacturer: "Soilmec",
    model: "SR-100",
    operatingWeight: 100,
    W: 0.9,
    L1: 5.8,
    L2: 4.9,
    q1k: 100,
    q2k: 145,
    description: "Super-heavy hydraulic rotary rig",
    category: "Heavy",
  },
];

/** Get all unique manufacturers */
export function getManufacturers(): string[] {
  return Array.from(new Set(PILING_RIGS.map((r) => r.manufacturer)));
}

/** Get rigs filtered by manufacturer */
export function getRigsByManufacturer(manufacturer: string): PilingRig[] {
  return PILING_RIGS.filter((r) => r.manufacturer === manufacturer);
}

/** Get a rig by ID */
export function getRigById(id: string): PilingRig | undefined {
  return PILING_RIGS.find((r) => r.id === id);
}

/** Get rigs filtered by category */
export function getRigsByCategory(category: PilingRig["category"]): PilingRig[] {
  return PILING_RIGS.filter((r) => r.category === category);
}

/** Search rigs by model name */
export function searchRigs(query: string): PilingRig[] {
  const q = query.toLowerCase();
  return PILING_RIGS.filter(
    (r) =>
      r.model.toLowerCase().includes(q) ||
      r.manufacturer.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
  );
}
