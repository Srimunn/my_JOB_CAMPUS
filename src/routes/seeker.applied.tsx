import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DashboardShell } from "@/components/site/DashboardShell";
import { seekerNav } from "@/lib/dashboard-nav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/seeker/applied")({
  component: Applied,
});

function Applied() {
  const { user } = useAuth();
  const { data = [], isLoading } = useQuery({
    queryKey: ["my-apps", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("applications")
        .select("id, created_at, status, job:jobs(id,title,company,location,job_type)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <DashboardShell title="Applied Jobs" nav={seekerNav} requireRole="jobseeker">
      <div className="rounded-2xl border border-border bg-card">
        {isLoading ? <div className="p-6 text-muted-foreground">Loading…</div> : data.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">You haven't applied to any jobs yet.</div>
        ) : (
          <div className="divide-y divide-border">
            {data.map((a) => {
              const job = a.job as { id: string; title: string; company: string; location: string; job_type: string } | null;
              if (!job) return null;
              return (
                <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <Link to="/job/$id" params={{ id: job.id }} className="font-semibold text-foreground hover:text-primary">{job.title}</Link>
                    <div className="text-sm text-muted-foreground">{job.company} · {job.location} · {job.job_type}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(a.created_at).toLocaleDateString()} · <span className="rounded-full bg-secondary px-2 py-0.5">{a.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}