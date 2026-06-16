import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Seeker — My Job Campus",
  description: "Job seeker area.",
};

export default function SeekerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
