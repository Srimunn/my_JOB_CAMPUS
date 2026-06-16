"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ARTICLES, Article } from "@/lib/data";
import { Calendar, User, Clock, ArrowRight, BookOpen } from "lucide-react";
import { BlogSidebar } from "@/components/site/BlogSidebar";

// Category definitions
const BLOG_CATEGORIES = ["Interview", "Jobs", "Resume", "Tips", "Uncategorized"] as const;

// Custom SVGs for blog illustrations based on categories
function BlogIllustration({ category, title }: { category: string; title: string }) {
  const isInterview = category.includes("Interview");
  const isJobs = category.includes("Jobs") || title.includes("Jobs") || title.includes("Career");
  const isResume = category.includes("Resume") || title.includes("Resume") || title.includes("CV");
  const isTips = category.includes("Tips") || title.includes("Tips") || title.includes("How to");

  if (isInterview) {
    return (
      <svg
        className="w-full h-full text-primary/80"
        viewBox="0 0 200 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad-interview" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-hero-blue)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--color-hero-blue-deep)" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <rect width="200" height="120" rx="16" fill="url(#grad-interview)" />
        {/* Background bubbles */}
        <circle cx="35" cy="40" r="25" fill="var(--color-primary)" fillOpacity="0.04" />
        <circle cx="165" cy="80" r="30" fill="var(--color-primary)" fillOpacity="0.03" />
        {/* Interacting figures (simplified avatar symbols) */}
        <rect
          x="50"
          y="55"
          width="28"
          height="32"
          rx="6"
          fill="var(--color-primary)"
          fillOpacity="0.1"
          stroke="var(--color-primary)"
          strokeWidth="1.5"
        />
        <circle
          cx="64"
          cy="42"
          r="10"
          fill="var(--color-primary)"
          fillOpacity="0.15"
          stroke="var(--color-primary)"
          strokeWidth="1.5"
        />

        <rect
          x="122"
          y="55"
          width="28"
          height="32"
          rx="6"
          fill="var(--color-accent)"
          fillOpacity="0.1"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
        />
        <circle
          cx="136"
          cy="42"
          r="10"
          fill="var(--color-accent)"
          fillOpacity="0.15"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
        />

        {/* Dialog bubble connecting them */}
        <path
          d="M 85 45 L 115 45 L 110 52 L 95 52 Z"
          fill="var(--color-accent)"
          fillOpacity="0.2"
        />
        <line
          x1="90"
          y1="48"
          x2="110"
          y2="48"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <path
          d="M 75 75 H 125"
          stroke="var(--color-border)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
      </svg>
    );
  }

  if (isJobs) {
    return (
      <svg
        className="w-full h-full text-primary/80"
        viewBox="0 0 200 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad-jobs" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--color-hero-blue-deep)" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <rect width="200" height="120" rx="16" fill="url(#grad-jobs)" />
        <circle cx="150" cy="40" r="20" fill="var(--color-accent)" fillOpacity="0.05" />
        {/* Briefcase */}
        <rect
          x="65"
          y="45"
          width="70"
          height="45"
          rx="8"
          fill="var(--color-primary)"
          fillOpacity="0.1"
          stroke="var(--color-primary)"
          strokeWidth="2"
        />
        <path
          d="M 85 45 V 35 C 85 32.7 86.8 31 89 31 H 111 C 113.2 31 115 32.7 115 35 V 45"
          stroke="var(--color-primary)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect
          x="92"
          y="60"
          width="16"
          height="10"
          rx="2"
          fill="var(--color-card)"
          stroke="var(--color-primary)"
          strokeWidth="1.5"
        />
        {/* Growing graph overlay */}
        <path
          d="M 40 90 L 75 70 L 110 78 L 160 40"
          stroke="var(--color-accent)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="160" cy="40" r="5" fill="var(--color-accent)" />
      </svg>
    );
  }

  if (isResume) {
    return (
      <svg
        className="w-full h-full text-primary/80"
        viewBox="0 0 200 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad-resume" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-hero-blue-deep)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.04" />
          </linearGradient>
        </defs>
        <rect width="200" height="120" rx="16" fill="url(#grad-resume)" />
        <circle cx="40" cy="80" r="25" fill="var(--color-primary)" fillOpacity="0.04" />
        {/* Resume document sheet */}
        <rect
          x="70"
          y="25"
          width="60"
          height="75"
          rx="4"
          fill="var(--color-card)"
          stroke="var(--color-border)"
          strokeWidth="2"
        />
        {/* Header lines */}
        <rect
          x="80"
          y="37"
          width="20"
          height="6"
          rx="1"
          fill="var(--color-primary)"
          fillOpacity="0.25"
        />
        <circle cx="118" cy="40" r="5" fill="var(--color-accent)" fillOpacity="0.3" />
        {/* Text lines */}
        <line
          x1="80"
          y1="52"
          x2="120"
          y2="52"
          stroke="var(--color-border)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="80"
          y1="62"
          x2="115"
          y2="62"
          stroke="var(--color-border)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="80"
          y1="72"
          x2="120"
          y2="72"
          stroke="var(--color-border)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="80"
          y1="82"
          x2="100"
          y2="82"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Checkmark badge */}
        <circle
          cx="132"
          cy="85"
          r="14"
          fill="var(--color-accent)"
          fillOpacity="0.1"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
        />
        <path
          d="M 127 85 L 131 89 L 138 81"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // default / Tips / Uncategorized
  return (
    <svg
      className="w-full h-full text-primary/80"
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="grad-default" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-hero-blue)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <rect width="200" height="120" rx="16" fill="url(#grad-default)" />
      {/* Lightbulb */}
      <circle
        cx="100"
        cy="52"
        r="22"
        fill="var(--color-card)"
        stroke="var(--color-primary)"
        strokeWidth="2"
      />
      <path
        d="M 90 70 H 110 M 93 75 H 107 M 97 80 H 103"
        stroke="var(--color-primary)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Glow rays */}
      <line
        x1="100"
        y1="20"
        x2="100"
        y2="26"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="72"
        y1="36"
        x2="77"
        y2="41"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="128"
        y1="36"
        x2="123"
        y2="41"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="68"
        y1="52"
        x2="62"
        y2="52"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="132"
        y1="52"
        x2="138"
        y2="52"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Little stars */}
      <path
        d="M 45 35 L 47 39 L 51 39 L 48 41 L 49 45 L 45 42 L 41 45 L 42 41 L 39 39 L 43 39 Z"
        fill="var(--color-accent)"
        fillOpacity="0.3"
      />
      <path
        d="M 155 75 L 157 79 L 161 79 L 158 81 L 159 85 L 155 82 L 151 85 L 152 81 L 149 79 L 153 79 Z"
        fill="var(--color-accent)"
        fillOpacity="0.3"
      />
    </svg>
  );
}

function CareerGuidanceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeCategoryParam = searchParams.get("category");
  const activeSearchParam = searchParams.get("search");
  const activeTagParam = searchParams.get("tag");

  const initialCategory =
    activeCategoryParam && (BLOG_CATEGORIES as readonly string[]).includes(activeCategoryParam)
      ? activeCategoryParam
      : "Interview"; // default to Interview as shown in first screen

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState(activeSearchParam || "");
  const [selectedTag, setSelectedTag] = useState<string | null>(activeTagParam);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync state with query params
  useMemo(() => {
    if (
      activeCategoryParam &&
      (BLOG_CATEGORIES as readonly string[]).includes(activeCategoryParam)
    ) {
      setSelectedCategory(activeCategoryParam);
    }
    setSearchQuery(activeSearchParam || "");
    setSelectedTag(activeTagParam || null);
    setCurrentPage(1);
  }, [activeCategoryParam, activeSearchParam, activeTagParam]);

  // Handler for category click
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedTag(null);
    setCurrentPage(1);
    router.push(`/career-guidance?category=${encodeURIComponent(category)}`);
  };

  // Filter articles based on Category, Search Query, and Tag
  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((article) => {
      // 1. Category Filter: Matches category array (ignored when tag filter is active)
      const matchesCategory = selectedTag ? true : article.categories.includes(selectedCategory);

      // 2. Search Query Filter: Matches title or excerpt or content
      const matchesSearch = searchQuery
        ? article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.content.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;

      // 3. Tag Filter: Matches selected tag (with smart fallbacks for Career/Future)
      const matchesTag = selectedTag
        ? article.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase()) ||
          (selectedTag.toLowerCase() === "career" && !article.categories.includes("Uncategorized"))
        : true;

      return matchesCategory && matchesSearch && matchesTag;
    });
  }, [selectedCategory, searchQuery, selectedTag]);

  // Pagination logic (6 cards per page)
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage) || 1;
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredArticles.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredArticles, currentPage]);

  return (
    <SiteLayout>
      {/* Main Blog Body Container */}
      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        {/* Simple Bold Heading matching mockup */}
        <div className="mb-10">
          <h1 className="font-display text-4xl font-extrabold text-[#0d1b3e] tracking-tight">
            {selectedTag ? `Tag: ${selectedTag}` : `Category: ${selectedCategory}`}
          </h1>
        </div>

        {/* 2-Column Split: Cards Grid (left) + Sidebar (right) */}
        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          {/* Left Column: Article cards list */}
          <div className="flex flex-col gap-8">
            {paginatedArticles.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {paginatedArticles.map((article, idx) => (
                  <article
                    key={article.slug}
                    style={{ animationDelay: `${idx * 80}ms` }}
                    className="group overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft hover:shadow-[0_20px_40px_rgba(8,112,184,0.12)] hover:border-primary/20 hover:-translate-y-2 transition-all duration-300 flex flex-col h-full animate-fade-in-up"
                  >
                    {/* Top Illustration container */}
                    <div className="h-44 bg-[#f5efe6]/70 p-4 flex items-center justify-center relative overflow-hidden border-b border-border/50 group-hover:scale-[1.01] transition-transform duration-300">
                      <div className="w-full h-full max-w-[180px] transition-transform duration-500 group-hover:scale-105">
                        <BlogIllustration category={article.categories[0]} title={article.title} />
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      {/* Metadata block: Date and category links */}
                      <div className="text-xs text-muted-foreground/85 font-semibold mb-3 space-y-1">
                        <div className="text-muted-foreground/80 font-medium">{article.date}</div>
                        <div className="text-[#3b82f6] font-extrabold text-[13px] tracking-wide">
                          {article.categories.join("   •   ")}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-extrabold text-[#0d1b3e] leading-snug group-hover:text-primary transition-colors duration-200">
                        <Link href={`/career-guidance/${article.slug}`}>{article.title}</Link>
                      </h3>

                      {/* Excerpt */}
                      <p className="mt-3 text-sm text-muted-foreground/95 leading-relaxed flex-grow">
                        {article.excerpt}
                      </p>

                      {/* Bottom action link */}
                      <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between">
                        <Link
                          href={`/career-guidance/${article.slug}`}
                          className="text-sm font-bold text-accent hover:underline flex items-center gap-1 transition-colors duration-150"
                        >
                          Read more <span className="font-sans font-semibold">&gt;</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 rounded-3xl border border-dashed border-border bg-card">
                <BookOpen className="h-12 w-12 text-muted-foreground/60 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-foreground">No articles found</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                  We couldn't find any articles matching this filter. Try adjusting your search
                  query or selecting a different category.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTag(null);
                  }}
                  className="mt-6 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-xs font-bold shadow hover:shadow-md transition-all"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-6 pt-6 border-t border-border/60 flex items-center justify-between">
                {/* Page Number Buttons */}
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 250, behavior: "smooth" });
                      }}
                      className={`h-9 w-9 rounded-full text-xs font-bold transition-all ${
                        currentPage === page
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-card border border-border text-foreground hover:bg-muted"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Show Me More button */}
                {currentPage < totalPages && (
                  <button
                    onClick={() => {
                      setCurrentPage((prev) => prev + 1);
                      window.scrollTo({ top: 250, behavior: "smooth" });
                    }}
                    className="px-6 py-2.5 bg-accent text-accent-foreground rounded-full text-xs font-bold flex items-center gap-1.5 hover:bg-accent/90 shadow-sm transition-all"
                  >
                    Show me more <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>{" "}
          {/* Right Column: Blog Sidebar */}
          <div className="h-fit">
            <BlogSidebar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={handleCategorySelect}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

export default function Career() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[80vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <CareerGuidanceContent />
    </Suspense>
  );
}
