/**
 * Redeem Access Code Page
 * Allows users to enter an access code shared by a buyer
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { HardHat, ArrowLeft, Lock, CheckCircle2 } from "lucide-react";

export default function Redeem() {
  useAuth({ redirectOnUnauthenticated: true });
  const [code, setCode] = useState("");
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();

  const redeemMutation = trpc.accessCode.redeem.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Access code redeemed! You now have full access.");
        utils.purchase.hasAccess.invalidate();
        setTimeout(() => setLocation("/calculator"), 1500);
      } else {
        toast.error("Invalid or already used access code");
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to redeem code");
    },
  });

  const handleRedeem = () => {
    if (!code.trim()) {
      toast.error("Please enter an access code");
      return;
    }
    redeemMutation.mutate({ code: code.trim() });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-14">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
              <HardHat className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-sm">BRE470 Designer</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container max-w-md">
          <Card>
            <CardContent className="pt-8 pb-8">
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-7 h-7 text-primary" />
                </div>
                <h1 className="font-heading text-2xl font-bold mb-2">Redeem Access Code</h1>
                <p className="text-muted-foreground">
                  Enter the access code shared with you to unlock the BRE470 Piling Mat Designer.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">Access Code</Label>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Enter your access code"
                    className="h-14 text-center font-mono text-lg tracking-widest"
                    maxLength={20}
                  />
                </div>
                <Button
                  size="lg"
                  className="w-full h-14 text-base font-bold"
                  onClick={handleRedeem}
                  disabled={redeemMutation.isPending}
                >
                  {redeemMutation.isPending ? "Redeeming..." : "Redeem Code"}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-6">
                Don't have a code? <Link href="/" className="text-primary underline">Purchase the tool</Link> or ask the project buyer for an access code.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
