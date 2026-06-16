"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { DashboardShell } from "@/components/site/DashboardShell";
import { adminNav } from "@/lib/dashboard-nav";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type AppProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
};

export default function Apps() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-apps"],
    queryFn: async () => {
      const { data } = await supabase
        .from("applications")
        .select("id, created_at, status, resume_url, user_id, job:jobs(id,title,company)")
        .order("created_at", { ascending: false });
      const apps = data ?? [];
      const userIds = Array.from(new Set(apps.map((a) => a.user_id)));
      const { data: profiles } = userIds.length
        ? await supabase.from("profiles").select("id,full_name,email,phone").in("id", userIds)
        : { data: [] as AppProfile[] };
      const map = new Map((profiles ?? []).map((p) => [p.id, p]));
      return apps.map((a) => ({ ...a, profile: map.get(a.user_id) ?? null }));
    },
  });

  async function viewResume(path: string) {
    const { data, error } = await supabase.storage.from("resumes").createSignedUrl(path, 60);
    if (error) return toast.error(error.message);
    window.open(data.signedUrl, "_blank");
  }

  return (
    <DashboardShell title="Applications" nav={adminNav} requireRole="admin">
      <div className="rounded-2xl border border-border bg-card">
        {isLoading ? (
          <div className="p-6 text-muted-foreground">Loading…</div>
        ) : data.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">No applications yet.</div>
        ) : (
          <div className="divide-y divide-border">
            {data.map((a) => {
              const job = a.job as { id: string; title: string; company: string } | null;
              const profile = a.profile;
              return (
                <div key={a.id} className="flex flex-wrap items-start justify-between gap-3 p-4">
                  <div>
                    <div className="font-semibold">{profile?.full_name ?? "Unknown"}</div>
                    <div className="text-sm text-muted-foreground">
                      {profile?.email} · {profile?.phone}
                    </div>
                    <div className="mt-1 text-sm">
                      Applied to{" "}
                      {job ? (
                        <Link href={`/job/${job.id}`} className="text-primary underline">
                          {job.title}
                        </Link>
                      ) : (
                        "—"
                      )}{" "}
                      @ {job?.company}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {new Date(a.created_at).toLocaleString()} · {a.status}
                    </div>
                  </div>
                  {a.resume_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => viewResume(a.resume_url!)}
                    >
                      View resume
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
