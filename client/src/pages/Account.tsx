/**
 * Account Page - Subscription management, access codes, and billing
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  HardHat, Calculator, BookOpen, Users, Copy, CheckCircle2,
  CreditCard, Shield, Clock, ArrowRight, Plus, ExternalLink
} from "lucide-react";

export default function Account() {
  const { user, isAuthenticated } = useAuth({ redirectOnUnauthenticated: true });
  const [companyName, setCompanyName] = useState("");

  const accessInfo = trpc.purchase.accessInfo.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const accessCodes = trpc.accessCode.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const createCode = trpc.accessCode.create.useMutation({
    onSuccess: (data) => {
      toast.success(`Access code created: ${data.code}`);
      setCompanyName("");
      accessCodes.refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const createPortal = trpc.purchase.createPortal.useMutation({
    onSuccess: (data) => {
      if (data.portalUrl) {
        window.open(data.portalUrl, "_blank");
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to open billing portal");
    },
  });

  const info = accessInfo.data;
  const hasAccess = info?.hasAccess === true;
  const tier = info?.tier || null;
  const tierName = tier === "enterprise" ? "Enterprise" : tier === "team" ? "Team" : tier === "individual" ? "Individual" : "None";
  const canShare = tier === "team" || tier === "enterprise";
  const maxUsers = info?.maxUsers || 0;
  const usedCodes = accessCodes.data?.filter(c => c.isUsed).length || 0;

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
          <nav className="flex items-center gap-2">
            {hasAccess && (
              <>
                <Link href="/reference">
                  <Button variant="ghost" size="sm" className="text-sm">
                    <BookOpen className="w-4 h-4 mr-1" /> Reference
                  </Button>
                </Link>
                <Link href="/calculator">
                  <Button size="sm" className="text-sm font-semibold">
                    <Calculator className="w-4 h-4 mr-1" /> Design Tool
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container max-w-3xl">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold mb-6">My Account</h1>

          {/* Subscription Status Card */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-heading text-lg font-semibold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Subscription
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {user?.name || user?.email || "User"}
                  </p>
                </div>
                {hasAccess && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active
                  </span>
                )}
              </div>

              {hasAccess ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Plan</p>
                      <p className="font-heading font-semibold text-lg">{tierName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Status</p>
                      <p className="font-semibold capitalize">{info?.status || "Active"}</p>
                    </div>
                    {info?.periodEnd && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Next Billing</p>
                        <p className="font-semibold">{new Date(info.periodEnd).toLocaleDateString("en-GB")}</p>
                      </div>
                    )}
                    {canShare && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Team Seats</p>
                        <p className="font-semibold">{usedCodes} / {maxUsers === 999 ? "Unlimited" : maxUsers}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => createPortal.mutate()}
                      disabled={createPortal.isPending}
                    >
                      <CreditCard className="w-4 h-4" />
                      {createPortal.isPending ? "Opening..." : "Manage Billing"}
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                    {tier === "individual" && (
                      <Link href="/#pricing">
                        <Button variant="outline" size="sm" className="gap-2">
                          <ArrowRight className="w-4 h-4" /> Upgrade Plan
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">You don't have an active subscription.</p>
                  <Link href="/#pricing">
                    <Button className="gap-2">
                      View Plans <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Links */}
          {hasAccess && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h2 className="font-heading text-lg font-semibold mb-4">Quick Links</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Link href="/calculator">
                    <Button variant="outline" className="w-full h-12 justify-start gap-3">
                      <Calculator className="w-5 h-5 text-primary" />
                      <span>Design Tool</span>
                    </Button>
                  </Link>
                  <Link href="/reference">
                    <Button variant="outline" className="w-full h-12 justify-start gap-3">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <span>BRE470 Reference</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Access Code Sharing - Team & Enterprise only */}
          {hasAccess && canShare && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h2 className="font-heading text-lg font-semibold flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-primary" />
                  Team Access Codes
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate access codes to share the tool with construction companies on your project.
                  {maxUsers !== 999 && ` You can share with up to ${maxUsers} users on your ${tierName} plan.`}
                </p>

                {/* Generate new code */}
                <div className="flex gap-2 mb-6">
                  <Input
                    placeholder="Company name (optional)"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="h-11"
                  />
                  <Button
                    onClick={() => createCode.mutate({ companyName: companyName || undefined })}
                    disabled={createCode.isPending}
                    className="h-11 gap-2 whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    {createCode.isPending ? "Creating..." : "Generate Code"}
                  </Button>
                </div>

                {/* Existing codes */}
                {accessCodes.data && accessCodes.data.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Generated Codes</h3>
                    {accessCodes.data.map((code) => (
                      <div
                        key={code.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${code.isUsed ? "bg-muted/30 border-border" : "bg-success/5 border-success/20"}`}
                      >
                        <div>
                          <code className="font-mono text-sm font-semibold">{code.code}</code>
                          {code.companyName && (
                            <span className="text-xs text-muted-foreground ml-2">— {code.companyName}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {code.isUsed ? (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Redeemed
                            </span>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 gap-1"
                              onClick={() => {
                                navigator.clipboard.writeText(code.code);
                                toast.success("Code copied to clipboard");
                              }}
                            >
                              <Copy className="w-3.5 h-3.5" /> Copy
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Individual plan - upgrade prompt for sharing */}
          {hasAccess && tier === "individual" && (
            <Card className="border-primary/20">
              <CardContent className="pt-6 text-center">
                <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-heading font-semibold mb-2">Need to share with your team?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upgrade to Team (up to 10 users) or Enterprise (unlimited) to generate access codes for your construction companies.
                </p>
                <Link href="/#pricing">
                  <Button variant="outline" className="gap-2">
                    View Upgrade Options <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
