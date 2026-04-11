/**
 * Blog Listing Page — SEO-rich articles targeting piling contractors and TWCs
 */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  HardHat, BookOpen, Calculator, ArrowRight, Clock, User,
  FileCheck, Shield, Tag
} from "lucide-react";
import { BLOG_ARTICLES } from "@/data/blog-articles";

export default function Blog() {
  const { isAuthenticated, user } = useAuth();

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
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="text-sm font-semibold text-primary">
                <BookOpen className="w-4 h-4 mr-1" /> Blog
              </Button>
            </Link>
            {isAuthenticated && (
              <Link href="/my-designs">
                <Button variant="ghost" size="sm" className="text-sm">
                  <FileCheck className="w-4 h-4 mr-1" /> My Designs
                </Button>
              </Link>
            )}
            <Link href="/calculator">
              <Button size="sm" className="text-sm font-semibold">
                <Calculator className="w-4 h-4 mr-1" /> Design Tool
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-muted/30 py-12 border-b border-border">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="font-heading text-3xl sm:text-4xl font-bold">
              BRE470 Knowledge Base
            </h1>
            <p className="text-muted-foreground text-lg mt-3 leading-relaxed">
              Expert articles on working platform design, BRE470 methodology, piling rig selection,
              and temporary works best practice — written by David Miller, Temporary Works Designer.
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 bg-background flex-1">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOG_ARTICLES.map((article) => (
              <Link key={article.slug} href={`/blog/${article.slug}`}>
                <Card className="border border-border hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer h-full">
                  <div className="aspect-[16/9] overflow-hidden rounded-t-lg">
                    <img
                      src={article.heroImage}
                      alt={article.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {article.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>
                    <h2 className="font-heading text-lg font-bold leading-snug mb-2 line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">
                      {article.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                        >
                          <Tag className="w-2.5 h-2.5" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-primary text-sm font-medium flex items-center gap-1">
                      Read article <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary text-primary-foreground py-10">
        <div className="container text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-3">
            Ready to Design Your Working Platform?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-6 max-w-2xl mx-auto">
            Get a professional BRE470 design certificate for £299.99 — full calculations,
            cross-section diagram, and check certificate signed by David Miller.
          </p>
          <Link href="/calculator">
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg font-heading font-bold gap-2 border-white/30 text-white hover:bg-white/10"
            >
              <Calculator className="w-5 h-5" />
              Start Your Design
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                  <HardHat className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-heading font-bold text-sm">BRE470 Piling Mat Designer</span>
              </div>
            </Link>
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
