"use client";

import { useTranslation } from "@/lib/i18n";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="w-full border-t border-sky-100 bg-sky-50/60 text-foreground/90 dark:bg-sky-950/10 dark:border-sky-900/30 backdrop-blur-sm z-10">
      <div className="mx-auto max-w-7xl py-6 text-center text-xs text-muted-foreground/75 font-medium">
        {t("footer.copyright")}
      </div>
    </footer>
  );
}
