import { Metadata } from "next";
import { supabase } from "@/integrations/supabase/client";
import { CompanyDetailsClient } from "@/components/site/CompanyDetailsClient";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const { data: company } = await supabase
    .from("companies")
    .select("name, description, seo_title, seo_description, canonical_url, og_image")
    .eq("slug", slug)
    .maybeSingle();

  if (!company) {
    return { title: "Company Profile Not Found | My Job Campus" };
  }

  const title = company.seo_title || `${company.name} Careers & Open Jobs | My Job Campus`;
  const description = company.seo_description || company.description || `Explore open jobs, salaries, and company culture at ${company.name}.`;

  return {
    title,
    description,
    alternates: {
      canonical: company.canonical_url || `https://myjobcampus.com/companies/${slug}`,
    },
    openGraph: {
      title,
      description,
      images: company.og_image ? [{ url: company.og_image }] : [],
    },
  };
}

export default async function CompanyDetailsPage({ params }: Props) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // Fetch company
  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!company) {
    notFound();
  }

  // Fetch jobs for company
  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, title, company, location, job_type, category, created_at")
    .eq("company_id", company.id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return <CompanyDetailsClient company={company} jobs={jobs || []} />;
}
