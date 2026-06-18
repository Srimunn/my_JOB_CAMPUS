import { MetadataRoute } from "next";
import { supabase } from "@/integrations/supabase/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://myjobcampus.com";

  // 1. Core pages list
  const coreRoutes = ["", "/jobs", "/companies", "/career-guidance", "/about", "/contact", "/privacy", "/terms"];
  const staticPages = coreRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // 2. Jobs list (pulling active jobs only)
  let jobPages: MetadataRoute.Sitemap = [];
  try {
    const { data: jobs } = await supabase
      .from("jobs")
      .select("slug, updated_at")
      .eq("status", "active");

    if (jobs) {
      jobPages = jobs
        .filter((j) => j.slug)
        .map((j) => ({
          url: `${baseUrl}/jobs/${j.slug}`,
          lastModified: new Date(j.updated_at),
          changeFrequency: "weekly" as const,
          priority: 0.6,
        }));
    }
  } catch (err) {
    console.error("Sitemap jobs retrieval error:", err);
  }

  // 3. Companies list
  let companyPages: MetadataRoute.Sitemap = [];
  try {
    const { data: companies } = await supabase
      .from("companies")
      .select("slug, updated_at");

    if (companies) {
      companyPages = companies
        .filter((c) => c.slug)
        .map((c) => ({
          url: `${baseUrl}/companies/${c.slug}`,
          lastModified: new Date(c.updated_at),
          changeFrequency: "weekly" as const,
          priority: 0.6,
        }));
    }
  } catch (err) {
    console.error("Sitemap companies retrieval error:", err);
  }

  // 4. Articles list
  let articlePages: MetadataRoute.Sitemap = [];
  try {
    const { data: articles } = await supabase
      .from("articles")
      .select("slug, updated_at");

    if (articles) {
      articlePages = articles
        .filter((a) => a.slug)
        .map((a) => ({
          url: `${baseUrl}/career-guidance/${a.slug}`,
          lastModified: new Date(a.updated_at),
          changeFrequency: "weekly" as const,
          priority: 0.6,
        }));
    }
  } catch (err) {
    console.error("Sitemap articles retrieval error:", err);
  }

  return [...staticPages, ...jobPages, ...companyPages, ...articlePages];
}
