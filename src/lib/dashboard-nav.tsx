import { Briefcase, FileText, LayoutDashboard, PlusCircle, User, ListChecks } from "lucide-react";
import type { NavItem } from "@/components/site/DashboardShell";

export const adminNav: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { to: "/admin/add-job", label: "Add Job", icon: <PlusCircle className="h-4 w-4" /> },
  { to: "/admin/manage-jobs", label: "Manage Jobs", icon: <Briefcase className="h-4 w-4" /> },
  { to: "/admin/applications", label: "Applications", icon: <FileText className="h-4 w-4" /> },
];

export const seekerNav: NavItem[] = [
  { to: "/seeker", label: "My Profile", icon: <User className="h-4 w-4" /> },
  { to: "/seeker/jobs", label: "Available Jobs", icon: <Briefcase className="h-4 w-4" /> },
  { to: "/seeker/applied", label: "Applied Jobs", icon: <ListChecks className="h-4 w-4" /> },
];
