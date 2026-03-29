/**
 * Payment Success Page
 * Shown after successful Stripe checkout
 */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { CheckCircle2, Calculator, Share2, ArrowRight, HardHat } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";

export default function PaymentSuccess() {
  const utils = trpc.useUtils();

  // Invalidate access query so the app reflects the new purchase
  useEffect(() => {
    utils.purchase.hasAccess.invalidate();
    utils.auth.me.invalidate();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-14">
          <Link href="/">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                <HardHat className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-lg tracking-tight">BRE470</span>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container max-w-lg">
          <Card className="border-success/30">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
              <h1 className="font-heading text-3xl font-bold mb-3">Payment Successful!</h1>
              <p className="text-muted-foreground text-lg mb-8">
                Thank you for your purchase. You now have lifetime access to the BRE470 Piling Mat Designer.
              </p>

              <div className="space-y-3">
                <Link href="/calculator">
                  <Button size="lg" className="w-full h-14 text-base font-bold">
                    <Calculator className="w-5 h-5 mr-2" /> Start Designing
                  </Button>
                </Link>
                <Link href="/account">
                  <Button variant="outline" size="lg" className="w-full h-14 text-base">
                    <Share2 className="w-5 h-5 mr-2" /> Share Access With Your Teams
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-muted-foreground mt-6">
                Go to your <Link href="/account" className="text-primary underline">Account page</Link> to generate access codes for your construction companies.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
