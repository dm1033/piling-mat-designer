/**
 * Official Design Pack PDF generator.
 *
 * Produces the paid deliverable for a BRE470 working platform design:
 *   1. Cover page
 *   2. Design certificate (project details, parameters, results, signed check certificate)
 *   3. Calculation audit trail
 *   4. Drawings — cross-section and plan (vector-drawn, with title blocks)
 *   5. Working platform risk assessment
 *   6. Notes, limitations and inspection requirements
 *
 * The PDF is generated server-side on payment and emailed to the customer —
 * this is the official record; the on-screen tool output is a draft only.
 */
import PDFDocument from "pdfkit";
import type { Design } from "../drizzle/schema";
import { CERTIFICATE } from "./products";
import { generateRiskAssessment, riskRating, riskBand } from "@shared/risk-assessment";

// A4 in PDF points
const A4: [number, number] = [595.28, 841.89];
const MARGIN = 48;
const CONTENT_W = A4[0] - MARGIN * 2;

const INK = "#111111";
const GREY = "#555555";
const LIGHT = "#999999";
const RULE = "#cccccc";
const ACCENT = "#b45309"; // construction amber, matches site branding

type Doc = PDFKit.PDFDocument;

function formatDateGB(d: Date | string | null | undefined): string {
  const date = d ? new Date(d) : new Date();
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/** Generate the full design pack as a Buffer. */
export async function generateDesignPackPdf(design: Design): Promise<Buffer> {
  const inputs = (design.calculationInputs || {}) as any;
  const result = (design.calculationResult || {}) as any;
  const issuedDate = formatDateGB(design.certificateIssuedAt || design.createdAt);

  const doc = new PDFDocument({ size: "A4", margins: { top: MARGIN, bottom: MARGIN + 18, left: MARGIN, right: MARGIN }, bufferPages: true });
  const chunks: Buffer[] = [];
  doc.on("data", (c: Buffer) => chunks.push(c));
  const done = new Promise<Buffer>(resolve => doc.on("end", () => resolve(Buffer.concat(chunks))));

  coverPage(doc, design, issuedDate);
  certificatePages(doc, design, inputs, result, issuedDate);
  calculationPages(doc, result);
  drawingPages(doc, design, inputs, result, issuedDate);
  riskAssessmentPages(doc, design, inputs, result, issuedDate);
  notesPage(doc);

  addFooters(doc, design, issuedDate);
  doc.end();
  return done;
}

// ─── Layout helpers ─────────────────────────────────────────────────────

function sectionHeading(doc: Doc, text: string) {
  ensureSpace(doc, 40);
  doc.font("Helvetica-Bold").fontSize(13).fillColor(INK).text(text.toUpperCase(), { characterSpacing: 0.5 });
  doc.moveDown(0.2);
  doc.moveTo(MARGIN, doc.y).lineTo(MARGIN + CONTENT_W, doc.y).lineWidth(1.5).strokeColor(INK).stroke();
  doc.moveDown(0.6);
}

function subHeading(doc: Doc, text: string) {
  ensureSpace(doc, 30);
  doc.font("Helvetica-Bold").fontSize(10).fillColor(INK).text(text);
  doc.moveDown(0.3);
}

function ensureSpace(doc: Doc, needed: number) {
  if (doc.y + needed > A4[1] - MARGIN - 24) doc.addPage();
}

function detailTable(doc: Doc, rows: Array<[string, string]>) {
  const labelW = CONTENT_W * 0.45;
  doc.fontSize(9);
  for (const [label, value] of rows) {
    const h = Math.max(
      doc.font("Helvetica").heightOfString(label, { width: labelW - 8 }),
      doc.font("Helvetica-Bold").heightOfString(value, { width: CONTENT_W - labelW - 8 })
    ) + 6;
    ensureSpace(doc, h + 2);
    const y = doc.y;
    doc.font("Helvetica").fillColor(GREY).text(label, MARGIN, y + 3, { width: labelW - 8 });
    doc.font("Helvetica-Bold").fillColor(INK).text(value, MARGIN + labelW, y + 3, { width: CONTENT_W - labelW - 8 });
    const yEnd = y + h;
    doc.moveTo(MARGIN, yEnd).lineTo(MARGIN + CONTENT_W, yEnd).lineWidth(0.5).strokeColor(RULE).stroke();
    doc.x = MARGIN;
    doc.y = yEnd + 2;
  }
  doc.moveDown(0.5);
}

function addFooters(doc: Doc, design: Design, issuedDate: string) {
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    // Zero the bottom margin while writing in the footer zone, otherwise
    // pdfkit auto-paginates and appends blank pages.
    const oldBottom = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    const y = A4[1] - MARGIN - 6;
    doc.font("Helvetica").fontSize(7).fillColor(LIGHT);
    doc.text(`${CERTIFICATE.company} — ${design.certificateRef} — Issued ${issuedDate}`, MARGIN, y, { width: CONTENT_W / 2, lineBreak: false });
    doc.text(`Page ${i - range.start + 1} of ${range.count}`, MARGIN + CONTENT_W / 2, y, { width: CONTENT_W / 2, align: "right", lineBreak: false });
    doc.page.margins.bottom = oldBottom;
  }
}

/**
 * The PDF standard fonts are WinAnsi-encoded, so Greek letters and some
 * symbols used in the calculation steps render as garbage — transliterate.
 */
function sanitizePdfText(value: unknown): string {
  return String(value)
    .replace(/γ/g, "gamma")
    .replace(/δ/g, "delta")
    .replace(/φ/g, "phi")
    .replace(/Δ/g, "Delta")
    .replace(/·/g, ".")
    .replace(/×/g, "x")
    .replace(/≤/g, "<=")
    .replace(/≥/g, ">=")
    .replace(/√/g, "sqrt")
    .replace(/°/g, " deg")
    .replace(/³/g, "3")
    .replace(/²/g, "2")
    .replace(/[′’]/g, "'");
}

// ─── 1. Cover ───────────────────────────────────────────────────────────

function coverPage(doc: Doc, design: Design, issuedDate: string) {
  doc.rect(0, 0, A4[0], 10).fill(ACCENT);
  doc.y = 140;
  doc.font("Helvetica-Bold").fontSize(11).fillColor(ACCENT).text("BRE470 PILING MAT DESIGNER", MARGIN, doc.y, { characterSpacing: 2 });
  doc.moveDown(0.8);
  doc.font("Helvetica-Bold").fontSize(28).fillColor(INK).text("Working Platform\nOfficial Design Pack");
  doc.moveDown(0.5);
  doc.font("Helvetica").fontSize(11).fillColor(GREY).text(`Designed in accordance with ${CERTIFICATE.standard}`);
  doc.text(CERTIFICATE.standardTitle, { width: CONTENT_W * 0.8 });

  doc.y = 380;
  detailTable(doc, [
    ["Certificate Reference", design.certificateRef],
    ["Project", design.projectName || "—"],
    ["Site Location", design.siteLocation || "—"],
    ["Client", design.clientName || "—"],
    ["Date of Issue", issuedDate],
    ["Designer", `${CERTIFICATE.designer}, ${CERTIFICATE.title}`],
    ["Issued by", CERTIFICATE.company],
  ]);

  doc.moveDown(1);
  subHeading(doc, "Contents of this pack");
  doc.font("Helvetica").fontSize(9.5).fillColor(INK).list(
    [
      "Design certificate — signed check certificate",
      "Full calculation audit trail",
      "Drawings — platform cross-section and plan",
      "Working platform risk assessment",
      "Notes, limitations and inspection requirements",
    ],
    { bulletRadius: 1.5, textIndent: 14 }
  );

  doc.font("Helvetica").fontSize(8).fillColor(GREY)
    .text(
      `This document is the official design record. It supersedes any on-screen draft output from the design tool. ` +
      `Contact: ${CERTIFICATE.email} | ${CERTIFICATE.phone}`,
      MARGIN, A4[1] - 130, { width: CONTENT_W }
    );
}

// ─── 2. Certificate ─────────────────────────────────────────────────────

function certificatePages(doc: Doc, design: Design, inputs: any, result: any, issuedDate: string) {
  doc.addPage();
  sectionHeading(doc, "1. Working Platform Design Certificate");

  subHeading(doc, "1.1 Project details");
  detailTable(doc, [
    ["Project Name", design.projectName || "—"],
    ["Site Location", design.siteLocation || "—"],
    ["Client", design.clientName || "—"],
    ["Certificate Reference", design.certificateRef],
    ["Date of Issue", issuedDate],
  ]);

  subHeading(doc, "1.2 Subgrade conditions");
  detailTable(
    doc,
    inputs?.subgradeType === "cohesive"
      ? [
          ["Subgrade Type", "Cohesive (Clay / Silt)"],
          ["Undrained Shear Strength (cu)", `${inputs.cu} kPa`],
        ]
      : [
          ["Subgrade Type", "Granular (Sand / Gravel)"],
          ["Angle of Shearing Resistance (phi')", `${inputs?.phiSubgrade} deg`],
          ["Unit Weight of Subgrade (gamma')", `${inputs?.gammaSubgrade} kN/m3`],
          ["Water Table within Depth D", inputs?.waterTableNear ? "Yes" : "No"],
        ]
  );

  subHeading(doc, "1.3 Platform material");
  detailTable(doc, [
    ["Angle of Shearing Resistance (phi'p)", `${inputs?.phiPlatform} deg`],
    ["Unit Weight (gamma p)", `${inputs?.gammaPlatform} kN/m3`],
    ["Geosynthetic Reinforcement", inputs?.useReinforcement ? "Yes" : "No"],
    ...(inputs?.useReinforcement && inputs?.Tult
      ? ([["Ultimate Tensile Strength (Tult)", `${inputs.Tult} kN/m`]] as Array<[string, string]>)
      : []),
  ]);

  subHeading(doc, "1.4 Plant loading (EN 996)");
  detailTable(doc, [
    ["Track Width (W)", `${inputs?.W} m`],
    ["Track Length — Overall (L1)", `${inputs?.L1} m`],
    ["Track Length — Loaded (L2)", `${inputs?.L2} m`],
    ["Max Track Pressure — Outrigger (q1k)", `${inputs?.q1k} kPa`],
    ["Max Track Pressure — Slewing (q2k)", `${inputs?.q2k} kPa`],
  ]);

  subHeading(doc, "1.5 Design result");
  ensureSpace(doc, 90);
  const boxY = doc.y;
  doc.rect(MARGIN, boxY, CONTENT_W, 70).lineWidth(1.5).strokeColor(INK).stroke();
  doc.font("Helvetica").fontSize(8).fillColor(GREY).text("REQUIRED PLATFORM THICKNESS", MARGIN, boxY + 12, { width: CONTENT_W, align: "center", characterSpacing: 1 });
  doc.font("Helvetica-Bold").fontSize(26).fillColor(INK).text(`${result?.designThicknessMm || 0} mm`, MARGIN, boxY + 26, { width: CONTENT_W, align: "center" });
  doc.font("Helvetica").fontSize(8.5).fillColor(GREY).text(
    `Design status: ${(result?.status || "—").toUpperCase()}${
      result?.reinforcedThickness !== undefined
        ? `  |  Unreinforced equivalent: ${Math.ceil(((result?.unreinforcedThickness || 0) * 1000) / 25) * 25} mm`
        : ""
    }`,
    MARGIN, boxY + 56, { width: CONTENT_W, align: "center" }
  );
  doc.x = MARGIN;
  doc.y = boxY + 82;
  doc.font("Helvetica").fontSize(9).fillColor(INK).text(result?.summary || "", { width: CONTENT_W });
  doc.moveDown(1);

  // Check certificate / signature block
  ensureSpace(doc, 220);
  subHeading(doc, "1.6 Design check certificate");
  const sigY = doc.y;
  doc.rect(MARGIN, sigY, CONTENT_W, 190).lineWidth(1.5).strokeColor(INK).stroke();
  doc.font("Helvetica").fontSize(9).fillColor(INK).text(
    `I certify that this working platform design has been prepared in accordance with the guidance contained in ` +
      `${CERTIFICATE.standard} — "${CERTIFICATE.standardTitle}". The design parameters, calculation methodology and ` +
      `results presented in this certificate are correct to the best of my knowledge and professional judgement.\n\n` +
      `This design is valid only for the specific site conditions, plant loading and platform material properties stated ` +
      `above. Any change to these parameters requires a new design assessment.`,
    MARGIN + 14, sigY + 14, { width: CONTENT_W - 28 }
  );
  const colW = (CONTENT_W - 28) / 2;
  const lineY = sigY + 140;
  doc.font("Helvetica-BoldOblique").fontSize(14).fillColor(INK).text(CERTIFICATE.designer, MARGIN + 14, lineY - 20, { width: colW - 20 });
  doc.moveTo(MARGIN + 14, lineY).lineTo(MARGIN + 14 + colW - 30, lineY).lineWidth(1).strokeColor(INK).stroke();
  doc.font("Helvetica-Bold").fontSize(9).text(CERTIFICATE.designer, MARGIN + 14, lineY + 5);
  doc.font("Helvetica").fontSize(8.5).fillColor(GREY).text(`${CERTIFICATE.title}\n${CERTIFICATE.company}`, MARGIN + 14, lineY + 17);

  doc.font("Helvetica-Bold").fontSize(12).fillColor(INK).text(issuedDate, MARGIN + 14 + colW, lineY - 18, { width: colW - 20 });
  doc.moveTo(MARGIN + 14 + colW, lineY).lineTo(MARGIN + CONTENT_W - 14, lineY).lineWidth(1).strokeColor(INK).stroke();
  doc.font("Helvetica-Bold").fontSize(9).text("Date", MARGIN + 14 + colW, lineY + 5);
  doc.font("Helvetica").fontSize(8.5).fillColor(GREY).text(`Certificate Ref: ${design.certificateRef}`, MARGIN + 14 + colW, lineY + 17);
  doc.x = MARGIN;
  doc.y = sigY + 200;
}

// ─── 3. Calculations ────────────────────────────────────────────────────

function calculationPages(doc: Doc, result: any) {
  doc.addPage();
  sectionHeading(doc, "2. Calculation Audit Trail");
  doc.font("Helvetica").fontSize(8.5).fillColor(GREY).text(
    `Calculations performed in accordance with ${CERTIFICATE.standard} — ${CERTIFICATE.standardTitle}.`
  );
  doc.moveDown(0.8);

  const steps: any[] = Array.isArray(result?.steps) ? result.steps : [];
  steps.forEach((step, idx) => {
    const values = step.values && typeof step.values === "object" ? Object.entries(step.values) : [];
    const estH = 60 + values.length * 12;
    ensureSpace(doc, Math.min(estH, 300));

    doc.font("Helvetica-Bold").fontSize(10).fillColor(INK).text(`2.${idx + 1}  ${sanitizePdfText(step.title)}   `, { continued: true });
    doc.font("Helvetica-Bold").fontSize(8).fillColor(step.status === "fail" ? "#b91c1c" : step.status === "warning" ? "#b45309" : step.status === "pass" ? "#15803d" : GREY)
      .text(`[${String(step.status || "info").toUpperCase()}]`);
    doc.font("Helvetica").fontSize(8.5).fillColor(GREY).text(sanitizePdfText(step.description || ""), { width: CONTENT_W });
    if (step.formula) {
      doc.moveDown(0.2);
      doc.font("Courier").fontSize(8.5).fillColor(INK).text(sanitizePdfText(step.formula), { width: CONTENT_W });
    }
    doc.moveDown(0.2);
    for (const [key, val] of values) {
      ensureSpace(doc, 12);
      const y = doc.y;
      doc.font("Helvetica").fontSize(8.5).fillColor(GREY).text(sanitizePdfText(key), MARGIN + 12, y, { width: CONTENT_W * 0.5, lineBreak: false });
      doc.font("Courier-Bold").fontSize(8.5).fillColor(INK).text(sanitizePdfText(val), MARGIN + CONTENT_W * 0.55, y, { width: CONTENT_W * 0.45 - 12, align: "right" });
      doc.x = MARGIN;
      doc.y = y + 12;
    }
    ensureSpace(doc, 16);
    const ry = doc.y;
    doc.font("Helvetica-Bold").fontSize(9).fillColor(INK).text("Result:", MARGIN + 12, ry + 2, { lineBreak: false });
    doc.font("Courier-Bold").fontSize(9).text(`${sanitizePdfText(step.result)} ${sanitizePdfText(step.unit || "")}`, MARGIN + CONTENT_W * 0.55, ry + 2, { width: CONTENT_W * 0.45 - 12, align: "right" });
    doc.x = MARGIN;
    doc.y = ry + 16;
    doc.moveTo(MARGIN, doc.y).lineTo(MARGIN + CONTENT_W, doc.y).lineWidth(0.5).strokeColor(RULE).stroke();
    doc.moveDown(0.6);
  });
}

// ─── 4. Drawings ────────────────────────────────────────────────────────

function titleBlock(doc: Doc, design: Design, issuedDate: string, drawingTitle: string, drawingNo: string) {
  const h = 58;
  const y = A4[1] - MARGIN - 24 - h;
  doc.rect(MARGIN, y, CONTENT_W, h).lineWidth(1).strokeColor(INK).stroke();
  const col = CONTENT_W / 3;
  doc.moveTo(MARGIN + col, y).lineTo(MARGIN + col, y + h).stroke();
  doc.moveTo(MARGIN + 2 * col, y).lineTo(MARGIN + 2 * col, y + h).stroke();
  doc.font("Helvetica").fontSize(6.5).fillColor(GREY);
  doc.text("PROJECT", MARGIN + 6, y + 6);
  doc.text("DRAWING TITLE", MARGIN + col + 6, y + 6);
  doc.text("DRAWING No. / REV", MARGIN + 2 * col + 6, y + 6);
  doc.font("Helvetica-Bold").fontSize(8).fillColor(INK);
  doc.text(design.projectName || "—", MARGIN + 6, y + 15, { width: col - 12, height: 20, ellipsis: true });
  doc.text(drawingTitle, MARGIN + col + 6, y + 15, { width: col - 12 });
  doc.text(`${design.certificateRef}-${drawingNo} / P1`, MARGIN + 2 * col + 6, y + 15, { width: col - 12 });
  doc.font("Helvetica").fontSize(6.5).fillColor(GREY);
  doc.text(`DESIGNED: ${CERTIFICATE.designer}`, MARGIN + 6, y + 36);
  doc.text(`DATE: ${issuedDate}`, MARGIN + col + 6, y + 36);
  doc.text("SCALE: NTS   STATUS: FOR CONSTRUCTION", MARGIN + 2 * col + 6, y + 36, { width: col - 12 });
}

function drawingPages(doc: Doc, design: Design, inputs: any, result: any, issuedDate: string) {
  const thicknessMm = result?.designThicknessMm || 0;
  const W = Number(inputs?.W) || 0.7;
  const L1 = Number(inputs?.L1) || 3.6;

  // ── Drawing 01: Cross-section ──
  doc.addPage();
  sectionHeading(doc, "3. Drawings");
  subHeading(doc, `Drawing 01 — Platform cross-section (thickness ${thicknessMm} mm)`);

  const cx = MARGIN, cw = CONTENT_W;
  const topY = doc.y + 60;
  const platformH = 90;
  const subgradeH = 60;
  const trackW = 90;
  const trackX1 = cx + cw / 2 - 140 - trackW / 2;
  const trackX2 = cx + cw / 2 + 140 - trackW / 2;

  // Track shoes + load arrows
  for (const tx of [trackX1, trackX2]) {
    doc.rect(tx, topY, trackW, 16).fillAndStroke("#e5e7eb", INK);
    for (let i = 0; i < 3; i++) {
      const ax = tx + 15 + i * 30;
      doc.moveTo(ax, topY - 26).lineTo(ax, topY - 4).lineWidth(1).strokeColor(INK).stroke();
      doc.moveTo(ax - 3, topY - 9).lineTo(ax, topY - 3).lineTo(ax + 3, topY - 9).stroke();
    }
  }
  doc.font("Helvetica").fontSize(7.5).fillColor(INK);
  doc.text(`Track load q1k = ${inputs?.q1k} kPa / q2k = ${inputs?.q2k} kPa`, cx, topY - 42, { width: cw, align: "center" });
  doc.text(`Track width W = ${W} m`, trackX1 - 20, topY + 20, { width: trackW + 40, align: "center" });

  // Platform layer
  const platY = topY + 16;
  doc.rect(cx, platY, cw, platformH).fillAndStroke("#fef3c7", INK);
  // granular fill dots
  doc.fillColor("#b45309");
  for (let i = 0; i < 120; i++) {
    const px = cx + ((i * 37) % cw);
    const py = platY + 6 + ((i * 23) % (platformH - 12));
    doc.circle(px, py, 0.8).fill();
  }
  doc.font("Helvetica-Bold").fontSize(9).fillColor(INK).text(
    `WELL-GRADED GRANULAR PLATFORM — phi'p = ${inputs?.phiPlatform} deg, gamma p = ${inputs?.gammaPlatform} kN/m3`,
    cx, platY + platformH / 2 - 12, { width: cw, align: "center" }
  );
  doc.font("Helvetica").fontSize(8).text("Compacted in layers not exceeding 250 mm", cx, platY + platformH / 2 + 2, { width: cw, align: "center" });

  // Geogrid — label sits above the dashed line, inside the platform layer
  if (inputs?.useReinforcement) {
    const gy = platY + platformH - 10;
    doc.moveTo(cx + 8, gy).lineTo(cx + cw - 8, gy).lineWidth(1.5).strokeColor("#15803d").dash(6, { space: 3 }).stroke().undash();
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#15803d").text(
      `GEOSYNTHETIC REINFORCEMENT — Tult = ${inputs?.Tult ?? "—"} kN/m (300 mm min laps)`,
      cx, gy - 12, { width: cw, align: "center" }
    );
  }

  // Subgrade
  const subY = platY + platformH;
  doc.rect(cx, subY, cw, subgradeH).fillAndStroke("#f3f4f6", INK);
  doc.strokeColor(GREY).lineWidth(0.5);
  for (let i = 0; i < 22; i++) {
    const hx = cx + 10 + i * (cw / 22);
    doc.moveTo(hx, subY + subgradeH - 6).lineTo(hx + 10, subY + 6).stroke();
  }
  doc.font("Helvetica-Bold").fontSize(9).fillColor(INK).text(
    inputs?.subgradeType === "cohesive"
      ? `COHESIVE SUBGRADE — cu = ${inputs?.cu} kPa`
      : `GRANULAR SUBGRADE — phi' = ${inputs?.phiSubgrade} deg, gamma' = ${inputs?.gammaSubgrade} kN/m3${inputs?.waterTableNear ? "  (high water table)" : ""}`,
    cx, subY + subgradeH / 2 - 5, { width: cw, align: "center" }
  );

  // Thickness dimension line
  const dimX = cx + cw + -14;
  doc.moveTo(dimX, platY).lineTo(dimX, subY).lineWidth(1).strokeColor(ACCENT).stroke();
  doc.moveTo(dimX - 4, platY).lineTo(dimX + 4, platY).stroke();
  doc.moveTo(dimX - 4, subY).lineTo(dimX + 4, subY).stroke();
  doc.save().rotate(-90, { origin: [dimX, (platY + subY) / 2] });
  doc.font("Helvetica-Bold").fontSize(9).fillColor(ACCENT).text(`${thicknessMm} mm`, dimX - 30, (platY + subY) / 2 - 16, { width: 60, align: "center" });
  doc.restore();

  doc.x = MARGIN;
  doc.y = subY + subgradeH + 16;
  doc.font("Helvetica").fontSize(8).fillColor(GREY).list(
    [
      `Platform thickness ${thicknessMm} mm minimum, maintained across the full working area.`,
      "Platform to extend at least 2 m (or one platform thickness if greater) beyond the plant footprint in all working positions.",
      "Proof-roll subgrade and remove soft spots before placing platform material.",
    ],
    { bulletRadius: 1.2, textIndent: 12 }
  );
  titleBlock(doc, design, issuedDate, "Working Platform Cross-Section", "D01");

  // ── Drawing 02: Plan ──
  doc.addPage();
  subHeading(doc, "Drawing 02 — Platform plan and rig footprint");
  const planY = doc.y + 24;
  const planH = 330;
  const platW2 = CONTENT_W - 60;
  const px0 = MARGIN + 30;

  // Platform extent
  doc.rect(px0, planY, platW2, planH).lineWidth(1.5).fillAndStroke("#fffbeb", INK);
  doc.font("Helvetica").fontSize(7.5).fillColor(GREY).text("WORKING PLATFORM EXTENT", px0 + 6, planY + 6);

  // Rig track footprint (two tracks centred)
  const scale = Math.min((planH - 120) / Math.max(L1, 1), 60);
  const tLen = Math.max(L1 * scale, 80);
  const tW = Math.max(W * scale, 22);
  const gap = Math.max(tW * 2.2, 60);
  const cxp = px0 + platW2 / 2;
  const cyp = planY + planH / 2;
  for (const off of [-gap / 2 - tW / 2, gap / 2 - tW / 2]) {
    doc.rect(cxp + off, cyp - tLen / 2, tW, tLen).lineWidth(1).fillAndStroke("#e5e7eb", INK);
  }
  doc.font("Helvetica-Bold").fontSize(8).fillColor(INK).text("PILING RIG TRACKS", cxp - 60, cyp - 5, { width: 120, align: "center" });
  doc.font("Helvetica").fontSize(7).fillColor(GREY).text(`L1 = ${L1} m`, cxp + gap / 2 + tW / 2 + 6, cyp - 4);
  doc.text(`W = ${W} m`, cxp - gap / 2 - tW / 2 - 4, cyp - tLen / 2 - 12, { width: tW + 8, align: "center" });

  // 2 m margin annotation
  doc.lineWidth(0.75).strokeColor(ACCENT).dash(4, { space: 3 });
  doc.rect(px0 + 24, planY + 24, platW2 - 48, planH - 48).stroke().undash();
  doc.font("Helvetica").fontSize(7).fillColor(ACCENT)
    .text("Plant working zone — platform extends min. 2 m (or 1 x platform thickness) beyond tracks in all positions", px0 + 30, planY + planH - 40, { width: platW2 - 60 });

  doc.x = MARGIN;
  doc.y = planY + planH + 14;
  doc.font("Helvetica").fontSize(8).fillColor(GREY).list(
    [
      "Platform extent to be physically demarcated on site; edges protected from over-run.",
      "No excavation within the zone of influence of the platform without designer review.",
      `Design valid for track pressures up to q1k = ${inputs?.q1k} kPa / q2k = ${inputs?.q2k} kPa. Any other rig requires a design check.`,
    ],
    { bulletRadius: 1.2, textIndent: 12 }
  );
  titleBlock(doc, design, issuedDate, "Working Platform Plan", "D02");
}

// ─── 5. Risk assessment ─────────────────────────────────────────────────

function riskAssessmentPages(doc: Doc, design: Design, inputs: any, result: any, issuedDate: string) {
  doc.addPage();
  sectionHeading(doc, "4. Working Platform Risk Assessment");

  const ra = generateRiskAssessment(
    {
      subgradeType: inputs?.subgradeType === "granular" ? "granular" : "cohesive",
      cu: inputs?.cu,
      phiSubgrade: inputs?.phiSubgrade,
      waterTableNear: !!inputs?.waterTableNear,
      useReinforcement: !!inputs?.useReinforcement,
      W: Number(inputs?.W) || 0,
      q1k: Number(inputs?.q1k) || 0,
      q2k: Number(inputs?.q2k) || 0,
    },
    {
      platformRequired: !!result?.platformRequired,
      designThicknessMm: Number(result?.designThicknessMm) || 0,
      status: result?.status === "fail" || result?.status === "warning" ? result.status : "pass",
    }
  );

  detailTable(doc, [
    ["Assessment", ra.title],
    ["Project", design.projectName || "—"],
    ["Certificate Reference", design.certificateRef],
    ["Assessed by", `${CERTIFICATE.designer}, ${CERTIFICATE.title}`],
    ["Date", issuedDate],
  ]);
  doc.font("Helvetica").fontSize(8.5).fillColor(GREY).text(ra.scope, { width: CONTENT_W });
  doc.moveDown(0.4);
  doc.font("Helvetica").fontSize(8).fillColor(GREY).text(
    "Risk rating = Likelihood (1-5) x Severity (1-5).  1-6 Low, 8-12 Medium, 15-25 High."
  );
  doc.moveDown(0.8);

  for (const item of ra.items) {
    const initial = riskRating(item.likelihood, item.severity);
    const residual = riskRating(item.residualLikelihood, item.residualSeverity);
    ensureSpace(doc, 90);
    const y0 = doc.y;
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor(INK).text(`${item.id} — ${item.hazard}`, MARGIN, y0, { width: CONTENT_W });
    doc.font("Helvetica").fontSize(8).fillColor(GREY).text(`Persons at risk: ${item.persons}`, { width: CONTENT_W });
    doc.font("Helvetica").fontSize(8).fillColor(INK).text(
      `Initial risk: ${item.likelihood} x ${item.severity} = ${initial} (${riskBand(initial)})`, { continued: true }
    );
    doc.fillColor(GREY).text(`    Residual risk: ${item.residualLikelihood} x ${item.residualSeverity} = ${residual} (${riskBand(residual)})`);
    doc.moveDown(0.2);
    doc.font("Helvetica-Bold").fontSize(8).fillColor(INK).text("Controls:");
    doc.font("Helvetica").fontSize(8).fillColor(INK).list(item.controls, { bulletRadius: 1.1, textIndent: 12, width: CONTENT_W - 12 });
    doc.moveDown(0.3);
    doc.moveTo(MARGIN, doc.y).lineTo(MARGIN + CONTENT_W, doc.y).lineWidth(0.5).strokeColor(RULE).stroke();
    doc.moveDown(0.5);
  }

  ensureSpace(doc, 100);
  subHeading(doc, "General controls applying to all items");
  doc.font("Helvetica").fontSize(8.5).fillColor(INK).list(ra.generalControls, { bulletRadius: 1.2, textIndent: 12, width: CONTENT_W - 12 });
}

// ─── 6. Notes ───────────────────────────────────────────────────────────

function notesPage(doc: Doc) {
  doc.addPage();
  sectionHeading(doc, "5. Notes, Limitations & Inspection Requirements");
  const notes: Array<[string, string]> = [
    [
      "Validity",
      "This design is valid only for the plant, loading, platform material and ground conditions stated in Section 1. Any change — including a different rig, attachment, or working method — requires a design review before work continues.",
    ],
    [
      "Ground conditions",
      "The design relies on the ground parameters supplied by the purchaser. Verify on site (proof-rolling, hand shear vane or plate testing as appropriate) before and during platform construction. If conditions differ from the design assumptions, stop and refer back to the designer.",
    ],
    [
      "Working Platform Certificate",
      "A Working Platform Certificate (FPS format) must be completed and signed by the platform installer, confirming the platform has been built to this design, before piling plant is accepted onto the platform.",
    ],
    [
      "Inspection & maintenance",
      "Inspect the platform at the start of each shift, after adverse weather, and after any repair or alteration, in accordance with BR 470. Repair ruts and surface damage with compacted granular fill. Keep inspection records with the Working Platform Certificate.",
    ],
    [
      "Temporary works management",
      "The platform is a temporary works item and must be managed under BS 5975:2024 with an appointed Temporary Works Coordinator. This pack should be incorporated into the site temporary works register.",
    ],
    [
      "Disclaimer",
      "This design pack has been prepared using the BRE470 Piling Mat Designer in accordance with BR 470 (BRE 2004). The Temporary Works Coordinator must verify that actual site conditions match the design parameters before authorising installation.",
    ],
  ];
  for (const [title, body] of notes) {
    ensureSpace(doc, 60);
    doc.font("Helvetica-Bold").fontSize(10).fillColor(INK).text(title);
    doc.font("Helvetica").fontSize(9).fillColor(GREY).text(body, { width: CONTENT_W });
    doc.moveDown(0.8);
  }
  doc.moveDown(1);
  doc.font("Helvetica").fontSize(9).fillColor(INK).text(
    `Questions about this design pack: ${CERTIFICATE.email} | ${CERTIFICATE.phone}`,
    { width: CONTENT_W }
  );
}
