/**
 * CPD Presentation Request Page
 * "BRE470 Compliance Made Simple" — Free CPD talk for piling contractors & TWCs
 */
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import {
  HardHat,
  BookOpen,
  Calculator,
  GraduationCap,
  Clock,
  Users,
  Target,
  CheckCircle2,
  Award,
  Send,
  ArrowLeft,
  Shield,
  Lightbulb,
  FileText,
} from "lucide-react";

const LEARNING_OUTCOMES = [
  {
    icon: FileText,
    title: "Understand BRE470 Methodology",
    description: "Learn the Appendix A calculation process for cohesive and granular subgrades, including partial factors and load combinations.",
  },
  {
    icon: Shield,
    title: "Regulatory Compliance",
    description: "Understand your duties under CDM 2015, BS 5975:2024, and the TWf guidance for working platform design and inspection.",
  },
  {
    icon: Calculator,
    title: "Practical Design Application",
    description: "Walk through a live design example using the BRE470 Piling Mat Designer tool — from soil parameters to signed certificate.",
  },
  {
    icon: Target,
    title: "Common Failure Modes",
    description: "Identify the most common causes of platform failure: inadequate thickness, poor compaction, drainage issues, and overloading.",
  },
  {
    icon: Lightbulb,
    title: "Cost & Programme Benefits",
    description: "Understand how digital design tools reduce turnaround from weeks to minutes, cutting costs by 50-70% vs traditional consultancy.",
  },
  {
    icon: Award,
    title: "Certificate of Attendance",
    description: "All attendees receive a CPD certificate confirming structured learning in BRE470 working platform design.",
  },
];

const TALK_DETAILS = [
  { label: "Duration", value: "45 minutes + 15 min Q&A", icon: Clock },
  { label: "Audience", value: "TWCs, Site Agents, Piling Managers, Design Engineers", icon: Users },
  { label: "Format", value: "Online (Teams/Zoom) or In-Person", icon: Target },
  { label: "Cost", value: "Free of charge", icon: CheckCircle2 },
  { label: "CPD Hours", value: "1 hour structured CPD", icon: GraduationCap },
  { label: "Presenter", value: "David Miller, Temporary Works Designer", icon: HardHat },
];

export default function CPD() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    contactName: "",
    companyName: "",
    email: "",
    phone: "",
    jobTitle: "",
    preferredDate: "",
    attendees: "",
    format: "either" as "online" | "in-person" | "either",
    additionalNotes: "",
  });

  const submitMutation = trpc.cpd.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("CPD request submitted — we'll be in touch shortly.");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit request. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.contactName || !form.companyName || !form.email) {
      toast.error("Please fill in all required fields.");
      return;
    }
    submitMutation.mutate(form);
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

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
            <Link href="/calculator">
              <Button size="sm" className="text-sm font-semibold">
                <Calculator className="w-4 h-4 mr-1" /> Design Tool
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 md:py-24">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <GraduationCap className="w-4 h-4" />
            Free CPD Presentation
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-bold tracking-tight mb-4">
            BRE470 Compliance<br />Made Simple
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            A practical, 1-hour CPD talk on working platform design for piling contractors,
            temporary works coordinators, and site engineers. Delivered by David Miller,
            Temporary Works Designer with 25+ years of experience.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="#request-form">
              <Button size="lg" className="font-semibold">
                <Send className="w-4 h-4 mr-2" /> Request a Presentation
              </Button>
            </a>
            <Link href="/calculator">
              <Button size="lg" variant="outline" className="font-semibold">
                <Calculator className="w-4 h-4 mr-2" /> Try the Design Tool
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Talk Details Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-10">
            Presentation Details
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {TALK_DETAILS.map((item) => (
              <Card key={item.label} className="text-center">
                <CardContent className="pt-6 pb-4">
                  <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                  <p className="font-semibold text-sm">{item.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Outcomes */}
      <section className="py-16">
        <div className="container max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-4">
            What Your Team Will Learn
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            This CPD presentation covers the essential knowledge every temporary works coordinator,
            piling manager, and site agent needs for BRE470 compliant working platform design.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LEARNING_OUTCOMES.map((outcome) => (
              <Card key={outcome.title} className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <outcome.icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{outcome.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{outcome.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Who Should Attend */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-8">
            Who Should Attend?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Temporary Works Coordinators",
                desc: "Understand the design methodology behind the certificates you approve. Know what to check and what questions to ask the designer.",
              },
              {
                title: "Piling Managers & Supervisors",
                desc: "Learn how platform thickness is determined for your rigs. Understand why different rigs need different platforms.",
              },
              {
                title: "Site Agents & Project Managers",
                desc: "Reduce programme delays by understanding the platform design process. Know when to commission a design and what information is needed.",
              },
              {
                title: "Design Engineers & Graduates",
                desc: "Master the BRE470 Appendix A calculation methodology. Understand the engineering principles behind working platform design.",
              },
            ].map((item) => (
              <Card key={item.title}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Request Form */}
      <section id="request-form" className="py-16">
        <div className="container max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-4">
            Request a CPD Presentation
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            Fill in the form below and we'll get back to you within 48 hours to arrange your presentation.
          </p>

          {submitted ? (
            <Card className="text-center py-12">
              <CardContent>
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-heading font-bold mb-2">Request Submitted</h3>
                <p className="text-muted-foreground mb-6">
                  Thank you for your interest. David Miller will be in touch within 48 hours
                  to arrange your CPD presentation.
                </p>
                <div className="flex justify-center gap-3">
                  <Link href="/">
                    <Button variant="outline">
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Button>
                  </Link>
                  <Link href="/calculator">
                    <Button>
                      <Calculator className="w-4 h-4 mr-2" /> Try the Design Tool
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Contact Details */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      Contact Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactName">Your Name *</Label>
                        <Input
                          id="contactName"
                          placeholder="e.g. John Smith"
                          value={form.contactName}
                          onChange={(e) => updateField("contactName", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input
                          id="companyName"
                          placeholder="e.g. Keller Group"
                          value={form.companyName}
                          onChange={(e) => updateField("companyName", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@company.com"
                          value={form.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="07xxx xxxxxx"
                          value={form.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input
                        id="jobTitle"
                        placeholder="e.g. Temporary Works Coordinator"
                        value={form.jobTitle}
                        onChange={(e) => updateField("jobTitle", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Presentation Preferences */}
                  <div className="space-y-4 pt-2">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      Presentation Preferences
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="preferredDate">Preferred Date / Month</Label>
                        <Input
                          id="preferredDate"
                          placeholder="e.g. June 2026, or flexible"
                          value={form.preferredDate}
                          onChange={(e) => updateField("preferredDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="attendees">Number of Attendees</Label>
                        <Input
                          id="attendees"
                          placeholder="e.g. 10-15"
                          value={form.attendees}
                          onChange={(e) => updateField("attendees", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="format">Delivery Format</Label>
                      <Select
                        value={form.format}
                        onValueChange={(val) => updateField("format", val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="online">Online (Teams / Zoom)</SelectItem>
                          <SelectItem value="in-person">In-Person (at your office/site)</SelectItem>
                          <SelectItem value="either">Either — No Preference</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any specific topics you'd like covered, or questions for the presenter..."
                        rows={3}
                        value={form.additionalNotes}
                        onChange={(e) => updateField("additionalNotes", e.target.value)}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full font-semibold"
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" /> Submit CPD Request
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By submitting this form, you agree to be contacted by Temporary Works Consulting Ltd
                    regarding your CPD presentation request. We will not share your details with third parties.
                  </p>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 mt-auto">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Temporary Works Consulting Ltd. All rights reserved.</p>
          <p className="mt-1">
            David Miller — Temporary Works Designer | 
            <a href="mailto:temporaryworksconsultingltd@outlook.com" className="text-primary hover:underline ml-1">
              temporaryworksconsultingltd@outlook.com
            </a> | 
            <a href="tel:07900984900" className="text-primary hover:underline ml-1">07900 984900</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
