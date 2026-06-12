import { Link } from "@tanstack/react-router";
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

  return (
    <header className="border-b-2 border-foreground/90 bg-background sticky top-0 z-40">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold text-foreground">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">MJ</span>
          My Job Campus
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              activeProps={{ className: "text-primary font-semibold" }}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {n.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-primary">
              Resources <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild><Link to="/privacy">Privacy Policy</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/terms">Terms & Conditions</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/contact" className="text-sm font-medium text-foreground/80 hover:text-primary">
            Contact Us
          </Link>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              <Link to={role === "admin" ? "/admin" : "/seeker"}>
                <Button variant="outline" className="rounded-full">Dashboard</Button>
              </Link>
              <Button onClick={signOut} variant="ghost" className="rounded-full">Sign out</Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="rounded-full px-6">Sign in</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild><Link to="/auth/admin">Admin Login</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/auth/login">Job Seeker Login</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/auth/register">Job Seeker Register</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <button className="lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded px-2 py-2 text-sm hover:bg-muted">
                {n.label}
              </Link>
            ))}
            <Link to="/privacy" onClick={() => setOpen(false)} className="rounded px-2 py-2 text-sm hover:bg-muted">Privacy Policy</Link>
            <Link to="/terms" onClick={() => setOpen(false)} className="rounded px-2 py-2 text-sm hover:bg-muted">Terms & Conditions</Link>
            <Link to="/contact" onClick={() => setOpen(false)} className="rounded px-2 py-2 text-sm hover:bg-muted">Contact Us</Link>
            {user ? (
              <>
                <Link to={role === "admin" ? "/admin" : "/seeker"} onClick={() => setOpen(false)} className="rounded px-2 py-2 text-sm hover:bg-muted">Dashboard</Link>
                <button onClick={() => { signOut(); setOpen(false); }} className="rounded px-2 py-2 text-left text-sm hover:bg-muted">Sign out</button>
              </>
            ) : (
              <>
                <Link to="/auth/admin" onClick={() => setOpen(false)} className="rounded px-2 py-2 text-sm hover:bg-muted">Admin Login</Link>
                <Link to="/auth/login" onClick={() => setOpen(false)} className="rounded px-2 py-2 text-sm hover:bg-muted">Job Seeker Login</Link>
                <Link to="/auth/register" onClick={() => setOpen(false)} className="rounded px-2 py-2 text-sm hover:bg-muted">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
