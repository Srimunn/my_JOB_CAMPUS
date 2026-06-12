import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — My Job Campus" }, { name: "description", content: "Admin area." }] }),
  component: () => <Outlet />,
});