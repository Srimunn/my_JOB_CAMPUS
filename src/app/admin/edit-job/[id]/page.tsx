"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/site/DashboardShell";
import { adminNav } from "@/lib/dashboard-nav";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CATEGORIES, CITIES, JOB_TYPES, EXPERIENCE_LEVELS } from "@/lib/data";
import { toast } from "sonner";
import { checkSEO, type SEOCheckResult } from "@/lib/seo-checker";
import { SEOScoreCard } from "@/components/site/SEOScoreCard";
import { ChevronDown, ChevronUp, AlertCircle } from "lucide-react";

interface CompanySelectOption {
  id: string;
  name: string;
  logo_url: string | null;
}

interface JobData {
  id: string;
  title: string;
  company: string;
  company_id: string | null;
  category: string;
  location: string;
  job_type: string;
  experience: string | null;
  salary: string | null;
  last_date: string | null;
  description: string;
  requirements: string | null;
  apply_link: string | null;
  apply_email: string | null;
  work_mode: string | null;
  department: string | null;
  qualification: string | null;
  required_skills: string | null;
  responsibilities: string | null;
  benefits: string | null;
  featured: boolean | null;
  published_date: string | null;
  status: string | null;
  slug: string | null;
  seo_title: string | null;
  seo_description: string | null;
  focus_keyword: string | null;
  canonical_url: string | null;
  og_image: string | null;
}

export default function EditJob() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [updating, setUpdating] = useState(false);
  const [classification, setClassification] = useState<"IT" | "Govt">("IT");
  const [seoOpen, setSeoOpen] = useState(false);

  // Fetch companies list
  const { data: companies = [], isLoading: loadingCompanies } = useQuery({
    queryKey: ["admin-companies-select"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("id, name, logo_url")
        .order("name", { ascending: true });
      if (error) throw error;
      return (data || []) as CompanySelectOption[];
    },
  });

  // Main fields
  const [title, setTitle] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [category, setCategory] = useState("Software Engineer");
  const [location, setLocation] = useState("Bengaluru");
  const [jobType, setJobType] = useState("Full Time");
  const [experience, setExperience] = useState("0-1 years");
  const [salary, setSalary] = useState("");
  const [lastDate, setLastDate] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");

  // Detailed fields
  const [workMode, setWorkMode] = useState("Onsite");
  const [department, setDepartment] = useState("");
  const [qualification, setQualification] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [benefits, setBenefits] = useState("");
  const [featured, setFeatured] = useState(false);
  const [publishedDate, setPublishedDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState("active");
  const [applyLink, setApplyLink] = useState("");
  const [applyEmail, setApplyEmail] = useState("");

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

  const { data: job, isLoading: loadingJob } = useQuery({
    queryKey: ["admin-job-edit", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as JobData;
    },
  });

  // Populate form states when job details are fetched
  useEffect(() => {
    if (job) {
      setTitle(job.title || "");
      setCompanyId(job.company_id || "");
      setCategory(job.category || "Software Engineer");
      setLocation(job.location || "Bengaluru");
      setJobType(job.job_type || "Full Time");
      setExperience(job.experience || "0-1 years");
      setSalary(job.salary || "");
      setLastDate(job.last_date || "");
      setDescription(job.description || "");
      setRequirements(job.requirements || "");
      setWorkMode(job.work_mode || "Onsite");
      setDepartment(job.department || "");
      setQualification(job.qualification || "");
      setRequiredSkills(job.required_skills || "");
      setResponsibilities(job.responsibilities || "");
      setBenefits(job.benefits || "");
      setFeatured(job.featured || false);
      setPublishedDate(job.published_date || new Date().toISOString().split("T")[0]);
      setStatus(job.status || "active");
      setApplyLink(job.apply_link || "");
      setApplyEmail(job.apply_email || "");
      setFocusKeyword(job.focus_keyword || "");
      setSeoTitle(job.seo_title || "");
      setSeoDescription(job.seo_description || "");
      setSlug(job.slug || "");
      setCanonicalUrl(job.canonical_url || "");
      setOgImage(job.og_image || "");
      setClassification(job.category === "Government-jobs" ? "Govt" : "IT");
    }
  }, [job]);

  // Handle Sector Change
  const handleClassificationChange = (v: "IT" | "Govt") => {
    setClassification(v);
    if (v === "Govt") {
      setCategory("Government-jobs");
    } else {
      setCategory("Software Engineer");
    }
  };

  // Live SEO checker trigger
  useEffect(() => {
    const res = checkSEO({
      title: seoTitle || title,
      description: description + "\n" + requirements + "\n" + responsibilities + "\n" + benefits,
      slug: slug,
      focusKeyword: focusKeyword,
      metaDescription: seoDescription,
      hasAltText: true,
    });
    setSeoResult(res);
  }, [title, description, requirements, responsibilities, benefits, slug, focusKeyword, seoTitle, seoDescription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Job title is required.");
      return;
    }
    if (!companyId) {
      toast.error("Please select a company.");
      return;
    }

    const selectedCompany = companies.find((c) => c.id === companyId);
    if (!selectedCompany) {
      toast.error("Selected company is invalid.");
      return;
    }

    setUpdating(true);
    const { error } = await supabase
      .from("jobs")
      .update({
        title,
        company: selectedCompany.name, // sync for compatibility
        company_id: companyId,
        category,
        location,
        job_type: jobType,
        experience: experience || null,
        salary: salary || null,
        last_date: lastDate || null,
        description,
        requirements: requirements || null,
        apply_link: applyLink || null,
        apply_email: applyEmail || null,
        work_mode: workMode,
        department: department || null,
        qualification: qualification || null,
        required_skills: requiredSkills || null,
        responsibilities: responsibilities || null,
        benefits: benefits || null,
        featured,
        published_date: publishedDate,
        status,
        slug,
        seo_title: seoTitle || null,
        seo_description: seoDescription || null,
        focus_keyword: focusKeyword || null,
        canonical_url: canonicalUrl || null,
        og_image: ogImage || null,
      })
      .eq("id", id);

    setUpdating(false);
    if (error) {
      toast.error("Failed to update job: " + error.message);
      return;
    }

    toast.success("Job updated successfully!");
    router.push("/admin/manage-jobs");
  };

  if (loadingJob) {
    return (
      <DashboardShell title="Edit Job" nav={adminNav} requireRole="admin">
        <div className="flex justify-center p-12 text-muted-foreground">
          <span className="flex h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin mr-3" />
          Loading job details...
        </div>
      </DashboardShell>
    );
  }

  if (!job) {
    return (
      <DashboardShell title="Edit Job" nav={adminNav} requireRole="admin">
        <div className="text-center p-12 text-muted-foreground">Job listing not found.</div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Edit Job" nav={adminNav} requireRole="admin">
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Job Title */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-foreground">Job Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Software Development Engineer"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Company Select */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-foreground">Select Company</label>
            {loadingCompanies ? (
              <div className="text-xs text-muted-foreground py-2">Loading companies...</div>
            ) : companies.length === 0 ? (
              <div className="flex items-center gap-2 text-xs text-rose-600 font-semibold py-2">
                <AlertCircle className="h-4 w-4" />
                No companies registered.{" "}
                <Link href="/admin/add-company" className="underline text-primary cursor-pointer">
                  Add one first
                </Link>
              </div>
            ) : (
              <select
                required
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">-- Select Company --</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Classification */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-foreground">Job Sector Classification</label>
            <select
              value={classification}
              onChange={(e) => handleClassificationChange(e.target.value as "IT" | "Govt")}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="IT">IT / Corporate Job</option>
              <option value="Govt">Government Job</option>
            </select>
          </div>

          {/* Category */}
          {classification === "IT" ? (
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">Category</label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2"
              >
                {CATEGORIES.map((c) => c.name)
                  .filter((name) => name !== "Government-jobs")
                  .map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">Category</label>
              <input
                type="text"
                disabled
                value="Government-jobs"
                className="w-full rounded-xl border border-border bg-secondary px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
              />
            </div>
          )}

          {/* Location */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-foreground">Location</label>
            <select
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2"
            >
              {CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Work Mode */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-foreground">Work Mode</label>
            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2"
            >
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>
          </div>

          {/* Employment Type */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-foreground">Employment Type</label>
            <select
              required
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2"
            >
              {JOB_TYPES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Required */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-foreground">Experience Required</label>
            <select
              required
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2"
            >
              {EXPERIENCE_LEVELS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          {/* Salary */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-foreground">Salary</label>
            <input
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g. ₹8–12 LPA"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2"
            />
          </div>

          {/* Department */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-foreground">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Engineering, Sales, HR"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          {/* Qualification */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-foreground">Minimum Qualification</label>
            <input
              type="text"
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              placeholder="e.g. B.Tech / BCA / MCA"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          {/* Required Skills */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-foreground">Required Skills (Comma separated)</label>
            <input
              type="text"
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              placeholder="e.g. React, TypeScript, Node.js, CSS"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-foreground">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2"
            >
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Application Deadline */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-foreground">Application Deadline</label>
            <input
              type="date"
              value={lastDate}
              onChange={(e) => setLastDate(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Description (Rich Content area) */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-foreground">Job Description (Rich Content Text)</label>
          <textarea
            required
            rows={7}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the job role, day-to-day operations, environment..."
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2"
          />
        </div>

        {/* Requirements */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-foreground">Key Requirements</label>
          <textarea
            rows={4}
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Qualifications, technical experience, soft skills needed..."
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none"
          />
        </div>

        {/* Responsibilities */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-foreground">Responsibilities</label>
          <textarea
            rows={4}
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.target.value)}
            placeholder="Detail the primary duties and expectations of this candidate..."
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none"
          />
        </div>

        {/* Benefits */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-foreground">Benefits & Perks</label>
          <textarea
            rows={4}
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            placeholder="Health insurance, remote allowances, equity, gym memberships..."
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none"
          />
        </div>

        {/* Apply Channels */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-foreground">Apply Link (Application URL)</label>
            <input
              type="url"
              value={applyLink}
              onChange={(e) => setApplyLink(e.target.value)}
              placeholder="https://company.careers.com/apply/..."
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-foreground">Apply Email</label>
            <input
              type="email"
              value={applyEmail}
              onChange={(e) => setApplyEmail(e.target.value)}
              placeholder="careers@company.com"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Featured toggle & dates */}
        <div className="grid gap-5 sm:grid-cols-2 items-center">
          <div className="flex items-center justify-between border border-border rounded-xl p-3 bg-secondary/10">
            <div>
              <div className="text-sm font-semibold">Featured Job</div>
              <div className="text-xs text-muted-foreground mt-0.5">Showcase this job listing on the home page.</div>
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

          <div>
            <label className="mb-1 block text-sm font-semibold text-foreground">Published Date</label>
            <input
              type="date"
              value={publishedDate}
              onChange={(e) => setPublishedDate(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Live SEO score display */}
        <SEOScoreCard seoResult={seoResult} />

        {/* SEO control panel */}
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
                    placeholder="e.g. Sprinklr Careers Gurgaon"
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
                    placeholder="e.g. java-developer-bangalore"
                    className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-foreground/80">SEO Meta Title</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Title shown in Google searches"
                    className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-foreground/80">Canonical URL</label>
                  <input
                    type="url"
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                    placeholder="https://myjobcampus.com/jobs/..."
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

        {/* Actions */}
        <div className="flex gap-3 pt-3 border-t border-border">
          <Button type="submit" disabled={updating || companies.length === 0} className="rounded-full cursor-pointer">
            {updating ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/manage-jobs")}
            className="rounded-full cursor-pointer"
          >
            Cancel
          </Button>
        </div>
      </form>
    </DashboardShell>
  );
}
