"use client";

import { use, useState, useMemo, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ARTICLES, Article } from "@/lib/data";
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Share2,
  Send,
  MessageSquare,
  ChevronRight,
  ArrowRight,
  Globe,
  Mail,
  Edit3,
  Bookmark,
} from "lucide-react";
import { BlogSidebar } from "@/components/site/BlogSidebar";

// Custom SVGs for blog illustrations (reused from main list for consistency)
function BlogIllustration({ category, title }: { category: string; title: string }) {
  const isInterview = category.includes("Interview");
  const isJobs = category.includes("Jobs") || title.includes("Jobs") || title.includes("Career");
  const isResume = category.includes("Resume") || title.includes("Resume") || title.includes("CV");
  const isTips = category.includes("Tips") || title.includes("Tips") || title.includes("How to");

  if (isInterview) {
    return (
      <svg
        className="w-full h-full max-h-[340px] text-primary/80"
        viewBox="0 0 200 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad-detail-interview" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-hero-blue)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--color-hero-blue-deep)" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        <rect width="200" height="120" rx="16" fill="url(#grad-detail-interview)" />
        <circle cx="35" cy="40" r="25" fill="var(--color-primary)" fillOpacity="0.04" />
        <circle cx="165" cy="80" r="30" fill="var(--color-primary)" fillOpacity="0.03" />

        {/* Figure 1 */}
        <rect
          x="45"
          y="50"
          width="32"
          height="38"
          rx="8"
          fill="var(--color-primary)"
          fillOpacity="0.1"
          stroke="var(--color-primary)"
          strokeWidth="1.5"
        />
        <circle
          cx="61"
          cy="35"
          r="11"
          fill="var(--color-primary)"
          fillOpacity="0.15"
          stroke="var(--color-primary)"
          strokeWidth="1.5"
        />

        {/* Figure 2 */}
        <rect
          x="123"
          y="50"
          width="32"
          height="38"
          rx="8"
          fill="var(--color-accent)"
          fillOpacity="0.1"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
        />
        <circle
          cx="139"
          cy="35"
          r="11"
          fill="var(--color-accent)"
          fillOpacity="0.15"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
        />

        {/* Interaction Bubbles */}
        <path
          d="M 80 40 C 80 32 90 28 100 28 C 110 28 120 32 120 40 C 120 45 115 48 110 50 L 112 55 L 102 50 C 90 50 80 45 80 40 Z"
          fill="var(--color-accent)"
          fillOpacity="0.15"
          stroke="var(--color-accent)"
          strokeWidth="1"
        />
        <circle cx="95" cy="40" r="2" fill="var(--color-accent)" />
        <circle cx="100" cy="40" r="2" fill="var(--color-accent)" />
        <circle cx="105" cy="40" r="2" fill="var(--color-accent)" />
      </svg>
    );
  }

  if (isJobs) {
    return (
      <svg
        className="w-full h-full max-h-[340px] text-primary/80"
        viewBox="0 0 200 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad-detail-jobs" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--color-hero-blue-deep)" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        <rect width="200" height="120" rx="16" fill="url(#grad-detail-jobs)" />
        <circle cx="150" cy="35" r="22" fill="var(--color-accent)" fillOpacity="0.05" />
        {/* Big Briefcase */}
        <rect
          x="60"
          y="40"
          width="80"
          height="50"
          rx="10"
          fill="var(--color-primary)"
          fillOpacity="0.1"
          stroke="var(--color-primary)"
          strokeWidth="2"
        />
        <path
          d="M 82 40 V 28 C 82 25 84 23 87 23 H 113 C 116 23 118 25 118 28 V 40"
          stroke="var(--color-primary)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect
          x="91"
          y="58"
          width="18"
          height="12"
          rx="3"
          fill="var(--color-card)"
          stroke="var(--color-primary)"
          strokeWidth="1.5"
        />

        {/* Abstract floating nodes */}
        <line x1="30" y1="85" x2="60" y2="60" stroke="var(--color-border)" strokeWidth="1.5" />
        <line x1="170" y1="85" x2="140" y2="60" stroke="var(--color-border)" strokeWidth="1.5" />
        <circle cx="30" cy="85" r="6" fill="var(--color-accent)" />
        <circle cx="170" cy="85" r="6" fill="var(--color-hero-blue)" />
      </svg>
    );
  }

  if (isResume) {
    return (
      <svg
        className="w-full h-full max-h-[340px] text-primary/80"
        viewBox="0 0 200 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad-detail-resume" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-hero-blue-deep)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.06" />
          </linearGradient>
        </defs>
        <rect width="200" height="120" rx="16" fill="url(#grad-detail-resume)" />
        {/* Resume paper sheet */}
        <rect
          x="65"
          y="20"
          width="70"
          height="85"
          rx="6"
          fill="var(--color-card)"
          stroke="var(--color-border)"
          strokeWidth="2"
        />
        {/* Text rows */}
        <rect
          x="75"
          y="32"
          width="25"
          height="8"
          rx="2"
          fill="var(--color-primary)"
          fillOpacity="0.25"
        />
        <circle cx="120" cy="36" r="6" fill="var(--color-accent)" fillOpacity="0.3" />

        <line
          x1="75"
          y1="50"
          x2="125"
          y2="50"
          stroke="var(--color-border)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="75"
          y1="62"
          x2="120"
          y2="62"
          stroke="var(--color-border)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="75"
          y1="74"
          x2="125"
          y2="74"
          stroke="var(--color-border)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="75"
          y1="86"
          x2="105"
          y2="86"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Floating badge */}
        <circle
          cx="145"
          cy="80"
          r="16"
          fill="var(--color-accent)"
          fillOpacity="0.15"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
        />
        <path
          d="M 139 80 L 143 84 L 151 75"
          stroke="var(--color-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      className="w-full h-full max-h-[340px] text-primary/80"
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="grad-detail-default" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-hero-blue)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <rect width="200" height="120" rx="16" fill="url(#grad-detail-default)" />
      {/* Huge Lightbulb */}
      <circle
        cx="100"
        cy="50"
        r="24"
        fill="var(--color-card)"
        stroke="var(--color-primary)"
        strokeWidth="2"
      />
      <path
        d="M 88 70 H 112 M 92 76 H 108 M 96 82 H 104"
        stroke="var(--color-primary)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Sparks */}
      <line
        x1="100"
        y1="15"
        x2="100"
        y2="22"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="68"
        y1="32"
        x2="74"
        y2="38"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="132"
        y1="32"
        x2="126"
        y2="38"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostDetail({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  // Search local storage or hardcoded ARTICLES
  const article = useMemo(() => {
    return ARTICLES.find((a) => a.slug === slug);
  }, [slug]);

  // Comments form state
  const [commentText, setCommentText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [authorWebsite, setAuthorWebsite] = useState("");
  const [saveInfo, setSaveInfo] = useState(false);
  const [submittedComment, setSubmittedComment] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  // Related posts: show up to 4 articles from the same categories/tags (excluding this one)
  const relatedArticles = useMemo(() => {
    if (!article) return [];
    return ARTICLES.filter(
      (a) =>
        a.slug !== article.slug &&
        (a.categories.some((c) => article.categories.includes(c)) ||
          a.tags.some((t) => article.tags.includes(t))),
    ).slice(0, 4);
  }, [article]);

  if (!article) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-xl text-center py-24 px-4">
          <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground">Article Not Found</h2>
          <p className="text-sm text-muted-foreground mt-2">
            The article you are looking for does not exist or has been relocated.
          </p>
          <Link href="/career-guidance">
            <button className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-bold shadow hover:shadow-md transition-all">
              Back to Career Guidance
            </button>
          </Link>
        </div>
      </SiteLayout>
    );
  }

  // Handle comment submit
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText || !authorName || !authorEmail) return;

    setSubmittedComment(true);
    // Reset fields after submit mockup
    setCommentText("");
    setAuthorName("");
    setAuthorEmail("");
    setAuthorWebsite("");
  };

  return (
    <SiteLayout>
      {/* Blog header section */}
      <section className="bg-card border-b border-border/80 py-10">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <Link
            href="/career-guidance"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent/80 transition-colors uppercase tracking-wider mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Articles
          </Link>

          {/* Heading */}
          <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl text-foreground max-w-4xl leading-tight">
            {article.title}
          </h1>

          {/* Subheader / Excerpt */}
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {article.excerpt}
          </p>

          {/* Article Info Bar */}
          <div className="mt-8 pt-6 border-t border-border/60 flex flex-wrap items-center gap-y-4 gap-x-6 text-sm text-muted-foreground font-medium">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" /> {article.date}
            </span>
            <span className="text-muted-foreground/45">•</span>
            <span className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" /> By {article.author}
            </span>
            <span className="text-muted-foreground/45">•</span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> {article.readTime}
            </span>
            <span className="text-muted-foreground/45">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground/75">Posted in</span>
              {article.categories.map((cat, idx) => (
                <span key={cat} className="inline-flex items-center">
                  <Link
                    href={`/career-guidance?category=${encodeURIComponent(cat)}`}
                    className="text-primary font-bold hover:underline"
                  >
                    {cat}
                  </Link>
                  {idx < article.categories.length - 1 && (
                    <span className="mx-1 text-muted-foreground/60">&bull;</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid content */}
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[1fr_280px] lg:px-8">
        {/* Left Column: Post Details */}
        <div className="space-y-10">
          {/* Post Image Illustration */}
          <div className="rounded-3xl border border-border bg-gradient-to-br from-secondary/60 to-[#f5ebe6]/30 p-8 flex items-center justify-center relative overflow-hidden shadow-sm">
            <div className="w-full max-w-[280px] aspect-video flex items-center justify-center">
              <BlogIllustration category={article.categories[0]} title={article.title} />
            </div>
          </div>

          {/* Post Content paragraphs */}
          <article className="prose prose-slate max-w-none text-foreground/90 text-justify">
            {article.content.map((paragraph, index) => {
              // Highlight the first paragraph slightly
              const isFirst = index === 0;
              return (
                <p
                  key={index}
                  className={`leading-relaxed mb-6 text-[15px] md:text-base text-justify ${
                    isFirst
                      ? "text-lg font-medium text-foreground leading-relaxed"
                      : "text-muted-foreground"
                  }`}
                >
                  {paragraph}
                </p>
              );
            })}
          </article>

          {/* Share Block */}
          <div className="pt-8 border-t border-border/60 flex flex-wrap items-center justify-between gap-4">
            <span className="text-sm font-bold text-foreground flex items-center gap-2">
              <Share2 className="h-4 w-4 text-primary" /> Share this article
            </span>
            <div className="flex gap-2.5 flex-wrap">
              <a
                href="https://www.whatsapp.com/channel/0029Vb6ysZf2ER6fKzAXfY2C"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 px-4 rounded-full bg-whatsapp text-white hover:bg-whatsapp/90 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                WhatsApp
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 px-4 rounded-full bg-[#1da1f2] text-white hover:bg-[#1da1f2]/90 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                Twitter
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 px-4 rounded-full bg-[#0077b5] text-white hover:bg-[#0077b5]/90 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                LinkedIn
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 px-4 rounded-full bg-[#1877f2] text-white hover:bg-[#1877f2]/90 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                Facebook
              </a>
              <a
                href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 px-4 rounded-full bg-[#bd081c] text-white hover:bg-[#bd081c]/90 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                Pinterest
              </a>
            </div>
          </div>

          {/* Leave a Reply section */}
          <div className="pt-10 border-t border-border/60">
            <h3 className="text-xl font-bold text-foreground mb-1 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" /> Leave a Reply
            </h3>
            <p className="text-xs text-muted-foreground mb-6">
              Your email address will not be published. Required fields are marked *
            </p>

            {submittedComment && (
              <div className="p-4 mb-6 rounded-2xl bg-accent/10 border border-accent/20 text-accent text-sm font-medium flex items-center gap-2">
                <Send className="h-4 w-4" /> Thank you! Your comment has been successfully submitted
                and is awaiting moderation.
              </div>
            )}

            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="comment"
                  className="block text-xs font-bold text-foreground/80 mb-2 uppercase tracking-wide"
                >
                  Comment *
                </label>
                <textarea
                  id="comment"
                  required
                  rows={5}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write your comment..."
                  className="w-full rounded-2xl border border-border bg-card p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60 transition-all"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-bold text-foreground/80 mb-2 uppercase tracking-wide"
                  >
                    Name *
                  </label>
                  <div className="relative">
                    <input
                      id="name"
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Name"
                      className="w-full rounded-2xl border border-border bg-card py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60 transition-all"
                    />
                    <Edit3 className="absolute right-3.5 top-3 h-4 w-4 text-muted-foreground/60" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold text-foreground/80 mb-2 uppercase tracking-wide"
                  >
                    Email *
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      required
                      value={authorEmail}
                      onChange={(e) => setAuthorEmail(e.target.value)}
                      placeholder="Email"
                      className="w-full rounded-2xl border border-border bg-card py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60 transition-all"
                    />
                    <Mail className="absolute right-3.5 top-3.5 h-3.5 w-3.5 text-muted-foreground/60" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="website"
                    className="block text-xs font-bold text-foreground/80 mb-2 uppercase tracking-wide"
                  >
                    Website
                  </label>
                  <div className="relative">
                    <input
                      id="website"
                      type="url"
                      value={authorWebsite}
                      onChange={(e) => setAuthorWebsite(e.target.value)}
                      placeholder="Website"
                      className="w-full rounded-2xl border border-border bg-card py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60 transition-all"
                    />
                    <Globe className="absolute right-3.5 top-3.5 h-3.5 w-3.5 text-muted-foreground/60" />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2">
                <input
                  id="save-info"
                  type="checkbox"
                  checked={saveInfo}
                  onChange={(e) => setSaveInfo(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-border bg-card text-primary focus:ring-primary/20 cursor-pointer"
                />
                <label
                  htmlFor="save-info"
                  className="text-xs text-muted-foreground/90 leading-tight select-none cursor-pointer"
                >
                  Save my name, email, and website in this browser for the next time I comment.
                </label>
              </div>

              <button
                type="submit"
                className="mt-4 px-8 py-3 bg-accent text-accent-foreground rounded-full text-xs font-bold flex items-center gap-1.5 hover:bg-accent/90 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                Submit Comment <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Blog Sidebar */}
        <div className="h-fit">
          <Suspense
            fallback={<div className="h-96 w-full bg-[#FAF6F0] rounded-[32px] animate-pulse" />}
          >
            <BlogSidebar selectedCategory={article.categories[0]} />
          </Suspense>
        </div>
      </section>

      {/* Bottom Block: Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="bg-secondary/35 border-t border-border/80 py-16">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-extrabold tracking-tight text-foreground">
                  Related Articles
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Browse the latest career advices
                </p>
              </div>
              <Link
                href="/career-guidance"
                className="text-xs font-bold text-accent hover:text-accent/80 flex items-center gap-1 uppercase tracking-wider transition-colors"
              >
                View all articles <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {relatedArticles.map((relPost) => (
                <article
                  key={relPost.slug}
                  className="group rounded-2xl border border-border/60 bg-card overflow-hidden shadow-soft hover:shadow-md hover:border-primary/10 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="h-28 bg-gradient-to-br from-secondary/50 to-[#f5ebe6]/20 p-3 flex items-center justify-center border-b border-border/40">
                    <div className="w-full h-full max-w-[120px]">
                      <BlogIllustration category={relPost.categories[0]} title={relPost.title} />
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-2 text-[10px] font-semibold text-muted-foreground">
                      <span>{relPost.date}</span>
                    </div>
                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug flex-grow">
                      <Link href={`/career-guidance/${relPost.slug}`}>{relPost.title}</Link>
                    </h4>
                    <Link
                      href={`/career-guidance/${relPost.slug}`}
                      className="text-xs font-bold text-accent mt-4 inline-flex items-center gap-0.5 hover:text-accent/80"
                    >
                      Read more{" "}
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 duration-200" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
