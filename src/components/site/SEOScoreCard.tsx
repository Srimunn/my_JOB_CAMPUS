import { CheckCircle2, XCircle } from "lucide-react";
import type { SEOCheckResult } from "@/lib/seo-checker";

interface SEOScoreCardProps {
  seoResult: SEOCheckResult;
}

export function SEOScoreCard({ seoResult }: SEOScoreCardProps) {
  const { score, label, color, checks } = seoResult;

  const colorClasses = {
    green: {
      bg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/30",
      text: "text-emerald-700 dark:text-emerald-400",
      badge: "bg-emerald-500 text-white",
      progress: "bg-emerald-500",
    },
    yellow: {
      bg: "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/30",
      text: "text-amber-700 dark:text-amber-400",
      badge: "bg-amber-500 text-white",
      progress: "bg-amber-500",
    },
    red: {
      bg: "bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/30",
      text: "text-rose-700 dark:text-rose-400",
      badge: "bg-rose-500 text-white",
      progress: "bg-rose-500",
    },
  }[color];

  return (
    <div className={`rounded-2xl border p-5 ${colorClasses.bg} transition-all duration-300`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">
            SEO Analysis Score
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Rank Math optimization metrics based on content analysis
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${colorClasses.badge}`}>
            {label}
          </span>
          <div className="font-display text-3xl font-black">{score}/100</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 h-2 w-full bg-secondary/80 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses.progress} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Checklist */}
      <div className="mt-5 grid gap-3.5 sm:grid-cols-2 text-xs font-medium text-foreground/80">
        <CheckItem
          passed={checks.keywordInTitle}
          text="Focus keyword in page/job title"
        />
        <CheckItem
          passed={checks.keywordInDescription}
          text="Focus keyword in description/content"
        />
        <CheckItem
          passed={checks.keywordInSlug}
          text="Focus keyword in URL slug"
        />
        <CheckItem
          passed={checks.contentLengthPass}
          text={`Content length: ${checks.contentLength} words (min 300)`}
        />
        <CheckItem
          passed={checks.hasAltText}
          text="Main image contains alt attribute tag"
        />
        <CheckItem
          passed={checks.hasInternalLinks}
          text="Contains internal links (/jobs, /companies, etc)"
        />
        <CheckItem
          passed={checks.hasHeadings}
          text="Good readability layout structure (headings, lists)"
        />
      </div>
    </div>
  );
}

function CheckItem({ passed, text }: { passed: boolean; text: string }) {
  return (
    <div className="flex items-start gap-2">
      {passed ? (
        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
      ) : (
        <XCircle className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
      )}
      <span className={passed ? "text-foreground/90" : "text-muted-foreground"}>
        {text}
      </span>
    </div>
  );
}
