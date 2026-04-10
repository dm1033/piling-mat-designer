import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, FileText, User, MapPin, Building2, Calendar, CreditCard } from "lucide-react";
import { useParams } from "wouter";
import { Link } from "wouter";

export default function AdminDesignDetail() {
  const params = useParams<{ id: string }>();
  const designId = parseInt(params.id || "0", 10);

  const { data: design, isLoading, error } = trpc.admin.designDetail.useQuery(
    { designId },
    { enabled: designId > 0 }
  );

  const formatDate = (d: Date | string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (pence: number) => `£${(pence / 100).toFixed(2)}`;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !design) {
    return (
      <div className="space-y-6">
        <Link href="/admin/designs">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Designs
          </Button>
        </Link>
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Design not found or an error occurred.
          </CardContent>
        </Card>
      </div>
    );
  }

  const inputs = design.calculationInputs as Record<string, any> | null;
  const result = design.calculationResult as Record<string, any> | null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/designs">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold tracking-tight">
            {design.certificateRef}
          </h1>
          <p className="text-muted-foreground text-sm">{design.projectName || "Untitled Project"}</p>
        </div>
      </div>

      {/* Status & Payment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <DetailRow label="Amount" value={formatPrice(design.amountPence)} />
            <DetailRow label="Currency" value={design.currency.toUpperCase()} />
            <DetailRow
              label="Status"
              value={
                <Badge
                  variant={design.paymentStatus === "completed" ? "default" : "secondary"}
                  className={
                    design.paymentStatus === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }
                >
                  {design.paymentStatus}
                </Badge>
              }
            />
            <DetailRow label="Stripe Session" value={design.stripeSessionId || "—"} mono />
            <DetailRow label="Payment Intent" value={design.stripePaymentIntentId || "—"} mono />
            <DetailRow label="Created" value={formatDate(design.createdAt)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <User className="w-4 h-4" /> Customer & Project
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <DetailRow label="Customer" value={design.user?.name || "—"} />
            <DetailRow label="Email" value={design.user?.email || "—"} />
            <DetailRow label="Role" value={design.user?.role || "—"} />
            <DetailRow label="Project" value={design.projectName || "—"} />
            <DetailRow label="Site" value={design.siteLocation || "—"} />
            <DetailRow label="Client" value={design.clientName || "—"} />
          </CardContent>
        </Card>
      </div>

      {/* Certificate Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading flex items-center gap-2">
            <FileText className="w-4 h-4" /> Certificate
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <DetailRow
            label="Issued"
            value={
              design.certificateIssued ? (
                <Badge className="bg-blue-100 text-blue-800">Yes</Badge>
              ) : (
                <Badge variant="secondary">No</Badge>
              )
            }
          />
          <DetailRow label="Issued At" value={formatDate(design.certificateIssuedAt)} />
          <DetailRow label="Designer" value={design.certificate.designer} />
          <DetailRow label="Title" value={design.certificate.title} />
          <DetailRow label="Company" value={design.certificate.company} />
          <DetailRow label="Standard" value={design.certificate.standard} />
        </CardContent>
      </Card>

      {/* Calculation Inputs */}
      {inputs && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-heading">Calculation Inputs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <DetailRow label="Subgrade Type" value={inputs.subgradeType || "—"} />
              {inputs.subgradeType === "cohesive" && (
                <DetailRow label="Undrained Shear Strength (cu)" value={inputs.cu ? `${inputs.cu} kPa` : "—"} />
              )}
              {inputs.subgradeType === "granular" && (
                <>
                  <DetailRow label="Angle of Shearing (φ')" value={inputs.phi ? `${inputs.phi}°` : "—"} />
                  <DetailRow label="Effective Stress (σ'v)" value={inputs.sigma ? `${inputs.sigma} kPa` : "—"} />
                </>
              )}
              <DetailRow label="Platform φ'p" value={inputs.phiP ? `${inputs.phiP}°` : "—"} />
              <DetailRow label="Platform γp" value={inputs.gammaP ? `${inputs.gammaP} kN/m³` : "—"} />
              <DetailRow label="Geosynthetic" value={inputs.useGeosynthetic ? "Yes" : "No"} />
              <DetailRow label="Track Width (W)" value={inputs.W ? `${inputs.W} m` : "—"} />
              <DetailRow label="Track Length L1" value={inputs.L1 ? `${inputs.L1} m` : "—"} />
              <DetailRow label="Track Length L2" value={inputs.L2 ? `${inputs.L2} m` : "—"} />
              <DetailRow label="Track Pressure q1k" value={inputs.q1k ? `${inputs.q1k} kPa` : "—"} />
              <DetailRow label="Track Pressure q2k" value={inputs.q2k ? `${inputs.q2k} kPa` : "—"} />
              {inputs.selectedRig && (
                <DetailRow label="Selected Rig" value={inputs.selectedRig} />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calculation Results */}
      {result && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-heading">Calculation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <DetailRow
                label="Required Thickness"
                value={
                  result.requiredThickness != null
                    ? `${result.requiredThickness} mm (${(result.requiredThickness / 1000).toFixed(2)} m)`
                    : "—"
                }
              />
              <DetailRow
                label="Platform Required"
                value={result.platformRequired ? "Yes" : "No"}
              />
              {result.steps && Array.isArray(result.steps) && (
                <div className="col-span-full mt-4">
                  <p className="font-medium mb-2">Calculation Steps:</p>
                  <div className="space-y-1 text-xs font-mono bg-muted/50 rounded-lg p-4 max-h-64 overflow-y-auto">
                    {result.steps.map((step: any, i: number) => (
                      <div key={i} className="py-0.5">
                        <span className="text-muted-foreground mr-2">{i + 1}.</span>
                        <span className="font-medium">{step.label}:</span>{" "}
                        <span>{step.formula}</span>{" "}
                        <span className="text-primary font-medium">= {step.result}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className={`text-right ${mono ? "font-mono text-xs break-all" : "font-medium"}`}>
        {value}
      </span>
    </div>
  );
}
