/**
 * Home Page — BRE470 Piling Mat Designer
 * Per-design payment model: £299.99 per certified design
 * Signed by David Miller, Temporary Works Designer
 */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  Calculator, BookOpen, HardHat, ArrowRight, Shield, Zap, FileText,
  CheckCircle2, Phone, Mail, Award, Clock, PoundSterling, FileCheck
} from "lucide-react";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663349554749/hMJrHrZWZ2XC9JAvjXeKjs/hero-construction-7yCmYE7gTL3hM6e2YBcmpd.webp";
const CROSS_SECTION_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663349554749/hMJrHrZWZ2XC9JAvjXeKjs/platform-layers-PcjvRgwvXBiEZzaTKeBrTN.webp";

export default function Home() {
  const { isAuthenticated, user } = useAuth();

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
            {isAuthenticated && (
              <>
                <Link href="/reference">
                  <Button variant="ghost" size="sm" className="text-sm">
                    <BookOpen className="w-4 h-4 mr-1" /> Reference
                  </Button>
                </Link>
                <Link href="/my-designs">
                  <Button variant="ghost" size="sm" className="text-sm">
                    <FileCheck className="w-4 h-4 mr-1" /> My Designs
                  </Button>
                </Link>
                {user?.role === "admin" && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="text-sm text-primary">
                      <Shield className="w-4 h-4 mr-1" /> Admin
                    </Button>
                  </Link>
                )}
              </>
            )}
            <Link href="/calculator">
              <Button size="sm" className="text-sm font-semibold">
                <Calculator className="w-4 h-4 mr-1" /> Design Tool
              </Button>
            </Link>
            {!isAuthenticated && (
              <Button variant="ghost" size="sm" className="text-sm" onClick={() => window.location.href = getLoginUrl()}>
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMG} alt="Construction site" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>
        <div className="relative z-10 container py-16 sm:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-1.5 mb-6">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">BR 470 Compliant</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Professional Piling Mat
              <span className="text-primary block mt-1">Design Certificates</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mt-4 max-w-xl leading-relaxed">
              Get a fully certified BRE470 working platform design with interpretive calculations and check certificate — signed by David Miller, Temporary Works Designer.
            </p>
            <p className="text-3xl sm:text-4xl font-heading font-bold text-white mt-6">
              £299.99 <span className="text-lg text-gray-400 font-normal">per design</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link href="/calculator">
                <Button size="lg" className="h-14 px-8 text-lg font-heading font-bold gap-2 w-full sm:w-auto">
                  <Calculator className="w-5 h-5" />
                  Start Your Design
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/calculator?demo=true">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-heading border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                  Try Free Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Savings Banner */}
      <section className="bg-primary text-primary-foreground py-4">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <PoundSterling className="w-6 h-6" />
              <div>
                <div className="text-2xl font-heading font-bold">Save 50-70%</div>
                <div className="text-sm opacity-90">vs traditional consultancy fees</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Clock className="w-6 h-6" />
              <div>
                <div className="text-2xl font-heading font-bold">2 Minutes</div>
                <div className="text-sm opacity-90">from input to certificate</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Award className="w-6 h-6" />
              <div>
                <div className="text-2xl font-heading font-bold">Certified</div>
                <div className="text-sm opacity-90">Signed by David Miller TWD</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">What You Get for £299.99</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-lg">
              A traditional consultancy design costs £500–£1,000. Our tool delivers the same professional output at a fraction of the cost.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<FileText className="w-7 h-7" />}
              title="Full Interpretive Design"
              description="Complete BRE470 Appendix A calculations with all parameters, partial factors, and bearing capacity checks clearly presented."
            />
            <FeatureCard
              icon={<CheckCircle2 className="w-7 h-7" />}
              title="Check Certificate"
              description="Professional design certificate with unique reference number, signed by David Miller — Temporary Works Designer."
            />
            <FeatureCard
              icon={<Calculator className="w-7 h-7" />}
              title="23 Pre-loaded Rigs"
              description="Select from Liebherr, Bauer, and Soilmec piling rigs with EN 996 track dimensions auto-filled."
            />
            <FeatureCard
              icon={<Shield className="w-7 h-7" />}
              title="BR 470 Compliant"
              description="Cohesive and granular subgrade calculations with optional geosynthetic reinforcement — fully aligned with BRE guidance."
            />
            <FeatureCard
              icon={<Zap className="w-7 h-7" />}
              title="Instant Results"
              description="Get your design thickness, cross-section diagram, and full calculation breakdown in under 2 minutes."
            />
            <FeatureCard
              icon={<Award className="w-7 h-7" />}
              title="Professional Output"
              description="Print-ready A4 certificate with project details, calculation audit trail, and designer's signature block."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">How It Works</h2>
            <p className="text-muted-foreground mt-3 text-lg">Three simple steps to your certified design</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <StepCard number={1} title="Enter Your Parameters" description="Select your piling rig, enter ground conditions and platform material properties. The tool guides you step by step." />
            <StepCard number={2} title="Review Your Design" description="See the calculated platform thickness, cross-section diagram, and full BRE470 calculation breakdown instantly." />
            <StepCard number={3} title="Get Your Certificate" description="Pay £299.99 and receive your professional design certificate with unique reference number, signed by David Miller." />
          </div>
        </div>
      </section>

      {/* Cross-Section Visual */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl font-bold mb-4">Professional Design Output</h2>
              <p className="text-muted-foreground text-lg mb-6">
                Each certificate includes a detailed cross-section diagram, full calculation audit trail, and clear pass/fail assessment — everything a Temporary Works Coordinator needs to approve the design.
              </p>
              <ul className="space-y-3">
                {[
                  "Unique certificate reference (BRE470-YYYY-NNNNN)",
                  "Project name, site location, and client details",
                  "Full BRE470 Appendix A calculation steps",
                  "Design thickness with 25mm rounding",
                  "Cross-section diagram with dimensions",
                  "Signed by David Miller, Temporary Works Designer",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl overflow-hidden border border-border shadow-lg">
              <img src={CROSS_SECTION_IMG} alt="Platform cross-section" className="w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-lg mx-auto">
            <Card className="border-2 border-primary shadow-xl">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <FileCheck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading text-2xl font-bold">BRE470 Design Certificate</h3>
                <p className="text-muted-foreground mt-2">
                  Full interpretive design with check certificate signed by David Miller
                </p>
                <div className="mt-6">
                  <span className="font-heading text-5xl font-bold text-primary">£299.99</span>
                  <span className="text-muted-foreground ml-2">per design</span>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  Traditional consultancy: <span className="line-through">£500–£1,000</span>
                </div>
                <ul className="text-left space-y-2 mt-6 max-w-sm mx-auto">
                  {[
                    "Full BRE470 Appendix A calculations",
                    "Professional check certificate",
                    "Unique reference number",
                    "Signed by David Miller TWD",
                    "Cohesive & granular subgrades",
                    "23 pre-loaded piling rigs",
                    "Instant digital delivery",
                    "Print-ready A4 format",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/calculator">
                  <Button size="lg" className="w-full h-14 text-lg font-heading font-bold mt-8 gap-2">
                    <Calculator className="w-5 h-5" />
                    Start Your Design
                  </Button>
                </Link>
                <Link href="/calculator?demo=true">
                  <Button variant="ghost" size="sm" className="mt-3 text-muted-foreground">
                    Try a free demo calculation first
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* David Miller Consultation */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <Card className="border border-border overflow-hidden">
              <CardContent className="p-0">
                <div className="p-8 sm:p-10">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <HardHat className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading text-2xl font-bold">David Miller</h3>
                      <p className="text-primary font-medium">Temporary Works Designer</p>
                      <p className="text-muted-foreground text-sm">Temporary Works Consulting Ltd</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Need specialist guidance beyond the standard BRE470 design? David offers one-to-one coaching and consultation for complex temporary works scenarios, including slopes greater than 1 in 10, unusual loading conditions, and bespoke platform designs.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a href="mailto:temporaryworksconsultingltd@outlook.com" className="block">
                      <Button variant="outline" size="lg" className="w-full h-14 gap-2">
                        <Mail className="w-5 h-5" />
                        Email David
                      </Button>
                    </a>
                    <a href="tel:+4407900984900" className="block">
                      <Button variant="outline" size="lg" className="w-full h-14 gap-2">
                        <Phone className="w-5 h-5" />
                        Call to Book
                      </Button>
                    </a>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    Consultation services are separate from the design tool and priced individually.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <HardHat className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-sm">BRE470 Piling Mat Designer</span>
            </div>
            <div className="text-sm text-muted-foreground text-center sm:text-right">
              <p>Temporary Works Consulting Ltd</p>
              <p>
                <a href="mailto:temporaryworksconsultingltd@outlook.com" className="hover:text-primary transition-colors">
                  temporaryworksconsultingltd@outlook.com
                </a>
                {" | "}
                <a href="tel:+4407900984900" className="hover:text-primary transition-colors">
                  07900 984900
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="border border-border hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
          {icon}
        </div>
        <h3 className="font-heading text-lg font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

function StepCard({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-heading font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="font-heading text-lg font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
