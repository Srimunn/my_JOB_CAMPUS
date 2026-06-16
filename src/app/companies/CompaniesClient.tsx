"use client";

import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CompaniesList } from "@/components/site/CompaniesList";

// Static list of 50 top IT companies
const TOP_COMPANIES = [
  { name: "Google", jobs: 12 },
  { name: "Microsoft", jobs: 10 },
  { name: "Apple", jobs: 8 },
  { name: "Amazon", jobs: 15 },
  { name: "Facebook (Meta)", jobs: 9 },
  { name: "IBM", jobs: 7 },
  { name: "Oracle", jobs: 6 },
  { name: "Cisco", jobs: 5 },
  { name: "Intel", jobs: 11 },
  { name: "SAP", jobs: 4 },
  { name: "Salesforce", jobs: 13 },
  { name: "Adobe", jobs: 5 },
  { name: "HP", jobs: 3 },
  { name: "Dell Technologies", jobs: 6 },
  { name: "Tencent", jobs: 9 },
  { name: "Alibaba", jobs: 8 },
  { name: "VMware", jobs: 4 },
  { name: "Accenture", jobs: 14 },
  { name: "Capgemini", jobs: 7 },
  { name: "Infosys", jobs: 12 },
  { name: "Wipro", jobs: 11 },
  { name: "TCS", jobs: 13 },
  { name: "HCL Technologies", jobs: 6 },
  { name: "Cognizant", jobs: 9 },
  { name: "Qualcomm", jobs: 5 },
  { name: "Nvidia", jobs: 10 },
  { name: "AMD", jobs: 4 },
  { name: "Snap Inc.", jobs: 3 },
  { name: "Twitter", jobs: 2 },
  { name: "Lyft", jobs: 2 },
  { name: "Uber", jobs: 8 },
  { name: "Shopify", jobs: 5 },
  { name: "Stripe", jobs: 4 },
  { name: "Square", jobs: 3 },
  { name: "Zoom", jobs: 6 },
  { name: "Slack", jobs: 4 },
  { name: "GitHub", jobs: 7 },
  { name: "GitLab", jobs: 2 },
  { name: "Atlassian", jobs: 5 },
  { name: "ServiceNow", jobs: 4 },
  { name: "Red Hat", jobs: 6 },
  { name: "Docker", jobs: 3 },
  { name: "MongoDB", jobs: 2 },
  { name: "PayPal", jobs: 7 },
  { name: "eBay", jobs: 3 },
  { name: "Spotify", jobs: 5 },
  { name: "Airbnb", jobs: 4 },
  { name: "Netflix", jobs: 6 },
  { name: "Dropbox", jobs: 2 },
  { name: "SquareSpace", jobs: 1 },
  { name: "ZoomInfo", jobs: 1 },
  { name: "Zycus", jobs: 4 },
  { name: "Zoho", jobs: 14 },
];

export default function CompaniesClient() {
  const itemsPerPage = 16; // 4x4 grid
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Sort companies by name based on sortOrder
  const sortedCompanies = [...TOP_COMPANIES].sort((a, b) => {
    if (sortOrder === "asc") return a.name.localeCompare(b.name);
    return b.name.localeCompare(a.name);
  });

  const totalPages = Math.ceil(sortedCompanies.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const displayedCompanies = sortedCompanies.slice(startIdx, startIdx + itemsPerPage);

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <SiteLayout>
      {/* Hero Section – mirrors Career Guidance style */}
      <section className="bg-secondary py-16 border-b border-border bg-dot-grid relative overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="glow-orb bg-hero-blue w-[250px] h-[250px] top-10 right-20" />
        </div>
        <div className="mx-auto max-w-5xl px-4 text-center lg:px-8 animate-fade-in-up">
          <h1 className="font-display text-4xl font-extrabold tracking-tight lg:text-5xl">
            Companies
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-xl mx-auto">
            Discover the top workplaces and explore current vacancies.
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="mx-auto max-w-6xl px-4 py-12 lg:px-8 animate-fade-in-up">
        <div className="grid gap-3 rounded-2xl bg-card/80 p-4 shadow-md backdrop-blur-md md:grid-cols-[1fr_180px_180px_auto] transition-all duration-300 hover:shadow-lg">
          <input
            placeholder="Company Name or Keyword"
            className="rounded-xl bg-background/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <select className="rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer">
            <option>All Locations</option>
          </select>
          <select className="rounded-xl bg-background/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer">
            <option>All Industries</option>
          </select>
          <button className="rounded-xl px-6 py-2.5 bg-green-600 text-white rounded-full font-semibold shadow hover:shadow-md transition-all cursor-pointer">
            Find Companies
          </button>
        </div>
      </section>

      {/* Result count and sorting */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-6 text-gray-400">
        <p className="text-left">
          Showing {sortedCompanies.length} companies (Page {currentPage} of {totalPages})
        </p>
        <div className="flex items-center gap-2">
          <select
            id="sortSelect"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="rounded-xl bg-background/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="asc">Name Asc</option>
            <option value="desc">Name Desc</option>
          </select>
        </div>
      </div>

      {/* Companies grid */}
      <div className="max-w-6xl mx-auto px-4">
        <CompaniesList companies={displayedCompanies} />
      </div>

      {/* Pagination controls */}
      <nav className="flex justify-center items-center mt-8 gap-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-xl bg-gray-700 text-white disabled:opacity-50 hover:bg-gray-600 transition"
        >
          Previous
        </button>
        <span className="text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-xl bg-gray-700 text-white disabled:opacity-50 hover:bg-gray-600 transition"
        >
          Next
        </button>
      </nav>
      {/* Spacer to ensure content isn’t hidden behind the fixed footer */}
      <div className="h-20"></div>
    </SiteLayout>
  );
}
