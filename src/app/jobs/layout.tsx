import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Jobs Alert — My Job Campus",
  description: "Search and apply to thousands of verified jobs across India and remote.",
  openGraph: {
    title: "Free Jobs Alert — My Job Campus",
    description: "Search and apply to thousands of verified jobs.",
  },
};

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
