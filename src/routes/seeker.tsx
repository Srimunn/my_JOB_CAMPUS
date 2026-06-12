import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/seeker")({
  head: () => ({ meta: [{ title: "Job Seeker — My Job Campus" }, { name: "description", content: "Job seeker area." }] }),
  component: () => <Outlet />,
});