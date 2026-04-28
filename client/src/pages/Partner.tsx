/**
 * Partner Page — "Work With Us" / Sales pitch page for piling contractors
 * Based on the outreach email content, presented as a permanent marketing page.
 * Targets Technical Directors, Contracts Managers, and TWCs.
 */
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import {
  HardHat,
  ArrowRight,
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
  Zap,
  Award,
  Shield,
  Send,
  Handshake,
  MessageSquare,
  Calendar,
  Globe,
} from "lucide-react";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663349554749/hMJrHrZWZ2XC9JAvjXeKjs/hero-construction-7yCmYE7gTL3hM6e2YBcmpd.webp";

const PARTNER_COMPANIES = [
  { name: "Keller Group", specialism: "Piling, ground improvement, grouting" },
  { name: "Cementation Skanska", specialism: "Bored piling, diaphragm walls" },
  { name: "Balfour Beatty Ground Engineering", specialism: "CFA piling, driven piling" },
  { name: "Van Elle", specialism: "Driven piling, ground investigation" },
  { name: "Roger Bullivant", specialism: "Driven precast piling, ground beams" },
  { name: "FK Lowry Piling", specialism: "CFA piling, retaining walls" },
  { name: "Bauer Technologies", specialism: "Large diameter piling" },
  { name: "Aarsleff Ground Engineering", specialism: "Driven piling, sheet piling" },
  { name: "Expanded Piling", specialism: "Mini piling, restricted access" },
  { name: "Martello Piling", specialism: "CFA piling, restricted access" },
  { name: "Vibro Menard", specialism: "Ground improvement, stone columns" },
  { name: "Murphy Ground Engineering", specialism: "Piling, retaining structures" },
  { name: "Franki Foundations", specialism: "CFA piling, ground improvement" },
  { name: "Dawson WAM", specialism: "Vibro stone columns" },
  { name: "Stent Foundations", specialism: "Bored piling, ground anchors" },
];

export default function Partner() {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    document.title = "Work With Us — BRE470 Working Platform Design for Piling Contractors | BRE470 Piling Mat Designer";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Partner with Temporary Works Consulting Ltd for BRE470 working platform designs. £299.99 per signed certificate, instant delivery, 23 piling rigs pre-loaded. Contact David Miller.");
    }
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
            <Link href="/for-contractors">
              <Button variant="ghost" size="sm" className="text-sm">
                <Building2 className="w-4 h-4 mr-1" /> For Contractors
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

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMG} alt="Piling rig on working platform" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
        </div>
        <div className="relative z-10 container py-20 sm:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-1.5 mb-6">
              <Handshake className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Work With Us</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              BRE470 Platform Designs
              <span className="text-primary block mt-2">When You Need Them, Not When a Consultant Is Free</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mt-6 max-w-xl leading-relaxed">
              I'm David Miller, Temporary Works Designer. I've built a tool that gives your site teams signed, BRE470-compliant design certificates in minutes — for £299.99 each.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <a href="#contact">
                <Button size="lg" className="h-14 px-8 text-lg font-heading font-bold gap-2 w-full sm:w-auto">
                  <MessageSquare className="w-5 h-5" />
                  Let's Talk
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <Link href="/calculator?demo=true">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-heading border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                  Try the Tool First
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Pitch — What We Solve */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl font-bold mb-6">
              The Service That Solves Your Platform Design Problem
            </h2>
            <div className="prose prose-lg text-muted-foreground space-y-4">
              <p className="text-lg leading-relaxed">
                I'm writing to introduce a service that solves a problem your site teams deal with on almost every piling project — getting a compliant working platform design without the 2–4 week wait and the £2,000+ consultancy fee.
              </p>
              <p className="text-lg leading-relaxed">
                <strong className="text-foreground">The BRE470 Piling Mat Designer</strong> is an online design tool I've built specifically for the UK piling and ground improvement industry. It produces fully certified working platform designs to BRE470 (Appendix A methodology), complete with:
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <FeatureItem icon={<FileCheck className="w-5 h-5" />} text="Interpretive design calculations for cohesive and granular subgrades" />
              <FeatureItem icon={<Calculator className="w-5 h-5" />} text="Platform thickness determination for your specific rig and ground conditions" />
              <FeatureItem icon={<Award className="w-5 h-5" />} text="A signed design certificate with unique reference number" />
              <FeatureItem icon={<Shield className="w-5 h-5" />} text="Full compliance with BS 5975:2024 and CDM 2015 requirements" />
            </div>
            <div className="mt-8 p-6 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-lg">
                <strong className="text-primary text-2xl font-heading">Each design costs £299.99</strong>
                <span className="text-muted-foreground ml-2">— a fraction of traditional consultancy fees — and the certificate is issued immediately after payment. No waiting. No back-and-forth. Your TWC gets a document they can check and approve the same day.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Your site team enters the rig type, outrigger loads, ground conditions, and platform material. The tool runs the BRE470 Appendix A calculation and produces a design certificate signed by me — David Miller, Temporary Works Designer with over 25 years of experience in UK temporary works, including piling platforms, crane bases, and excavation support.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StepCard number={1} title="Enter Parameters" description="Select rig, enter ground conditions, choose platform material. 2 minutes." />
              <StepCard number={2} title="Review Calculation" description="See the full BRE470 Appendix A calculation before you pay." />
              <StepCard number={3} title="Get Certificate" description="Pay £299.99, receive your signed certificate instantly." />
            </div>
            <div className="text-center mt-8">
              <Link href="/calculator?demo=true">
                <Button variant="outline" size="lg" className="gap-2">
                  <Calculator className="w-5 h-5" />
                  Try the Free Demo — No Login Required
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl font-bold mb-4">Why This Matters to Your Business</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Every piling contractor knows the scenario: mobilisation is next week, the platform design hasn't been done, and the TWC is asking questions. Traditional consultancy takes weeks and costs thousands. This tool closes that gap.
            </p>
            <div className="space-y-4">
              <BenefitRow
                icon={<PoundSterling className="w-5 h-5" />}
                title="Your contracts team"
                description="can budget a fixed £299.99 per platform design — no surprise invoices, no consultancy retainers."
              />
              <BenefitRow
                icon={<Clock className="w-5 h-5" />}
                title="Your site agents"
                description="can commission a design the day they need it — no waiting for consultants to respond."
              />
              <BenefitRow
                icon={<FileCheck className="w-5 h-5" />}
                title="Your TWC"
                description="gets a properly documented certificate to review — consistent format, every time, with full audit trail."
              />
              <BenefitRow
                icon={<Zap className="w-5 h-5" />}
                title="Your programme"
                description="stays on track — platform designs no longer hold up rig mobilisation."
              />
            </div>
          </div>
        </div>
      </section>

      {/* CPD Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <GraduationCap className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h2 className="font-heading text-3xl font-bold">CPD for Your Team — £19.99 per person</h2>
              </div>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              I also deliver a 1-hour CPD presentation — <strong className="text-foreground">"BRE470 Compliance Made Simple"</strong> — covering the design methodology, common failure modes, and how to use the tool. It's aimed at TWCs, site agents, piling managers, and graduate engineers. Online or in-person, at a time that suits your team.
            </p>
            <Link href="/cpd">
              <Button size="lg" className="gap-2">
                <GraduationCap className="w-5 h-5" />
                Book a CPD Presentation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Companies We Work With */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl font-bold mb-3 text-center">
              Built for UK Piling & Ground Improvement Specialists
            </h2>
            <p className="text-muted-foreground text-center mb-8 text-lg">
              The tool is designed for the companies that need working platform designs on every project.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PARTNER_COMPANIES.map((company) => (
                <div key={company.name} className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{company.name}</div>
                    <div className="text-xs text-muted-foreground">{company.specialism}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center mt-6">
              Whether you're a specialist piling contractor or a principal contractor with an in-house piling division, the tool works for your team.
            </p>
          </div>
        </div>
      </section>

      {/* Contact / Next Step */}
      <section id="contact" className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl font-bold mb-4">Next Step</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              I'd welcome 15 minutes of your time to walk you through the tool and discuss how it fits your current platform design workflow. I'm available by phone, Teams, or email — whichever suits. Alternatively, your team can start using the tool immediately.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border-2 border-primary/30 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-lg font-bold mb-2">Book a Demo Call</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    15 minutes. I'll walk you through the tool, answer your questions, and discuss how it fits your workflow.
                  </p>
                  <div className="space-y-2">
                    <a href="mailto:temporaryworksconsultingltd@outlook.com?subject=BRE470%20Demo%20Request" className="block">
                      <Button className="w-full gap-2">
                        <Mail className="w-4 h-4" />
                        Email to Book
                      </Button>
                    </a>
                    <a href="tel:+4407900984900" className="block">
                      <Button variant="outline" className="w-full gap-2">
                        <Phone className="w-4 h-4" />
                        07900 984900
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-border hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-lg font-bold mb-2">Start Using It Now</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    No demo needed? Your team can try the free calculator right now and purchase a design when they're ready.
                  </p>
                  <div className="space-y-2">
                    <Link href="/calculator">
                      <Button className="w-full gap-2">
                        <Calculator className="w-4 h-4" />
                        Start a Design
                      </Button>
                    </Link>
                    <Link href="/calculator?demo=true">
                      <Button variant="outline" className="w-full gap-2">
                        <Globe className="w-4 h-4" />
                        Try Free Demo
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* About David */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <Card className="border border-border">
              <CardContent className="p-8">
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-heading font-bold text-primary">25+</div>
                    <div className="text-xs text-muted-foreground">Years Experience</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-heading font-bold text-primary">23</div>
                    <div className="text-xs text-muted-foreground">Piling Rigs Pre-loaded</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-heading font-bold text-primary">£299.99</div>
                    <div className="text-xs text-muted-foreground">Per Design Certificate</div>
                  </div>
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
            Ready to Streamline Your Platform Designs?
          </h2>
          <p className="text-lg mt-4 max-w-xl mx-auto opacity-90">
            £299.99 per design. Signed certificate. BRE470 compliant. Instant delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <a href="mailto:temporaryworksconsultingltd@outlook.com?subject=BRE470%20Partnership%20Enquiry">
              <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-heading font-bold gap-2">
                <Send className="w-5 h-5" />
                Get in Touch
              </Button>
            </a>
            <Link href="/calculator">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-heading border-white/30 text-white hover:bg-white/10 gap-2">
                <Calculator className="w-5 h-5" />
                Start a Design Now
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
                <li><Link href="/for-contractors" className="hover:text-primary transition-colors">For Piling Contractors</Link></li>
                <li><Link href="/cpd" className="hover:text-primary transition-colors">CPD Presentation</Link></li>
                <li><Link href="/blog" className="hover:text-primary transition-colors">Knowledge Base</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm mb-3">Resources</h4>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li><Link href="/blog/what-is-bre470" className="hover:text-primary transition-colors">What Is BRE470?</Link></li>
                <li><Link href="/blog/digitising-bre470-platform-design" className="hover:text-primary transition-colors">BRE470 in the Digital Age</Link></li>
                <li><Link href="/blog/how-to-design-working-platform" className="hover:text-primary transition-colors">How to Design a Working Platform</Link></li>
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

function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <span className="text-sm text-muted-foreground leading-relaxed mt-1">{text}</span>
    </div>
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

function BenefitRow({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <p className="text-muted-foreground leading-relaxed">
        <strong className="text-foreground">{title}</strong> {description}
      </p>
    </div>
  );
}
