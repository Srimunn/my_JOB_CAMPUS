"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SiteLayout } from "@/components/site/SiteLayout";
import { JobCard, type JobRow } from "@/components/site/JobCard";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, CITIES } from "@/lib/data";
import { Search, Globe, Folder, ChevronDown, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";

const STATIC_EMPLOYMENT_TYPES = [
  { name: "Apprenticeship", count: 0 },
  { name: "Content Writing", count: 0 },
  { name: "Contract", count: 0 },
  { name: "Contract Based", count: 0 },
  { name: "Freelance", count: 0 },
  { name: "Freelancer", count: 0 },
  { name: "Full Time", count: 0 },
  { name: "Full-Time Internship", count: 0 },
  { name: "Fulltime", count: 0 },
  { name: "Hybrid", count: 0 },
  { name: "Internship", count: 0 },
  { name: "Internship - 6 Months", count: 0 },
  { name: "Internship 2 months", count: 0 },
  { name: "Internship 3 months", count: 0 },
  { name: "Internship.", count: 0 },
  { name: "Onsite", count: 0 },
  { name: "Part Time", count: 0 },
  { name: "Partime", count: 0 },
  { name: "Remote", count: 0 },
  { name: "Security Research", count: 0 },
  { name: "Training", count: 0 },
  { name: "Unpaid Internship", count: 0 },
  { name: "Work-from-Home", count: 0 },
];

const STATIC_EXPERIENCE_LEVELS = [
  { name: "Apprenticeship", count: 0 },
  { name: "Beginner", count: 0 },
  { name: "Entry-Level", count: 0 },
  { name: "Experienced", count: 0 },
  { name: "Fresher", count: 0 },
  { name: "Manager / Executive", count: 0 },
  { name: "Mid-Level", count: 0 },
  { name: "Minimal Experience", count: 0 },
  { name: "No Experience", count: 0 },
  { name: "Senior-Level", count: 0 },
  { name: "Students", count: 0 },
];

export function JobsList({
  title,
  subtitle,
  forcedCategory,
}: {
  title: string;
  subtitle: string;
  forcedCategory?: string;
}) {
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");
  const [cat, setCat] = useState(forcedCategory ?? "");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedExps, setSelectedExps] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);
  const PAGE = 9;

  useEffect(() => {
    const urlQ = searchParams.get("q") || "";
    const urlLoc = searchParams.get("loc") || "";
    const urlCat = searchParams.get("category") || forcedCategory || "";

    setQ(urlQ);
    setLoc(urlLoc);
    setCat(urlCat);
  }, [searchParams, forcedCategory]);

  const { data: dbCategories = [] } = useQuery({
    queryKey: ["job-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("jobs").select("category");
      if (error) return [];
      const uniqueCats = Array.from(new Set(data.map((j) => j.category).filter(Boolean)));
      return uniqueCats.sort();
    },
  });

  const categoriesList = useMemo(() => {
    const defaultCats = CATEGORIES.map((c) => c.name);
    const combined = Array.from(new Set([...defaultCats, ...dbCategories]));
    return combined.sort();
  }, [dbCategories]);

  // Fetch db counts for type and experience
  const { data: dbJobsForCounting = [] } = useQuery({
    queryKey: ["all-db-jobs-for-counting"],
    queryFn: async () => {
      const { data } = await supabase.from("jobs").select("job_type, experience");
      return data || [];
    },
  });

  const employmentTypes = useMemo(() => {
    const counts: Record<string, number> = {};
    dbJobsForCounting.forEach((j) => {
      if (j.job_type) {
        counts[j.job_type] = (counts[j.job_type] || 0) + 1;
      }
    });

    // We start with static values clone
    const merged = STATIC_EMPLOYMENT_TYPES.map((t) => ({ ...t }));

    // Merge database job type values
    Object.keys(counts).forEach((type) => {
      const existing = merged.find((t) => t.name.toLowerCase() === type.toLowerCase());
      if (existing) {
        existing.count = counts[type];
      } else {
        merged.push({ name: type, count: counts[type] });
      }
    });
    return merged.sort((a, b) => a.name.localeCompare(b.name));
  }, [dbJobsForCounting]);

  const experienceLevels = useMemo(() => {
    const counts: Record<string, number> = {};
    dbJobsForCounting.forEach((j) => {
      if (j.experience) {
        counts[j.experience] = (counts[j.experience] || 0) + 1;
      }
    });

    const merged = STATIC_EXPERIENCE_LEVELS.map((t) => ({ ...t }));
    Object.keys(counts).forEach((exp) => {
      const existing = merged.find((t) => t.name.toLowerCase() === exp.toLowerCase());
      if (existing) {
        existing.count = counts[exp];
      } else {
        merged.push({ name: exp, count: counts[exp] });
      }
    });
    return merged.sort((a, b) => a.name.localeCompare(b.name));
  }, [dbJobsForCounting]);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs", { q, loc, cat, selectedTypes, selectedExps, forcedCategory }],
    queryFn: async () => {
      let query = supabase
        .from("jobs")
        .select("id,title,company,location,job_type,category,created_at")
        .order("created_at", { ascending: false });
      if (cat) query = query.eq("category", cat);
      if (loc) query = query.eq("location", loc);
      if (selectedTypes.length > 0) query = query.in("job_type", selectedTypes);
      if (selectedExps.length > 0) query = query.in("experience", selectedExps);
      if (q) query = query.ilike("title", `%${q}%`);
      const { data } = await query;
      return (data ?? []) as JobRow[];
    },
  });

  const sortedJobs = useMemo(() => {
    return [...jobs].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [jobs, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedJobs.length / PAGE));
  const visible = sortedJobs.slice((page - 1) * PAGE, page * PAGE);

  const handleTypeChange = (typeName: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeName) ? prev.filter((t) => t !== typeName) : [...prev, typeName],
    );
    setPage(1);
  };

  const handleExpChange = (expName: string) => {
    setSelectedExps((prev) =>
      prev.includes(expName) ? prev.filter((e) => e !== expName) : [...prev, expName],
    );
    setPage(1);
  };

  return (
    <SiteLayout>
      <section className="bg-secondary py-16 border-b border-border bg-dot-grid relative overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="glow-orb bg-hero-blue w-[250px] h-[250px] -top-10 left-10" />
        </div>
        <div className="mx-auto max-w-5xl px-4 text-center lg:px-8 animate-fade-in-up">
          <h1 className="font-display text-4xl font-extrabold tracking-tight lg:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-xl mx-auto">{subtitle}</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12 lg:px-8 animate-fade-in-up">
        {/* Unified Pill-shaped Search Bar */}
        <div className="rounded-full border border-border/80 bg-card p-2 shadow-sm flex flex-col md:flex-row items-center gap-2 md:gap-0 transition-all duration-300 hover:shadow-md hover:border-primary/10">
          {/* Keyword Search */}
          <div className="flex flex-1 items-center gap-2.5 px-4 w-full">
            <Search className="h-4.5 w-4.5 text-muted-foreground/80 shrink-0" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("jobs.searchPlaceholder")}
              className="w-full bg-transparent text-sm py-1.5 focus:outline-none placeholder:text-muted-foreground/60 border-none outline-none text-foreground"
            />
          </div>

          {/* Divider */}
          <div className="hidden md:block h-6 w-px bg-border/80" />

          {/* Location Select */}
          <div className="flex flex-1 items-center gap-2.5 px-4 w-full relative">
            <Globe className="h-4.5 w-4.5 text-muted-foreground/80 shrink-0" />
            <div className="relative w-full">
              <select
                value={loc}
                onChange={(e) => setLoc(e.target.value)}
                className="w-full bg-transparent text-sm py-1.5 pr-8 appearance-none focus:outline-none cursor-pointer border-none outline-none text-foreground/85"
              >
                <option value="">{t("jobs.allLocations")}</option>
                {CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80 pointer-events-none" />
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block h-6 w-px bg-border/80" />

          {/* Category Select */}
          <div className="flex flex-1 items-center gap-2.5 px-4 w-full relative">
            <Folder className="h-4.5 w-4.5 text-muted-foreground/80 shrink-0" />
            <div className="relative w-full">
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="w-full bg-transparent text-sm py-1.5 pr-8 appearance-none focus:outline-none cursor-pointer border-none outline-none text-foreground/85"
              >
                <option value="">{t("jobs.allCategories")}</option>
                {categoriesList.map((cName) => (
                  <option key={cName} value={cName}>
                    {cName}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80 pointer-events-none" />
            </div>
          </div>

          {/* Action Button */}
          <Button className="rounded-full bg-green-600 hover:bg-green-700 text-white px-7 py-2.5 text-sm font-semibold shadow-sm hover:shadow-md transition-all shrink-0 w-full md:w-auto cursor-pointer">
            {t("jobs.findButton")}
          </Button>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="space-y-6">
            <FilterGroup
              label={t("jobs.employmentType")}
              onClear={selectedTypes.length > 0 ? () => setSelectedTypes([]) : undefined}
            >
              <div className="flex flex-col gap-2.5">
                {employmentTypes.map((t) => {
                  const isChecked = selectedTypes.includes(t.name);
                  return (
                    <label
                      key={t.name}
                      className="flex items-center justify-between text-sm text-foreground/85 cursor-pointer hover:text-primary transition-colors py-0.5 select-none"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTypeChange(t.name)}
                          className="h-4 w-4 rounded border-border text-[#006A00] focus:ring-[#006A00]/30 cursor-pointer"
                        />
                        <span className={isChecked ? "font-medium text-foreground" : ""}>
                          {t.name}
                        </span>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-secondary text-muted-foreground rounded-full min-w-[24px] text-center">
                        {t.count}
                      </span>
                    </label>
                  );
                })}
              </div>
            </FilterGroup>

            <FilterGroup
              label={t("jobs.experienceLevel")}
              onClear={selectedExps.length > 0 ? () => setSelectedExps([]) : undefined}
            >
              <div className="flex flex-col gap-2.5">
                {experienceLevels.map((t) => {
                  const isChecked = selectedExps.includes(t.name);
                  return (
                    <label
                      key={t.name}
                      className="flex items-center justify-between text-sm text-foreground/85 cursor-pointer hover:text-primary transition-colors py-0.5 select-none"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleExpChange(t.name)}
                          className="h-4 w-4 rounded border-border text-[#006A00] focus:ring-[#006A00]/30 cursor-pointer"
                        />
                        <span className={isChecked ? "font-medium text-foreground" : ""}>
                          {t.name}
                        </span>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-secondary text-muted-foreground rounded-full min-w-[24px] text-center">
                        {t.count}
                      </span>
                    </label>
                  );
                })}
              </div>
            </FilterGroup>
          </aside>

          <div>
            {/* Header: Showing X jobs & Sort Dropdown */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-[#0d1b3e]">
                {(() => {
                  const text =
                    sortedJobs.length === 1 ? t("jobs.showingSingle") : t("jobs.showingPlural");
                  const parts = text.split("{count}");
                  return (
                    <>
                      {parts[0]}
                      <span className="text-[#006A00] font-extrabold">{sortedJobs.length}</span>
                      {parts[1]}
                    </>
                  );
                })()}
              </h2>

              <div className="flex items-center gap-1 bg-card border border-border/60 rounded-xl px-3 py-1.5 shadow-sm hover:shadow-md transition-all">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
                  className="text-xs font-bold bg-transparent border-none focus:outline-none cursor-pointer text-[#0d1b3e]"
                >
                  <option value="newest">{t("jobs.newest")}</option>
                  <option value="oldest">{t("jobs.oldest")}</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="text-muted-foreground flex items-center justify-center p-12">
                <span className="flex h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin mr-3" />
                {t("jobs.loading")}
              </div>
            ) : visible.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center text-muted-foreground animate-fade-in-up">
                {t("jobs.noResults")}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {visible.map((j) => (
                  <JobCard key={j.id} job={j} />
                ))}
              </div>
            )}
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center gap-2.5">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`h-9 w-9 rounded-xl text-sm font-semibold transition-all hover:scale-105 cursor-pointer ${page === i + 1 ? "bg-primary text-primary-foreground shadow-md" : "border border-border bg-card/65 text-foreground/85 hover:border-primary/50"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function FilterGroup({
  label,
  children,
  onClear,
}: {
  label: string;
  children: React.ReactNode;
  onClear?: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-border/60 bg-card/75 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:border-primary/10">
      <div className="mb-3.5 flex items-center justify-between">
        <div className="text-sm font-bold text-foreground/90 uppercase tracking-wide">{label}</div>
        {onClear && (
          <button
            onClick={onClear}
            className="text-xs text-[#006A00] font-bold hover:underline transition-all cursor-pointer"
          >
            {t("jobs.clear")}
          </button>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
