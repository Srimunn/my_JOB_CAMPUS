import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { JobCard, type JobRow } from "@/components/site/JobCard";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, CITIES, JOB_TYPES, EXPERIENCE_LEVELS } from "@/lib/data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "Free Jobs Alert — My Job Campus" },
      { name: "description", content: "Search and apply to thousands of verified jobs across India and remote." },
      { property: "og:title", content: "Free Jobs Alert — My Job Campus" },
      { property: "og:description", content: "Search and apply to thousands of verified jobs." },
    ],
  }),
  component: JobsPage,
});

function JobsPage() {
  return <JobsList title="Jobs" subtitle="Search your career opportunity through 12,800+ jobs" />;
}

export function JobsList({ title, subtitle, forcedCategory }: { title: string; subtitle: string; forcedCategory?: string }) {
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");
  const [cat, setCat] = useState(forcedCategory ?? "");
  const [type, setType] = useState("");
  const [exp, setExp] = useState("");
  const [page, setPage] = useState(1);
  const PAGE = 9;

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs", { q, loc, cat, type, exp, forcedCategory }],
    queryFn: async () => {
      let query = supabase.from("jobs").select("id,title,company,location,job_type,category,created_at").order("created_at", { ascending: false });
      if (forcedCategory) query = query.eq("category", forcedCategory);
      else if (cat) query = query.eq("category", cat);
      if (loc) query = query.eq("location", loc);
      if (type) query = query.eq("job_type", type);
      if (q) query = query.ilike("title", `%${q}%`);
      const { data } = await query;
      return (data ?? []) as JobRow[];
    },
  });

  const totalPages = Math.max(1, Math.ceil(jobs.length / PAGE));
  const visible = jobs.slice((page - 1) * PAGE, page * PAGE);

  return (
    <SiteLayout>
      <section className="bg-secondary py-12">
        <div className="mx-auto max-w-5xl px-4 text-center lg:px-8">
          <h1 className="font-display text-4xl font-extrabold">{title}</h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
        <div className="grid gap-2 rounded-2xl bg-card p-3 shadow-sm md:grid-cols-[1fr_180px_180px_auto]">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Job Title or Keyword" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <select value={loc} onChange={(e) => setLoc(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
            <option value="">All Locations</option>
            {CITIES.map((c) => <option key={c.name}>{c.name}</option>)}
          </select>
          {!forcedCategory && (
            <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => <option key={c.name}>{c.name}</option>)}
            </select>
          )}
          <Button className="rounded-lg">Find Jobs</Button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-6">
            <FilterGroup label="Type of Employment">
              {JOB_TYPES.map((t) => (
                <label key={t} className="flex items-center gap-2 text-sm">
                  <input type="radio" name="type" checked={type === t} onChange={() => setType(t)} /> {t}
                </label>
              ))}
              {type && <button onClick={() => setType("")} className="text-xs text-primary underline">Clear</button>}
            </FilterGroup>
            <FilterGroup label="Experience Level">
              {EXPERIENCE_LEVELS.map((t) => (
                <label key={t} className="flex items-center gap-2 text-sm">
                  <input type="radio" name="exp" checked={exp === t} onChange={() => setExp(t)} /> {t}
                </label>
              ))}
              {exp && <button onClick={() => setExp("")} className="text-xs text-primary underline">Clear</button>}
            </FilterGroup>
          </aside>

          <div>
            {isLoading ? (
              <div className="text-muted-foreground">Loading…</div>
            ) : visible.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
                No jobs match your filters yet.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {visible.map((j) => <JobCard key={j.id} job={j} />)}
              </div>
            )}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`h-9 w-9 rounded-full text-sm ${page === i + 1 ? "bg-primary text-primary-foreground" : "border border-border"}`}
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

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 text-sm font-semibold">{label}</div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}