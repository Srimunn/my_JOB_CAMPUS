import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ARTICLES } from "@/lib/data";
import { Calendar, User } from "lucide-react";

export const Route = createFileRoute("/career-guidance")({
  head: () => ({
    meta: [
      { title: "Career Guidance — My Job Campus" },
      { name: "description", content: "Expert articles on resumes, interviews, and career growth for freshers and professionals." },
      { property: "og:title", content: "Career Guidance — My Job Campus" },
      { property: "og:description", content: "Expert articles on resumes, interviews, and career growth." },
    ],
  }),
  component: Career,
});

function Career() {
  return (
    <SiteLayout>
      <section className="bg-secondary py-12">
        <div className="mx-auto max-w-5xl px-4 text-center lg:px-8">
          <h1 className="font-display text-4xl font-extrabold">Career Guidance</h1>
          <p className="mt-2 text-muted-foreground">Resume tips, interview prep, and career growth — written by recruiters.</p>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_280px] lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          {ARTICLES.map((a) => (
            <article key={a.slug} className="overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
              <div className="h-36 bg-gradient-to-br from-hero-blue to-hero-blue-deep" />
              <div className="p-5">
                <h3 className="text-base font-semibold text-foreground">{a.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{a.excerpt}</p>
                <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><User className="h-3 w-3" /> Editorial</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> Jan 2026</span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <aside className="h-fit rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 text-sm font-semibold">Popular Topics</div>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li>Resume Writing</li>
            <li>HR Interview Prep</li>
            <li>Salary Negotiation</li>
            <li>Remote Work</li>
            <li>Freshers' Guide</li>
          </ul>
        </aside>
      </section>
    </SiteLayout>
  );
}