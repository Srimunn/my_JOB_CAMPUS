import { Link } from "@tanstack/react-router";
import { Briefcase, Calendar, MapPin } from "lucide-react";

export interface JobRow {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  category: string;
  created_at: string;
}

export function JobCard({ job }: { job: JobRow }) {
  return (
    <Link
      to="/job/$id"
      params={{ id: job.id }}
      className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
    >
      <div className="mb-3 inline-flex w-fit rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
        {job.category}
      </div>
      <h3 className="line-clamp-2 text-lg font-semibold text-foreground group-hover:text-primary">
        {job.title}
      </h3>
      <div className="mt-1 text-sm font-medium text-foreground/70">{job.company}</div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
        <span className="inline-flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{job.job_type}</span>
        <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(job.created_at).toLocaleDateString()}</span>
      </div>
    </Link>
  );
}
