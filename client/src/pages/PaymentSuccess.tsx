/**
 * Payment Success Page - Shown after successful Stripe subscription checkout
 */
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, Calculator, Users, HardHat, ArrowRight, BookOpen } from "lucide-react";

export default function PaymentSuccess() {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const accessInfo = trpc.purchase.accessInfo.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Invalidate access cache so the app reflects the new subscription
  useEffect(() => {
    utils.purchase.hasAccess.invalidate();
    utils.purchase.accessInfo.invalidate();
    utils.auth.me.invalidate();
  }, []);

  const tier = accessInfo.data?.tier || "individual";
  const tierName = tier === "enterprise" ? "Enterprise" : tier === "team" ? "Team" : "Individual";
  const canShare = tier === "team" || tier === "enterprise";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
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

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full border-2 border-success/30 shadow-lg">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl font-bold mb-2">
              Subscription Activated!
            </h1>
            <p className="text-muted-foreground text-lg mb-2">
              Your <span className="font-semibold text-foreground">{tierName}</span> plan is now active.
            </p>
            <p className="text-muted-foreground mb-8">
              You now have full access to the BRE470 Piling Mat Designer.
            </p>

            <div className="space-y-3 mb-8">
              <Link href="/calculator">
                <Button size="lg" className="w-full h-14 text-base font-bold gap-2">
                  <Calculator className="w-5 h-5" />
                  Start Designing <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>

              <Link href="/reference">
                <Button variant="outline" size="lg" className="w-full h-12 text-sm gap-2">
                  <BookOpen className="w-4 h-4" />
                  View BRE470 Reference
                </Button>
              </Link>

              {canShare && (
                <Link href="/account">
                  <Button variant="outline" size="lg" className="w-full h-12 text-sm gap-2">
                    <Users className="w-4 h-4" />
                    Generate Access Codes for Your Team
                  </Button>
                </Link>
              )}
            </div>

            {canShare && (
              <p className="text-sm text-muted-foreground">
                As a {tierName} subscriber, you can generate access codes from your Account page to share with construction companies on your project.
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
