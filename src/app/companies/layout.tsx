import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Companies — My Job Campus",
  description:
    "Work for the best companies in India and the world. Browse verified employers hiring now.",
  openGraph: {
    title: "Companies — My Job Campus",
    description: "Browse verified employers and explore open roles.",
  },
};

export default function CompaniesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
