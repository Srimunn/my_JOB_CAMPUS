import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register — My Job Campus",
  description: "Create a free job seeker account on My Job Campus.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
