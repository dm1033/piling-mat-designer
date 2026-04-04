/**
 * Home Page - Sales-focused landing page for BRE470 Piling Mat Designer
 * Three subscription tiers: Individual, Team, Enterprise
 * David Miller Temporary Works consultation section
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Calculator, BookOpen, HardHat, ArrowRight, Shield, Zap, FileText,
  CheckCircle2, PoundSterling, Share2, Lock, Users, Star, Phone,
  Mail, Award, Building2, Clock, TrendingDown
} from "lucide-react";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663349554749/hMJrHrZWZ2XC9JAvjXeKjs/hero-construction-7yCmYE7gTL3hM6e2YBcmpd.webp";
const CROSS_SECTION_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663349554749/hMJrHrZWZ2XC9JAvjXeKjs/platform-layers-PcjvRgwvXBiEZzaTKeBrTN.webp";
const SITE_ENGINEER_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663349554749/hMJrHrZWZ2XC9JAvjXeKjs/site-engineer-D2Xx6DhbcjSeDAfkyHm7sU.webp";

type BillingToggle = "month" | "year";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [billing, setBilling] = useState<BillingToggle>("month");
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

  const handleSubscribe = (planId: "individual" | "team" | "enterprise") => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    createCheckout.mutate({ planId, interval: billing });
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
              <Link href="/account">
                <Button variant="ghost" size="sm" className="text-sm">
                  <Users className="w-4 h-4 mr-1" /> Account
                </Button>
              </Link>
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
              Design &amp; check your own bases — save thousands
            </p>
            <p className="text-lg text-white/75 leading-relaxed mb-8 max-w-lg">
              Full BRE470 compliant calculations for cohesive and granular subgrades. Subscribe from just £9.99/month and share with your entire project team.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              {hasAccess ? (
                <Link href="/calculator">
                  <Button size="lg" className="w-full sm:w-auto text-base font-semibold h-14 px-8">
                    Open Design Tool <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <>
                  <a href="#pricing">
                    <Button size="lg" className="w-full sm:w-auto text-base font-semibold h-16 px-8">
                      <PoundSterling className="w-5 h-5 mr-2" />
                      View Plans — From £9.99/mo
                    </Button>
                  </a>
                  <Link href="/calculator">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-14 px-8 bg-white/10 border-white/30 text-white hover:bg-white/20">
                      <Calculator className="w-5 h-5 mr-2" /> Try Free Demo
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cost Savings Banner */}
      <section className="py-8 bg-primary text-primary-foreground">
        <div className="container">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div>
              <TrendingDown className="w-8 h-8 mx-auto mb-2" />
              <div className="font-heading text-2xl font-bold">90% Cheaper</div>
              <p className="text-sm opacity-80">Than hiring a consultant for each platform design</p>
            </div>
            <div>
              <Clock className="w-8 h-8 mx-auto mb-2" />
              <div className="font-heading text-2xl font-bold">2 Minutes</div>
              <p className="text-sm opacity-80">Average time to complete a full BRE470 design</p>
            </div>
            <div>
              <Building2 className="w-8 h-8 mx-auto mb-2" />
              <div className="font-heading text-2xl font-bold">23 Rigs</div>
              <p className="text-sm opacity-80">Pre-loaded Liebherr, Bauer &amp; Soilmec specifications</p>
            </div>
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
            Built for site-based engineering staff who need quick, accurate platform designs without waiting for consultants
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Instant Calculations"
              description="Get platform thickness results in seconds. Step-by-step BRE470 methodology with automatic safety factor application."
              color="primary"
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Code Compliant"
              description="Full implementation of Appendix A design calculations for both cohesive (A2) and granular (A3) subgrades with geosynthetic reinforcement."
              color="success"
            />
            <FeatureCard
              icon={<FileText className="w-6 h-6" />}
              title="Audit-Ready Reports"
              description="Complete calculation audit trail showing every step, formula, and intermediate value. Export or print for site records."
              color="warning"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 sm:py-20">
        <div className="container">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-center mb-3">
            Choose Your Plan
          </h2>
          <p className="text-center text-muted-foreground mb-8 max-w-lg mx-auto">
            All plans include full BRE470 calculations, 23-rig database, and ongoing updates. Cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${billing === "month" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
              onClick={() => setBilling("month")}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${billing === "year" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
              onClick={() => setBilling("year")}
            >
              Annual <span className="text-xs ml-1 opacity-80">(Save ~17%)</span>
            </button>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Individual */}
            <PricingCard
              name="Individual"
              description="For site engineers & small contractors"
              monthlyPrice={999}
              annualPrice={9900}
              billing={billing}
              features={[
                "Full BRE470 calculations",
                "Cohesive & granular subgrades",
                "23-rig database with auto-fill",
                "Export / print reports",
                "Cross-section diagrams",
                "PWA mobile access",
                "All future updates",
              ]}
              onSubscribe={() => handleSubscribe("individual")}
              isPending={createCheckout.isPending}
              hasAccess={hasAccess}
            />

            {/* Team - Popular */}
            <PricingCard
              name="Team"
              description="For piling subcontractors & project teams"
              monthlyPrice={2999}
              annualPrice={29900}
              billing={billing}
              popular
              features={[
                "Everything in Individual",
                "Up to 10 users via access codes",
                "Team sharing dashboard",
                "Priority email support",
                "Geosynthetic reinforcement design",
              ]}
              onSubscribe={() => handleSubscribe("team")}
              isPending={createCheckout.isPending}
              hasAccess={hasAccess}
            />

            {/* Enterprise */}
            <PricingCard
              name="Enterprise"
              description="For principal contractors & large organisations"
              monthlyPrice={4999}
              annualPrice={49900}
              billing={billing}
              features={[
                "Everything in Team",
                "Unlimited users",
                "Custom rig database entries",
                "Priority support",
                "1-hour consultation with David Miller",
                "Dedicated account manager",
              ]}
              onSubscribe={() => handleSubscribe("enterprise")}
              isPending={createCheckout.isPending}
              hasAccess={hasAccess}
            />
          </div>

          {/* Free demo CTA */}
          {!hasAccess && (
            <div className="text-center mt-8">
              <Link href="/calculator">
                <Button variant="outline" size="lg" className="h-12 px-8 text-sm">
                  <Calculator className="w-4 h-4 mr-2" /> Try one free calculation before subscribing
                </Button>
              </Link>
              {isAuthenticated && (
                <div className="mt-3">
                  <Link href="/redeem">
                    <Button variant="ghost" size="sm" className="text-muted-foreground text-sm">
                      <Lock className="w-4 h-4 mr-1" /> Have an access code? Redeem here
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* How sharing works */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4">
                Share With Your Project Teams
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Team and Enterprise subscribers can generate access codes to share the tool with all construction companies involved in their works. Each code grants full access to the design tool.
              </p>
              <div className="space-y-4">
                <ShareStep n={1} title="Subscribe to Team or Enterprise" desc="Get access for yourself and your project teams" />
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

      {/* David Miller Consultation Section */}
      <section className="py-12 sm:py-20" id="consultation">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Award className="w-4 h-4" />
                <span>Specialist Consultation</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-3">
                One-to-One Temporary Works Coaching
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Need specialist guidance? Get direct access to an experienced Temporary Works Designer for personalised coaching and design review.
              </p>
            </div>

            <Card className="border-2 border-primary/30 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-5">
                  {/* Profile side */}
                  <div className="md:col-span-2 bg-gradient-to-br from-primary/5 to-primary/10 p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                      <HardHat className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="font-heading text-xl font-bold">David Miller</h3>
                    <p className="text-primary font-medium text-sm mt-1">Temporary Works Designer</p>
                    <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" />
                        <span>BRE470 Specialist</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary" />
                        <span>Working Platform Expert</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        <span>Temporary Works Coordinator</span>
                      </div>
                    </div>
                  </div>

                  {/* Details side */}
                  <div className="md:col-span-3 p-8">
                    <h4 className="font-heading font-semibold text-lg mb-4">What You Get</h4>
                    <div className="space-y-3 mb-6">
                      <ConsultItem text="One-to-one coaching on BRE470 design methodology" />
                      <ConsultItem text="Review of your specific working platform designs" />
                      <ConsultItem text="Understanding temporary works requirements and CDM duties" />
                      <ConsultItem text="Guidance on ground investigation interpretation" />
                      <ConsultItem text="Best practice for installation, maintenance and repair" />
                      <ConsultItem text="Tailored advice for your project-specific challenges" />
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4 mb-6">
                      <p className="text-sm text-muted-foreground mb-3">
                        Enterprise subscribers receive a complimentary 1-hour consultation. Additional sessions available for all subscribers.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <a href="mailto:temporaryworksconsultingltd@outlook.com" className="flex-1">
                          <Button className="w-full gap-2" size="lg">
                            <Mail className="w-4 h-4" /> Email David
                          </Button>
                        </a>
                        <a href="tel:+4407900984900" className="flex-1">
                          <Button variant="outline" className="w-full gap-2" size="lg">
                            <Phone className="w-4 h-4" /> Call to Book
                          </Button>
                        </a>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      All designs must be reviewed by a competent temporary works designer. David Miller provides specialist consultation to help you understand and apply BRE470 correctly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                  Ready to Save Thousands?
                </h2>
                <p className="text-white/80 text-lg mb-6 max-w-md">
                  Stop paying consultants for every platform design. Subscribe from £9.99/month and design unlimited working platforms on site.
                </p>
                {hasAccess ? (
                  <Link href="/calculator">
                    <Button size="lg" className="text-base font-semibold h-14 px-8">
                      Open Design Tool <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <a href="#pricing">
                    <Button size="lg" className="text-base font-semibold h-14 px-8">
                      View Plans <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-card py-8">
        <div className="container">
          <div className="grid sm:grid-cols-3 gap-6 text-sm text-muted-foreground">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <HardHat className="w-5 h-5 text-primary" />
                <span className="font-heading font-bold text-foreground">BRE470 Piling Mat Designer</span>
              </div>
              <p>Based on BR 470 (BRE 2004)</p>
              <p>Working Platforms for Tracked Plant: Good Practice Guide</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Quick Links</h4>
              <div className="space-y-1">
                <a href="#pricing" className="block hover:text-foreground transition-colors">Pricing</a>
                <a href="#consultation" className="block hover:text-foreground transition-colors">Consultation</a>
                <Link href="/calculator" className="block hover:text-foreground transition-colors">Free Demo</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Contact</h4>
              <p>David Miller — Temporary Works Designer</p>
              <a href="mailto:temporaryworksconsultingltd@outlook.com" className="hover:text-foreground transition-colors">
                temporaryworksconsultingltd@outlook.com
              </a>
              <p className="mt-1">
                <a href="tel:+4407900984900" className="hover:text-foreground transition-colors">07900 984900</a>
              </p>
            </div>
          </div>
          <div className="border-t border-border mt-6 pt-6 text-center text-xs text-muted-foreground">
            <p>This tool is for preliminary design purposes. All designs must be reviewed by a competent geotechnical engineer.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────

function PricingCard({
  name, description, monthlyPrice, annualPrice, billing, features, popular, onSubscribe, isPending, hasAccess,
}: {
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  billing: BillingToggle;
  features: string[];
  popular?: boolean;
  onSubscribe: () => void;
  isPending: boolean;
  hasAccess: boolean;
}) {
  const price = billing === "year" ? annualPrice : monthlyPrice;
  const displayPrice = (price / 100).toFixed(2);
  const interval = billing === "year" ? "/year" : "/month";

  return (
    <Card className={`relative ${popular ? "border-2 border-primary shadow-xl scale-[1.02]" : "border border-border"}`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3" /> Most Popular
          </span>
        </div>
      )}
      <CardContent className="pt-8 pb-8 text-center">
        <h3 className="font-heading text-xl font-bold mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>

        <div className="mb-6">
          <span className="font-heading text-4xl font-bold">£{displayPrice}</span>
          <span className="text-muted-foreground ml-1">{interval}</span>
        </div>

        <div className="space-y-2.5 text-left mb-8">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
              <span className="text-sm text-foreground">{f}</span>
            </div>
          ))}
        </div>

        {hasAccess ? (
          <Link href="/calculator">
            <Button size="lg" className="w-full h-12 font-semibold" variant={popular ? "default" : "outline"}>
              Open Design Tool
            </Button>
          </Link>
        ) : (
          <Button
            size="lg"
            className="w-full h-12 font-semibold"
            variant={popular ? "default" : "outline"}
            onClick={onSubscribe}
            disabled={isPending}
          >
            {isPending ? "Redirecting..." : `Subscribe — £${displayPrice}${interval}`}
          </Button>
        )}
      </CardContent>
    </Card>
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

function ConsultItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
      <span className="text-sm">{text}</span>
    </div>
  );
}
