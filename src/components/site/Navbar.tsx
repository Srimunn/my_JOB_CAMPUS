"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import Image from "next/image";
import logo from "@/assets/logo.jpg";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/companies", label: "Companies" },
  { to: "/jobs", label: "Free Jobs Alert" },
  { to: "/govt-jobs", label: "Govt Job Alerts" },
  { to: "/career-guidance", label: "Career Guidance" },
] as const;

export function Navbar() {
  const { user, role, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b-[10px] border-white bg-white text-foreground shadow-sm rounded-b-lg transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-display text-xl font-extrabold text-foreground"
        >
          <Image
            src={logo}
            alt="My Job Campus logo"
            width={160}
            height={160}
            className="object-contain mt-[50px]"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex translate-y-[3px]">
          {NAV.map((n) => {
            const active =
              (n.to as string) === "/"
                ? pathname === "/"
                : pathname === n.to || ((n.to as string) !== "/" && pathname.startsWith(n.to));
            return (
              <Link
                key={n.to}
                href={n.to}
                className={`text-sm font-medium transition-all duration-200 hover:text-primary hover:translate-y-[-1px] hover:scale-105 ${active ? "text-primary font-semibold border-b-2 border-primary pb-0.5" : "text-foreground/80"}`}
              >
                {n.label}
              </Link>
            );
          })}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-foreground/80 transition-all duration-200 hover:text-primary hover:translate-y-[-1px] cursor-pointer">
              Resources <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl border border-border shadow-lg">
              <DropdownMenuItem asChild>
                <Link href="/privacy" className="cursor-pointer w-full block">
                  Privacy Policy
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/terms" className="cursor-pointer w-full block">
                  Terms & Conditions
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            href="/contact"
            className={`text-sm font-medium transition-all duration-200 hover:text-primary hover:translate-y-[-1px] ${pathname === "/contact" ? "text-primary font-semibold border-b-2 border-primary pb-0.5" : "text-foreground/80"}`}
          >
            Contact Us
          </Link>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <Link href={role === "admin" ? "/admin" : "/seeker"}>
                <Button
                  variant="outline"
                  className="rounded-full shadow-sm hover:shadow-md transition-all duration-300"
                >
                  Dashboard
                </Button>
              </Link>
              <Button onClick={signOut} variant="ghost" className="rounded-full hover:bg-muted/80">
                Sign out
              </Button>
            </>
          ) : (
            <Link href="/auth/login">
              <Button className="rounded-full px-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
                Sign in
              </Button>
            </Link>
          )}
        </div>

        <button className="lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in z-50">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-foreground"
            aria-label="Close Menu"
          >
            <X className="h-6 w-6" />
          </button>
          <nav className="flex flex-col gap-4 items-center">
            {NAV.map((n) => (
              <Link
                key={n.to}
                href={n.to}
                onClick={() => setOpen(false)}
                className="text-lg font-medium text-foreground hover:text-primary transition-colors"
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/privacy"
              onClick={() => setOpen(false)}
              className="text-lg font-medium text-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              onClick={() => setOpen(false)}
              className="text-lg font-medium text-foreground hover:text-primary transition-colors"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="text-lg font-medium text-foreground hover:text-primary transition-colors"
            >
              Contact Us
            </Link>
            {user ? (
              <>
                <Link
                  href={role === "admin" ? "/admin" : "/seeker"}
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setOpen(false);
                  }}
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  Create Account
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
