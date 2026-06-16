import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Govt Job Alerts — My Job Campus",
  description:
    "Latest government job notifications across India — SSC, PSU, Railways, Banking and more.",
  openGraph: {
    title: "Govt Job Alerts — My Job Campus",
    description: "Latest government job notifications across India.",
  },
};

export default function GovtJobsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
