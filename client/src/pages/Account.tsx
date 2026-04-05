/**
 * My Designs / Account Page — Per-design certificate model
 * Shows list of purchased design certificates with links to view each one.
 */
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import {
  HardHat, ArrowLeft, FileCheck, Calculator, BookOpen,
  Loader2, FileText, Clock, CheckCircle2
} from "lucide-react";

export default function Account() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [authLoading, isAuthenticated]);

  // Fetch user's designs
  const designsQuery = trpc.design.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const countQuery = trpc.design.count.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const designs = designsQuery.data || [];
  const totalDesigns = countQuery.data?.count || 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="w-4 h-4" /> Home
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/calculator">
              <Button variant="ghost" size="sm" className="text-sm">
                <Calculator className="w-4 h-4 mr-1" /> Calculator
              </Button>
            </Link>
            <Link href="/reference">
              <Button variant="ghost" size="sm" className="text-sm">
                <BookOpen className="w-4 h-4 mr-1" /> Reference
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-16">
        <div className="container py-6 space-y-6">
          {/* Title & User Info */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold">My Designs</h1>
              <p className="text-muted-foreground mt-1">
                {user?.name ? `${user.name} — ` : ""}
                {totalDesigns} certified design{totalDesigns !== 1 ? "s" : ""}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => logout()}>
              Sign Out
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/calculator">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="pt-4 pb-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-sm">New Design</p>
                    <p className="text-xs text-muted-foreground">Start a new BRE470 calculation</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/reference">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="pt-4 pb-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-sm">BRE470 Reference</p>
                    <p className="text-xs text-muted-foreground">Design tables and guidance</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Designs List */}
          {designsQuery.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
              <span className="text-muted-foreground">Loading designs...</span>
            </div>
          ) : designs.length === 0 ? (
            <Card>
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-heading text-lg font-bold mb-2">No designs yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Run a calculation and purchase a design certificate to see it here.
                </p>
                <Link href="/calculator">
                  <Button size="lg" className="gap-2">
                    <Calculator className="w-5 h-5" />
                    Start Your First Design
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {designs.map((design) => (
                <DesignCard key={design.id} design={design} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

interface DesignCardDesign {
  id: number;
  certificateRef: string;
  projectName: string | null;
  siteLocation: string | null;
  clientName: string | null;
  paymentStatus: string;
  certificateIssued: boolean;
  createdAt: Date;
}

function DesignCard({ design }: { design: DesignCardDesign }) {
  const isPaid = design.paymentStatus === "completed";
  const dateStr = new Date(design.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Card className={`${isPaid ? "border-success/30" : "border-warning/30"}`}>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              isPaid ? "bg-success/10" : "bg-warning/10"
            }`}>
              {isPaid ? (
                <CheckCircle2 className="w-5 h-5 text-success" />
              ) : (
                <Clock className="w-5 h-5 text-warning" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-heading font-semibold text-sm truncate">
                {design.projectName || "Untitled Project"}
              </p>
              <p className="font-mono text-xs text-primary mt-0.5">{design.certificateRef}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span>{dateStr}</span>
                {design.siteLocation && (
                  <>
                    <span>·</span>
                    <span className="truncate">{design.siteLocation}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {isPaid && (
            <Link href={`/certificate/${design.id}`}>
              <Button variant="outline" size="sm" className="gap-1 shrink-0">
                <FileCheck className="w-4 h-4" />
                View
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
