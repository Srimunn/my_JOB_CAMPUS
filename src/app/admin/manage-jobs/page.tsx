"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardShell } from "@/components/site/DashboardShell";
import { adminNav } from "@/lib/dashboard-nav";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink, Pencil } from "lucide-react";
import { toast } from "sonner";

export default function Manage() {
  const qc = useQueryClient();
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: async () => {
      const { data } = await supabase
        .from("jobs")
        .select("id,title,company,location,category,created_at")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });
  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("jobs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-jobs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <DashboardShell title="Manage Jobs" nav={adminNav} requireRole="admin">
      <div className="rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="font-semibold">All Jobs ({jobs.length})</div>
          <Link href="/admin/add-job">
            <Button size="sm" className="rounded-full cursor-pointer">
              Add Job
            </Button>
          </Link>
        </div>
        {isLoading ? (
          <div className="p-6 text-muted-foreground">Loading…</div>
        ) : jobs.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            No jobs yet — add your first one.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {jobs.map((j) => (
              <div key={j.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <div className="font-semibold">{j.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {j.company} · {j.location} · {j.category}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/job/${j.id}`}>
                    <Button variant="outline" size="sm" className="cursor-pointer">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/admin/edit-job/${j.id}`}>
                    <Button variant="outline" size="sm" className="cursor-pointer">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    onClick={() => confirm("Delete this job?") && del.mutate(j.id)}
                    variant="destructive"
                    size="sm"
                    className="cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
