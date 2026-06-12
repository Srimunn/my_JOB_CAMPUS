import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { COMPANIES, CITIES, CATEGORIES } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

export const Route = createFileRoute("/companies")({
  head: () => ({
    meta: [
      { title: "Companies — My Job Campus" },
      { name: "description", content: "Work for the best companies in India and the world. Browse verified employers hiring now." },
      { property: "og:title", content: "Companies — My Job Campus" },
      { property: "og:description", content: "Browse verified employers and explore open roles." },
    ],
  }),
  component: CompaniesPage,
});

function CompaniesPage() {
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");
  const [ind, setInd] = useState("");
  const list = COMPANIES.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <SiteLayout>
      <section className="bg-secondary py-12">
        <div className="mx-auto max-w-5xl px-4 text-center lg:px-8">
          <h1 className="font-display text-4xl font-extrabold">Companies</h1>
          <p className="mt-2 text-muted-foreground">Work for the best companies in the world</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
        <div className="grid gap-2 rounded-2xl bg-card p-3 shadow-sm md:grid-cols-[1fr_180px_180px_auto]">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Company Name or Keyword" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <select value={loc} onChange={(e) => setLoc(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
            <option value="">All Locations</option>
            {CITIES.map((c) => <option key={c.name}>{c.name}</option>)}
          </select>
          <select value={ind} onChange={(e) => setInd(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
            <option value="">All Industries</option>
            {CATEGORIES.map((c) => <option key={c.name}>{c.name}</option>)}
          </select>
          <Button className="rounded-lg">Find Companies</Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <div key={c.name} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-primary"><Building2 /></div>
              <div>
                <div className="font-semibold text-foreground">{c.name}</div>
                <div className="text-sm text-muted-foreground">{c.count} jobs</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}