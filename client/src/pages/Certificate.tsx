/**
 * Certificate Page — Professional BRE470 Design Certificate
 * Displays the full design certificate with:
 * - Interpretive design summary
 * - Full calculation breakdown
 * - Cross-section diagram
 * - Check certificate section
 * - David Miller's signature block
 * 
 * Printable A4 format with professional styling.
 */
import { useEffect, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import {
  HardHat, ArrowLeft, Printer, Loader2, Download, FileCheck
} from "lucide-react";

export default function Certificate() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const params = useParams<{ id: string }>();
  const designId = parseInt(params.id || "0", 10);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [authLoading, isAuthenticated]);

  const designQuery = trpc.design.get.useQuery(
    { designId },
    { enabled: isAuthenticated && designId > 0 }
  );

  if (authLoading || designQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (designQuery.error || !designQuery.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive font-semibold mb-2">Certificate not found</p>
          <p className="text-muted-foreground text-sm mb-4">
            {designQuery.error?.message || "This design may not exist or payment may not be completed."}
          </p>
          <Link href="/my-designs">
            <Button variant="outline">Back to My Designs</Button>
          </Link>
        </div>
      </div>
    );
  }

  const design = designQuery.data;
  const cert = design.certificate;
  const inputs = design.calculationInputs as any;
  const result = design.calculationResult as any;
  const issuedDate = design.certificateIssuedAt
    ? new Date(design.certificateIssuedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : new Date(design.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Screen-only header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border print:hidden">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <Link href="/my-designs">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="w-4 h-4" /> My Designs
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1">
              <Printer className="w-4 h-4" /> Print / PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Certificate Content — A4 printable */}
      <main className="flex-1 py-8 print:py-0">
        <div className="container max-w-[210mm] mx-auto">
          <div className="bg-white text-black rounded-lg shadow-lg print:shadow-none print:rounded-none">
            
            {/* Certificate Header */}
            <div className="border-b-4 border-black p-8 pb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-black">
                    WORKING PLATFORM DESIGN CERTIFICATE
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    In accordance with {cert.standard}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-lg font-bold text-black">{design.certificateRef}</p>
                  <p className="text-sm text-gray-600">{issuedDate}</p>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="p-8 pb-6 border-b border-gray-300">
              <h2 className="text-lg font-bold text-black mb-4 uppercase tracking-wide">
                1. Project Details
              </h2>
              <table className="w-full text-sm">
                <tbody>
                  <DetailRow label="Project Name" value={design.projectName || "—"} />
                  <DetailRow label="Site Location" value={design.siteLocation || "—"} />
                  <DetailRow label="Client" value={design.clientName || "—"} />
                  <DetailRow label="Certificate Reference" value={design.certificateRef} />
                  <DetailRow label="Date of Issue" value={issuedDate} />
                </tbody>
              </table>
            </div>

            {/* Design Parameters */}
            <div className="p-8 pb-6 border-b border-gray-300">
              <h2 className="text-lg font-bold text-black mb-4 uppercase tracking-wide">
                2. Design Parameters
              </h2>
              
              <h3 className="text-sm font-bold text-black mb-2">2.1 Subgrade Conditions</h3>
              <table className="w-full text-sm mb-4">
                <tbody>
                  <DetailRow label="Subgrade Type" value={inputs?.subgradeType === "cohesive" ? "Cohesive (Clay/Silt)" : "Granular (Sand/Gravel)"} />
                  {inputs?.subgradeType === "cohesive" ? (
                    <DetailRow label="Undrained Shear Strength (cu)" value={`${inputs.cu} kPa`} />
                  ) : (
                    <>
                      <DetailRow label="Angle of Shearing Resistance (φ')" value={`${inputs.phiSubgrade}°`} />
                      <DetailRow label="Unit Weight of Subgrade (γ')" value={`${inputs.gammaSubgrade} kN/m³`} />
                      <DetailRow label="Water Table within Depth D" value={inputs.waterTableNear ? "Yes" : "No"} />
                    </>
                  )}
                </tbody>
              </table>

              <h3 className="text-sm font-bold text-black mb-2">2.2 Platform Material</h3>
              <table className="w-full text-sm mb-4">
                <tbody>
                  <DetailRow label="Angle of Shearing Resistance (φ'p)" value={`${inputs?.phiPlatform}°`} />
                  <DetailRow label="Unit Weight (γp)" value={`${inputs?.gammaPlatform} kN/m³`} />
                  <DetailRow label="Geosynthetic Reinforcement" value={inputs?.useReinforcement ? "Yes" : "No"} />
                  {inputs?.useReinforcement && inputs?.Tult && (
                    <DetailRow label="Ultimate Tensile Strength (Tult)" value={`${inputs.Tult} kN/m`} />
                  )}
                </tbody>
              </table>

              <h3 className="text-sm font-bold text-black mb-2">2.3 Plant Loading (EN 996)</h3>
              <table className="w-full text-sm">
                <tbody>
                  <DetailRow label="Track Width (W)" value={`${inputs?.W} m`} />
                  <DetailRow label="Track Length — Overall (L1)" value={`${inputs?.L1} m`} />
                  <DetailRow label="Track Length — Loaded (L2)" value={`${inputs?.L2} m`} />
                  <DetailRow label="Max Track Pressure — Outrigger (q1k)" value={`${inputs?.q1k} kPa`} />
                  <DetailRow label="Max Track Pressure — Slewing (q2k)" value={`${inputs?.q2k} kPa`} />
                </tbody>
              </table>
            </div>

            {/* Design Results */}
            <div className="p-8 pb-6 border-b border-gray-300">
              <h2 className="text-lg font-bold text-black mb-4 uppercase tracking-wide">
                3. Design Results
              </h2>
              
              <div className="bg-gray-50 border-2 border-black rounded-lg p-6 text-center mb-6">
                <p className="text-sm text-gray-600 uppercase tracking-wider font-medium">
                  Required Platform Thickness
                </p>
                <p className="text-5xl font-bold text-black mt-2">
                  {result?.designThicknessMm || 0} mm
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  ({result?.designThickness || 0} m)
                  {result?.reinforcedThickness !== undefined && (
                    <span> | Unreinforced: {Math.ceil(((result?.unreinforcedThickness || 0) * 1000) / 25) * 25} mm</span>
                  )}
                </p>
              </div>

              <table className="w-full text-sm">
                <tbody>
                  <DetailRow label="Platform Required" value={result?.platformRequired ? "Yes" : "No"} />
                  <DetailRow label="Design Status" value={result?.status?.toUpperCase() || "—"} />
                  <DetailRow label="Summary" value={result?.summary || "—"} />
                </tbody>
              </table>
            </div>

            {/* Calculation Steps */}
            <div className="p-8 pb-6 border-b border-gray-300">
              <h2 className="text-lg font-bold text-black mb-4 uppercase tracking-wide">
                4. Calculation Audit Trail
              </h2>
              <p className="text-xs text-gray-600 mb-4">
                Calculations performed in accordance with {cert.standard} — {cert.standardTitle}
              </p>
              
              {result?.steps?.map((step: any, idx: number) => (
                <div key={idx} className="mb-4 border border-gray-200 rounded p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-black">
                      4.{idx + 1} {step.title}
                    </h4>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      step.status === "pass" ? "bg-green-100 text-green-800" :
                      step.status === "fail" ? "bg-red-100 text-red-800" :
                      step.status === "warning" ? "bg-yellow-100 text-yellow-800" :
                      "bg-blue-100 text-blue-800"
                    }`}>
                      {step.status?.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{step.description}</p>
                  {step.formula && (
                    <p className="text-xs font-mono bg-gray-50 rounded px-2 py-1 mb-2">{step.formula}</p>
                  )}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {step.values && Object.entries(step.values).map(([key, val]: [string, any]) => (
                      <div key={key} className="flex justify-between text-xs">
                        <span className="text-gray-600">{key}</span>
                        <span className="font-mono font-medium">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-1 border-t border-gray-200 flex justify-between text-xs">
                    <span className="font-medium">Result:</span>
                    <span className="font-mono font-bold">{String(step.result)} {step.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Check Certificate / Signature Block */}
            <div className="p-8 pb-6 border-b border-gray-300">
              <h2 className="text-lg font-bold text-black mb-4 uppercase tracking-wide">
                5. Design Check Certificate
              </h2>
              
              <div className="border-2 border-black rounded-lg p-6">
                <p className="text-sm text-black mb-4">
                  I certify that this working platform design has been prepared in accordance with the guidance
                  contained in {cert.standard} — "{cert.standardTitle}". The design parameters, calculation
                  methodology, and results presented in this certificate are correct to the best of my knowledge
                  and professional judgement.
                </p>
                <p className="text-sm text-black mb-6">
                  This design is valid for the specific site conditions, plant loading, and platform material
                  properties stated in Section 2 above. Any changes to these parameters will require a new design assessment.
                </p>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="border-b-2 border-black pb-2 mb-2">
                      <p className="text-lg font-bold italic text-black">David Miller</p>
                    </div>
                    <p className="text-sm font-bold text-black">{cert.designer}</p>
                    <p className="text-sm text-gray-600">{cert.title}</p>
                    <p className="text-sm text-gray-600">{cert.company}</p>
                  </div>
                  <div>
                    <div className="border-b-2 border-black pb-2 mb-2">
                      <p className="text-lg font-bold text-black">{issuedDate}</p>
                    </div>
                    <p className="text-sm font-bold text-black">Date</p>
                    <p className="text-sm text-gray-600">Certificate Ref: {design.certificateRef}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 pt-6">
              <div className="text-xs text-gray-500 space-y-2">
                <p>
                  <strong>Disclaimer:</strong> This design certificate has been prepared using the BRE470 Piling Mat Designer tool
                  in accordance with BR 470 (BRE 2004). The Temporary Works Coordinator (TWC) must verify that the actual site
                  conditions match the design parameters before authorising installation. The platform must be inspected regularly
                  and maintained in accordance with the guidance in BR 470.
                </p>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <div>
                    <p>{cert.company}</p>
                    <p>{cert.email} | {cert.phone}</p>
                  </div>
                  <div className="text-right">
                    <p>Certificate: {design.certificateRef}</p>
                    <p>Generated: {issuedDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-gray-100">
      <td className="py-1.5 pr-4 text-gray-600 w-1/2">{label}</td>
      <td className="py-1.5 font-medium text-black">{value}</td>
    </tr>
  );
}
