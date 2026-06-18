import { Metadata } from "next";
import { supabase } from "@/integrations/supabase/client";
import { JobDetailsClient } from "@/components/site/JobDetailsClient";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const { data: job } = await supabase
    .from("jobs")
    .select("title, company, description, seo_title, seo_description, canonical_url, og_image")
    .eq("slug", slug)
    .maybeSingle();

  if (!job) {
    return { title: "Job Vacancy Not Found | My Job Campus" };
  }

  const title = job.seo_title || `${job.title} Job Vacancy at ${job.company} | My Job Campus`;
  const description = job.seo_description || job.description.substring(0, 160) || `Apply online for the ${job.title} job opening at ${job.company}.`;

  return {
    title,
    description,
    alternates: {
      canonical: job.canonical_url || `https://myjobcampus.com/jobs/${slug}`,
    },
    openGraph: {
      title,
      description,
      images: job.og_image ? [{ url: job.og_image }] : [],
    },
  };
}

export default async function JobDetailsPage({ params }: Props) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // Fetch job details
  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!job) {
    notFound();
  }

  // Fetch hiring company profile details
  let company = null;
  if (job.company_id) {
    const { data: comp } = await supabase
      .from("companies")
      .select("*")
      .eq("id", job.company_id)
      .maybeSingle();
    company = comp;
  }

  // Fetch related jobs (from same category, status = active, excluding this job)
  const { data: relatedJobs } = await supabase
    .from("jobs")
    .select("id, title, company, location, job_type, category, created_at")
    .eq("category", job.category)
    .eq("status", "active")
    .neq("id", job.id)
    .limit(4);

  return (
    <JobDetailsClient
      job={job}
      company={company}
      relatedJobs={(relatedJobs || []).map((j) => ({
        ...j,
        created_at: j.created_at,
      }))}
    />
  );
}
