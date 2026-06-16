import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Seeker Login — My Job Campus",
  description: "Sign in to apply and track applications.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
