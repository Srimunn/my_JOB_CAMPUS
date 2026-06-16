import type { Metadata } from "next";
import "../styles.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "My Job Campus — Find the perfect job for you",
  description:
    "Explore verified job openings, government alerts, and career guidance — My Job Campus connects talent with opportunity across India.",
  authors: [{ name: "Lovable" }],
  openGraph: {
    title: "My Job Campus — Find the perfect job for you",
    description: "Explore verified job openings, government alerts, and career guidance.",
    type: "website",
  },
  twitter: {
    card: "summary",
    site: "@Lovable",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
