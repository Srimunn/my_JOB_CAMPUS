"use client";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Calendar,
  IndianRupee,
  MapPin,
  Tag,
  Clock,
  Building2,
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Link from "next/link";
import { useState } from "react";
import { JobCard } from "@/components/site/JobCard";

interface Job {
  id: string;
  title: string;
  company: string;
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
  published_date: string | null;
  created_at: string;
}

interface Company {
  id: string;
  name: string;
  logo_url: string | null;
  description: string | null;
  website_url: string | null;
  location: string | null;
}

interface JobDetailsClientProps {
  job: Job;
  company: Company | null;
  relatedJobs: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    job_type: string;
    category: string;
    created_at: string;
  }>;
}

export function JobDetailsClient({ job, company, relatedJobs }: JobDetailsClientProps) {
  const { user, role } = useAuth();
  const qc = useQueryClient();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Check if already applied
  const { data: alreadyApplied } = useQuery({
    queryKey: ["app-status", job.id, user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("applications")
        .select("id")
        .eq("job_id", job.id)
        .eq("user_id", user!.id)
        .maybeSingle();
      return !!data;
    },
  });

  // Apply mutation
  const apply = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Please sign in to apply.");
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("resume_url")
        .eq("id", user.id)
        .single();

      const { error } = await supabase.from("applications").insert({
        job_id: job.id,
        user_id: user.id,
        resume_url: profile?.resume_url ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Application submitted successfully!");
      qc.invalidateQueries({ queryKey: ["app-status", job.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // structured JobPosting schema
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description + (job.requirements ? "\nRequirements: " + job.requirements : ""),
    "datePosted": job.published_date || job.created_at,
    "validThrough": job.last_date || undefined,
    "employmentType": job.job_type === "Full Time" ? "FULL_TIME" : "PART_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": company?.name || job.company,
      "logo": company?.logo_url || undefined,
      "sameAs": company?.website_url || undefined,
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location,
        "addressCountry": "IN"
      }
    },
    "baseSalary": job.salary ? {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": {
        "@type": "QuantitativeValue",
        "value": job.salary,
        "unitText": "YEAR"
      }
    } : undefined
  };

  const FAQS = [
    {
      q: `What is the work mode of the ${job.title} role?`,
      a: `This position is offered as a ${job.work_mode || "Onsite"} role based in ${job.location}.`
    },
    {
      q: `What experience is required to apply for this job?`,
      a: `The hiring company is looking for candidates with ${job.experience || "Freshers / Entry-Level"} experience.`
    },
    {
      q: `Are there key skills required?`,
      a: job.required_skills 
        ? `Yes, the primary skills required for this job are: ${job.required_skills}.`
        : "Please review the job description for specific technical skills required."
    },
    {
      q: `What is the last date to apply for this vacancy?`,
      a: job.last_date
        ? `The application deadline is ${new Date(job.last_date).toLocaleDateString()}. We recommend submitting early.`
        : "No specific deadline is mentioned. Applications are reviewed on a rolling basis."
    }
  ];

  return (
    <SiteLayout>
      {/* Schema Script Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      <article className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          {/* Top section */}
          <div className="flex flex-wrap items-start justify-between gap-5 border-b border-border/60 pb-6">
            <div className="flex items-start gap-4">
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-background p-1.5 shadow-sm overflow-hidden">
                {company?.logo_url ? (
                  <Image
                    src={company.logo_url}
                    alt={`${company.name} logo`}
                    fill
                    className="object-contain p-1"
                  />
                ) : (
                  <Building2 className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-100">
                  {job.category}
                </span>
                <h1 className="mt-2.5 font-display text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">
                  {job.title}
                </h1>
                <div className="mt-1.5 text-base font-bold text-foreground/80 hover:text-primary transition duration-150">
                  {company ? (
                    <Link href={`/companies/${company.slug}`}>{company.name}</Link>
                  ) : (
                    <span>{job.company}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Apply Button Options */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {!user ? (
                <Link href="/auth/login" className="w-full sm:w-auto">
                  <Button className="rounded-full w-full">Sign In to Apply</Button>
                </Link>
              ) : role === "admin" ? (
                <Button disabled className="rounded-full w-full bg-secondary text-foreground border border-border">
                  Admin Preview
                </Button>
              ) : alreadyApplied ? (
                <Button disabled className="rounded-full w-full bg-secondary text-muted-foreground">
                  Already Applied
                </Button>
              ) : (
                <Button
                  onClick={() => apply.mutate()}
                  disabled={apply.isPending}
                  className="rounded-full w-full bg-emerald-800 hover:bg-emerald-700 text-white cursor-pointer"
                >
                  {apply.isPending ? "Submitting..." : "Apply Local"}
                </Button>
              )}

              {job.apply_link && (
                <a
                  href={job.apply_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button variant="outline" className="rounded-full w-full cursor-pointer flex items-center gap-1">
                    Apply on Website <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Meta Badges Grid */}
          <div className="mt-6 grid gap-3.5 grid-cols-2 sm:grid-cols-3">
            <MetaBadge
              icon={<MapPin className="h-4 w-4" />}
              label="Location"
              value={`${job.location} (${job.work_mode || "Onsite"})`}
            />
            <MetaBadge
              icon={<Briefcase className="h-4 w-4" />}
              label="Job Type"
              value={job.job_type}
            />
            <MetaBadge
              icon={<Tag className="h-4 w-4" />}
              label="Category"
              value={job.category}
            />
            {job.experience && (
              <MetaBadge
                icon={<Clock className="h-4 w-4" />}
                label="Experience"
                value={job.experience}
              />
            )}
            {job.salary && (
              <MetaBadge
                icon={<IndianRupee className="h-4 w-4" />}
                label="Salary"
                value={job.salary}
              />
            )}
            {job.last_date && (
              <MetaBadge
                icon={<Calendar className="h-4 w-4" />}
                label="Deadline"
                value={new Date(job.last_date).toLocaleDateString()}
              />
            )}
          </div>

          {/* Job Details Section */}
          <div className="mt-8 space-y-6">
            <section>
              <h2 className="font-display text-lg font-bold text-foreground">Job Description</h2>
              <div className="mt-2.5 whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed text-justify">
                {job.description}
              </div>
            </section>

            {job.requirements && (
              <section>
                <h2 className="font-display text-lg font-bold text-foreground">Requirements & Qualifications</h2>
                <div className="mt-2.5 whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed text-justify">
                  {job.requirements}
                </div>
              </section>
            )}

            {job.responsibilities && (
              <section>
                <h2 className="font-display text-lg font-bold text-foreground">Key Responsibilities</h2>
                <div className="mt-2.5 whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed text-justify">
                  {job.responsibilities}
                </div>
              </section>
            )}

            {job.benefits && (
              <section>
                <h2 className="font-display text-lg font-bold text-foreground">Benefits & Perks</h2>
                <div className="mt-2.5 whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed text-justify">
                  {job.benefits}
                </div>
              </section>
            )}
          </div>

          {/* External Company Info Card */}
          {company && (
            <div className="mt-8 rounded-2xl border border-border bg-secondary/10 p-5">
              <h3 className="font-bold text-sm text-foreground uppercase tracking-wide">Hiring Company Details</h3>
              <div className="flex items-start gap-4 mt-3">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-background p-1 shadow-inner overflow-hidden">
                  {company.logo_url ? (
                    <Image src={company.logo_url} alt={company.name} fill className="object-contain p-1" />
                  ) : (
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <div className="font-semibold text-sm text-foreground hover:underline">
                    <Link href={`/companies/${company.slug}`}>{company.name}</Link>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {company.description || "View company details and other job openings."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic FAQ Accordion */}
        <section className="mt-12 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-1.5 mb-6">
            <HelpCircle className="h-5 w-5 text-emerald-800" /> Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-xl border transition duration-150 ${
                    isOpen ? "border-emerald-600 bg-emerald-50/5" : "border-border hover:bg-secondary/25"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-4 text-left font-bold text-sm text-foreground cursor-pointer focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  <div className={`grid transition-all ease-in-out duration-200 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <p className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-border/30 pt-2.5">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Related Jobs Section */}
        {relatedJobs.length > 0 && (
          <section className="mt-12 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-foreground">Related Jobs For You</h2>
              <Link href="/jobs" className="text-xs font-bold text-accent hover:underline">
                View All Jobs
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {relatedJobs.map((j) => (
                <JobCard key={j.id} job={j} />
              ))}
            </div>
          </section>
        )}
      </article>
    </SiteLayout>
  );
}

function MetaBadge({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-border p-2.5 bg-card">
      <div className="grid h-7 w-7 place-items-center rounded-lg bg-secondary text-primary shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">{label}</div>
        <div className="text-xs font-bold truncate text-foreground/90 mt-0.5">{value}</div>
      </div>
    </div>
  );
}
