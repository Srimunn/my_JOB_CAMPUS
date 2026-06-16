import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — My Job Campus",
  description: "Terms and conditions of using My Job Campus.",
  openGraph: {
    title: "Terms & Conditions — My Job Campus",
    description: "Read the rules, terms, and guidelines for using the My Job Campus platform.",
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
