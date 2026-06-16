import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login — My Job Campus",
  description: "Admin sign-in for My Job Campus.",
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
