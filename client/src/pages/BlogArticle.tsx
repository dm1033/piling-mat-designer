/**
 * Blog Article Page — Individual SEO-rich article with structured content
 * Updates document title and meta description for each article
 */
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useParams } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  HardHat, BookOpen, Calculator, ArrowLeft, ArrowRight, Clock, User,
  FileCheck, Tag, Share2, CheckCircle2
} from "lucide-react";
import { BLOG_ARTICLES, getArticleBySlug } from "@/data/blog-articles";

export default function BlogArticle() {
  const { isAuthenticated } = useAuth();
  const params = useParams<{ slug: string }>();
  const article = getArticleBySlug(params.slug || "");

  // Update document title, meta, canonical, and JSON-LD for SEO
  useEffect(() => {
    if (article) {
      const articleUrl = `https://www.bre470pilingmatdesign.com/blog/${article.slug}`;

      // Title & description
      document.title = article.metaTitle;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", article.metaDescription);

      // OG tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute("content", article.metaTitle);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute("content", article.metaDescription);
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute("content", articleUrl);

      // Canonical URL
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", articleUrl);

      // JSON-LD Article structured data
      let jsonLd = document.getElementById("article-jsonld");
      if (!jsonLd) {
        jsonLd = document.createElement("script");
        jsonLd.id = "article-jsonld";
        jsonLd.setAttribute("type", "application/ld+json");
        document.head.appendChild(jsonLd);
      }
      jsonLd.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "description": article.metaDescription,
        "author": {
          "@type": "Person",
          "name": article.author,
          "jobTitle": "Temporary Works Designer"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Temporary Works Consulting Ltd"
        },
        "datePublished": article.date,
        "url": articleUrl,
        "image": article.heroImage,
        "keywords": article.tags.join(", ")
      });
    }
    return () => {
      // Reset on unmount
      document.title = "BRE470 Piling Mat Designer \u2014 Professional Working Platform Design Certificates";
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute("href", "https://www.bre470pilingmatdesign.com");
      const jsonLd = document.getElementById("article-jsonld");
      if (jsonLd) jsonLd.remove();
    };
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h1 className="font-heading text-2xl font-bold mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
        <Link href="/blog">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  // Find related articles (exclude current)
  const related = BLOG_ARTICLES.filter(a => a.slug !== article.slug).slice(0, 2);

  // Current article index for prev/next
  const currentIdx = BLOG_ARTICLES.findIndex(a => a.slug === article.slug);
  const prevArticle = currentIdx > 0 ? BLOG_ARTICLES[currentIdx - 1] : null;
  const nextArticle = currentIdx < BLOG_ARTICLES.length - 1 ? BLOG_ARTICLES[currentIdx + 1] : null;

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
              <Button variant="ghost" size="sm" className="text-sm">
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

      {/* Article Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={article.heroImage} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
        </div>
        <div className="relative z-10 container py-16 sm:py-20">
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white mb-6 -ml-2 gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Button>
          </Link>
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-xs bg-primary/20 text-primary border border-primary/30 px-2.5 py-1 rounded-full"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-4xl">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 mt-6 text-white/70 text-sm">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {article.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {article.readTime}
            </span>
            <span>{new Date(article.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12 bg-background flex-1">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Excerpt / Lead */}
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 border-l-4 border-primary pl-6 italic">
              {article.excerpt}
            </p>

            {/* Table of Contents */}
            <Card className="mb-10 border border-border">
              <CardContent className="pt-5 pb-4">
                <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  In This Article
                </h2>
                <ol className="space-y-1.5">
                  {article.sections.map((section, i) => (
                    <li key={i}>
                      <a
                        href={`#section-${i}`}
                        className="text-sm text-primary hover:underline flex items-center gap-2"
                      >
                        <span className="text-muted-foreground w-5 text-right">{i + 1}.</span>
                        {section.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Sections */}
            {article.sections.map((section, i) => (
              <section key={i} id={`section-${i}`} className="mb-10">
                <h2 className="font-heading text-2xl font-bold mb-4 scroll-mt-20">
                  {section.heading}
                </h2>
                <div className="prose prose-slate max-w-none">
                  {section.content.split("\n\n").map((paragraph, j) => {
                    // Handle bold text with **
                    const renderParagraph = (text: string) => {
                      const parts = text.split(/(\*\*[^*]+\*\*)/g);
                      return parts.map((part, k) => {
                        if (part.startsWith("**") && part.endsWith("**")) {
                          return <strong key={k}>{part.slice(2, -2)}</strong>;
                        }
                        return <span key={k}>{part}</span>;
                      });
                    };

                    const trimmed = paragraph.trim();
                    if (!trimmed) return null;

                    return (
                      <p key={j} className="text-foreground/85 leading-relaxed mb-4">
                        {renderParagraph(trimmed)}
                      </p>
                    );
                  })}
                </div>
              </section>
            ))}

            {/* CTA Box */}
            <Card className="border-2 border-primary bg-primary/5 my-10">
              <CardContent className="pt-6 pb-6 text-center">
                <CheckCircle2 className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-heading text-xl font-bold mb-2">
                  Get Your BRE470 Design Certificate
                </h3>
                <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
                  Professional working platform design with full calculations and check certificate
                  signed by David Miller — £299.99 per design.
                </p>
                <Link href="/calculator">
                  <Button size="lg" className="h-12 px-8 font-heading font-bold gap-2">
                    <Calculator className="w-5 h-5" />
                    Start Your Design
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Share */}
            <div className="flex items-center gap-3 py-6 border-t border-border">
              <Share2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Share this article:</span>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://www.bre470pilingmatdesign.com/blog/${article.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                LinkedIn
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(`Read this article: https://www.bre470pilingmatdesign.com/blog/${article.slug}`)}`}
                className="text-sm text-primary hover:underline"
              >
                Email
              </a>
            </div>

            {/* Prev / Next Navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-t border-border">
              {prevArticle ? (
                <Link href={`/blog/${prevArticle.slug}`}>
                  <Card className="border border-border hover:border-primary/30 transition-colors cursor-pointer h-full">
                    <CardContent className="pt-4 pb-4">
                      <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                        <ArrowLeft className="w-3 h-3" /> Previous
                      </span>
                      <span className="text-sm font-medium line-clamp-2">{prevArticle.title}</span>
                    </CardContent>
                  </Card>
                </Link>
              ) : <div />}
              {nextArticle ? (
                <Link href={`/blog/${nextArticle.slug}`}>
                  <Card className="border border-border hover:border-primary/30 transition-colors cursor-pointer h-full">
                    <CardContent className="pt-4 pb-4 text-right">
                      <span className="text-xs text-muted-foreground flex items-center gap-1 justify-end mb-1">
                        Next <ArrowRight className="w-3 h-3" />
                      </span>
                      <span className="text-sm font-medium line-clamp-2">{nextArticle.title}</span>
                    </CardContent>
                  </Card>
                </Link>
              ) : <div />}
            </div>
          </div>

          {/* Related Articles */}
          {related.length > 0 && (
            <div className="max-w-3xl mx-auto mt-6">
              <h3 className="font-heading text-xl font-bold mb-4">Related Articles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map((rel) => (
                  <Link key={rel.slug} href={`/blog/${rel.slug}`}>
                    <Card className="border border-border hover:shadow-md hover:border-primary/30 transition-all cursor-pointer h-full">
                      <div className="aspect-[16/9] overflow-hidden rounded-t-lg">
                        <img
                          src={rel.heroImage}
                          alt={rel.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="pt-3 pb-4">
                        <h4 className="font-heading text-sm font-bold leading-snug line-clamp-2 mb-1">
                          {rel.title}
                        </h4>
                        <span className="text-xs text-muted-foreground">{rel.readTime}</span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

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
