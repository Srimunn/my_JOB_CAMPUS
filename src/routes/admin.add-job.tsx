import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardShell } from "@/components/site/DashboardShell";
import { adminNav } from "@/lib/dashboard-nav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { CATEGORIES, CITIES, JOB_TYPES, EXPERIENCE_LEVELS } from "@/lib/data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/add-job")({
  component: AddJob,
});

function AddJob() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [f, setF] = useState({
    title: "", company: "", category: "Software Engineer", location: "Bengaluru",
    job_type: "Full Time", experience: "0-1 years", salary: "", last_date: "",
    description: "", requirements: "", apply_link: "", apply_email: "",
  });
  const [loading, setLoading] = useState(false);
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });

  return (
    <DashboardShell title="Add Job" nav={adminNav} requireRole="admin">
      <form
        className="mx-auto max-w-3xl space-y-5 rounded-2xl border border-border bg-card p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          const { error } = await supabase.from("jobs").insert({
            title: f.title, company: f.company, category: f.category, location: f.location,
            job_type: f.job_type, experience: f.experience || null, salary: f.salary || null,
            last_date: f.last_date || null, description: f.description, requirements: f.requirements || null,
            apply_link: f.apply_link || null, apply_email: f.apply_email || null,
            posted_by: user?.id ?? null,
          });
          setLoading(false);
          if (error) { toast.error(error.message); return; }
          toast.success("Job posted!");
          navigate({ to: "/admin/manage-jobs" });
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Text label="Job Title" v={f.title} on={set("title")} />
          <Text label="Company Name" v={f.company} on={set("company")} />
          <Select label="Category" v={f.category} on={set("category")} options={CATEGORIES.map((c) => c.name)} />
          <Select label="Location" v={f.location} on={set("location")} options={CITIES.map((c) => c.name)} />
          <Select label="Job Type" v={f.job_type} on={set("job_type")} options={JOB_TYPES} />
          <Select label="Experience Level" v={f.experience} on={set("experience")} options={EXPERIENCE_LEVELS} />
          <Text label="Salary" v={f.salary} on={set("salary")} required={false} placeholder="e.g. ₹6–10 LPA" />
          <Text label="Last Date" type="date" v={f.last_date} on={set("last_date")} required={false} />
        </div>
        <Area label="Description" v={f.description} on={set("description")} rows={6} />
        <Area label="Requirements" v={f.requirements} on={set("requirements")} rows={4} required={false} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Text label="Apply Link" v={f.apply_link} on={set("apply_link")} required={false} placeholder="https://..." />
          <Text label="Apply Email" type="email" v={f.apply_email} on={set("apply_email")} required={false} />
        </div>
        <Button type="submit" disabled={loading} className="rounded-full">{loading ? "Posting…" : "Submit"}</Button>
      </form>
    </DashboardShell>
  );
}

function Text({ label, v, on, type = "text", required = true, placeholder }: { label: string; v: string; on: (v: string) => void; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input type={type} required={required} placeholder={placeholder} value={v} onChange={(e) => on(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
    </div>
  );
}
function Select({ label, v, on, options }: { label: string; v: string; on: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <select required value={v} onChange={(e) => on(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
function Area({ label, v, on, rows, required = true }: { label: string; v: string; on: (v: string) => void; rows: number; required?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <textarea required={required} rows={rows} value={v} onChange={(e) => on(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
    </div>
  );
}