"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardShell } from "@/components/site/DashboardShell";
import { adminNav } from "@/lib/dashboard-nav";
import { supabase } from "@/integrations/supabase/client";
import {
  Briefcase,
  FileText,
  Building2,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

interface RecentJob {
  id: string;
  title: string;
  company: string;
  created_at: string;
}

interface RecentApp {
  id: string;
  created_at: string;
  status: string;
  jobs: {
    title: string;
  } | null;
}

export default function AdminDash() {
  const { data: dashData, isLoading } = useQuery({
    queryKey: ["admin-dashboard-stats-and-activities"],
    queryFn: async () => {
      const [
        { count: totalJobs },
        { count: activeJobs },
        { count: expiredJobs },
        { count: totalCompanies },
        { count: totalArticles },
        { count: totalApps },
        { data: recentJobs },
        { data: recentApps },
      ] = await Promise.all([
        supabase.from("jobs").select("id", { count: "exact", head: true }),
        supabase.from("jobs").select("id", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("jobs").select("id", { count: "exact", head: true }).eq("status", "expired"),
        supabase.from("companies").select("id", { count: "exact", head: true }),
        supabase.from("articles").select("id", { count: "exact", head: true }),
        supabase.from("applications").select("id", { count: "exact", head: true }),
        supabase
          .from("jobs")
          .select("id, title, company, created_at")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("applications")
          .select("id, created_at, status, jobs(title)")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      return {
        totalJobs: totalJobs ?? 0,
        activeJobs: activeJobs ?? 0,
        expiredJobs: expiredJobs ?? 0,
        totalCompanies: totalCompanies ?? 0,
        totalArticles: totalArticles ?? 0,
        totalApps: totalApps ?? 0,
        recentJobs: (recentJobs || []) as RecentJob[],
        recentApps: (recentApps || []) as unknown as RecentApp[],
      };
    },
  });

  return (
    <DashboardShell title="Dashboard" nav={adminNav} requireRole="admin">
      {isLoading ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          <span className="flex h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin mr-3" />
          Loading dashboard statistics...
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top Info Banner */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm relative overflow-hidden bg-dot-grid">
            <div className="absolute right-0 top-0 -z-10 h-32 w-32 bg-emerald-500/10 rounded-full blur-2xl" />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                  Welcome back, Admin!
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground max-w-xl">
                  Manage jobs, verify hiring companies, publish career advice guides, and review seeker applications in real time.
                </p>
              </div>
              <div className="flex gap-2">
                <Link href="/admin/add-job">
                  <button className="h-9 px-4 rounded-full bg-emerald-800 text-white hover:bg-emerald-700 text-xs font-bold shadow-sm transition cursor-pointer">
                    Add Job
                  </button>
                </Link>
                <Link href="/admin/add-company">
                  <button className="h-9 px-4 rounded-full bg-secondary text-foreground hover:bg-secondary/80 border border-border text-xs font-bold transition cursor-pointer">
                    Add Company
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              icon={<Briefcase />}
              label="Total Jobs"
              value={dashData?.totalJobs ?? 0}
              colorClass="bg-blue-500/10 text-blue-600"
            />
            <StatCard
              icon={<CheckCircle />}
              label="Active Jobs"
              value={dashData?.activeJobs ?? 0}
              colorClass="bg-emerald-500/10 text-emerald-600"
            />
            <StatCard
              icon={<XCircle />}
              label="Expired Jobs"
              value={dashData?.expiredJobs ?? 0}
              colorClass="bg-rose-500/10 text-rose-600"
            />
            <StatCard
              icon={<Building2 />}
              label="Total Companies"
              value={dashData?.totalCompanies ?? 0}
              colorClass="bg-indigo-500/10 text-indigo-600"
            />
            <StatCard
              icon={<BookOpen />}
              label="Career Guides"
              value={dashData?.totalArticles ?? 0}
              colorClass="bg-amber-500/10 text-amber-600"
            />
            <StatCard
              icon={<FileText />}
              label="Applications"
              value={dashData?.totalApps ?? 0}
              colorClass="bg-violet-500/10 text-violet-600"
            />
          </div>

          {/* Recent Activities Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Job Listings */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
                <h3 className="font-bold text-foreground text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" /> Recent Jobs Added
                </h3>
                <Link href="/admin/manage-jobs" className="text-xs font-bold text-accent hover:underline flex items-center gap-0.5">
                  View All <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              {dashData?.recentJobs && dashData.recentJobs.length > 0 ? (
                <div className="space-y-3.5">
                  {dashData.recentJobs.map((j) => (
                    <div key={j.id} className="flex items-start justify-between gap-3 p-2 rounded-xl hover:bg-secondary/40 transition">
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate text-foreground">{j.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {j.company} &bull; {new Date(j.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <Link href={`/jobs/${j.id}`}>
                        <button className="h-7 w-7 rounded-full bg-secondary text-primary hover:bg-primary hover:text-white flex items-center justify-center transition cursor-pointer">
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">No jobs posted yet.</div>
              )}
            </div>

            {/* Recent Applications */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
                <h3 className="font-bold text-foreground text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-600" /> Recent Applications
                </h3>
                <Link href="/admin/applications" className="text-xs font-bold text-accent hover:underline flex items-center gap-0.5">
                  View All <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              {dashData?.recentApps && dashData.recentApps.length > 0 ? (
                <div className="space-y-3.5">
                  {dashData.recentApps.map((a) => (
                    <div key={a.id} className="flex items-start justify-between gap-3 p-2 rounded-xl hover:bg-secondary/40 transition">
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate text-foreground">
                          Applied for: {a.jobs?.title || "Unknown Job"}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Submitted on {new Date(a.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize shrink-0 ${
                        a.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                        a.status === 'reviewed' ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {a.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">No applications received yet.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  colorClass: string;
}

function StatCard({ icon, label, value, colorClass }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition duration-200">
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className={`grid h-9 w-9 place-items-center rounded-xl ${colorClass}`}>
          {icon}
        </div>
        <div className="text-sm font-medium">{label}</div>
      </div>
      <div className="mt-4 font-display text-3xl font-extrabold text-foreground">{value}</div>
    </div>
  );
}
