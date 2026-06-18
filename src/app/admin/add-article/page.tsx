"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/site/DashboardShell";
import { adminNav } from "@/lib/dashboard-nav";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { checkSEO, type SEOCheckResult } from "@/lib/seo-checker";
import { SEOScoreCard } from "@/components/site/SEOScoreCard";
import { Newspaper, Upload, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

const ARTICLE_CATEGORIES = [
  "Resume Building",
  "Interview Preparation",
  "Career Growth",
  "Certifications",
  "Salary Trends",
  "AI Careers",
  "Freshers Guidance",
];

export default function AddArticle() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Resume Building");
  const [authorName, setAuthorName] = useState("My Job Campus Editor");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");

  // SEO states
  const [focusKeyword, setFocusKeyword] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [ogImage, setOgImage] = useState("");

  const [seoResult, setSeoResult] = useState<SEOCheckResult>({
    score: 0,
    label: "Needs Improvement",
    color: "red",
    checks: {
      keywordInTitle: false,
      keywordInDescription: false,
      keywordInSlug: false,
      contentLength: 0,
      contentLengthPass: false,
      hasAltText: false,
      hasInternalLinks: false,
      hasHeadings: false,
    },
  });

  // Dynamic slug auto-generation from Title
  useEffect(() => {
    if (title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\-_]+/g, "-")
        .replace(/^-|-$/g, "")
        .replace(/-+/g, "-");
      setSlug(generatedSlug);
    }
  }, [title]);

  // Live SEO scoring engine trigger
  useEffect(() => {
    const res = checkSEO({
      title: seoTitle || title,
      description: content,
      slug: slug,
      focusKeyword: focusKeyword,
      metaDescription: seoDescription,
      hasAltText: !!featuredImage,
    });
    setSeoResult(res);
  }, [title, content, slug, focusKeyword, seoTitle, seoDescription, featuredImage]);

  // Image upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("blog-images").getPublicUrl(filePath);
      setFeaturedImage(data.publicUrl);
      toast.success("Featured image uploaded!");
    } catch (err: any) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !content) {
      toast.error("Title, Slug and Content are required.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("articles").insert({
      title,
      slug,
      featured_image: featuredImage || null,
      category,
      author_name: authorName,
      content,
      meta_title: seoTitle || null,
      meta_description: seoDescription || null,
      focus_keyword: focusKeyword || null,
      canonical_url: canonicalUrl || null,
      og_image: ogImage || null,
    });

    setLoading(false);
    if (error) {
      toast.error("Failed to add article: " + error.message);
      return;
    }

    toast.success("Article published successfully!");
    router.push("/admin/manage-articles");
  };

  return (
    <DashboardShell title="Publish Article" nav={adminNav} requireRole="admin">
      <div className="mx-auto max-w-4xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-foreground">Article Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. How to Build a Job-Ready Resume"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Author */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">Author Name</label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">Category</label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {ARTICLE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Article Content */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-foreground">Article Content (HTML/Rich Text Supported)</label>
            <textarea
              required
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the long-form SEO article content here. You can use HTML tags like <h2>, <h3>, <p>, <strong> to structure headings..."
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
            />
          </div>

          {/* Featured Image */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-dashed border-border p-4 bg-secondary/15">
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-24 items-center justify-center rounded-xl border border-border bg-background shadow-inner overflow-hidden">
                {featuredImage ? (
                  <Image src={featuredImage} alt="Featured image preview" fill className="object-cover" />
                ) : (
                  <Newspaper className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <div className="text-sm font-semibold">Featured Image</div>
                <div className="text-xs text-muted-foreground mt-0.5">Upload a high-quality article graphic.</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="relative flex items-center justify-center h-9 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold shadow-sm transition cursor-pointer select-none">
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                {uploading ? "Uploading..." : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* SEO Score Display */}
          <SEOScoreCard seoResult={seoResult} />

          {/* SEO Accordion */}
          <div className="rounded-xl border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setSeoOpen(!seoOpen)}
              className="flex w-full items-center justify-between bg-secondary/15 px-4 py-3 text-left font-bold text-foreground text-sm cursor-pointer hover:bg-secondary/35 transition"
            >
              <span className="flex items-center gap-1.5">SEO Control Panel Settings</span>
              {seoOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {seoOpen && (
              <div className="p-4 space-y-4 border-t border-border bg-card">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-foreground/80">Focus Keyword</label>
                    <input
                      type="text"
                      value={focusKeyword}
                      onChange={(e) => setFocusKeyword(e.target.value)}
                      placeholder="e.g. Job Ready Resume"
                      className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-foreground/80">URL Slug</label>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="e.g. how-to-build-a-job-ready-resume"
                      className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-foreground/80">SEO Meta Title</label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder="e.g. How to Build a Job-Ready Resume | My Job Campus"
                      className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-foreground/80">Canonical URL</label>
                    <input
                      type="url"
                      value={canonicalUrl}
                      onChange={(e) => setCanonicalUrl(e.target.value)}
                      placeholder="https://myjobcampus.com/career-guidance/..."
                      className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-foreground/80">Meta Description</label>
                  <textarea
                    rows={3}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Short summary for Google search results (max 160 characters)..."
                    className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-foreground/80">Open Graph Image (Social Share Image)</label>
                  <input
                    type="text"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    placeholder="Image URL for social previews"
                    className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-3 border-t border-border">
            <Button type="submit" disabled={loading} className="rounded-full cursor-pointer">
              {loading ? "Publishing..." : "Publish Article"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/manage-articles")}
              className="rounded-full cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
