"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Briefcase, Calendar, IndianRupee, MapPin, Tag, Clock } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export default function JobDetails() {
  const { id } = useParams() as { id: string };
  const { user, role } = useAuth();
  const qc = useQueryClient();

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("jobs").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: alreadyApplied } = useQuery({
    queryKey: ["app", id, user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("applications")
        .select("id")
        .eq("job_id", id)
        .eq("user_id", user!.id)
        .maybeSingle();
      return !!data;
    },
  });

  const apply = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Please sign in to apply.");
      const { data: profile } = await supabase
        .from("profiles")
        .select("resume_url")
        .eq("id", user.id)
        .single();
      const { error } = await supabase.from("applications").insert({
        job_id: id,
        user_id: user.id,
        resume_url: profile?.resume_url ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Application submitted!");
      qc.invalidateQueries({ queryKey: ["app", id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading)
    return (
      <SiteLayout>
        <div className="mx-auto max-w-4xl px-4 py-20 text-muted-foreground">Loading…</div>
      </SiteLayout>
    );
  if (!job)
    return (
      <SiteLayout>
        <div className="mx-auto max-w-4xl px-4 py-20">Job not found.</div>
      </SiteLayout>
    );

  return (
    <SiteLayout>
      <article className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                {job.category}
              </div>
              <h1 className="mt-3 font-display text-3xl font-extrabold">{job.title}</h1>
              <div className="mt-1 text-lg font-medium text-foreground/80">{job.company}</div>
            </div>
            <div className="flex gap-2">
              {!user ? (
                <Link href="/auth/login">
                  <Button className="rounded-full">Sign in to Apply</Button>
                </Link>
              ) : role === "admin" ? (
                <Button disabled className="rounded-full">
                  Admin view
                </Button>
              ) : alreadyApplied ? (
                <Button disabled className="rounded-full">
                  Already Applied
                </Button>
              ) : (
                <Button
                  onClick={() => apply.mutate()}
                  disabled={apply.isPending}
                  className="rounded-full"
                >
                  Apply Now
                </Button>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Meta icon={<MapPin className="h-4 w-4" />} label="Location" value={job.location} />
            <Meta icon={<Briefcase className="h-4 w-4" />} label="Type" value={job.job_type} />
            <Meta icon={<Tag className="h-4 w-4" />} label="Category" value={job.category} />
            {job.experience && (
              <Meta
                icon={<Clock className="h-4 w-4" />}
                label="Experience"
                value={job.experience}
              />
            )}
            {job.salary && (
              <Meta icon={<IndianRupee className="h-4 w-4" />} label="Salary" value={job.salary} />
            )}
            {job.last_date && (
              <Meta
                icon={<Calendar className="h-4 w-4" />}
                label="Last Date"
                value={new Date(job.last_date).toLocaleDateString()}
              />
            )}
          </div>

          <section className="mt-8">
            <h2 className="font-display text-xl font-bold">Description</h2>
            <p className="mt-2 whitespace-pre-wrap text-foreground/80">{job.description}</p>
          </section>
          {job.requirements && (
            <section className="mt-6">
              <h2 className="font-display text-xl font-bold">Requirements</h2>
              <p className="mt-2 whitespace-pre-wrap text-foreground/80">{job.requirements}</p>
            </section>
          )}
          {(job.apply_link || job.apply_email) && (
            <section className="mt-8 rounded-xl bg-secondary p-4 text-sm">
              <div className="font-semibold">How to apply</div>
              {job.apply_link && (
                <a
                  href={job.apply_link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-1 block text-primary underline"
                >
                  {job.apply_link}
                </a>
              )}
              {job.apply_email && (
                <a href={`mailto:${job.apply_email}`} className="mt-1 block text-primary underline">
                  {job.apply_email}
                </a>
              )}
            </section>
          )}
        </div>
      </article>
    </SiteLayout>
  );
}

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border p-3">
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-primary">
        {icon}
      </div>
      <div>
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}
