import Link from "next/link";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <SiteLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 relative overflow-hidden bg-dot-grid">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="glow-orb bg-hero-blue w-[280px] h-[280px] top-1/3 left-1/3" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10 mb-4 animate-bounce">
          Error 404
        </span>

        <h1 className="text-7xl font-extrabold text-primary font-display tracking-tight lg:text-8xl">
          404
        </h1>

        <h2 className="text-2xl font-bold mt-4 text-foreground font-display">Page Not Found</h2>

        <p className="text-muted-foreground mt-2 max-w-md leading-relaxed text-sm">
          We can't seem to find the page you are looking for. The link might be broken or the page
          may have been moved.
        </p>

        <div className="flex flex-wrap gap-4 mt-8 justify-center">
          <Link href="/">
            <Button className="rounded-full px-6 py-5 font-bold shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1.5 cursor-pointer">
              <Home className="h-4 w-4" /> Go back home
            </Button>
          </Link>
          <Link href="/jobs">
            <Button
              variant="outline"
              className="rounded-full px-6 py-5 font-bold shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-1.5 cursor-pointer bg-card"
            >
              <Compass className="h-4 w-4" /> Browse Jobs
            </Button>
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}
