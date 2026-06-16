"use client";

import { Suspense } from "react";
import { JobsList } from "@/components/site/JobsList";

export default function GovtJobsPage() {
  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground flex items-center justify-center p-12">
          Loading...
        </div>
      }
    >
      <JobsList
        title="Government Jobs"
        subtitle="Latest Government Job Notifications across India"
        forcedCategory="Government-jobs"
      />
    </Suspense>
  );
}
