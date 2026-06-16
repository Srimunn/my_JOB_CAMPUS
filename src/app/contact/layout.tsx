import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — My Job Campus",
  description: "Get in touch with the My Job Campus team. We typically respond within 24 hours.",
  openGraph: {
    title: "Contact Us — My Job Campus",
    description: "Get in touch with the My Job Campus team.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
