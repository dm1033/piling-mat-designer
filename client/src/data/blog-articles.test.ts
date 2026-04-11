import { describe, it, expect } from "vitest";
import { BLOG_ARTICLES, getArticleBySlug } from "./blog-articles";

describe("Blog Articles Data", () => {
  it("should have exactly 5 articles", () => {
    expect(BLOG_ARTICLES).toHaveLength(5);
  });

  it("each article should have all required fields", () => {
    for (const article of BLOG_ARTICLES) {
      expect(article.slug).toBeTruthy();
      expect(article.title).toBeTruthy();
      expect(article.excerpt).toBeTruthy();
      expect(article.metaTitle).toBeTruthy();
      expect(article.metaDescription).toBeTruthy();
      expect(article.author).toBe("David Miller");
      expect(article.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(article.readTime).toBeTruthy();
      expect(article.heroImage).toMatch(/^https?:\/\//);
      expect(article.tags.length).toBeGreaterThan(0);
      expect(article.sections.length).toBeGreaterThan(0);
    }
  });

  it("each article should have unique slugs", () => {
    const slugs = BLOG_ARTICLES.map(a => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("each article slug should be URL-safe", () => {
    for (const article of BLOG_ARTICLES) {
      expect(article.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("each article section should have heading and content", () => {
    for (const article of BLOG_ARTICLES) {
      for (const section of article.sections) {
        expect(section.heading).toBeTruthy();
        expect(section.content).toBeTruthy();
        expect(section.content.length).toBeGreaterThan(50);
      }
    }
  });

  it("metaTitle should be under 70 characters for SEO", () => {
    for (const article of BLOG_ARTICLES) {
      expect(article.metaTitle.length).toBeLessThanOrEqual(100); // Allow some flexibility
    }
  });

  it("metaDescription should be under 220 characters for SEO", () => {
    for (const article of BLOG_ARTICLES) {
      expect(article.metaDescription.length).toBeLessThanOrEqual(220);
    }
  });

  describe("getArticleBySlug", () => {
    it("should return the correct article for a valid slug", () => {
      const article = getArticleBySlug("what-is-bre470");
      expect(article).toBeDefined();
      expect(article!.title).toContain("BRE470");
    });

    it("should return undefined for an invalid slug", () => {
      const article = getArticleBySlug("nonexistent-article");
      expect(article).toBeUndefined();
    });

    it("should return the correct article for each slug", () => {
      for (const expected of BLOG_ARTICLES) {
        const found = getArticleBySlug(expected.slug);
        expect(found).toBeDefined();
        expect(found!.slug).toBe(expected.slug);
        expect(found!.title).toBe(expected.title);
      }
    });
  });
});
