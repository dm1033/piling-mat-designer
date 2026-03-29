/**
 * Account Page - Manage access codes and sharing
 * Buyers can generate access codes to share with construction companies
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  HardHat, ArrowLeft, Share2, Copy, Plus, CheckCircle2, Clock,
  Calculator, BookOpen, Users
} from "lucide-react";

export default function Account() {
  const { user } = useAuth({ redirectOnUnauthenticated: true });
  const [companyName, setCompanyName] = useState("");

  const accessQuery = trpc.purchase.hasAccess.useQuery();
  const codesQuery = trpc.accessCode.list.useQuery();

  const createCode = trpc.accessCode.create.useMutation({
    onSuccess: (data) => {
      toast.success(`Access code created: ${data.code}`);
      setCompanyName("");
      codesQuery.refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleCreateCode = () => {
    createCode.mutate({ companyName: companyName || undefined });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  if (!accessQuery.data?.hasAccess) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <AccountHeader />
        <main className="flex-1 flex items-center justify-center py-12">
          <Card className="max-w-md">
            <CardContent className="pt-8 pb-8 text-center">
              <h2 className="font-heading text-xl font-bold mb-3">No Active Licence</h2>
              <p className="text-muted-foreground mb-6">
                Purchase the BRE470 Piling Mat Designer to access the tool and share with your teams.
              </p>
              <Link href="/">
                <Button size="lg">Go to Purchase Page</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AccountHeader />

      <main className="flex-1 pb-16">
        <div className="container py-6 space-y-6 max-w-2xl">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold">Your Account</h1>
            <p className="text-muted-foreground mt-1">
              Welcome, {user?.name || user?.email || "User"}
            </p>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-3">
            <Link href="/calculator">
              <Button variant="outline" className="w-full h-14 gap-2">
                <Calculator className="w-5 h-5" /> Design Tool
              </Button>
            </Link>
            <Link href="/reference">
              <Button variant="outline" className="w-full h-14 gap-2">
                <BookOpen className="w-5 h-5" /> Reference
              </Button>
            </Link>
          </div>

          <Separator />

          {/* Access Code Generation */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Share Access With Construction Companies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Generate unique access codes to share the BRE470 Designer with other companies involved in your works. Each code can be used once.
              </p>
              <div>
                <Label className="text-sm font-medium mb-1.5 block">Company Name (optional)</Label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. ABC Piling Ltd"
                  className="h-12"
                />
              </div>
              <Button
                onClick={handleCreateCode}
                disabled={createCode.isPending}
                className="w-full h-12"
              >
                <Plus className="w-4 h-4 mr-2" />
                {createCode.isPending ? "Generating..." : "Generate Access Code"}
              </Button>
            </CardContent>
          </Card>

          {/* Existing Codes */}
          {codesQuery.data && codesQuery.data.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Your Access Codes ({codesQuery.data.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {codesQuery.data.map((ac) => (
                  <div
                    key={ac.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      ac.isUsed ? "bg-muted/50 border-border" : "bg-card border-primary/20"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-base tracking-wider">{ac.code}</span>
                        {ac.isUsed ? (
                          <span className="inline-flex items-center gap-1 text-xs text-success bg-success/10 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Redeemed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" /> Unused
                          </span>
                        )}
                      </div>
                      {ac.companyName && (
                        <p className="text-sm text-muted-foreground mt-0.5">{ac.companyName}</p>
                      )}
                    </div>
                    {!ac.isUsed && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyCode(ac.code)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

function AccountHeader() {
  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
      <div className="container flex items-center justify-between h-14">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
            <HardHat className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-sm">BRE470 Designer</span>
        </div>
      </div>
    </header>
  );
}
