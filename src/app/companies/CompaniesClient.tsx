"use client";

import { useState, useMemo } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useTranslation } from "@/lib/i18n";
import { CompaniesList } from "@/components/site/CompaniesList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Static list of 50 top IT companies as baseline
const TOP_COMPANIES = [
  { name: "Google", jobs: 12 },
  { name: "Microsoft", jobs: 10 },
  { name: "Apple", jobs: 8 },
  { name: "Amazon", jobs: 15 },
  { name: "Facebook (Meta)", jobs: 9 },
  { name: "IBM", jobs: 7 },
  { name: "Oracle", jobs: 6 },
  { name: "Cisco", jobs: 5 },
  { name: "Intel", jobs: 11 },
  { name: "SAP", jobs: 4 },
  { name: "Salesforce", jobs: 13 },
  { name: "Adobe", jobs: 5 },
  { name: "HP", jobs: 3 },
  { name: "Dell Technologies", jobs: 6 },
  { name: "Tencent", jobs: 9 },
  { name: "Alibaba", jobs: 8 },
  { name: "VMware", jobs: 4 },
  { name: "Accenture", jobs: 14 },
  { name: "Capgemini", jobs: 7 },
  { name: "Infosys", jobs: 12 },
  { name: "Wipro", jobs: 11 },
  { name: "TCS", jobs: 13 },
  { name: "HCL Technologies", jobs: 6 },
  { name: "Cognizant", jobs: 9 },
  { name: "Qualcomm", jobs: 5 },
  { name: "Nvidia", jobs: 10 },
  { name: "AMD", jobs: 4 },
  { name: "Snap Inc.", jobs: 3 },
  { name: "Twitter", jobs: 2 },
  { name: "Lyft", jobs: 2 },
  { name: "Uber", jobs: 8 },
  { name: "Shopify", jobs: 5 },
  { name: "Stripe", jobs: 4 },
  { name: "Square", jobs: 3 },
  { name: "Zoom", jobs: 6 },
  { name: "Slack", jobs: 4 },
  { name: "GitHub", jobs: 7 },
  { name: "GitLab", jobs: 2 },
  { name: "Atlassian", jobs: 5 },
  { name: "ServiceNow", jobs: 4 },
  { name: "Red Hat", jobs: 6 },
  { name: "Docker", jobs: 3 },
  { name: "MongoDB", jobs: 2 },
  { name: "PayPal", jobs: 7 },
  { name: "eBay", jobs: 3 },
  { name: "Spotify", jobs: 5 },
  { name: "Airbnb", jobs: 4 },
  { name: "Netflix", jobs: 6 },
  { name: "Dropbox", jobs: 2 },
  { name: "SquareSpace", jobs: 1 },
  { name: "ZoomInfo", jobs: 1 },
  { name: "Zycus", jobs: 4 },
  { name: "Zoho", jobs: 14 },
];

export default function CompaniesClient() {
  const { t } = useTranslation();
  const itemsPerPage = 16; // 4x4 grid
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // State hooks for search input and selection filters
  const [search, setSearch] = useState("");
  const [loc, setLoc] = useState("");
  const [cat, setCat] = useState("");

  // Fetch all jobs from DB to dynamically group by company, location, and category
  const { data: dbJobs = [], isLoading } = useQuery({
    queryKey: ["all-db-jobs-for-companies"],
    queryFn: async () => {
      const { data } = await supabase.from("jobs").select("company, location, category");
      return data || [];
    },
  });

  const { mergedCompanies, citiesList, categoriesList } = useMemo(() => {
    // 1. Group DB jobs by company
    const companyJobsMap: Record<
      string,
      { jobsCount: number; locations: Set<string>; categories: Set<string> }
    > = {};

    dbJobs.forEach((job) => {
      if (!job.company) return;
      const normalizedName = job.company.trim();
      const matchName = normalizedName.toLowerCase();

      let existingKey = Object.keys(companyJobsMap).find((k) => k.toLowerCase() === matchName);
      if (!existingKey) {
        existingKey = normalizedName;
        companyJobsMap[existingKey] = {
          jobsCount: 0,
          locations: new Set(),
          categories: new Set(),
        };
      }

      companyJobsMap[existingKey].jobsCount += 1;
      if (job.location) companyJobsMap[existingKey].locations.add(job.location.trim());
      if (job.category) companyJobsMap[existingKey].categories.add(job.category.trim());
    });

    // 2. Build final merged companies list starting with TOP_COMPANIES
    const resultList: {
      name: string;
      jobs: number;
      locations: Set<string>;
      categories: Set<string>;
    }[] = [];

    TOP_COMPANIES.forEach((tc) => {
      const dbMatchKey = Object.keys(companyJobsMap).find(
        (k) => k.toLowerCase() === tc.name.toLowerCase(),
      );

      let jobsCount = tc.jobs;
      const locations = new Set<string>();
      const categories = new Set<string>();

      if (dbMatchKey) {
        jobsCount += companyJobsMap[dbMatchKey].jobsCount;
        companyJobsMap[dbMatchKey].locations.forEach((l) => locations.add(l));
        companyJobsMap[dbMatchKey].categories.forEach((c) => categories.add(c));
        delete companyJobsMap[dbMatchKey];
      }

      resultList.push({
        name: tc.name,
        jobs: jobsCount,
        locations,
        categories,
      });
    });

    // Add any remaining companies from DB that weren't in TOP_COMPANIES
    Object.entries(companyJobsMap).forEach(([name, data]) => {
      resultList.push({
        name,
        jobs: data.jobsCount,
        locations: data.locations,
        categories: data.categories,
      });
    });

    // Collect all available cities and categories from DB jobs to populate select filters
    const citiesSet = new Set<string>();
    const categoriesSet = new Set<string>();
    dbJobs.forEach((job) => {
      if (job.location) citiesSet.add(job.location.trim());
      if (job.category) categoriesSet.add(job.category.trim());
    });

    return {
      mergedCompanies: resultList,
      citiesList: Array.from(citiesSet).sort(),
      categoriesList: Array.from(categoriesSet).sort(),
    };
  }, [dbJobs]);

  // Filter companies by search keyword, location, and category
  const filteredCompanies = useMemo(() => {
    return mergedCompanies.filter((company) => {
      const matchesSearch = company.name.toLowerCase().includes(search.toLowerCase());
      const matchesLoc = loc
        ? Array.from(company.locations).some((l) => l.toLowerCase().includes(loc.toLowerCase()))
        : true;
      const matchesCat = cat
        ? Array.from(company.categories).some((c) => c.toLowerCase() === cat.toLowerCase())
        : true;
      return matchesSearch && matchesLoc && matchesCat;
    });
  }, [mergedCompanies, search, loc, cat]);

  // Sort companies by name based on sortOrder
  const sortedCompanies = useMemo(() => {
    return [...filteredCompanies].sort((a, b) => {
      if (sortOrder === "asc") return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });
  }, [filteredCompanies, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedCompanies.length / itemsPerPage));
  const startIdx = (currentPage - 1) * itemsPerPage;
  const displayedCompanies = sortedCompanies.slice(startIdx, startIdx + itemsPerPage);

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="bg-secondary py-16 border-b border-border bg-dot-grid relative overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="glow-orb bg-hero-blue w-[250px] h-[250px] top-10 right-20" />
        </div>
        <div className="mx-auto max-w-5xl px-4 text-center lg:px-8 animate-fade-in-up">
          <h1 className="font-display text-4xl font-extrabold tracking-tight lg:text-5xl">
            {t("companies.heroTitle")}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-xl mx-auto">
            {t("companies.heroSub")}
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="mx-auto max-w-6xl px-4 py-12 lg:px-8 animate-fade-in-up">
        <div className="grid gap-3 rounded-2xl bg-card/80 p-4 shadow-md backdrop-blur-md md:grid-cols-[1fr_180px_180px] transition-all duration-300 hover:shadow-lg">
          <input
            placeholder={t("companies.searchPlaceholder")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl bg-background/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all border border-border"
          />
          <select
            value={loc}
            onChange={(e) => {
              setLoc(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
          >
            <option value="">{t("companies.allLocations")}</option>
            {citiesList.map((cityName) => (
              <option key={cityName} value={cityName}>
                {cityName}
              </option>
            ))}
          </select>
          <select
            value={cat}
            onChange={(e) => {
              setCat(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
          >
            <option value="">{t("companies.allCategories")}</option>
            {categoriesList.map((catName) => (
              <option key={catName} value={catName}>
                {catName}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Result count and sorting */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-6 text-muted-foreground px-4">
        <p className="text-left text-sm font-medium">
          {isLoading ? (
            <span>{t("companies.loading")}</span>
          ) : (
            <span>
              {sortedCompanies.length === 1
                ? t("companies.showingSingle").replace("{count}", String(sortedCompanies.length))
                : t("companies.showingPlural").replace(
                    "{count}",
                    String(sortedCompanies.length),
                  )}{" "}
              (
              {t("companies.pageOf")
                .replace("{current}", String(currentPage))
                .replace("{total}", String(totalPages))}
              )
            </span>
          )}
        </p>
        <div className="flex items-center gap-2">
          <select
            id="sortSelect"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="rounded-xl border border-border bg-background/50 px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
          >
            <option value="asc">{t("companies.sortNameAsc")}</option>
            <option value="desc">{t("companies.sortNameDesc")}</option>
          </select>
        </div>
      </div>

      {/* Companies grid */}
      <div className="max-w-6xl mx-auto px-4">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">{t("companies.loading")}</div>
        ) : sortedCompanies.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground border border-dashed rounded-3xl bg-card">
            {t("companies.noResults")}
          </div>
        ) : (
          <CompaniesList companies={displayedCompanies} />
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <nav className="flex justify-center items-center mt-8 gap-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-xl bg-secondary text-foreground font-semibold disabled:opacity-50 hover:bg-secondary/80 transition cursor-pointer text-sm"
          >
            {t("companies.prev")}
          </button>
          <span className="text-sm font-medium">
            {t("companies.pageOf")
              .replace("{current}", String(currentPage))
              .replace("{total}", String(totalPages))}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-xl bg-secondary text-foreground font-semibold disabled:opacity-50 hover:bg-secondary/80 transition cursor-pointer text-sm"
          >
            {t("companies.next")}
          </button>
        </nav>
      )}

      <div className="h-20"></div>
    </SiteLayout>
  );
}
