import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="font-display text-xl font-extrabold">My Job Campus</div>
          <p className="mt-3 text-sm text-primary-foreground/70">
            Connecting talent with opportunity — verified jobs across India and beyond.
          </p>
        </div>
        <div>
          <div className="mb-3 text-sm font-semibold">Explore</div>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/jobs">All Jobs</Link></li>
            <li><Link to="/govt-jobs">Govt Job Alerts</Link></li>
            <li><Link to="/companies">Companies</Link></li>
            <li><Link to="/career-guidance">Career Guidance</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-sm font-semibold">Company</div>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-sm font-semibold">For Job Seekers</div>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/auth/register">Create an account</Link></li>
            <li><Link to="/auth/login">Sign in</Link></li>
            <li><Link to="/auth/admin">Admin Login</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-5 text-center text-xs text-primary-foreground/70">
        © 2025 My Job Campus. All Right Reserved.
      </div>
    </footer>
  );
}
