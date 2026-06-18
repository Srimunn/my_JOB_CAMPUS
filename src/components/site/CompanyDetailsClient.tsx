"use client";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Globe, Briefcase, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { JobCard } from "@/components/site/JobCard";

interface Company {
  id: string;
  name: string;
  logo_url: string | null;
  description: string | null;
  industry: string | null;
  location: string | null;
  website_url: string | null;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  category: string;
  created_at: string;
}

interface CompanyDetailsClientProps {
  company: Company;
  jobs: Job[];
}

export function CompanyDetailsClient({ company, jobs }: CompanyDetailsClientProps) {
  return (
    <SiteLayout>
      {/* Header Banner */}
      <section className="bg-secondary/40 border-b border-border bg-dot-grid py-12 lg:py-16">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-border bg-background p-2.5 shadow-sm overflow-hidden">
                {company.logo_url ? (
                  <Image
                    src={company.logo_url}
                    alt={`${company.name} logo`}
                    fill
                    className="object-contain p-2"
                  />
                ) : (
                  <Building2 className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              <div>
                <h1 className="font-display text-3xl font-extrabold text-foreground">{company.name}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground font-medium mt-1">
                  {company.industry && <span>{company.industry}</span>}
                  {company.location && (
                    <>
                      <span className="hidden md:inline">&bull;</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" /> {company.location}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {company.website_url && (
              <a href={company.website_url} target="_blank" rel="noopener noreferrer">
                <Button className="rounded-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-6 py-5 shadow-md flex items-center gap-1.5 transition cursor-pointer">
                  Visit Website <Globe className="h-4 w-4" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="mx-auto max-w-5xl px-4 py-12 lg:px-8 grid gap-8 lg:grid-cols-[1fr_280px]">
        {/* Left Col: Description & Available Jobs */}
        <div className="space-y-8">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-display text-xl font-bold text-foreground">About {company.name}</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap text-justify">
              {company.description || `Learn more about careers and company culture at ${company.name}.`}
            </p>
          </div>

          <div className="space-y-5">
            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-emerald-800" /> Open Positions ({jobs.length})
            </h2>

            {jobs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
                No jobs listed currently for {company.name}. Check back later.
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Details Summary Panel */}
        <div className="space-y-6 h-fit">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-foreground text-sm uppercase tracking-wide">Company Details</h3>
            
            <div className="divide-y divide-border/60 text-xs font-medium text-foreground/80 space-y-3">
              <div className="pt-2 flex justify-between">
                <span className="text-muted-foreground">Industry</span>
                <span>{company.industry || "N/A"}</span>
              </div>
              <div className="pt-3 flex justify-between">
                <span className="text-muted-foreground">Headquarters</span>
                <span>{company.location || "N/A"}</span>
              </div>
              <div className="pt-3 flex justify-between">
                <span className="text-muted-foreground">Job Openings</span>
                <span className="text-emerald-700 font-bold">{jobs.length} roles</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
