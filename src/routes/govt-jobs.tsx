import { createFileRoute } from "@tanstack/react-router";
import { JobsList } from "./jobs";

export const Route = createFileRoute("/govt-jobs")({
  head: () => ({
    meta: [
      { title: "Govt Job Alerts — My Job Campus" },
      { name: "description", content: "Latest government job notifications across India — SSC, PSU, Railways, Banking and more." },
      { property: "og:title", content: "Govt Job Alerts — My Job Campus" },
      { property: "og:description", content: "Latest government job notifications across India." },
    ],
  }),
  component: () => <JobsList title="Government Jobs" subtitle="Latest Government Job Notifications across India" forcedCategory="Government-jobs" />,
});