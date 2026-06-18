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
import { useTranslation } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/companies", label: "Companies" },
  { to: "/jobs", label: "Free Jobs Alert" },
  { to: "/govt-jobs", label: "Govt Job Alerts" },
  { to: "/career-guidance", label: "Career Guidance" },
] as const;

const NAV_KEYS: Record<string, string> = {
  "/": "nav.home",
  "/about": "nav.aboutUs",
  "/companies": "nav.companies",
  "/jobs": "nav.freeJobsAlert",
  "/govt-jobs": "nav.govtJobAlerts",
  "/career-guidance": "nav.careerGuidance",
};

export function Navbar() {
  const { user, role, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t, currentLanguage } = useTranslation();
  const isLongLang = currentLanguage === "ta" || currentLanguage === "ml";

  return (
    <header className="sticky top-0 z-40 border-b-[10px] border-white bg-white text-foreground shadow-sm rounded-b-lg transition-all duration-300">
      <div
        className={`mx-auto flex h-16 max-w-7xl items-center justify-between ${isLongLang ? "px-1.5 lg:px-3 xl:px-4" : "px-4 lg:px-8"}`}
      >
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-display text-xl font-extrabold text-foreground flex-shrink-0"
        >
          <Image
            src={logo}
            alt="My Job Campus logo"
            width={160}
            height={160}
            className={`object-contain mt-[50px] h-auto ${isLongLang ? "w-[115px] xl:w-[135px]" : "w-[130px] xl:w-[160px]"}`}
            priority
          />
        </Link>

        <nav
          className={`hidden items-center ${isLongLang ? "gap-1 xl:gap-2.5" : "gap-2.5 xl:gap-5"} xl:flex translate-y-[3px] min-w-0 flex-shrink`}
        >
          {NAV.map((n) => {
            const active =
              (n.to as string) === "/"
                ? pathname === "/"
                : pathname === n.to || ((n.to as string) !== "/" && pathname.startsWith(n.to));
            return (
              <Link
                key={n.to}
                href={n.to}
                className={`font-medium transition-all duration-200 hover:text-primary hover:translate-y-[-1px] hover:scale-105 whitespace-nowrap ${isLongLang ? "text-[10.5px] xl:text-[12.5px]" : "text-xs xl:text-sm"} ${active ? "text-primary font-semibold border-b-2 border-primary pb-0.5" : "text-foreground/80"}`}
              >
                {t(NAV_KEYS[n.to])}
              </Link>
            );
          })}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`flex items-center gap-1 font-medium text-foreground/80 transition-all duration-200 hover:text-primary hover:translate-y-[-1px] cursor-pointer whitespace-nowrap ${isLongLang ? "text-[10.5px] xl:text-[12.5px]" : "text-xs xl:text-sm"}`}
            >
              {t("nav.resources")} <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl border border-border shadow-lg">
              <DropdownMenuItem asChild>
                <Link href="/privacy" className="cursor-pointer w-full block">
                  {t("nav.privacyPolicy")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/terms" className="cursor-pointer w-full block">
                  {t("nav.termsConditions")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            href="/contact"
            className={`font-medium transition-all duration-200 hover:text-primary hover:translate-y-[-1px] whitespace-nowrap ${isLongLang ? "text-[10.5px] xl:text-[12.5px]" : "text-xs xl:text-sm"} ${pathname === "/contact" ? "text-primary font-semibold border-b-2 border-primary pb-0.5" : "text-foreground/80"}`}
          >
            {t("nav.contactUs")}
          </Link>
        </nav>

        <div
          className={`hidden items-center ${isLongLang ? "gap-1 xl:gap-2" : "gap-2.5 xl:gap-4"} xl:flex flex-shrink-0`}
        >
          <LanguageSwitcher />
          {user ? (
            <>
              <Link href={role === "admin" ? "/admin" : "/seeker"}>
                <Button
                  variant="outline"
                  size={isLongLang ? "sm" : "default"}
                  className={`rounded-full shadow-sm hover:shadow-md transition-all duration-300 ${isLongLang ? "text-[10px] xl:text-[12px] px-2" : "text-xs xl:text-sm"}`}
                >
                  {t("nav.dashboard")}
                </Button>
              </Link>
              <Button
                onClick={signOut}
                variant="ghost"
                size={isLongLang ? "sm" : "default"}
                className={`rounded-full hover:bg-muted/80 ${isLongLang ? "text-[10px] xl:text-[12px] px-2" : "text-xs xl:text-sm"}`}
              >
                {t("nav.signOut")}
              </Button>
            </>
          ) : (
            <Link href="/auth/login">
              <Button
                size={isLongLang ? "sm" : "default"}
                className={`rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer ${isLongLang ? "px-2.5 xl:px-3 text-[10px] xl:text-[12px]" : "px-5 xl:px-6 text-xs xl:text-sm"}`}
              >
                {t("nav.signIn")}
              </Button>
            </Link>
          )}
        </div>

        <button className="xl:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
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
          <nav className="flex flex-col gap-4 items-center animate-fade-in-up">
            <div className="mb-4">
              <LanguageSwitcher />
            </div>
            {NAV.map((n) => (
              <Link
                key={n.to}
                href={n.to}
                onClick={() => setOpen(false)}
                className="text-lg font-medium text-foreground hover:text-primary transition-colors"
              >
                {t(NAV_KEYS[n.to])}
              </Link>
            ))}
            <Link
              href="/privacy"
              onClick={() => setOpen(false)}
              className="text-lg font-medium text-foreground hover:text-primary transition-colors"
            >
              {t("nav.privacyPolicy")}
            </Link>
            <Link
              href="/terms"
              onClick={() => setOpen(false)}
              className="text-lg font-medium text-foreground hover:text-primary transition-colors"
            >
              {t("nav.termsConditions")}
            </Link>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="text-lg font-medium text-foreground hover:text-primary transition-colors"
            >
              {t("nav.contactUs")}
            </Link>
            {user ? (
              <>
                <Link
                  href={role === "admin" ? "/admin" : "/seeker"}
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  {t("nav.dashboard")}
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setOpen(false);
                  }}
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  {t("nav.signOut")}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  {t("nav.signIn")}
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  {t("auth.createAccount")}
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
