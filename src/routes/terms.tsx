import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — My Job Campus" },
      { name: "description", content: "The terms governing your use of My Job Campus." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-4 py-16 lg:px-8 prose prose-slate">
        <h1 className="font-display text-4xl font-extrabold">Terms & Conditions</h1>
        <p className="mt-4 text-muted-foreground">Last updated: January 2026</p>
        <p className="mt-6 text-foreground/80">By using My Job Campus, you agree to use the platform responsibly and provide accurate information.</p>
        <h2 className="mt-8 font-display text-2xl font-bold">Accounts</h2>
        <p className="mt-2 text-foreground/80">You are responsible for keeping your login credentials safe. One account per person.</p>
        <h2 className="mt-8 font-display text-2xl font-bold">Listings</h2>
        <p className="mt-2 text-foreground/80">We verify listings but do not guarantee outcomes. Final hiring decisions rest with the employer.</p>
        <h2 className="mt-8 font-display text-2xl font-bold">Prohibited Use</h2>
        <p className="mt-2 text-foreground/80">No spam, scraping, impersonation, or misuse of resumes. Violations may result in account suspension.</p>
      </article>
    </SiteLayout>
  ),
});