/**
 * Payment Success Page — Per-design certificate model
 * Shows after Stripe checkout completes for a £299.99 design purchase.
 * Displays certificate reference and links to view/download the certificate.
 */
import { useEffect, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, FileCheck, Calculator, ArrowRight, HardHat, Loader2 } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function PaymentSuccess() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const searchString = useSearch();
  const params = useMemo(() => new URLSearchParams(searchString), [searchString]);
  const designId = params.get("design_id");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [authLoading, isAuthenticated, searchString]);

  // Fetch the design details
  const designQuery = trpc.design.get.useQuery(
    { designId: parseInt(designId || "0", 10) },
    { enabled: isAuthenticated && !!designId && parseInt(designId, 10) > 0 }
  );

  // Invalidate design list cache
  const utils = trpc.useUtils();
  useEffect(() => {
    if (isAuthenticated) {
      utils.design.list.invalidate();
      utils.design.count.invalidate();
    }
  }, [isAuthenticated, utils]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const design = designQuery.data;
  const isLoading = designQuery.isLoading;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-14">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
                <HardHat className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-sm">BRE470</span>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="max-w-lg w-full border-2 border-success/30">
          <CardContent className="pt-8 pb-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>

            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold">Payment Successful!</h1>
              <p className="text-muted-foreground mt-2">
                Your BRE470 design certificate has been issued.
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading certificate details...</span>
              </div>
            ) : design ? (
              <div className="bg-muted/50 rounded-xl p-6 text-left space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Certificate Ref:</span>
                  <span className="font-mono font-bold text-primary">{design.certificateRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Project:</span>
                  <span className="font-medium">{design.projectName || "—"}</span>
                </div>
                {design.siteLocation && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Site:</span>
                    <span className="font-medium">{design.siteLocation}</span>
                  </div>
                )}
                {design.clientName && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Client:</span>
                    <span className="font-medium">{design.clientName}</span>
                  </div>
                )}
              </div>
            ) : designId ? (
              <div className="text-sm text-muted-foreground">
                Certificate is being processed. It may take a moment for payment to be confirmed.
              </div>
            ) : null}

            <div className="space-y-3">
              {design && (
                <Link href={`/certificate/${design.id}`}>
                  <Button size="lg" className="w-full h-14 text-lg font-heading font-bold gap-2">
                    <FileCheck className="w-5 h-5" />
                    View Certificate
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              )}

              <Link href="/my-designs">
                <Button variant="outline" size="lg" className="w-full h-12 gap-2">
                  <FileCheck className="w-4 h-4" />
                  My Designs
                </Button>
              </Link>

              <Link href="/calculator">
                <Button variant="ghost" size="lg" className="w-full h-12 gap-2">
                  <Calculator className="w-4 h-4" />
                  New Calculation
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
