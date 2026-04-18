/**
 * CPD Payment Success Page
 * Shown after successful Stripe Checkout for a CPD presentation booking
 * Validates session_id and cpd_id from URL params
 */
import { Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {
  CheckCircle2,
  ArrowLeft,
  Calculator,
  GraduationCap,
  HardHat,
  Mail,
  Calendar,
  Building2,
  AlertTriangle,
  Loader2,
} from "lucide-react";

export default function CpdSuccess() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const cpdId = params.get("cpd_id");
  const sessionId = params.get("session_id");

  const { data: cpd, isLoading, error } = trpc.cpd.get.useQuery(
    { cpdId: Number(cpdId) },
    { enabled: !!cpdId && !!sessionId, retry: false }
  );

  // Missing parameters — invalid URL
  if (!cpdId || !sessionId) {
    return (
      <PageShell>
        <Card className="text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-12 h-12 text-yellow-500" />
            </div>
            <h1 className="text-2xl font-heading font-bold mb-2">Invalid Link</h1>
            <p className="text-muted-foreground mb-6">
              This page requires a valid booking reference. If you've just completed a payment,
              please check your email for confirmation.
            </p>
            <NavButtons />
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  // Loading
  if (isLoading) {
    return (
      <PageShell>
        <Card className="text-center">
          <CardContent className="pt-12 pb-12">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your booking details...</p>
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  // Error or not found
  if (error || !cpd) {
    return (
      <PageShell>
        <Card className="text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-12 h-12 text-yellow-500" />
            </div>
            <h1 className="text-2xl font-heading font-bold mb-2">Booking Not Found</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find this booking. If you've just completed payment, it may take a moment
              to process. Please try refreshing, or contact us if the issue persists.
            </p>
            <NavButtons />
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  // Success
  return (
    <PageShell>
      <Card className="text-center">
        <CardContent className="pt-8 pb-8">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>

          <h1 className="text-2xl font-heading font-bold mb-2">
            Payment Successful
          </h1>
          <p className="text-muted-foreground mb-6">
            Your CPD presentation has been booked. David Miller will contact you within 48 hours
            to confirm the date and arrange delivery.
          </p>

          <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <GraduationCap className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="font-medium">BRE470 CPD Presentation — 1 Hour</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="w-4 h-4 flex-shrink-0" />
              <span>{cpd.companyName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span>{cpd.email}</span>
            </div>
            {cpd.preferredDate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>Preferred: {cpd.preferredDate}</span>
              </div>
            )}
            <div className="pt-2 border-t border-border mt-2">
              <p className="text-sm font-medium text-primary">Amount paid: £19.99</p>
            </div>
          </div>

          <div className="bg-blue-500/10 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>What happens next?</strong> David Miller will email you at the address provided
              to confirm the presentation date, format, and any specific topics you'd like covered.
              A CPD attendance certificate will be issued to all attendees after the session.
            </p>
          </div>

          <NavButtons />
        </CardContent>
      </Card>
    </PageShell>
  );
}

/** Shared page shell with header */
function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-14">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                <HardHat className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-lg tracking-tight">BRE470</span>
            </div>
          </Link>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-lg w-full">{children}</div>
      </div>
    </div>
  );
}

/** Shared navigation buttons */
function NavButtons() {
  return (
    <div className="flex flex-col sm:flex-row justify-center gap-3">
      <Link href="/">
        <Button variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Button>
      </Link>
      <Link href="/calculator">
        <Button>
          <Calculator className="w-4 h-4 mr-2" /> Try the Design Tool
        </Button>
      </Link>
    </div>
  );
}
