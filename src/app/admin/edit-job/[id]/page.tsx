"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/site/DashboardShell";
import { adminNav } from "@/lib/dashboard-nav";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CATEGORIES, CITIES, JOB_TYPES, EXPERIENCE_LEVELS } from "@/lib/data";
import { toast } from "sonner";

export default function EditJob() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [classification, setClassification] = useState<"IT" | "Govt">("IT");
  const [f, setF] = useState({
    title: "",
    company: "",
    category: "Software Engineer",
    location: "Bengaluru",
    job_type: "Full Time",
    experience: "0-1 years",
    salary: "",
    last_date: "",
    description: "",
    requirements: "",
    apply_link: "",
    apply_email: "",
  });
  const [updating, setUpdating] = useState(false);

  const { data: job, isLoading } = useQuery({
    queryKey: ["admin-job", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("jobs").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (job) {
      setF({
        title: job.title || "",
        company: job.company || "",
        category: job.category || "Software Engineer",
        location: job.location || "Bengaluru",
        job_type: job.job_type || "Full Time",
        experience: job.experience || "0-1 years",
        salary: job.salary || "",
        last_date: job.last_date || "",
        description: job.description || "",
        requirements: job.requirements || "",
        apply_link: job.apply_link || "",
        apply_email: job.apply_email || "",
      });
      setClassification(job.category === "Government-jobs" ? "Govt" : "IT");
    }
  }, [job]);

  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });

  const handleClassificationChange = (v: "IT" | "Govt") => {
    setClassification(v);
    if (v === "Govt") {
      setF((prev) => ({ ...prev, category: "Government-jobs" }));
    } else {
      setF((prev) => ({ ...prev, category: "Software Engineer" }));
    }
  };

  if (isLoading) {
    return (
      <DashboardShell title="Edit Job" nav={adminNav} requireRole="admin">
        <div className="mx-auto max-w-3xl text-center p-10 text-muted-foreground">
          Loading job details...
        </div>
      </DashboardShell>
    );
  }

  if (!job) {
    return (
      <DashboardShell title="Edit Job" nav={adminNav} requireRole="admin">
        <div className="mx-auto max-w-3xl text-center p-10 text-muted-foreground">
          Job not found.
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Edit Job" nav={adminNav} requireRole="admin">
      <form
        className="mx-auto max-w-3xl space-y-5 rounded-2xl border border-border bg-card p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          setUpdating(true);
          const { error } = await supabase
            .from("jobs")
            .update({
              title: f.title,
              company: f.company,
              category: f.category,
              location: f.location,
              job_type: f.job_type,
              experience: f.experience || null,
              salary: f.salary || null,
              last_date: f.last_date || null,
              description: f.description,
              requirements: f.requirements || null,
              apply_link: f.apply_link || null,
              apply_email: f.apply_email || null,
            })
            .eq("id", id);
          setUpdating(false);
          if (error) {
            toast.error(error.message);
            return;
          }
          toast.success("Job updated successfully!");
          router.push("/admin/manage-jobs");
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Text label="Job Title" v={f.title} on={set("title")} />
          <Text label="Company Name" v={f.company} on={set("company")} />

          <div>
            <label className="mb-1 block text-sm font-medium">Job Sector / Classification</label>
            <select
              value={classification}
              onChange={(e) => handleClassificationChange(e.target.value as "IT" | "Govt")}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="IT">IT / Corporate Job</option>
              <option value="Govt">Government Job</option>
            </select>
          </div>

          {classification === "IT" ? (
            <Select
              label="Category"
              v={f.category}
              on={set("category")}
              options={CATEGORIES.map((c) => c.name).filter((name) => name !== "Government-jobs")}
            />
          ) : (
            <div>
              <label className="mb-1 block text-sm font-medium">Category</label>
              <input
                type="text"
                disabled
                value="Government-jobs"
                className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
              />
            </div>
          )}

          <Select
            label="Location"
            v={f.location}
            on={set("location")}
            options={CITIES.map((c) => c.name)}
          />
          <Select label="Job Type" v={f.job_type} on={set("job_type")} options={JOB_TYPES} />
          <Select
            label="Experience Level"
            v={f.experience}
            on={set("experience")}
            options={EXPERIENCE_LEVELS}
          />
          <Text
            label="Salary"
            v={f.salary}
            on={set("salary")}
            required={false}
            placeholder="e.g. ₹6–10 LPA"
          />
          <Text
            label="Last Date"
            type="date"
            v={f.last_date}
            on={set("last_date")}
            required={false}
          />
        </div>
        <Area label="Description" v={f.description} on={set("description")} rows={6} />
        <Area
          label="Requirements"
          v={f.requirements}
          on={set("requirements")}
          rows={4}
          required={false}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Text
            label="Apply Link"
            v={f.apply_link}
            on={set("apply_link")}
            required={false}
            placeholder="https://..."
          />
          <Text
            label="Apply Email"
            type="email"
            v={f.apply_email}
            on={set("apply_email")}
            required={false}
          />
        </div>
        <div className="flex gap-3 pt-3">
          <Button type="submit" disabled={updating} className="rounded-full cursor-pointer">
            {updating ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/manage-jobs")}
            className="rounded-full cursor-pointer"
          >
            Cancel
          </Button>
        </div>
      </form>
    </DashboardShell>
  );
}

function Text({
  label,
  v,
  on,
  type = "text",
  required = true,
  placeholder,
}: {
  label: string;
  v: string;
  on: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={v}
        onChange={(e) => on(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      />
    </div>
  );
}

function Select({
  label,
  v,
  on,
  options,
}: {
  label: string;
  v: string;
  on: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <select
        required
        value={v}
        onChange={(e) => on(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function Area({
  label,
  v,
  on,
  rows,
  required = true,
}: {
  label: string;
  v: string;
  on: (v: string) => void;
  rows: number;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <textarea
        required={required}
        rows={rows}
        value={v}
        onChange={(e) => on(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      />
    </div>
  );
}
