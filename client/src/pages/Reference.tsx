/**
 * Reference Page - BRE470 Design Tables and Guidance
 * Design: "Site Engineer's Companion" - quick-reference cards
 */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, HardHat, BookOpen, Calculator } from "lucide-react";

const TRACKED_PLANT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663349554749/hMJrHrZWZ2XC9JAvjXeKjs/tracked-plant-gPnkM3EukEYj6rsemarWLR.webp";

export default function Reference() {
  // Reference page is now freely accessible (no paywall)
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
              <HardHat className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-sm">BRE470 Reference</span>
          </div>
          <Link href="/calculator">
            <Button size="sm" className="text-sm">
              <Calculator className="w-4 h-4 mr-1" /> Design Tool
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 pb-16">
        <div className="container py-6 space-y-6">
          {/* Title */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">BR 470 (BRE 2004)</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold">Design Reference Tables</h1>
            <p className="text-muted-foreground mt-1">Quick reference for BRE470 design parameters</p>
          </div>

          {/* Image */}
          <div className="rounded-lg overflow-hidden border border-border">
            <img
              src={TRACKED_PLANT_IMG}
              alt="Tracked piling rig on working platform"
              className="w-full h-48 sm:h-64 object-cover"
            />
          </div>

          {/* Table A1 */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Table A1 — Bearing Capacity Factor Nγ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Values of Nγ for use in bearing resistance calculations. Interpolate for intermediate values.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-border">
                      <th className="text-left py-2 px-3 font-heading font-semibold">φ'd (°)</th>
                      <th className="text-right py-2 px-3 font-heading font-semibold">Nγ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      [25, 10.9],
                      [30, 22.4],
                      [35, 48.0],
                      [40, 109.0],
                      [45, 272.0],
                      [50, 763.0],
                    ].map(([phi, ng]) => (
                      <tr key={phi} className="border-b border-border/50">
                        <td className="py-2.5 px-3 font-mono">{phi}°</td>
                        <td className="py-2.5 px-3 text-right font-mono font-medium">{ng}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Table A2 */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Table A2 — Punching Shear Coefficient Kp·tanδ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Values for the platform material. Used in platform thickness calculations.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-border">
                      <th className="text-left py-2 px-3 font-heading font-semibold">φ'd (°)</th>
                      <th className="text-right py-2 px-3 font-heading font-semibold">Kp·tanδ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      [35, 3.1],
                      [40, 5.5],
                      [45, 10.0],
                    ].map(([phi, kp]) => (
                      <tr key={phi} className="border-b border-border/50">
                        <td className="py-2.5 px-3 font-mono">{phi}°</td>
                        <td className="py-2.5 px-3 text-right font-mono font-medium">{kp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Table A3 */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Table A3 — Loading Factors (γq)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Partial factors applied to characteristic loading values.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-border">
                      <th className="text-left py-2 px-3 font-heading font-semibold">Loading</th>
                      <th className="text-right py-2 px-3 font-heading font-semibold">No Platform</th>
                      <th className="text-right py-2 px-3 font-heading font-semibold">With Platform</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-2.5 px-3 font-medium">Case 1</td>
                      <td className="py-2.5 px-3 text-right font-mono">2.0</td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium">1.6</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2.5 px-3 font-medium">Case 2</td>
                      <td className="py-2.5 px-3 text-right font-mono">1.5</td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium">1.2</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-3 p-3 bg-muted/50 rounded-lg text-sm space-y-1">
                <p><strong>Case 1:</strong> Operator UNLIKELY to aid recovery from imminent failure — standing, travelling, crane mode, lifting precast pile, handling casings/cages.</p>
                <p><strong>Case 2:</strong> Operator CAN control load safely — installing casing, drilling, extracting auger/casing, travelling with fixed mast and fixed load close to surface.</p>
              </div>
            </CardContent>
          </Card>

          {/* Table B1 */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Table B1 — Characteristic cu from Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Undrained shear strength based on qualitative description of cohesive subgrade.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-border">
                      <th className="text-left py-2 px-3 font-heading font-semibold">Quality</th>
                      <th className="text-right py-2 px-3 font-heading font-semibold">Range (kPa)</th>
                      <th className="text-right py-2 px-3 font-heading font-semibold">cuk (kPa)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Very soft', '< 20', '10'],
                      ['Soft', '20 – 40', '20'],
                      ['Firm', '40 – 75', '40'],
                      ['Stiff', '75 – 150', '80'],
                    ].map(([q, r, c]) => (
                      <tr key={q} className="border-b border-border/50">
                        <td className="py-2.5 px-3 font-medium">{q}</td>
                        <td className="py-2.5 px-3 text-right font-mono">{r}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-medium">{c}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Note: Very soft subgrade (cu &lt; 20 kPa) is outside the valid range for this design method.
              </p>
            </CardContent>
          </Card>

          {/* Table B3 */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Table B3 — Typical φ' for Platform Material</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Based on particle strength and compaction level. Material with φ' &lt; 35° is unsuitable.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-border">
                      <th className="text-left py-2 px-3 font-heading font-semibold">Particle Strength</th>
                      <th className="text-center py-2 px-3 font-heading font-semibold">qc (MPa)</th>
                      <th className="text-right py-2 px-3 font-heading font-semibold">Poor Compaction</th>
                      <th className="text-right py-2 px-3 font-heading font-semibold">Heavy Compaction</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-2.5 px-3 font-medium">Weak</td>
                      <td className="py-2.5 px-3 text-center font-mono">&lt; 25</td>
                      <td className="py-2.5 px-3 text-right text-destructive">Unsuitable</td>
                      <td className="py-2.5 px-3 text-right text-destructive">Unsuitable</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2.5 px-3 font-medium">Medium</td>
                      <td className="py-2.5 px-3 text-center font-mono">25 – 50</td>
                      <td className="py-2.5 px-3 text-right font-mono">35°</td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium">40°</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2.5 px-3 font-medium">Strong</td>
                      <td className="py-2.5 px-3 text-center font-mono">&gt; 50</td>
                      <td className="py-2.5 px-3 text-right font-mono">35°</td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium">45°</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Shape Factors */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Shape Factor Equations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3">
                <FormulaRow label="Cohesive shape factor" formula="sc = 1 + 0.2 × (W / L)" />
                <FormulaRow label="Granular shape factor" formula="sγ = 1 - 0.3 × (W / L)" />
                <FormulaRow label="Punching shape factor" formula="sp = 1 + (W / L)" />
                <FormulaRow label="Bearing capacity (cohesive)" formula="Nc = (2 + π) = 5.14" />
              </div>
            </CardContent>
          </Card>

          {/* Design Formulas */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Key Design Formulas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-heading font-semibold text-sm mb-2">Cohesive Subgrade — Bearing Resistance</h4>
                <div className="bg-muted/50 rounded-lg p-3 font-mono text-sm">
                  R = cu × Nc × sc
                </div>
              </div>
              <div>
                <h4 className="font-heading font-semibold text-sm mb-2">Granular Subgrade — Bearing Resistance</h4>
                <div className="bg-muted/50 rounded-lg p-3 font-mono text-sm">
                  R = 0.5 × γ's × W × Nγs × sγ
                </div>
              </div>
              <div>
                <h4 className="font-heading font-semibold text-sm mb-2">Unreinforced Platform Thickness (Cohesive)</h4>
                <div className="bg-muted/50 rounded-lg p-3 font-mono text-sm">
                  D = √(W × (qd - cu·Nc·sc) / (γp·Kp·tanδ·sp))
                </div>
              </div>
              <div>
                <h4 className="font-heading font-semibold text-sm mb-2">Unreinforced Platform Thickness (Granular)</h4>
                <div className="bg-muted/50 rounded-lg p-3 font-mono text-sm">
                  D = √(W × (qd - 0.5·γ's·W·Nγs·sγ) / (γp·Kp·tanδ·sp))
                </div>
              </div>
              <div>
                <h4 className="font-heading font-semibold text-sm mb-2">With Geosynthetic Reinforcement</h4>
                <div className="bg-muted/50 rounded-lg p-3 font-mono text-sm">
                  Additional resistance = 2 × Td / W<br />
                  where Td = Tult / 2
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reinforcement Check Factors */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Reinforcement Verification Factors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                When using reinforcement, the unreinforced platform at the same thickness must also satisfy reduced loading:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-border">
                      <th className="text-left py-2 px-3 font-heading font-semibold">Condition</th>
                      <th className="text-right py-2 px-3 font-heading font-semibold">Factor</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-2.5 px-3">Case 1 (ignoring reinforcement)</td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium">1.25</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2.5 px-3">Case 2 (ignoring reinforcement)</td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium">1.05</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Minimum Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Minimum Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-muted/50 text-sm">
                <strong>Minimum platform thickness:</strong> Lesser of 0.5 × W or 300 mm
              </div>
              <div className="p-3 rounded-lg bg-muted/50 text-sm">
                <strong>Minimum cover to reinforcement:</strong> 300 mm
              </div>
              <div className="p-3 rounded-lg bg-muted/50 text-sm">
                <strong>Rounding:</strong> Round up to nearest 25 mm
              </div>
              <div className="p-3 rounded-lg bg-muted/50 text-sm">
                <strong>Edge distance:</strong> Minimum half machine width from platform edge
              </div>
              <div className="p-3 rounded-lg bg-muted/50 text-sm">
                <strong>Access ramps:</strong> Extra 50% of design thickness
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="border-warning/30 bg-warning/5">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                <strong>Important:</strong> This tool implements the routine design calculations from BRE470 Appendix A.
                It is intended for preliminary design purposes. All designs must be reviewed and approved by a
                competent geotechnical engineer. Slopes greater than 1 in 10 require specialist design not covered
                by this guide. The design method contains simplifying assumptions and cannot fully represent actual
                soil behaviour.
              </p>
            </CardContent>
          </Card>

          {/* CTA */}
          <Link href="/calculator">
            <Button size="lg" className="w-full h-14 text-base font-heading font-bold">
              <Calculator className="w-5 h-5 mr-2" />
              Open Design Tool
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

function FormulaRow({ label, formula }: { label: string; formula: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 p-2 rounded bg-muted/30">
      <span className="text-sm text-muted-foreground min-w-[200px]">{label}:</span>
      <span className="font-mono text-sm font-medium">{formula}</span>
    </div>
  );
}
