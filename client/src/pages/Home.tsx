/**
 * Home Page - Sales-focused landing page for BRE470 Piling Mat Designer
 * Tagline: "Design & check your own bases — one-off cost"
 * Price: £300 one-off purchase
 */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Calculator, BookOpen, HardHat, ArrowRight, Shield, Zap, FileText,
  CheckCircle2, PoundSterling, Share2, Lock, Users
} from "lucide-react";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663349554749/hMJrHrZWZ2XC9JAvjXeKjs/hero-construction-7yCmYE7gTL3hM6e2YBcmpd.webp";
const CROSS_SECTION_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663349554749/hMJrHrZWZ2XC9JAvjXeKjs/platform-layers-PcjvRgwvXBiEZzaTKeBrTN.webp";
const SITE_ENGINEER_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663349554749/hMJrHrZWZ2XC9JAvjXeKjs/site-engineer-D2Xx6DhbcjSeDAfkyHm7sU.webp";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const accessQuery = trpc.purchase.hasAccess.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const hasAccess = accessQuery.data?.hasAccess === true;

  const createCheckout = trpc.purchase.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        toast.info("Redirecting to secure checkout...");
        window.open(data.checkoutUrl, "_blank");
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create checkout session");
    },
  });

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    createCheckout.mutate();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <HardHat className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight">BRE470</span>
          </div>
          <nav className="flex items-center gap-2">
            {hasAccess ? (
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
                <Link href="/account">
                  <Button variant="ghost" size="sm" className="text-sm">
                    <Users className="w-4 h-4 mr-1" /> Account
                  </Button>
                </Link>
              </>
            ) : isAuthenticated ? (
              <Button size="sm" className="text-sm font-semibold" onClick={handleBuyNow}>
                <PoundSterling className="w-4 h-4 mr-1" /> Buy Now
              </Button>
            ) : (
              <Button size="sm" className="text-sm font-semibold" onClick={() => window.location.href = getLoginUrl()}>
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt="Construction site with tracked piling rig"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/30" />
        </div>
        <div className="relative container py-16 sm:py-24 lg:py-32">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white/90 text-sm mb-6">
              <Shield className="w-4 h-4" />
              <span>In accordance with BR 470 (BRE 2004)</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Piling Mat<br />Designer
            </h1>
            <p className="text-xl sm:text-2xl text-white font-heading font-semibold mb-3">
              Design &amp; check your own bases — one-off cost
            </p>
            <p className="text-lg text-white/75 leading-relaxed mb-8 max-w-lg">
              Full BRE470 compliant calculations for cohesive and granular subgrades. Purchase once, share with all construction companies involved in your works.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              {hasAccess ? (
                <Link href="/calculator">
                  <Button size="lg" className="w-full sm:w-auto text-base font-semibold h-14 px-8">
                    Open Design Tool <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-base font-semibold h-16 px-8"
                  onClick={handleBuyNow}
                  disabled={createCheckout.isPending}
                >
                  <PoundSterling className="w-5 h-5 mr-2" />
                  Buy Now — £300
                </Button>
              )}
              {!hasAccess && (
                <Link href="/calculator">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-14 px-8 bg-white/10 border-white/30 text-white hover:bg-white/20">
                    <Calculator className="w-5 h-5 mr-2" /> Try Free Demo
                  </Button>
                </Link>
              )}
              {!hasAccess && isAuthenticated && (
                <Link href="/redeem">
                  <Button variant="ghost" size="sm" className="text-white/70 hover:text-white text-sm">
                    <Lock className="w-4 h-4 mr-1" /> Redeem Access Code
                  </Button>
                </Link>
              )}
              {!isAuthenticated && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white text-sm"
                  onClick={() => window.location.href = getLoginUrl()}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="py-12 sm:py-16">
        <div className="container">
          <div className="max-w-lg mx-auto">
            <Card className="border-2 border-primary shadow-lg">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <PoundSterling className="w-4 h-4" /> One-off payment
                </div>
                <h2 className="font-heading text-3xl font-bold mb-2">£300.00</h2>
                <p className="text-muted-foreground mb-6">
                  Lifetime access — no subscription, no recurring fees
                </p>
                <div className="space-y-3 text-left mb-8">
                  <PricingItem text="Full BRE470 Appendix A calculations" />
                  <PricingItem text="Cohesive & granular subgrade design" />
                  <PricingItem text="Geosynthetic reinforcement option" />
                  <PricingItem text="Printable design reports" />
                  <PricingItem text="Share access with your construction companies" />
                  <PricingItem text="Unlimited calculations, forever" />
                </div>
                {hasAccess ? (
                  <Link href="/calculator">
                    <Button size="lg" className="w-full h-14 text-base font-bold">
                      <Calculator className="w-5 h-5 mr-2" /> Open Design Tool
                    </Button>
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <Button
                      size="lg"
                      className="w-full h-14 text-base font-bold"
                      onClick={handleBuyNow}
                      disabled={createCheckout.isPending}
                    >
                      {createCheckout.isPending ? "Redirecting..." : "Buy Now — £300"}
                    </Button>
                    <Link href="/calculator">
                      <Button variant="outline" size="lg" className="w-full h-12 text-sm">
                        <Calculator className="w-4 h-4 mr-2" /> Try one free calculation first
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="container">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-center mb-3">
            Designed for Site Use
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-lg mx-auto">
            Built for site-based engineering staff who need quick, accurate platform designs
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Fast Calculations"
              description="Get platform thickness results in seconds. Step-by-step BRE470 methodology with automatic safety factor application."
              color="primary"
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Code Compliant"
              description="Full implementation of Appendix A design calculations for both cohesive (A2) and granular (A3) subgrades."
              color="success"
            />
            <FeatureCard
              icon={<FileText className="w-6 h-6" />}
              title="Detailed Output"
              description="Complete calculation audit trail showing every step, formula, and intermediate value for engineering review."
              color="warning"
            />
          </div>
        </div>
      </section>

      {/* How sharing works */}
      <section className="py-12 sm:py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4">
                Share With Your Teams
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Once purchased, generate access codes to share the tool with all construction companies involved in your works. Each code grants full access to the design tool.
              </p>
              <div className="space-y-4">
                <ShareStep n={1} title="Purchase the tool" desc="One-off payment of £300 for lifetime access" />
                <ShareStep n={2} title="Generate access codes" desc="Create unique codes for each company on your project" />
                <ShareStep n={3} title="Share with your teams" desc="Send codes to site engineers who need to design platforms" />
              </div>
            </div>
            <div className="rounded-lg overflow-hidden border border-border shadow-sm">
              <img
                src={CROSS_SECTION_IMG}
                alt="Working platform cross-section showing layers"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="container">
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={SITE_ENGINEER_IMG}
              alt="Engineer using tablet on construction site"
              className="w-full h-64 sm:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 flex items-center">
              <div className="container">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-3">
                  Ready to Design?
                </h2>
                <p className="text-white/80 text-lg mb-6 max-w-md">
                  Get instant BRE470 compliant platform designs for £300 — one-off, no subscription.
                </p>
                {hasAccess ? (
                  <Link href="/calculator">
                    <Button size="lg" className="text-base font-semibold h-14 px-8">
                      Open Design Tool <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    size="lg"
                    className="text-base font-semibold h-14 px-8"
                    onClick={handleBuyNow}
                    disabled={createCheckout.isPending}
                  >
                    Buy Now — £300 <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-card py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>BRE470 Piling Mat Designer — Based on BR 470 (BRE 2004)</p>
          <p className="mt-1">Working Platforms for Tracked Plant: Good Practice Guide</p>
          <p className="mt-2 text-xs">This tool is for preliminary design purposes. All designs must be reviewed by a competent geotechnical engineer.</p>
        </div>
      </footer>
    </div>
  );
}

function PricingItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
      <span className="text-foreground">{text}</span>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'primary' | 'success' | 'warning';
}) {
  const borderColors = {
    primary: 'border-l-primary',
    success: 'border-l-success',
    warning: 'border-l-warning',
  };
  const bgColors = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
  };

  return (
    <div className={`bg-card rounded-lg border border-border border-l-4 ${borderColors[color]} p-6 shadow-sm`}>
      <div className={`w-12 h-12 rounded-lg ${bgColors[color]} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="font-heading font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function ShareStep({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
        {n}
      </div>
      <div>
        <h4 className="font-heading font-semibold">{title}</h4>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
