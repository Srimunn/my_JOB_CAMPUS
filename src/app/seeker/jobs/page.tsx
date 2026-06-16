"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardShell } from "@/components/site/DashboardShell";
import { seekerNav } from "@/lib/dashboard-nav";
import { supabase } from "@/integrations/supabase/client";
import { JobCard, type JobRow } from "@/components/site/JobCard";

export default function AvailableJobs() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["seeker-jobs"],
    queryFn: async () => {
      const { data } = await supabase
        .from("jobs")
        .select("id,title,company,location,job_type,category,created_at")
        .order("created_at", { ascending: false });
      return (data ?? []) as JobRow[];
    },
  });

  return (
    <DashboardShell title="Available Jobs" nav={seekerNav} requireRole="jobseeker">
      {isLoading ? (
        <div className="text-muted-foreground">Loading…</div>
      ) : data.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
          No jobs available right now.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((j) => (
            <JobCard key={j.id} job={j} />
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
