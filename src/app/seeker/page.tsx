"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/site/DashboardShell";
import { seekerNav } from "@/lib/dashboard-nav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Profile() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
      return data;
    },
  });
  const [form, setForm] = useState({ full_name: "", phone: "" });
  useEffect(() => {
    if (profile) setForm({ full_name: profile.full_name ?? "", phone: profile.phone ?? "" });
  }, [profile]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("profiles").update(form).eq("id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profile saved");
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function uploadResume(file: File) {
    const path = `${user!.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("resumes").upload(path, file);
    if (error) return toast.error(error.message);
    await supabase.from("profiles").update({ resume_url: path }).eq("id", user!.id);
    toast.success("Resume updated");
    qc.invalidateQueries({ queryKey: ["profile"] });
  }

  return (
    <DashboardShell title="My Profile" nav={seekerNav} requireRole="jobseeker">
      <div className="mx-auto max-w-2xl space-y-5 rounded-2xl border border-border bg-card p-6">
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            disabled
            value={profile?.email ?? ""}
            className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Full Name</label>
          <input
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Phone</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Resume</label>
          {profile?.resume_url ? (
            <div className="mb-2 text-xs text-muted-foreground">
              Current: {profile.resume_url.split("/").pop()}
            </div>
          ) : null}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => e.target.files?.[0] && uploadResume(e.target.files[0])}
            className="text-sm"
          />
        </div>
        <Button
          onClick={() => save.mutate()}
          disabled={save.isPending}
          className="rounded-full cursor-pointer"
        >
          {save.isPending ? "Saving…" : "Save Profile"}
        </Button>
      </div>
    </DashboardShell>
  );
}
