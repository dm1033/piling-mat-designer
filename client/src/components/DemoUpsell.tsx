import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, ShoppingCart, Zap, Share2, BookOpen } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { Link } from "wouter";

interface DemoUpsellProps {
  /** Whether the user has already used their free calculation */
  hasUsedDemo: boolean;
}

export default function DemoUpsell({ hasUsedDemo }: DemoUpsellProps) {
  const { isAuthenticated } = useAuth();
  const createCheckout = trpc.purchase.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        toast.info("Redirecting to checkout...");
        window.open(data.checkoutUrl, "_blank");
      }
    },
    onError: () => {
      toast.error("Failed to start checkout. Please try again.");
    },
  });

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    createCheckout.mutate({ planId: "individual", interval: "month" });
  };

  if (!hasUsedDemo) return null;

  return (
    <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-primary" />
          </div>

          <div>
            <h3 className="font-heading text-xl font-bold">
              You've used your free calculation
            </h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              Subscribe to unlock unlimited BRE470 calculations, export reports, and share with your project team.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-lg mx-auto">
            <div className="flex items-start gap-2 p-2">
              <Zap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="text-sm">Unlimited calculations</span>
            </div>
            <div className="flex items-start gap-2 p-2">
              <Share2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="text-sm">Share with your team</span>
            </div>
            <div className="flex items-start gap-2 p-2">
              <BookOpen className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="text-sm">Full BRE470 reference</span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="pt-2">
            <div className="mb-3">
              <span className="font-heading text-4xl font-bold text-primary">£9.99</span>
              <span className="text-muted-foreground ml-2">/month</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                onClick={handleSubscribe}
                disabled={createCheckout.isPending}
                className="h-14 px-10 text-lg font-heading font-bold gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {createCheckout.isPending ? "Processing..." : "Subscribe Now"}
              </Button>
              <Link href="/#pricing">
                <Button variant="outline" size="lg" className="h-14 px-8 text-sm">
                  View All Plans
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Plans from £9.99/month. Team &amp; Enterprise plans available. Cancel anytime.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
