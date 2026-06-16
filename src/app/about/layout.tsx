import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — My Job Campus",
  description:
    "Connecting talent with opportunity — empowering your career journey every step of the way.",
  openGraph: {
    title: "About Us — My Job Campus",
    description:
      "Learn how My Job Campus connects job seekers with verified employers across India.",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
