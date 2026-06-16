import Link from "next/link";
import {
  MapPin,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  MapPinIcon,
  BriefcaseIcon,
} from "lucide-react";
import React from "react";

export interface JobRow {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  category: string;
  created_at: string;
}

interface Branding {
  banner: React.ReactNode;
  logo: React.ReactNode;
}

function getCompanyBranding(
  company: string | null | undefined,
  category: string | null | undefined,
): Branding {
  const comp = (company || "").toLowerCase();
  const cat = (category || "").toLowerCase();
  const compName = company || "Company";

  // Government Jobs / NML Recruitment
  if (cat.includes("govt") || cat.includes("government") || comp.includes("nml")) {
    return {
      banner: (
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50 flex items-center justify-center border-b border-border/50">
          <span className="text-emerald-800/10 font-display font-black text-sm tracking-widest uppercase select-none">
            Govt Jobs Alert
          </span>
        </div>
      ),
      logo: (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md border-2 border-white">
          <ShieldCheck className="h-5 w-5" />
        </div>
      ),
    };
  }

  if (comp.includes("euromonitor")) {
    return {
      banner: (
        <div className="absolute inset-0 bg-white flex flex-col justify-center items-center px-4 border-b border-border/40">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 bg-[#00a896] rounded-sm flex items-center justify-center text-[8px] text-white font-bold">
                E
              </div>
              <span className="font-display font-extrabold text-xs text-[#1d2951] tracking-wider">
                EUROMONITOR
              </span>
            </div>
            <span className="text-[7px] text-[#1d2951] tracking-widest font-medium -mt-0.5">
              INTERNATIONAL
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-[#00a896]" />
        </div>
      ),
      logo: (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md border border-border overflow-hidden p-1">
          <div className="flex flex-col items-center gap-0.5">
            <div className="h-1.5 w-6 bg-[#00a896] rounded-sm" />
            <div className="h-1 w-6 bg-orange-400 rounded-sm" />
          </div>
        </div>
      ),
    };
  }

  if (comp.includes("winfrox")) {
    return {
      banner: (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center border-b border-border/40">
          <div className="flex items-center gap-2">
            <span className="text-xl font-display font-black text-purple-700 tracking-tight">
              Winfrox
            </span>
          </div>
        </div>
      ),
      logo: (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md border border-purple-100">
          <span className="font-display font-black text-lg text-purple-700">W</span>
        </div>
      ),
    };
  }

  if (comp.includes("jcpenney")) {
    return {
      banner: (
        <div className="absolute inset-0 bg-[#bd1a2b] flex items-center justify-center overflow-hidden">
          <span className="font-display font-black text-xl text-white/30 tracking-wider">
            JCPenney
          </span>
        </div>
      ),
      logo: (
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#bd1a2b] text-white shadow-md border-2 border-white">
          <span className="font-display font-black text-xs">JCP</span>
        </div>
      ),
    };
  }

  if (comp.includes("cognizant")) {
    return {
      banner: (
        <div className="absolute inset-0 bg-white flex items-center justify-center border-b border-border/40">
          <span className="font-display font-extrabold text-xl text-[#0033a0] tracking-tight">
            cognizant
          </span>
        </div>
      ),
      logo: (
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0033a0] text-white shadow-md border-2 border-white">
          <span className="font-display font-black text-sm">C</span>
        </div>
      ),
    };
  }

  if (comp.includes("lowe")) {
    return {
      banner: (
        <div className="absolute inset-0 bg-[#004b87] flex items-center justify-center">
          <div className="border border-white/30 px-3 py-1 rounded">
            <span className="font-display font-black text-sm text-white tracking-widest">
              LOWE'S
            </span>
          </div>
        </div>
      ),
      logo: (
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#004b87] text-white shadow-md border-2 border-white">
          <span className="font-display font-extrabold text-xs">L</span>
        </div>
      ),
    };
  }

  if (comp.includes("ebay")) {
    return {
      banner: (
        <div className="absolute inset-0 bg-white flex items-center justify-center border-b border-border/40">
          <div className="flex text-xl font-bold font-sans">
            <span className="text-[#e53238]">e</span>
            <span className="text-[#0064d2]">b</span>
            <span className="text-[#fec435]">a</span>
            <span className="text-[#86b817]">y</span>
          </div>
        </div>
      ),
      logo: (
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-md border border-border">
          <div className="flex text-xs font-bold font-sans">
            <span className="text-[#e53238]">e</span>
            <span className="text-[#0064d2]">b</span>
          </div>
        </div>
      ),
    };
  }

  if (comp.includes("concentrix")) {
    return {
      banner: (
        <div className="absolute inset-0 bg-[#005a70] flex items-center justify-center overflow-hidden">
          <span className="font-display font-extrabold text-xs text-white/50 tracking-wider">
            CONCENTRIX
          </span>
        </div>
      ),
      logo: (
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#005a70] text-white shadow-md border border-teal-400">
          <div className="h-6 w-6 rounded-full border border-teal-300 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-white" />
          </div>
        </div>
      ),
    };
  }

  // Fallback beautiful gradients
  const gradients = [
    "from-blue-500 to-indigo-600",
    "from-teal-500 to-emerald-600",
    "from-purple-500 to-pink-600",
    "from-orange-500 to-red-600",
    "from-cyan-500 to-blue-600",
  ];
  const hash = compName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const grad = gradients[hash % gradients.length];

  return {
    banner: (
      <div className={`absolute inset-0 bg-gradient-to-r ${grad} flex items-center justify-center`}>
        <span className="font-display font-black text-sm text-white/30 tracking-widest uppercase">
          {compName}
        </span>
      </div>
    ),
    logo: (
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r ${grad} text-white shadow-md border-2 border-white`}
      >
        <span className="font-display font-bold text-sm uppercase">{compName.charAt(0)}</span>
      </div>
    ),
  };
}

const formatJobDate = (dateString?: string) => {
  if (!dateString) return "Recent";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Recent";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export function JobCard({ job }: { job: JobRow }) {
  const branding = getCompanyBranding(job.company, job.category);

  return (
    <Link
      href={`/job/${job.id}`}
      className="group relative flex flex-col h-full w-full overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-soft)] hover:border-primary/20"
    >
      {/* Banner */}
      <div className="relative h-32 w-full overflow-hidden">
        {branding.banner}
        {/* Floating Logo Badge */}
        <div className="absolute -bottom-3 right-5 z-10 transition-transform duration-300 group-hover:scale-110">
          {branding.logo}
        </div>
      </div>

      {/* Info Section */}
      <div className="flex flex-1 flex-col justify-between p-5 pt-6">
        <div>
          {/* Category Tag with Dot */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
            <span className="font-medium truncate">{job.category}</span>
          </div>

          {/* Job Title */}
          <h3 className="line-clamp-2 font-display text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors duration-200">
            {job.title}
          </h3>

          {/* Location and Type */}
          <div className="mt-3 flex items-center gap-4 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPinIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <BriefcaseIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
              {job.job_type}
            </span>
          </div>
        </div>

        {/* Date and Company Footer */}
        <div className="mt-6 border-t border-border/50 pt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {formatJobDate(job.created_at)} by{" "}
            <strong className="font-semibold text-foreground/80">{job.company}</strong>
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-primary opacity-0 scale-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
