import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SearchBar } from "@/components/site/SearchBar";
import { JobCard, type JobRow } from "@/components/site/JobCard";
import { CATEGORIES, CITIES, FAQS } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-professional.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "My Job Campus — Find the perfect job for you" },
      { name: "description", content: "Explore verified job openings, government alerts, and career guidance — My Job Campus connects talent with opportunity across India." },
      { property: "og:title", content: "My Job Campus — Find the perfect job for you" },
      { property: "og:description", content: "Explore verified job openings, government alerts, and career guidance." },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: jobs = [] } = useQuery({
    queryKey: ["jobs", "featured"],
    queryFn: async () => {
      const { data } = await supabase
        .from("jobs")
        .select("id,title,company,location,job_type,category,created_at")
        .order("created_at", { ascending: false })
        .limit(6);
      return (data ?? []) as JobRow[];
    },
  });

  const bullets = [
    "Refine your search by industry, location, and more.",
    "Find jobs that match your expertise.",
    "Get the latest job openings instantly.",
    "Discover companies that match your values.",
  ];

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="grid gap-0 lg:grid-cols-[420px_1fr]">
        <div className="relative hidden bg-hero-blue lg:block">
          <div className="absolute inset-0 bg-gradient-to-b from-hero-blue to-hero-blue-deep opacity-90" />
          <img
            src={heroImg}
            alt="Professional at work"
            width={896}
            height={1152}
            className="relative h-full w-full object-cover mix-blend-luminosity opacity-90"
          />
        </div>
        <div className="px-6 py-14 lg:px-16 lg:py-20">
          <h1 className="font-display text-4xl font-extrabold leading-tight text-foreground lg:text-6xl">
            Find the perfect <br /> job for you
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore a wide range of opportunities
          </p>
          <div className="mt-8 max-w-2xl">
            <SearchBar />
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-foreground/80">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <SectionHeader title="Search by Category" subtitle="Find Opportunities in Your Preferred Category" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.slice(0, 12).map((c) => (
            <Link
              key={c.name}
              to="/jobs"
              search={{ category: c.name } as never}
              className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
            >
              <div className="text-base font-semibold text-foreground group-hover:text-primary">{c.name}</div>
              <div className="mt-1 text-sm text-muted-foreground">{c.count} open positions</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured jobs */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <SectionHeader title="Featured Job Offers" subtitle="Search your career through wide-range of opportunities" />
        {jobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
            No jobs posted yet. Check back soon — new roles are added every day.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((j) => <JobCard key={j.id} job={j} />)}
          </div>
        )}
        <div className="mt-8 text-center">
          <Link to="/jobs"><Button variant="outline" className="rounded-full">View all jobs <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
        </div>
      </section>

      {/* Cities */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <SectionHeader title="Featured Cities" subtitle="Start your next career in a city of your choice" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CITIES.slice(0, 9).map((c) => (
            <Link
              key={c.name}
              to="/jobs"
              search={{ loc: c.name } as never}
              className="rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
            >
              <div className="text-lg font-semibold text-foreground">{c.name}</div>
              <div className="mt-1 text-sm text-muted-foreground">{c.count} open positions</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why */}
      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="max-w-3xl font-display text-3xl font-extrabold text-foreground lg:text-4xl">
            Your career. Your future. Your success — made simple.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              ["Smart Job Matching", "No more endless searching! Get job recommendations tailored to your skills and goals."],
              ["Effortless Applications", "Apply faster with one-click submissions and a professional profile that stands out."],
              ["Career-Boosting Insights", "Master the job market with expert tips, resume hacks, and interview-winning strategies."],
              ["Verified Listings", "Find genuine job opportunities with verified listings from trusted employers."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-2xl bg-card p-6 shadow-sm">
                <div className="text-lg font-semibold text-foreground">{t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link to="/about"><Button className="rounded-full">Know More About Us</Button></Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 py-20 lg:px-8">
        <SectionHeader title="Frequently Asked Questions" subtitle="Everything you need to know about My Job Campus" />
        <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card">
          {FAQS.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`} className="px-5">
              <AccordionTrigger className="text-left text-base font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </SiteLayout>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8 text-center">
      <h2 className="font-display text-3xl font-extrabold text-foreground lg:text-4xl">{title}</h2>
      <p className="mt-2 text-muted-foreground">{subtitle}</p>
    </div>
  );
}
