import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — My Job Campus" },
      { name: "description", content: "How My Job Campus collects, uses, and protects your data." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-4 py-16 lg:px-8 prose prose-slate">
        <h1 className="font-display text-4xl font-extrabold">Privacy Policy</h1>
        <p className="mt-4 text-muted-foreground">Last updated: January 2026</p>
        <p className="mt-6 text-foreground/80">We respect your privacy. This policy explains what information we collect when you use My Job Campus, how we use it, and the choices you have.</p>
        <h2 className="mt-8 font-display text-2xl font-bold">Information We Collect</h2>
        <p className="mt-2 text-foreground/80">Account details (name, email, phone), uploaded resumes, and application history. We do not sell your data.</p>
        <h2 className="mt-8 font-display text-2xl font-bold">How We Use It</h2>
        <p className="mt-2 text-foreground/80">To match you with relevant jobs, deliver alerts you subscribe to, and share your application with employers you apply to.</p>
        <h2 className="mt-8 font-display text-2xl font-bold">Your Choices</h2>
        <p className="mt-2 text-foreground/80">You can update your profile, withdraw an application, or delete your account at any time by contacting support.</p>
      </article>
    </SiteLayout>
  ),
});