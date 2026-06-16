"use client";

import React from "react";

interface Company {
  name: string;
  jobs: number;
}

type CompaniesListProps = {
  companies: Company[];
};

export const CompaniesList: React.FC<CompaniesListProps> = ({ companies }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {companies.map((company, idx) => (
        <article
          key={idx}
          className="group overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft hover:shadow-[0_20px_40px_rgba(8,112,184,0.12)] hover:border-primary/20 hover:-translate-y-2 transition-all flex flex-col h-full animate-fade-in-up"
        >
          <div className="p-6 flex flex-col flex-grow">
            <h3 className="font-display text-lg font-extrabold text-foreground mb-2">
              {company.name}
            </h3>
            <p className="text-muted-foreground mt-2">
              {company.jobs} {company.jobs === 1 ? "job" : "jobs"}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
};
