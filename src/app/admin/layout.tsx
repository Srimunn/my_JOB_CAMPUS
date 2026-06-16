import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — My Job Campus",
  description: "Admin area.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
