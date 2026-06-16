import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Guidance — My Job Campus",
  description:
    "Expert articles on resumes, interviews, and career growth for freshers and professionals.",
  openGraph: {
    title: "Career Guidance — My Job Campus",
    description: "Expert articles on resumes, interviews, and career growth.",
  },
};

export default function CareerGuidanceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
