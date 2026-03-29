/**
 * Export BRE470 calculation report as printable HTML
 * Opens a new window with a formatted report that can be printed/saved as PDF
 */
import type { DesignResult, CalculationStep } from './bre470-calc';

interface ReportInputs {
  subgradeType: 'cohesive' | 'granular';
  cu?: number;
  phiSubgrade?: number;
  gammaSubgrade?: number;
  phiPlatform: number;
  gammaPlatform: number;
  W: number;
  L1: number;
  L2: number;
  q1k: number;
  q2k: number;
  useReinforcement: boolean;
  Tult?: number;
  waterTableNear?: boolean;
}

export function exportReport(inputs: ReportInputs, result: DesignResult) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit',
  });

  const statusColor = result.status === 'pass' ? '#2d8a4e' : result.status === 'warning' ? '#b86e00' : '#c0392b';
  const statusLabel = result.status === 'pass' ? 'PASS' : result.status === 'warning' ? 'WARNING' : 'FAIL';

  const inputRows = buildInputRows(inputs);
  const stepRows = result.steps.map(renderStep).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>BRE470 Platform Design Report — ${dateStr}</title>
<style>
  @page { size: A4; margin: 15mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; color: #222; line-height: 1.5; padding: 20px; max-width: 800px; margin: 0 auto; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #333; padding-bottom: 12px; margin-bottom: 16px; }
  .header h1 { font-size: 18pt; font-weight: 700; }
  .header .meta { text-align: right; font-size: 9pt; color: #666; }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 3px; font-size: 10pt; font-weight: 700; color: #fff; background: ${statusColor}; }
  .result-box { background: #f5f5f5; border: 2px solid ${statusColor}; border-radius: 6px; padding: 16px; margin: 16px 0; text-align: center; }
  .result-box .thickness { font-size: 36pt; font-weight: 800; color: ${statusColor}; }
  .result-box .unit { font-size: 14pt; }
  .result-box .sub { font-size: 10pt; color: #666; margin-top: 4px; }
  h2 { font-size: 13pt; font-weight: 700; margin: 18px 0 8px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
  table { width: 100%; border-collapse: collapse; margin: 8px 0; }
  th, td { border: 1px solid #ccc; padding: 5px 8px; text-align: left; font-size: 10pt; }
  th { background: #f0f0f0; font-weight: 600; }
  .step { margin: 10px 0; padding: 8px 12px; border-left: 3px solid #999; background: #fafafa; page-break-inside: avoid; }
  .step.pass { border-left-color: #2d8a4e; }
  .step.fail { border-left-color: #c0392b; }
  .step.warning { border-left-color: #b86e00; }
  .step.info { border-left-color: #2563eb; }
  .step h3 { font-size: 10pt; font-weight: 700; margin-bottom: 4px; }
  .step p { font-size: 9pt; color: #555; }
  .step .formula { font-family: 'Courier New', monospace; font-size: 9pt; background: #eee; padding: 2px 6px; border-radius: 2px; display: inline-block; margin: 4px 0; }
  .step .vals { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 16px; margin: 4px 0; }
  .step .vals span { font-size: 9pt; }
  .step .result-line { font-weight: 700; font-size: 10pt; margin-top: 4px; padding-top: 4px; border-top: 1px solid #ddd; }
  .disclaimer { margin-top: 24px; padding: 10px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px; font-size: 9pt; }
  .footer { margin-top: 20px; text-align: center; font-size: 8pt; color: #999; border-top: 1px solid #ddd; padding-top: 8px; }
  @media print {
    body { padding: 0; }
    .no-print { display: none; }
  }
</style>
</head>
<body>
<div class="no-print" style="text-align:center;margin-bottom:16px;">
  <button onclick="window.print()" style="padding:10px 24px;font-size:14pt;font-weight:700;background:#c0392b;color:#fff;border:none;border-radius:6px;cursor:pointer;">
    Print / Save as PDF
  </button>
</div>

<div class="header">
  <div>
    <h1>BRE470 Platform Design Report</h1>
    <p style="font-size:10pt;color:#666;">Working Platforms for Tracked Plant — BR 470 (BRE 2004)</p>
  </div>
  <div class="meta">
    <div>Date: ${dateStr}</div>
    <div>Time: ${timeStr}</div>
    <div style="margin-top:4px;"><span class="badge">${statusLabel}</span></div>
  </div>
</div>

<div class="result-box">
  <div style="font-size:10pt;color:#666;text-transform:uppercase;letter-spacing:1px;">Design Platform Thickness</div>
  ${result.designThicknessMm > 0
    ? `<div class="thickness">${result.designThicknessMm}<span class="unit"> mm</span></div>
       <div class="sub">(${result.designThickness} m)${result.reinforcedThickness !== undefined ? ` | Unreinforced: ${Math.ceil((result.unreinforcedThickness * 1000) / 25) * 25} mm` : ''}</div>`
    : `<div style="font-size:16pt;font-weight:700;color:${statusColor};">${result.platformRequired ? 'DESIGN FAILED' : 'NO PLATFORM REQUIRED'}</div>`
  }
  <div class="sub" style="margin-top:8px;">${result.summary}</div>
</div>

<h2>Design Inputs</h2>
<table>
  <tr><th style="width:50%;">Parameter</th><th>Value</th></tr>
  ${inputRows}
</table>

<h2>Calculation Steps</h2>
${stepRows}

<div class="disclaimer">
  <strong>Important:</strong> This tool implements the routine design calculations from BRE470 Appendix A. It is intended for preliminary design purposes only. All designs must be reviewed and approved by a competent geotechnical engineer. Slopes greater than 1 in 10 require specialist design not covered by this guide.
</div>

<div class="footer">
  BRE470 Piling Mat Designer — Generated ${dateStr} ${timeStr}<br>
  Based on BR 470 (BRE 2004): Working Platforms for Tracked Plant
</div>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}

function buildInputRows(inputs: ReportInputs): string {
  const rows: [string, string][] = [
    ['Subgrade Type', inputs.subgradeType === 'cohesive' ? 'Cohesive (Clay/Silt)' : 'Granular (Sand/Gravel)'],
  ];

  if (inputs.subgradeType === 'cohesive') {
    rows.push(['Undrained Shear Strength (cu)', `${inputs.cu} kPa`]);
  } else {
    rows.push(['Subgrade φ\'', `${inputs.phiSubgrade}°`]);
    rows.push(['Subgrade Effective Unit Weight (γ\'s)', `${inputs.gammaSubgrade} kN/m³`]);
    rows.push(['Water Table Near Surface', inputs.waterTableNear ? 'Yes' : 'No']);
  }

  rows.push(
    ['Platform φ\'', `${inputs.phiPlatform}°`],
    ['Platform Bulk Unit Weight (γp)', `${inputs.gammaPlatform} kN/m³`],
    ['Track Width (W)', `${inputs.W} m`],
    ['Track Length L1 (Case 1)', `${inputs.L1} m`],
    ['Track Length L2 (Case 2)', `${inputs.L2} m`],
    ['Case 1 Loading (q1k)', `${inputs.q1k} kPa`],
    ['Case 2 Loading (q2k)', `${inputs.q2k} kPa`],
    ['Geosynthetic Reinforcement', inputs.useReinforcement ? `Yes (Tult = ${inputs.Tult} kN/m)` : 'No'],
  );

  return rows.map(([param, val]) => `<tr><td>${param}</td><td><strong>${val}</strong></td></tr>`).join('');
}

function renderStep(step: CalculationStep): string {
  const valEntries = Object.entries(step.values)
    .map(([k, v]) => `<span>${k}: <strong>${String(v)}</strong></span>`)
    .join('');

  return `<div class="step ${step.status}">
    <h3>${step.title}</h3>
    <p>${step.description}</p>
    ${step.formula ? `<div class="formula">${step.formula}</div>` : ''}
    <div class="vals">${valEntries}</div>
    <div class="result-line">Result: ${String(step.result)} ${step.unit}</div>
  </div>`;
}
