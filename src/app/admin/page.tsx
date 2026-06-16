"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardShell } from "@/components/site/DashboardShell";
import { adminNav } from "@/lib/dashboard-nav";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, FileText, Users } from "lucide-react";

export default function AdminDash() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [{ count: jobs }, { count: apps }, { count: seekers }] = await Promise.all([
        supabase.from("jobs").select("id", { count: "exact", head: true }),
        supabase.from("applications").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);
      return { jobs: jobs ?? 0, apps: apps ?? 0, seekers: seekers ?? 0 };
    },
  });

  return (
    <DashboardShell title="Dashboard" nav={adminNav} requireRole="admin">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={<Briefcase />} label="Total Jobs" value={stats?.jobs ?? 0} />
        <Stat icon={<FileText />} label="Applications" value={stats?.apps ?? 0} />
        <Stat icon={<Users />} label="Job Seekers" value={stats?.seekers ?? 0} />
      </div>
      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-bold">Welcome back, admin</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Use the sidebar to add a job, manage existing listings, or review applications.
        </p>
      </div>
    </DashboardShell>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-primary">
          {icon}
        </div>
        <div className="text-sm">{label}</div>
      </div>
      <div className="mt-3 font-display text-3xl font-extrabold">{value}</div>
    </div>
  );
}
