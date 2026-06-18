"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.jpg";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

export function DashboardShell({
  title,
  nav,
  requireRole,
  children,
}: {
  title: string;
  nav: NavItem[];
  requireRole: "admin" | "jobseeker";
  children: ReactNode;
}) {
  const { user, role, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) router.push(requireRole === "admin" ? "/auth/admin" : "/auth/login");
    else if (role && role !== requireRole) router.push("/");
  }, [loading, user, role, requireRole, router]);

  if (loading || !user || role !== requireRole) {
    return (
      <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-primary text-primary-foreground lg:flex">
        <Link
          href="/"
          className="flex h-20 items-center justify-center border-b border-primary-foreground/10 px-5"
        >
          <div className="bg-white rounded-2xl p-1.5 flex items-center justify-center w-full shadow-inner h-12 overflow-hidden">
            <Image
              src={logo}
              alt="My Job Campus logo"
              width={140}
              height={36}
              className="object-contain"
              priority
            />
          </div>
        </Link>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((n) => {
            const active =
              pathname === n.to ||
              (n.to !== "/admin" && n.to !== "/seeker" && pathname.startsWith(n.to));
            return (
              <Link
                key={n.to}
                href={n.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${active ? "bg-primary-foreground/10 font-semibold" : "hover:bg-primary-foreground/5"}`}
              >
                {n.icon}
                {n.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={() => signOut().then(() => router.push("/"))}
          className="flex items-center gap-3 border-t border-primary-foreground/10 px-5 py-4 text-sm hover:bg-primary-foreground/5"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <div className="font-display text-lg font-bold">{title}</div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-muted-foreground sm:inline">{user.email}</span>
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => signOut().then(() => router.push("/"))}
            >
              Logout
            </Button>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
