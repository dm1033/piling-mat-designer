/**
 * Calculator Page - BRE470 Working Platform Design Tool
 * Design: "Site Engineer's Companion" - step-by-step card flow
 * Large inputs, clear status indicators, mobile-optimized
 * 
 * Access modes:
 * 1. Paid user → full unlimited access
 * 2. Guest/unpaid → one free demo calculation, then paywall
 */
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import {
  HardHat, ArrowLeft, ChevronDown, ChevronUp, Calculator as CalcIcon,
  CheckCircle2, AlertTriangle, XCircle, Info, RotateCcw, Printer, Sparkles
} from "lucide-react";
import CrossSection from "@/components/CrossSection";
import RigSelector from "@/components/RigSelector";
import DemoUpsell from "@/components/DemoUpsell";
import {
  calculateDesign,
  type DesignInputs,
  type CohesiveInputs,
  type GranularInputs,
  type DesignResult,
  type CalculationStep,
  CU_QUALITATIVE,
} from "@/lib/bre470-calc";
import { type PilingRig } from "@/lib/rig-database";
import { exportReport } from "@/lib/export-report";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useDemoMode } from "@/hooks/useDemoMode";

type SubgradeType = "cohesive" | "granular";

export default function Calculator() {
  // Do NOT redirect unauthenticated users — allow guest demo access
  const { isAuthenticated, loading: authLoading } = useAuth();
  const accessQuery = trpc.purchase.hasAccess.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const hasPaidAccess = accessQuery.data?.hasAccess === true;
  const isLoading = authLoading || (isAuthenticated && accessQuery.isLoading);

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

  return <CalculatorInner hasPaidAccess={hasPaidAccess} />;
}

function CalculatorInner({ hasPaidAccess }: { hasPaidAccess: boolean }) {
  const { hasUsedDemo, recordDemoUse } = useDemoMode();
  const [subgradeType, setSubgradeType] = useState<SubgradeType>("cohesive");
  const [useReinforcement, setUseReinforcement] = useState(false);
  const [waterTableNear, setWaterTableNear] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  // Cohesive inputs
  const [cu, setCu] = useState<string>("40");
  const [phiPlatform, setPhiPlatform] = useState<string>("40");
  const [gammaPlatform, setGammaPlatform] = useState<string>("20");
  const [W, setW] = useState<string>("0.7");
  const [L1, setL1] = useState<string>("3.6");
  const [L2, setL2] = useState<string>("3.1");
  const [q1k, setQ1k] = useState<string>("140");
  const [q2k, setQ2k] = useState<string>("190");
  const [Tult, setTult] = useState<string>("30");

  // Granular-specific inputs
  const [phiSubgrade, setPhiSubgrade] = useState<string>("35");
  const [gammaSubgrade, setGammaSubgrade] = useState<string>("20");

  // Rig selector state
  const [selectedRigId, setSelectedRigId] = useState<string | undefined>(undefined);
  const [inputMode, setInputMode] = useState<"rig" | "manual">("rig");

  const [result, setResult] = useState<DesignResult | null>(null);
  const [demoLocked, setDemoLocked] = useState(false);

  const handleRigSelect = useCallback((rig: PilingRig) => {
    setSelectedRigId(rig.id);
    setW(String(rig.W));
    setL1(String(rig.L1));
    setL2(String(rig.L2));
    setQ1k(String(rig.q1k));
    setQ2k(String(rig.q2k));
  }, []);

  const handleRigClear = useCallback(() => {
    setSelectedRigId(undefined);
  }, []);

  const handleCalculate = useCallback(() => {
    // If not paid and already used demo, block
    if (!hasPaidAccess && hasUsedDemo) {
      setDemoLocked(true);
      setTimeout(() => {
        document.getElementById("demo-upsell")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }

    let inputs: DesignInputs;

    if (subgradeType === "cohesive") {
      inputs = {
        subgradeType: "cohesive",
        cu: parseFloat(cu) || 0,
        phiPlatform: parseFloat(phiPlatform) || 0,
        gammaPlatform: parseFloat(gammaPlatform) || 0,
        W: parseFloat(W) || 0,
        L1: parseFloat(L1) || 0,
        L2: parseFloat(L2) || 0,
        q1k: parseFloat(q1k) || 0,
        q2k: parseFloat(q2k) || 0,
        useReinforcement,
        Tult: useReinforcement ? parseFloat(Tult) || 0 : undefined,
      } as CohesiveInputs;
    } else {
      inputs = {
        subgradeType: "granular",
        phiSubgrade: parseFloat(phiSubgrade) || 0,
        gammaSubgrade: parseFloat(gammaSubgrade) || 0,
        phiPlatform: parseFloat(phiPlatform) || 0,
        gammaPlatform: parseFloat(gammaPlatform) || 0,
        W: parseFloat(W) || 0,
        L1: parseFloat(L1) || 0,
        L2: parseFloat(L2) || 0,
        q1k: parseFloat(q1k) || 0,
        q2k: parseFloat(q2k) || 0,
        waterTableNear,
        useReinforcement,
        Tult: useReinforcement ? parseFloat(Tult) || 0 : undefined,
      } as GranularInputs;
    }

    const res = calculateDesign(inputs);
    setResult(res);
    setShowSteps(false);

    // Record demo use for non-paid users
    if (!hasPaidAccess) {
      const isNowLocked = recordDemoUse();
      setDemoLocked(isNowLocked);
    }

    // Scroll to results
    setTimeout(() => {
      document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [subgradeType, cu, phiPlatform, gammaPlatform, W, L1, L2, q1k, q2k, useReinforcement, Tult, phiSubgrade, gammaSubgrade, waterTableNear, hasPaidAccess, hasUsedDemo, recordDemoUse]);

  const handleExport = useCallback(() => {
    if (!result) return;
    exportReport({
      subgradeType,
      cu: subgradeType === 'cohesive' ? parseFloat(cu) || 0 : undefined,
      phiSubgrade: subgradeType === 'granular' ? parseFloat(phiSubgrade) || 0 : undefined,
      gammaSubgrade: subgradeType === 'granular' ? parseFloat(gammaSubgrade) || 0 : undefined,
      phiPlatform: parseFloat(phiPlatform) || 0,
      gammaPlatform: parseFloat(gammaPlatform) || 0,
      W: parseFloat(W) || 0,
      L1: parseFloat(L1) || 0,
      L2: parseFloat(L2) || 0,
      q1k: parseFloat(q1k) || 0,
      q2k: parseFloat(q2k) || 0,
      useReinforcement,
      Tult: useReinforcement ? parseFloat(Tult) || 0 : undefined,
      waterTableNear: subgradeType === 'granular' ? waterTableNear : undefined,
    }, result);
  }, [result, subgradeType, cu, phiSubgrade, gammaSubgrade, phiPlatform, gammaPlatform, W, L1, L2, q1k, q2k, useReinforcement, Tult, waterTableNear]);

  const handleReset = useCallback(() => {
    setResult(null);
    setShowSteps(false);
    setDemoLocked(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Determine if the calculate button should be blocked
  const isBlocked = !hasPaidAccess && hasUsedDemo && !result;

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
            <span className="font-heading font-bold text-sm">BRE470 Designer</span>
          </div>
        </div>
      </header>

      {/* Demo Banner for non-paid users */}
      {!hasPaidAccess && !hasUsedDemo && (
        <div className="bg-primary/10 border-b border-primary/20">
          <div className="container py-2.5 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <p className="text-sm font-medium text-primary">
              Free demo — try one calculation before you buy
            </p>
          </div>
        </div>
      )}

      <main className="flex-1 pb-32">
        <div className="container py-6 space-y-6">
          {/* Title */}
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold">Platform Design</h1>
            <p className="text-muted-foreground mt-1">Enter site parameters below</p>
          </div>

          {/* Step 1: Subgrade Type */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <StepBadge n={1} />
                Subgrade Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSubgradeType("cohesive")}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    subgradeType === "cohesive"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <div className="font-heading font-semibold text-base">Cohesive</div>
                  <div className="text-sm text-muted-foreground mt-1">Clay / Silt</div>
                  <div className="text-xs text-muted-foreground mt-0.5">cu: 20-80 kPa</div>
                </button>
                <button
                  onClick={() => setSubgradeType("granular")}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    subgradeType === "granular"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <div className="font-heading font-semibold text-base">Granular</div>
                  <div className="text-sm text-muted-foreground mt-1">Sand / Gravel</div>
                  <div className="text-xs text-muted-foreground mt-0.5">φ' based</div>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Ground Conditions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <StepBadge n={2} />
                Ground Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subgradeType === "cohesive" ? (
                <>
                  <FieldGroup
                    label="Undrained Shear Strength (cu)"
                    unit="kPa"
                    value={cu}
                    onChange={setCu}
                    hint="Valid range: 20-80 kPa"
                    type="number"
                    min={0}
                    max={200}
                  />
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Quick reference (Table B1):</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(CU_QUALITATIVE).map(([key, { range, cuk }]) => (
                        <QuickBtn
                          key={key}
                          label={`${key.replace('_', ' ')} (${cuk} kPa)`}
                          onClick={() => setCu(String(cuk))}
                          active={cu === String(cuk)}
                        />
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <FieldGroup
                    label="Angle of Shearing Resistance (φ')"
                    unit="°"
                    value={phiSubgrade}
                    onChange={setPhiSubgrade}
                    hint="Typical: 25-45°"
                    type="number"
                    min={0}
                    max={60}
                  />
                  <FieldGroup
                    label="Unit Weight of Subgrade (γ')"
                    unit="kN/m³"
                    value={gammaSubgrade}
                    onChange={setGammaSubgrade}
                    hint="Typical: 16-22 kN/m³"
                    type="number"
                    min={0}
                    max={30}
                  />
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Switch checked={waterTableNear} onCheckedChange={setWaterTableNear} />
                    <div>
                      <Label className="text-sm font-medium">Water table within depth D</Label>
                      <p className="text-xs text-muted-foreground">Reduces effective stress</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Step 3: Platform Material */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <StepBadge n={3} />
                Platform Material
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldGroup
                label="Angle of Shearing Resistance (φ'p)"
                unit="°"
                value={phiPlatform}
                onChange={setPhiPlatform}
                hint="Well-graded crushed rock: 40-45°"
                type="number"
                min={0}
                max={60}
              />
              <div className="flex flex-wrap gap-2">
                <QuickBtn label="Crushed Rock (40°)" onClick={() => setPhiPlatform("40")} active={phiPlatform === "40"} />
                <QuickBtn label="Well-graded (45°)" onClick={() => setPhiPlatform("45")} active={phiPlatform === "45"} />
                <QuickBtn label="Gravel (35°)" onClick={() => setPhiPlatform("35")} active={phiPlatform === "35"} />
              </div>
              <FieldGroup
                label="Unit Weight of Platform (γp)"
                unit="kN/m³"
                value={gammaPlatform}
                onChange={setGammaPlatform}
                hint="Typical: 18-22 kN/m³"
                type="number"
                min={0}
                max={30}
              />
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Switch checked={useReinforcement} onCheckedChange={setUseReinforcement} />
                <div>
                  <Label className="text-sm font-medium">Geosynthetic Reinforcement</Label>
                  <p className="text-xs text-muted-foreground">Reduces required thickness</p>
                </div>
              </div>
              {useReinforcement && (
                <FieldGroup
                  label="Ultimate Tensile Strength (Tult)"
                  unit="kN/m"
                  value={Tult}
                  onChange={setTult}
                  hint="From manufacturer data sheet"
                  type="number"
                  min={0}
                />
              )}
            </CardContent>
          </Card>

          {/* Step 4: Plant Loading */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <StepBadge n={4} />
                Plant Loading
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Input mode toggle */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setInputMode("rig")}
                  className={`p-3 rounded-lg border-2 text-center transition-all text-sm font-medium ${
                    inputMode === "rig"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  Select Rig
                </button>
                <button
                  onClick={() => setInputMode("manual")}
                  className={`p-3 rounded-lg border-2 text-center transition-all text-sm font-medium ${
                    inputMode === "manual"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  Manual Entry
                </button>
              </div>

              {inputMode === "rig" && (
                <RigSelector
                  selectedRigId={selectedRigId}
                  onSelect={handleRigSelect}
                  onClear={handleRigClear}
                />
              )}

              <Separator />

              <FieldGroup label="Track Width (W)" unit="m" value={W} onChange={setW} hint="Width of one track shoe" type="number" min={0} />
              <div className="grid grid-cols-2 gap-3">
                <FieldGroup label="Track Length L1" unit="m" value={L1} onChange={setL1} hint="Overall length" type="number" min={0} />
                <FieldGroup label="Track Length L2" unit="m" value={L2} onChange={setL2} hint="Loaded length" type="number" min={0} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FieldGroup label="Track Pressure q1k" unit="kPa" value={q1k} onChange={setQ1k} hint="Max (outrigger)" type="number" min={0} />
                <FieldGroup label="Track Pressure q2k" unit="kPa" value={q2k} onChange={setQ2k} hint="Max (slewing)" type="number" min={0} />
              </div>
            </CardContent>
          </Card>

          {/* Demo Upsell - shown when blocked */}
          {isBlocked && (
            <div id="demo-upsell">
              <DemoUpsell hasUsedDemo={hasUsedDemo} />
            </div>
          )}

          {/* Calculate Button */}
          <Button
            size="lg"
            onClick={handleCalculate}
            className={`w-full h-16 text-lg font-heading font-bold ${isBlocked ? "opacity-50" : ""}`}
          >
            <CalcIcon className="w-6 h-6 mr-2" />
            {isBlocked ? "Purchase to Calculate Again" : "Calculate Platform Thickness"}
          </Button>

          {/* Results */}
          {result && (
            <div id="results-section" className="space-y-4">
              <Separator />

              {/* Summary Card */}
              <Card className={`border-l-4 ${
                result.status === 'pass' ? 'border-l-success' :
                result.status === 'warning' ? 'border-l-warning' :
                'border-l-destructive'
              }`}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    {result.status === 'pass' && <CheckCircle2 className="w-8 h-8 text-success flex-shrink-0" />}
                    {result.status === 'warning' && <AlertTriangle className="w-8 h-8 text-warning flex-shrink-0" />}
                    {result.status === 'fail' && <XCircle className="w-8 h-8 text-destructive flex-shrink-0" />}
                    <div>
                      <h3 className="font-heading text-xl font-bold mb-1">
                        {result.platformRequired ? 'Platform Required' : 'No Platform Required'}
                      </h3>
                      <p className="text-muted-foreground">{result.summary}</p>
                    </div>
                  </div>

                  {result.designThicknessMm > 0 && (
                    <div className="mt-6 p-6 rounded-xl bg-muted/50 text-center">
                      <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Design Thickness</p>
                      <p className="font-heading text-5xl sm:text-6xl font-bold text-primary mt-2">
                        {result.designThicknessMm}
                        <span className="text-2xl ml-1">mm</span>
                      </p>
                      <p className="text-muted-foreground mt-2">
                        ({result.designThickness} m)
                        {result.reinforcedThickness !== undefined && (
                          <span className="ml-2">| Unreinforced: {Math.ceil((result.unreinforcedThickness * 1000) / 25) * 25} mm</span>
                        )}
                      </p>
                    </div>
                  )}

                  {/* Export Button - only for paid users */}
                  {hasPaidAccess && (
                    <div className="mt-4 flex justify-center">
                      <Button variant="outline" size="lg" onClick={handleExport} className="gap-2">
                        <Printer className="w-5 h-5" />
                        Export / Print Report
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Cross-Section Diagram */}
              {result.designThicknessMm > 0 && (
                <CrossSection
                  thickness={result.designThicknessMm}
                  trackWidth={parseFloat(W) || 0.7}
                  subgradeType={subgradeType}
                  useReinforcement={useReinforcement}
                />
              )}

              {/* Demo Upsell after results for non-paid users */}
              {!hasPaidAccess && demoLocked && (
                <div id="demo-upsell">
                  <DemoUpsell hasUsedDemo={true} />
                </div>
              )}

              {/* Calculation Steps - only for paid users */}
              {hasPaidAccess ? (
                <Card>
                  <CardHeader className="pb-3">
                    <button
                      onClick={() => setShowSteps(!showSteps)}
                      className="flex items-center justify-between w-full"
                    >
                      <CardTitle className="font-heading text-lg flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        Calculation Steps
                      </CardTitle>
                      {showSteps ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </CardHeader>
                  {showSteps && (
                    <CardContent className="space-y-4">
                      {result.steps.map((step) => (
                        <StepCard key={step.title} step={step} />
                      ))}
                    </CardContent>
                  )}
                </Card>
              ) : (
                <Card className="border border-dashed border-muted-foreground/30">
                  <CardContent className="pt-6 text-center">
                    <Info className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Full calculation steps and export available with purchase
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Reset */}
              <Button variant="outline" size="lg" onClick={handleReset} className="w-full h-14">
                <RotateCcw className="w-5 h-5 mr-2" />
                New Calculation
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────

function StepBadge({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex-shrink-0">
      {n}
    </span>
  );
}

function FieldGroup({
  label, unit, value, onChange, hint, type = "number", min, max,
}: {
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  type?: string;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <Label className="text-sm font-medium mb-1.5 block">{label}</Label>
      <div className="relative">
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-16 text-lg h-12 font-mono"
          min={min}
          max={max}
          step="any"
          inputMode="decimal"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
          {unit}
        </span>
      </div>
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

function QuickBtn({ label, onClick, active }: { label: string; onClick: () => void; active: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded border text-sm transition-colors ${
        active
          ? "border-primary bg-primary/10 text-primary font-medium"
          : "border-border bg-card hover:bg-accent"
      }`}
    >
      {label}
    </button>
  );
}

function StepCard({ step }: { step: CalculationStep }) {
  const statusColors = {
    pass: 'border-l-success bg-success/5',
    fail: 'border-l-destructive bg-destructive/5',
    warning: 'border-l-warning bg-warning/5',
    info: 'border-l-primary bg-primary/5',
  };

  const statusIcons = {
    pass: <CheckCircle2 className="w-4 h-4 text-success" />,
    fail: <XCircle className="w-4 h-4 text-destructive" />,
    warning: <AlertTriangle className="w-4 h-4 text-warning" />,
    info: <Info className="w-4 h-4 text-primary" />,
  };

  return (
    <div className={`rounded-lg border border-border border-l-4 p-4 ${statusColors[step.status]}`}>
      <div className="flex items-center gap-2 mb-2">
        {statusIcons[step.status]}
        <h4 className="font-heading font-semibold text-sm">{step.title}</h4>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
      {step.formula && (
        <p className="text-xs font-mono bg-muted/50 rounded px-2 py-1 mb-2 inline-block">{step.formula}</p>
      )}
      <div className="space-y-1">
        {Object.entries(step.values).map(([key, val]) => (
          <div key={key} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{key}</span>
            <span className="font-mono font-medium">{String(val)}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 pt-2 border-t border-border/50 flex justify-between items-center">
        <span className="text-sm font-medium">Result:</span>
        <span className="font-mono font-bold text-base">
          {String(step.result)} {step.unit}
        </span>
      </div>
    </div>
  );
}
