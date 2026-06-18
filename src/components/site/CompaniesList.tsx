"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n";
import Link from "next/link";

interface Company {
  name: string;
  jobs: number;
  slug?: string;
}

type CompaniesListProps = {
  companies: Company[];
};

export const CompaniesList: React.FC<CompaniesListProps> = ({ companies }) => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {companies.map((company, idx) => {
        const slug = company.slug || company.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        return (
          <Link key={idx} href={`/companies/${slug}`} className="block h-full">
            <article
              className="group overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft hover:shadow-[0_20px_40px_rgba(8,112,184,0.12)] hover:border-primary/20 hover:-translate-y-2 transition-all flex flex-col h-full cursor-pointer animate-fade-in-up"
            >
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-display text-lg font-extrabold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {company.name}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm font-semibold">
                  {company.jobs}{" "}
                  {company.jobs === 1 ? t("companies.jobSingle") : t("companies.jobPlural")}
                </p>
              </div>
            </article>
          </Link>
        );
      })}
    </div>
  );
};
