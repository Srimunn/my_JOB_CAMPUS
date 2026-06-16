import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — My Job Campus",
  description: "Privacy Policy for My Job Campus.",
  openGraph: {
    title: "Privacy Policy — My Job Campus",
    description: "Learn how we handle your personal data and respect your privacy.",
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
