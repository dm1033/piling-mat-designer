import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, FileCheck, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

interface DemoUpsellProps {
  /** Whether the user has already used their free calculation */
  hasUsedDemo: boolean;
}

export default function DemoUpsell({ hasUsedDemo }: DemoUpsellProps) {
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
              You've used your free demo calculation
            </h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              To get a professional design certificate with full calculations signed by David Miller, purchase a design below.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-lg mx-auto">
            <div className="flex items-start gap-2 p-2">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="text-sm">Full BRE470 calculations</span>
            </div>
            <div className="flex items-start gap-2 p-2">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="text-sm">Signed check certificate</span>
            </div>
            <div className="flex items-start gap-2 p-2">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="text-sm">Unique reference number</span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="pt-2">
            <div className="mb-3">
              <span className="font-heading text-4xl font-bold text-primary">£299.99</span>
              <span className="text-muted-foreground ml-2">per design</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/#pricing">
                <Button size="lg" className="h-14 px-10 text-lg font-heading font-bold gap-2">
                  <FileCheck className="w-5 h-5" />
                  Learn More
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Traditional consultancy: £500–£1,000. Save 50-70% with our tool.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
