/**
 * For Piling Contractors — Permanent Marketing Landing Page
 * Based on the outreach email content, targeting Technical Directors,
 * Contracts Managers, and TWCs at UK piling & ground improvement specialists.
 * SEO-optimised with structured data and meta tags.
 */
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import {
  HardHat,
  ArrowRight,
  Shield,
  Calculator,
  Clock,
  PoundSterling,
  FileCheck,
  CheckCircle2,
  Phone,
  Mail,
  BookOpen,
  GraduationCap,
  Building2,
  Users,
  TrendingDown,
  Zap,
  Award,
  FileText,
  Target,
  Truck,
  AlertTriangle,
} from "lucide-react";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663349554749/hMJrHrZWZ2XC9JAvjXeKjs/hero-construction-7yCmYE7gTL3hM6e2YBcmpd.webp";

const TARGET_COMPANIES = [
  "Keller Group",
  "Cementation Skanska",
  "Balfour Beatty Ground Engineering",
  "Van Elle",
  "Roger Bullivant",
  "FK Lowry Piling",
  "Bauer Technologies",
  "Aarsleff Ground Engineering",
  "Expanded Piling",
  "Martello Piling",
  "Vibro Menard",
  "Murphy Ground Engineering",
  "Franki Foundations",
  "Dawson WAM",
  "Stent Foundations",
];

export default function ForContractors() {
  useEffect(() => {
    document.title = "For Piling Contractors — BRE470 Working Platform Design Certificates | BRE470 Piling Mat Designer";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Professional BRE470 working platform design certificates for UK piling and ground improvement contractors. £299.99 per design — same-day delivery, signed by David Miller TWD.");
    }
    // Add JSON-LD structured data
    const jsonLd = document.createElement("script");
    jsonLd.type = "application/ld+json";
    jsonLd.id = "contractors-jsonld";
    jsonLd.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      name: "BRE470 Working Platform Design Certificate",
      provider: {
        "@type": "Organization",
        name: "Temporary Works Consulting Ltd",
        url: "https://www.bre470pilingmatdesign.com",
      },
      description: "Professional BRE470-compliant working platform design certificates for UK piling and ground improvement contractors.",
      areaServed: { "@type": "Country", name: "United Kingdom" },
      offers: {
        "@type": "Offer",
        price: "299.99",
        priceCurrency: "GBP",
        description: "Per-design certificate with full interpretive calculations",
      },
    });
    document.head.appendChild(jsonLd);
    return () => {
      const el = document.getElementById("contractors-jsonld");
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
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
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="text-sm">
                <BookOpen className="w-4 h-4 mr-1" /> Blog
              </Button>
            </Link>
            <Link href="/cpd">
              <Button variant="ghost" size="sm" className="text-sm">
                <GraduationCap className="w-4 h-4 mr-1" /> CPD
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

      {/* Hero Section — Pain Point → Solution */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMG} alt="Piling rig on working platform" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50" />
        </div>
        <div className="relative z-10 container py-20 sm:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-1.5 mb-6">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-red-300">The Problem Every Piling Contractor Knows</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Mobilisation is Next Week.
              <span className="text-primary block mt-2">The Platform Design Isn't Done.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mt-6 max-w-xl leading-relaxed">
              Traditional consultancy takes 2–4 weeks and costs £500–£2,000 per design. Your TWC is asking questions. Your programme is slipping.
            </p>
            <p className="text-lg sm:text-xl text-white font-medium mt-4">
              Get a signed, BRE470-compliant design certificate in minutes — for £299.99.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link href="/calculator">
                <Button size="lg" className="h-14 px-8 text-lg font-heading font-bold gap-2 w-full sm:w-auto">
                  <Calculator className="w-5 h-5" />
                  Start Your Design Now
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

      {/* Stats Banner */}
      <section className="bg-primary text-primary-foreground py-5">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
            <StatItem icon={<PoundSterling className="w-6 h-6" />} value="£299.99" label="per design certificate" />
            <StatItem icon={<TrendingDown className="w-6 h-6" />} value="Save 50-70%" label="vs consultancy fees" />
            <StatItem icon={<Clock className="w-6 h-6" />} value="Same Day" label="certificate delivery" />
            <StatItem icon={<Award className="w-6 h-6" />} value="25+ Years" label="David Miller TWD experience" />
          </div>
        </div>
      </section>

      {/* The Problem (expanded) */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold">
                Why Platform Designs Hold Up Your Programme
              </h2>
              <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
                Every piling contractor knows the scenario. The rig is booked, the site is ready, but the working platform design is still sitting in a consultant's inbox.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ProblemCard
                icon={<Clock className="w-7 h-7" />}
                title="2–4 Week Turnaround"
                description="Traditional consultancy designs take weeks. Your programme can't wait that long — and delays cost more than the design itself."
              />
              <ProblemCard
                icon={<PoundSterling className="w-7 h-7" />}
                title="£500–£2,000 Per Design"
                description="Bespoke consultancy fees for a standard BRE470 calculation. Multiply that across 10–20 sites per year and the cost is significant."
              />
              <ProblemCard
                icon={<FileText className="w-7 h-7" />}
                title="Inconsistent Output"
                description="Different consultants, different formats, different levels of detail. Your TWC has to review a different document every time."
              />
            </div>
          </div>
        </div>
      </section>

      {/* The Solution — How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">The Solution</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">
              BRE470 Design Certificates — On Demand
            </h2>
            <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
              Your site team enters the parameters. The tool runs the BRE470 Appendix A calculation. You get a signed certificate.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <StepCard
              number={1}
              title="Enter Your Parameters"
              description="Select your piling rig from 23 pre-loaded models (Liebherr, Bauer, Soilmec), enter ground conditions and platform material. Takes 2 minutes."
            />
            <StepCard
              number={2}
              title="Review the Calculation"
              description="See the full BRE470 Appendix A calculation — bearing capacity, platform thickness, cross-section diagram. Check it makes sense before you pay."
            />
            <StepCard
              number={3}
              title="Get Your Certificate"
              description="Pay £299.99 and receive your professional design certificate immediately. Unique reference, full audit trail, signed by David Miller TWD."
            />
          </div>
          <div className="text-center mt-10">
            <Link href="/calculator?demo=true">
              <Button size="lg" className="h-14 px-8 text-lg font-heading font-bold gap-2">
                Try a Free Demo Calculation
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-3">No login required. See the full calculation before you commit.</p>
          </div>
        </div>
      </section>

      {/* What Your TWC Gets */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">
              What Your TWC Gets
            </h2>
            <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
              A professional design certificate with everything needed for TWC review and approval — consistent format, every time.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <FeatureCard icon={<FileCheck className="w-7 h-7" />} title="Signed Check Certificate" description="Professional design certificate with unique reference number, signed by David Miller — Temporary Works Designer." />
            <FeatureCard icon={<Calculator className="w-7 h-7" />} title="Full Calculation Audit Trail" description="Complete BRE470 Appendix A calculations with all parameters, partial factors, and bearing capacity checks." />
            <FeatureCard icon={<Shield className="w-7 h-7" />} title="BRE470 & BS 5975 Compliant" description="Full compliance with BRE470 methodology, BS 5975:2024, and CDM 2015 requirements." />
            <FeatureCard icon={<Target className="w-7 h-7" />} title="Cohesive & Granular Subgrades" description="Separate calculation methodologies for clay and granular soils, with optional geosynthetic reinforcement." />
            <FeatureCard icon={<Truck className="w-7 h-7" />} title="23 Pre-loaded Piling Rigs" description="Liebherr LB 16–44, Bauer BG 15–46, Soilmec SR-30 to SR-100 — EN 996 track dimensions auto-filled." />
            <FeatureCard icon={<FileText className="w-7 h-7" />} title="Print-Ready A4 Format" description="Professional layout ready for printing, filing, or attaching to the temporary works register." />
          </div>
        </div>
      </section>

      {/* Why This Matters to Your Business */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold">
                Why This Matters to Your Business
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <BenefitCard
                title="For Your Contracts Team"
                items={[
                  "Fixed £299.99 per design — no surprise invoices",
                  "Budget platform designs accurately across all projects",
                  "No consultancy retainers or minimum fees",
                  "Instant procurement — no PO process for sub-£500 spend",
                ]}
              />
              <BenefitCard
                title="For Your Site Agents"
                items={[
                  "Commission a design the day you need it",
                  "No waiting for consultants to respond",
                  "Simple form — enter rig, ground, material, done",
                  "Certificate ready before the rig arrives on site",
                ]}
              />
              <BenefitCard
                title="For Your TWC"
                items={[
                  "Consistent, professional format every time",
                  "Full calculation audit trail for CAT 2/3 check",
                  "Unique reference number for the TW register",
                  "Signed by a qualified Temporary Works Designer",
                ]}
              />
              <BenefitCard
                title="For Your Business"
                items={[
                  "Save 50–70% vs traditional consultancy fees",
                  "Eliminate programme delays from platform design",
                  "Demonstrate BRE470 compliance to principal contractors",
                  "Reduce risk of HSE enforcement action",
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Who Is This For */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">
              Built for UK Piling & Ground Improvement
            </h2>
            <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
              This tool is designed specifically for the companies that need working platform designs on every project.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { icon: <Building2 className="w-5 h-5" />, label: "CFA & Bored Piling Contractors" },
              { icon: <Truck className="w-5 h-5" />, label: "Driven Piling Specialists" },
              { icon: <Target className="w-5 h-5" />, label: "Mini Piling & Restricted Access" },
              { icon: <Building2 className="w-5 h-5" />, label: "Ground Improvement Contractors" },
              { icon: <Users className="w-5 h-5" />, label: "Principal Contractors with Piling Divisions" },
              { icon: <HardHat className="w-5 h-5" />, label: "Temporary Works Coordinators" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  {item.icon}
                </div>
                <span className="font-medium text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By / Industry Names */}
      <section className="py-12 bg-muted/20 border-y border-border">
        <div className="container">
          <p className="text-center text-sm text-muted-foreground mb-6 font-medium uppercase tracking-wider">
            Designed for companies like
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 max-w-4xl mx-auto">
            {TARGET_COMPANIES.map((name) => (
              <span key={name} className="text-sm text-muted-foreground/70 font-medium whitespace-nowrap">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CPD Upsell */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <Card className="border-2 border-primary/30 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-primary/5 p-6 sm:p-8 border-b border-primary/10">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading text-2xl font-bold">CPD for Your Team</h3>
                      <p className="text-primary font-medium mt-1">"BRE470 Compliance Made Simple" — 1 Hour</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    I deliver a 1-hour CPD presentation covering the BRE470 design methodology, common failure modes, and how to use the design tool. Aimed at TWCs, site agents, piling managers, and graduate engineers. Online or in-person, at a time that suits your team.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <MiniStat label="Duration" value="1 Hour" />
                    <MiniStat label="Format" value="Online / In-Person" />
                    <MiniStat label="Cost" value="£19.99/person" />
                    <MiniStat label="CPD Hours" value="1 CPD Hour" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/cpd">
                      <Button size="lg" className="w-full sm:w-auto gap-2">
                        <GraduationCap className="w-5 h-5" />
                        Book a CPD Presentation
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About David Miller */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <Card className="border border-border overflow-hidden">
              <CardContent className="p-8 sm:p-10">
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
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Over 25 years of experience in UK temporary works design, including piling platforms, crane bases, excavation support, and falsework. Every design certificate is personally signed and carries professional accountability.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Need specialist guidance beyond the standard BRE470 design? I offer one-to-one consultation for complex scenarios — slopes greater than 1 in 10, unusual loading conditions, multi-rig platforms, and bespoke designs.
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
                      07900 984900
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold">
            Stop Waiting. Start Designing.
          </h2>
          <p className="text-lg mt-4 max-w-xl mx-auto opacity-90">
            Your next working platform design is 2 minutes away. £299.99. Signed certificate. BRE470 compliant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/calculator">
              <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-heading font-bold gap-2">
                <Calculator className="w-5 h-5" />
                Start Your Design
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/calculator?demo=true">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-heading border-white/30 text-white hover:bg-white/10 gap-2">
                Try Free Demo First
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-10">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                  <HardHat className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-heading font-bold text-sm">BRE470 Piling Mat Designer</span>
              </div>
              <p className="text-sm text-muted-foreground">Temporary Works Consulting Ltd</p>
              <p className="text-sm text-muted-foreground mt-1">
                <a href="mailto:temporaryworksconsultingltd@outlook.com" className="hover:text-primary transition-colors">
                  temporaryworksconsultingltd@outlook.com
                </a>
              </p>
              <p className="text-sm text-muted-foreground">
                <a href="tel:+4407900984900" className="hover:text-primary transition-colors">
                  07900 984900
                </a>
              </p>
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm mb-3">Quick Links</h4>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li><Link href="/calculator" className="hover:text-primary transition-colors">Design Tool</Link></li>
                <li><Link href="/cpd" className="hover:text-primary transition-colors">CPD Presentation</Link></li>
                <li><Link href="/blog" className="hover:text-primary transition-colors">Knowledge Base</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm mb-3">Resources</h4>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li><Link href="/blog/what-is-bre470" className="hover:text-primary transition-colors">What Is BRE470?</Link></li>
                <li><Link href="/blog/how-to-design-working-platform" className="hover:text-primary transition-colors">How to Design a Working Platform</Link></li>
                <li><Link href="/blog/twc-guide-platform-certificates" className="hover:text-primary transition-colors">TWC Guide to Platform Certificates</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Temporary Works Consulting Ltd. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────

function StatItem({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center justify-center gap-3">
      {icon}
      <div>
        <div className="text-xl sm:text-2xl font-heading font-bold">{value}</div>
        <div className="text-xs sm:text-sm opacity-90">{label}</div>
      </div>
    </div>
  );
}

function ProblemCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="border border-red-500/20 bg-red-500/5">
      <CardContent className="pt-6">
        <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
          {icon}
        </div>
        <h3 className="font-heading text-lg font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

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

function BenefitCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="border border-border">
      <CardContent className="pt-6">
        <h3 className="font-heading text-lg font-bold mb-4">{title}</h3>
        <ul className="space-y-2.5">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
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

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center p-3 rounded-lg bg-muted/50">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="text-sm font-bold">{value}</div>
    </div>
  );
}
