import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — My Job Campus" },
      { name: "description", content: "Connecting talent with opportunity — empowering your career journey every step of the way." },
      { property: "og:title", content: "About Us — My Job Campus" },
      { property: "og:description", content: "Learn how My Job Campus connects job seekers with verified employers across India." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <section className="bg-secondary py-16">
        <div className="mx-auto max-w-5xl px-4 text-center lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">About Us</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold text-foreground lg:text-5xl">
            We help you find the right job!
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Connecting Talent with Opportunity — Empowering Your Career Journey Every Step of the Way.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl space-y-12 px-4 py-16 lg:px-8">
        <Block title="Welcome to My Job Campus">
          Your go-to platform for the latest job updates, educational news, and current affairs.
          We bring verified listings, government alerts, and career advice into one simple place.
        </Block>
        <Block title="Why My Job Campus?">
          We focus on quality over quantity — every employer is verified, every listing is reviewed,
          and every applicant gets the tools to put their best foot forward.
        </Block>
        <Block title="What We Offer">
          A daily-updated job board, government job alerts, expert-written career guidance, and a
          clean profile + resume system that helps you apply in one click.
        </Block>

        <div className="grid gap-4 sm:grid-cols-3">
          {[["130+", "Job Offers"], ["100+", "Active Employers"], ["80+", "Career Resources"]].map(([n, l]) => (
            <div key={l} className="rounded-2xl border border-border bg-card p-6 text-center">
              <div className="font-display text-3xl font-extrabold text-primary">{n}</div>
              <div className="mt-1 text-sm text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>

        <Block title="Latest Job Openings">Get the freshest opportunities from top Indian and global companies, updated daily.</Block>
        <Block title="Educational News">Stay informed about exams, admissions, scholarships, and learning resources.</Block>
        <Block title="Current Affairs">A curated digest of what matters this week, written for students and professionals.</Block>
        <Block title="Who's Behind My Job Campus?">
          A small team of career mentors, recruiters, and engineers building the job board we always wished existed.
        </Block>

        <div>
          <h2 className="mb-6 font-display text-2xl font-extrabold">What our users say</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Priya S.", "Got placed at Cognizant within 3 weeks of signing up. The verified listings made all the difference."],
              ["Rahul M.", "The Govt Job Alerts section is gold. I never miss an SSC or PSU notification anymore."],
              ["Ananya K.", "The career guidance articles helped me prep for HR interviews and land my first remote role."],
            ].map(([n, q]) => (
              <div key={n} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex text-accent">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
                <p className="mt-3 text-sm text-foreground/80">"{q}"</p>
                <div className="mt-3 text-sm font-semibold">{n}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link to="/jobs"><Button className="rounded-full">Explore Open Jobs</Button></Link>
        </div>
      </section>
    </SiteLayout>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-extrabold text-foreground">{title}</h2>
      <p className="mt-3 text-foreground/80">{children}</p>
    </div>
  );
}