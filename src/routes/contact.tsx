import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — My Job Campus" },
      { name: "description", content: "Get in touch with the My Job Campus team. We typically respond within 24 hours." },
      { property: "og:title", content: "Contact Us — My Job Campus" },
      { property: "og:description", content: "Get in touch with the My Job Campus team." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <SiteLayout>
      <section className="bg-secondary py-12">
        <div className="mx-auto max-w-5xl px-4 text-center lg:px-8">
          <h1 className="font-display text-4xl font-extrabold">Contact Us</h1>
          <p className="mt-2 text-muted-foreground">We'd love to hear from you. Send us a message and we'll respond within 24 hours.</p>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[1fr_320px] lg:px-8">
        <form
          onSubmit={(e) => { e.preventDefault(); toast.success("Thanks — we'll be in touch shortly."); (e.target as HTMLFormElement).reset(); }}
          className="space-y-4 rounded-2xl border border-border bg-card p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="name" label="Full Name" />
            <Field name="email" label="Email" type="email" />
          </div>
          <Field name="subject" label="Subject" />
          <div>
            <label className="mb-1 block text-sm font-medium">Message</label>
            <textarea name="message" required rows={5} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          </div>
          <Button type="submit" className="rounded-full">Send Message</Button>
        </form>
        <aside className="space-y-4">
          <Info icon={<Mail className="h-4 w-4" />} label="Email" value="support@myjobcampus.com" />
          <Info icon={<Phone className="h-4 w-4" />} label="Phone" value="+91 99999 99999" />
          <Info icon={<MapPin className="h-4 w-4" />} label="Address" value="Bengaluru, India" />
        </aside>
      </section>
    </SiteLayout>
  );
}

function Field({ name, label, type = "text" }: { name: string; label: string; type?: string }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input name={name} type={type} required className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
    </div>
  );
}
function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-primary">{icon}</div>
      <div>
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}