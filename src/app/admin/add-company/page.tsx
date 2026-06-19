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
import { Building2, Upload, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AddCompany() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("Software & Tech");
  const [location, setLocation] = useState("Bengaluru");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [featured, setFeatured] = useState(false);

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

  // Slug auto-generation from name
  useEffect(() => {
    if (name) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9\-_]+/g, "-")
        .replace(/^-|-$/g, "")
        .replace(/-+/g, "-");
      setSlug(generatedSlug);
    }
  }, [name]);

  // Live SEO checker trigger
  useEffect(() => {
    const res = checkSEO({
      title: seoTitle || name,
      description: description,
      slug: slug,
      focusKeyword: focusKeyword,
      metaDescription: seoDescription,
      hasAltText: !!logoUrl,
    });
    setSeoResult(res);
  }, [name, description, slug, focusKeyword, seoTitle, seoDescription, logoUrl]);

  // Logo file upload handler
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      
      // Verify active session before upload
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Session expired or inactive. Please log in again.");
        console.error("Upload failed: No active Supabase session.");
        return;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("logos")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Full storage upload error:", uploadError);
        throw new Error(`${uploadError.message} (Bucket: logos)`);
      }

      const { data } = supabase.storage.from("logos").getPublicUrl(filePath);
      setLogoUrl(data.publicUrl);
      toast.success("Logo uploaded successfully!");
    } catch (err: any) {
      toast.error("Logo upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) {
      toast.error("Name and Slug are required.");
      return;
    }

    setLoading(true);

    // Verify active session before insert
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Authentication required. Redirecting to login...");
      router.push("/auth/admin");
      setLoading(false);
      return;
    }

    const payload = {
      name,
      description: description || null,
      industry: industry || null,
      location: location || null,
      website_url: websiteUrl || null,
      logo_url: logoUrl || null,
      featured,
      slug,
      seo_title: seoTitle || null,
      seo_description: seoDescription || null,
      focus_keyword: focusKeyword || null,
      canonical_url: canonicalUrl || null,
      og_image: ogImage || null,
    };

    const { error } = await supabase.from("companies").insert(payload);

    setLoading(false);
    if (error) {
      console.error("Full company insert database error:", error, "Payload:", payload);
      toast.error(`Failed to add company: ${error.message} (Detail: ${error.details || 'Row-level security policy violation on table companies'})`);
      return;
    }

    toast.success("Company added successfully!");
    router.push("/admin/manage-companies");
  };

  return (
    <DashboardShell title="Add Company" nav={adminNav} requireRole="admin">
      <div className="mx-auto max-w-4xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          {/* Main Info */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">Company Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sprinklr"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">Industry</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Software & SaaS"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">Headquarters Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Gurgaon, Haryana"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">Website URL</label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-foreground">Company Description</label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a brief overview of the company, history, values, and work culture..."
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Logo Upload & Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-dashed border-border p-4 bg-secondary/15">
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-xl border border-border bg-background p-1.5 shadow-inner overflow-hidden">
                {logoUrl ? (
                  <Image src={logoUrl} alt="Company logo preview" fill className="object-contain p-1" />
                ) : (
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <div className="text-sm font-semibold">Company Logo</div>
                <div className="text-xs text-muted-foreground mt-0.5">Upload a clean PNG/JPG logo. Max size 2MB.</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="relative flex items-center justify-center h-9 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold shadow-sm transition cursor-pointer select-none">
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                {uploading ? "Uploading..." : "Upload Logo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center justify-between p-1">
            <div>
              <div className="text-sm font-semibold">Featured Company</div>
              <div className="text-xs text-muted-foreground mt-0.5">Showcase this company prominently on the portal.</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="sr-only peer cursor-pointer"
              />
              <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* SEO score card is placed before the advanced settings to remain visible */}
          <SEOScoreCard seoResult={seoResult} />

          {/* SEO Control Panel Accordion */}
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
                      placeholder="e.g. Sprinklr Careers"
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
                      placeholder="e.g. sprinklr"
                      className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-foreground/80">SEO Meta Title</label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder="Title displayed in Google searches"
                      className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-foreground/80">Canonical URL</label>
                    <input
                      type="url"
                      value={canonicalUrl}
                      onChange={(e) => setCanonicalUrl(e.target.value)}
                      placeholder="https://myjobcampus.com/companies/..."
                      className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-foreground/80">Meta Description</label>
                  <textarea
                    rows={3}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Short description displayed under SEO Title in Google search results (max 160 characters)..."
                    className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-foreground/80">Open Graph Image (Social Share Image)</label>
                  <input
                    type="text"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    placeholder="Image URL for social previews"
                    className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-3 border-t border-border">
            <Button type="submit" disabled={loading} className="rounded-full cursor-pointer">
              {loading ? "Adding..." : "Add Company"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/manage-companies")}
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
