"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Folder,
  Laptop,
  LineChart,
  Headphones,
  Search,
  Send,
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  MapPin,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SearchBar } from "@/components/site/SearchBar";
import { JobCard, type JobRow } from "@/components/site/JobCard";
import { CATEGORIES, CITIES, FAQS } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/site/ScrollReveal";
import handshakeImg from "@/assets/handshake.png";

// Map category names to icons
const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (
    n.includes("software engineer") ||
    n.includes("software development") ||
    n.includes("developer")
  ) {
    return Laptop;
  }
  if (n.includes("finance")) {
    return LineChart;
  }
  if (n.includes("customer service") || n.includes("customer support") || n.includes("support")) {
    return Headphones;
  }
  return Folder;
};

const MOCK_JOBS: JobRow[] = [
  {
    id: "govt-1",
    title: "NML Recruitment 2026 – 22 MTS Vacancies | Apply Online",
    company: "Government Jobs",
    location: "Jamshedpur, Chennai, Digha",
    job_type: "Full Time",
    category: "Government-jobs",
    created_at: "2026-01-05T00:00:00.000Z",
  },
  {
    id: "ea-1",
    title: "Data Analyst",
    company: "Euromonitor International",
    location: "Bengaluru",
    job_type: "Full Time",
    category: "Data Analyst/Data Scientist",
    created_at: "2025-08-01T00:00:00.000Z",
  },
  {
    id: "win-1",
    title: "Junior Data Analyst",
    company: "Winfrox",
    location: "Remote",
    job_type: "Full Time",
    category: "Data Analyst/Data Scientist",
    created_at: "2025-08-01T00:00:00.000Z",
  },
  {
    id: "jcp-1",
    title: "Analyst 2",
    company: "JCPenney",
    location: "Bengaluru",
    job_type: "Full Time",
    category: "Data Analyst/Data Scientist",
    created_at: "2025-07-31T00:00:00.000Z",
  },
  {
    id: "cog-1",
    title: "Data Analyst(VBA and Advanced Excel)",
    company: "Cognizant",
    location: "Bengaluru",
    job_type: "Full Time",
    category: "Data Analyst/Data Scientist",
    created_at: "2025-07-31T00:00:00.000Z",
  },
  {
    id: "low-1",
    title: "Analyst, LMN Insights",
    company: "Lowes",
    location: "Bengaluru",
    job_type: "Full Time",
    category: "Data Analyst/Data Scientist",
    created_at: "2025-07-31T00:00:00.000Z",
  },
  {
    id: "ebay-1",
    title: "Data Operations Analyst",
    company: "ebay",
    location: "Bengaluru",
    job_type: "Full Time",
    category: "Data Analyst/Data Scientist",
    created_at: "2025-07-29T00:00:00.000Z",
  },
  {
    id: "con-1",
    title: "Analyst, Forecasting",
    company: "Concentrix",
    location: "Bengaluru",
    job_type: "Full Time",
    category: "Data Analyst/Data Scientist",
    created_at: "2025-07-28T00:00:00.000Z",
  },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { data: jobs = [] } = useQuery({
    queryKey: ["jobs", "featured"],
    queryFn: async () => {
      const { data } = await supabase
        .from("jobs")
        .select("id,title,company,location,job_type,category,created_at")
        .order("created_at", { ascending: false })
        .limit(8);
      return (data ?? []) as JobRow[];
    },
  });

  const displayJobs = jobs.length > 0 ? jobs : MOCK_JOBS;

  const { data: allJobs = [] } = useQuery({
    queryKey: ["jobs", "all-locations-categories"],
    queryFn: async () => {
      const { data } = await supabase.from("jobs").select("location,category");
      return data ?? [];
    },
  });

  const dynamicCities = CITIES.map((city) => {
    const count = allJobs.filter((job) => {
      if (!job.location) return false;
      return job.location.toLowerCase().includes(city.name.toLowerCase());
    }).length;
    return { ...city, count };
  });

  const dynamicCategories = CATEGORIES.map((cat) => {
    const count = allJobs.filter((job) => {
      if (!job.category) return false;
      return job.category.toLowerCase() === cat.name.toLowerCase();
    }).length;
    return { ...cat, count };
  });

  const bullets = [
    "Refine your search by industry, location, and more.",
    "Find jobs that match your expertise.",
    "Get the latest job openings instantly",
    "Discover companies that match your values.",
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-dot-grid border-b border-border py-20 lg:py-28 text-center">
        {/* Glow Orbs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="glow-orb bg-hero-blue w-[400px] h-[400px] -top-20 -left-20" />
          <div className="glow-orb bg-hero-blue-deep w-[350px] h-[350px] bottom-10 right-10" />
        </div>

        {/* Floating cards for unique animatic layout */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block overflow-hidden">
          {/* Card 1: Left Top */}
          <div className="absolute left-[6%] top-[20%] glass-morphism rounded-2xl p-4 shadow-lg border border-white/20 animate-float-slow flex items-center gap-3 bg-white/70 max-w-[230px]">
            <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-black text-[#1d2951]">Verified Roles</div>
              <div className="text-[10px] text-muted-foreground font-medium">
                100% Legit Postings
              </div>
            </div>
          </div>

          {/* Card 2: Right Top */}
          <div className="absolute right-[6%] top-[18%] glass-morphism rounded-2xl p-4 shadow-lg border border-white/20 animate-float-fast flex items-center gap-3 bg-white/70 max-w-[230px]">
            <div className="h-10 w-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600 shrink-0">
              <Laptop className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-black text-[#1d2951]">Remote Friendly</div>
              <div className="text-[10px] text-muted-foreground font-medium">
                Work from Anywhere
              </div>
            </div>
          </div>

          {/* Card 3: Left Bottom */}
          <div className="absolute left-[10%] bottom-[20%] glass-morphism rounded-2xl p-4 shadow-lg border border-white/20 animate-float-fast flex items-center gap-3 bg-white/70 max-w-[230px]">
            <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 shrink-0">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-black text-[#1d2951]">98% Success</div>
              <div className="text-[10px] text-muted-foreground font-medium">Fast-track Hiring</div>
            </div>
          </div>

          {/* Card 4: Right Bottom */}
          <div className="absolute right-[10%] bottom-[22%] glass-morphism rounded-2xl p-4 shadow-lg border border-white/20 animate-float-slow flex items-center gap-3 bg-white/70 max-w-[230px]">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 shrink-0">
              <Folder className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-black text-[#1d2951]">Top Categories</div>
              <div className="text-[10px] text-muted-foreground font-medium">Find your niche</div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 lg:px-8 -mt-[20px] relative">
          {/* Neon Glow backdrop behind header */}
          <div className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 -z-10 w-[240px] h-[240px] bg-sky-200/20 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />

          <ScrollReveal animation="fade-in-up" duration={800}>
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-foreground lg:text-7xl">
              Find the perfect{" "}
              <span className="bg-gradient-to-r from-primary via-hero-blue-deep to-primary bg-clip-text text-transparent">
                job for you
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-in-up" duration={800} delay={150}>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground lg:text-xl">
              Explore a wide range of opportunities
            </p>
          </ScrollReveal>

          <ScrollReveal animation="scale-up" duration={900} delay={300}>
            <div className="mx-auto mt-10 max-w-2xl glass-morphism rounded-3xl p-4 shadow-2xl border border-white/40 transition-all duration-500 hover:shadow-primary/5 hover:border-primary/20">
              <SearchBar />
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-in-up" duration={800} delay={450}>
            <div className="mt-12 grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:justify-center sm:gap-6">
              {bullets.map((b) => (
                <div
                  key={b}
                  className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/85 px-4 py-2.5 text-left text-sm text-foreground/80 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/15 hover:bg-card group cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-accent transition-transform duration-300 group-hover:scale-125" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <ScrollReveal animation="fade-in-up" duration={800}>
          <SectionHeader
            title="Search by Category"
            subtitle="Find Opportunities in Your Preferred Category"
          />
        </ScrollReveal>

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {dynamicCategories.slice(0, 12).map((c, idx) => {
            const Icon = getCategoryIcon(c.name);
            return (
              <ScrollReveal key={c.name} animation="scale-up" duration={600} delay={idx * 50}>
                <Link
                  href={`/jobs?category=${encodeURIComponent(c.name)}`}
                  className="group flex flex-col items-center text-center rounded-3xl border border-border bg-card p-6 transition-all duration-350 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)] hover:border-primary/20"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:rotate-6">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2 min-h-[40px] flex items-center justify-center">
                    {c.name}
                  </div>
                  <div className="mt-1.5 text-xs text-muted-foreground">
                    {c.count} open positions
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal animation="fade-in" duration={600} delay={200}>
          <div className="mt-10 text-center">
            <Link href="/jobs">
              <Button className="rounded-full bg-accent hover:bg-accent/90 text-white font-bold px-6 py-5 shadow-md hover:shadow-lg transition-all duration-300">
                All Categories <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* Featured jobs */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <ScrollReveal animation="fade-in-up" duration={800}>
          <SectionHeader
            title="Featured Job Offers"
            subtitle="Search your career through wide-range of opportunities"
          />
        </ScrollReveal>

        {displayJobs.length === 0 ? (
          <ScrollReveal animation="fade-in" duration={850}>
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
              No jobs posted yet. Check back soon — new roles are added every day.
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {displayJobs.map((j, idx) => (
              <ScrollReveal
                key={j.id}
                animation="fade-in-up"
                duration={700}
                delay={idx * 80}
                className="h-full"
              >
                <JobCard job={j} />
              </ScrollReveal>
            ))}
          </div>
        )}

        <ScrollReveal animation="fade-in" duration={600} delay={200}>
          <div className="mt-10 text-center">
            <Link href="/jobs">
              <Button className="rounded-full bg-accent hover:bg-accent/90 text-white font-bold px-6 py-5 shadow-md hover:shadow-lg transition-all duration-300">
                All Job Offers <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* Cities */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <ScrollReveal animation="fade-in-up" duration={800}>
          <SectionHeader
            title="Featured Cities"
            subtitle="Start your next career in a city of your choice"
          />
        </ScrollReveal>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {dynamicCities.slice(0, 9).map((c, idx) => (
            <ScrollReveal key={c.name} animation="scale-up" duration={600} delay={idx * 60}>
              <Link
                href={`/jobs?loc=${encodeURIComponent(c.name)}`}
                className="group relative flex flex-col justify-center rounded-3xl border border-sky-100/30 bg-[#e8effc]/60 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_24px_-8px_rgba(14,165,233,0.2)] hover:bg-[#e0eafc] hover:border-sky-200/50"
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-100/80 text-sky-700 transition-all duration-300 group-hover:scale-110">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-[#1d2951] dark:text-[#f8fafc] group-hover:text-primary transition-colors duration-200">
                        {c.name}
                      </div>
                      <div className="mt-1 text-xs text-[#64748b] dark:text-[#94a3b8] font-medium">
                        {c.count} open positions
                      </div>
                    </div>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-primary opacity-0 scale-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Why */}
      <section className="py-20 bg-transparent">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Handshake Image Column */}
            <div className="lg:col-span-5 flex justify-center">
              <ScrollReveal animation="slide-in-left" duration={900}>
                <div className="relative border-[6px] border-emerald-800 rounded-3xl overflow-hidden shadow-2xl bg-card max-w-[400px] h-[500px] w-full group cursor-pointer">
                  <Image
                    src={handshakeImg}
                    alt="Why My Job Campus"
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                </div>
              </ScrollReveal>
            </div>

            {/* Right Information Column */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <ScrollReveal animation="slide-in-right" duration={900}>
                <span className="text-emerald-700 font-bold tracking-wider text-sm mb-3 block uppercase">
                  Why My Job Campus
                </span>
                <h2 className="font-display text-2xl font-extrabold text-foreground lg:text-4xl leading-tight mb-8">
                  Your career. Your future. Your success — made simple.
                </h2>
              </ScrollReveal>

              <div className="space-y-6 w-full">
                {[
                  [
                    "Smart Job Matching",
                    "No more endless searching! Get job recommendations tailored to your skills and goals.",
                    Search,
                  ],
                  [
                    "Effortless Applications",
                    "Apply faster with one-click submissions and a professional profile that stands out.",
                    Send,
                  ],
                  [
                    "Career-Boosting Insights",
                    "Master the job market with expert tips, resume hacks, and interview-winning strategies.",
                    TrendingUp,
                  ],
                  [
                    "Verified Listings",
                    "Find genuine job opportunities with our thoroughly verified listings from trusted employers.",
                    ShieldCheck,
                  ],
                ].map(([title, desc, Icon], idx) => {
                  const LucideIcon = Icon as React.ComponentType<{ className?: string }>;
                  return (
                    <ScrollReveal
                      key={title as string}
                      animation="fade-in-up"
                      duration={700}
                      delay={idx * 100}
                    >
                      <div className="flex gap-4 items-start group">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 transition-all duration-300 group-hover:bg-emerald-800 group-hover:text-white">
                          <LucideIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-foreground mb-1">
                            {title as string}
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {desc as string}
                          </p>
                        </div>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>

              <ScrollReveal animation="fade-in" duration={600} delay={500}>
                <div className="mt-10">
                  <Link href="/about">
                    <Button className="rounded-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-8 py-5 shadow-lg transition-all duration-300">
                      Know More About Us
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 py-20 lg:px-8">
        <ScrollReveal animation="fade-in-up" duration={800}>
          <div className="mb-12 text-center">
            <h2 className="font-display text-4xl font-extrabold text-foreground tracking-tight">
              FAQs
            </h2>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {FAQS.map((f, i) => {
            const isOpen = openFaq === i;
            return (
              <ScrollReveal key={f.q} animation="fade-in-up" duration={600} delay={i * 50}>
                <div
                  className={`group overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? "border-emerald-500 bg-emerald-50/15 shadow-[var(--shadow-soft)]"
                      : "border-border bg-card hover:border-border-hover hover:shadow-sm"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(i)}
                    className="flex w-full items-center justify-between p-5 text-left cursor-pointer focus:outline-none"
                  >
                    <span
                      className={`text-base font-bold transition-colors duration-300 ${
                        isOpen ? "text-emerald-700" : "text-foreground/90 group-hover:text-primary"
                      }`}
                    >
                      {f.q}
                    </span>
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 ${
                        isOpen
                          ? "bg-emerald-100 text-emerald-800 rotate-180"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </button>

                  {/* Smooth height transition using grid interpolation */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground border-t border-border/30 pt-3">
                        {f.a}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      <div className="h-[30px]"></div>
    </SiteLayout>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-10 text-center">
      <h2 className="font-display text-3xl font-extrabold text-foreground lg:text-4xl tracking-tight">
        {title}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}
