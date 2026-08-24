/**
 * RiskPreview - on-screen draft preview of the working platform risk assessment.
 * The full formatted risk assessment is part of the paid Official Design Pack
 * (emailed as a PDF); this preview shows what the pack covers.
 */
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, ChevronDown, ChevronUp } from "lucide-react";
import {
  generateRiskAssessment,
  riskRating,
  riskBand,
  type RaInputs,
  type RaResult,
} from "@shared/risk-assessment";

interface RiskPreviewProps {
  inputs: RaInputs;
  result: RaResult;
}

const BAND_CLASSES: Record<string, string> = {
  High: "bg-destructive/10 text-destructive",
  Medium: "bg-warning/10 text-warning",
  Low: "bg-success/10 text-success",
};

export default function RiskPreview({ inputs, result }: RiskPreviewProps) {
  const [open, setOpen] = useState(false);
  const ra = useMemo(() => generateRiskAssessment(inputs, result), [inputs, result]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full">
          <CardTitle className="font-heading text-lg flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            Risk Assessment Preview
          </CardTitle>
          {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        <p className="text-xs text-muted-foreground mt-1">
          {ra.items.length} site-specific hazards identified. The full formatted risk assessment is
          included in the Official Design Pack PDF.
        </p>
      </CardHeader>
      {open && (
        <CardContent className="space-y-3">
          {ra.items.map(item => {
            const initial = riskRating(item.likelihood, item.severity);
            const residual = riskRating(item.residualLikelihood, item.residualSeverity);
            const initialBand = riskBand(initial);
            const residualBand = riskBand(residual);
            return (
              <div key={item.id} className="rounded-lg border border-border p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">
                    <span className="font-mono text-xs text-muted-foreground mr-1.5">{item.id}</span>
                    {item.hazard}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${BAND_CLASSES[initialBand]}`}>
                    Initial: {initial} ({initialBand})
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${BAND_CLASSES[residualBand]}`}>
                    Residual: {residual} ({residualBand})
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    {item.controls.length} controls
                  </span>
                </div>
              </div>
            );
          })}
          <p className="text-xs text-muted-foreground">
            Persons at risk, full control measures and general site controls are set out in the paid
            PDF risk assessment, alongside the drawings and calculations.
          </p>
        </CardContent>
      )}
    </Card>
  );
}
