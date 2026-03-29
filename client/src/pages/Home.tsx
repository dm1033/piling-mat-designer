/**
 * Home Page - Landing page for BRE470 Piling Mat Designer
 * Design: "Site Engineer's Companion" - Rugged Field Tool aesthetic
 * Mobile-first, high contrast, construction-site color coding
 */
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calculator, BookOpen, HardHat, ArrowRight, Shield, Zap, FileText } from "lucide-react";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663349554749/hMJrHrZWZ2XC9JAvjXeKjs/hero-construction-7yCmYE7gTL3hM6e2YBcmpd.webp";
const CROSS_SECTION_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663349554749/hMJrHrZWZ2XC9JAvjXeKjs/platform-layers-PcjvRgwvXBiEZzaTKeBrTN.webp";
const SITE_ENGINEER_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663349554749/hMJrHrZWZ2XC9JAvjXeKjs/site-engineer-D2Xx6DhbcjSeDAfkyHm7sU.webp";

export default function Home() {
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
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
            <p className="text-lg sm:text-xl text-white/80 leading-relaxed mb-8 max-w-lg">
              Design working platforms for tracked plant quickly and accurately on site. Full BRE470 compliant calculations for cohesive and granular subgrades.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/calculator">
                <Button size="lg" className="w-full sm:w-auto text-base font-semibold h-14 px-8">
                  Start Design <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/reference">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-14 px-8 bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <BookOpen className="w-5 h-5 mr-2" /> View Reference
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16">
        <div className="container">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-center mb-10">
            Designed for Site Use
          </h2>
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

      {/* Cross-section diagram */}
      <section className="py-12 sm:py-16 bg-card border-y border-border">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4">
                Working Platform Cross-Section
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                The design calculates the required thickness of compacted granular fill to safely distribute tracked plant loads through the platform to the subgrade below. Optional geosynthetic reinforcement can reduce the required thickness.
              </p>
              <div className="space-y-3">
                <CheckItem text="Cohesive subgrade: cu from 20 to 80 kPa" />
                <CheckItem text="Granular subgrade: with water table adjustment" />
                <CheckItem text="Platform material: φ' from 35° to 45°" />
                <CheckItem text="Optional geosynthetic reinforcement" />
                <CheckItem text="Case 1 & Case 2 loading conditions" />
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
      <section className="py-12 sm:py-16">
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
                  Enter your site parameters and get an instant BRE470 compliant platform design.
                </p>
                <Link href="/calculator">
                  <Button size="lg" className="text-base font-semibold h-14 px-8">
                    Open Design Tool <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
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

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 rounded-full bg-success/15 flex items-center justify-center flex-shrink-0">
        <svg className="w-3 h-3 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="text-foreground">{text}</span>
    </div>
  );
}
