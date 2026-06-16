import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Details — My Job Campus",
  description: "View full job details and apply on My Job Campus.",
};

export default function JobDetailsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
