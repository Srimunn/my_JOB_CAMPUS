"use client";

import { Suspense } from "react";
import { JobsList } from "@/components/site/JobsList";

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground flex items-center justify-center p-12">
          Loading...
        </div>
      }
    >
      <JobsList title="Jobs" subtitle="Search your career opportunity through 12,800+ jobs" />
    </Suspense>
  );
}
