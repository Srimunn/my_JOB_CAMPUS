"use client";

import { useTranslation } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";

const languages = [
  { code: "en", name: "English" },
  { code: "ta", name: "தமிழ் (Tamil)" },
  { code: "hi", name: "हिन्दी (Hindi)" },
  { code: "te", name: "తెలుగు (Telugu)" },
  { code: "ml", name: "മലയാളം (Malayalam)" },
];

export function LanguageSwitcher() {
  const { currentLanguage, changeLanguage } = useTranslation();

  const activeLang = languages.find((l) => l.code === currentLanguage) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-bold text-foreground/90 shadow-sm hover:shadow transition-all duration-300 hover:border-primary/20 cursor-pointer outline-none select-none">
        <Globe className="h-3.5 w-3.5 text-muted-foreground/80" />
        <span>{activeLang.name.split(" ")[0]}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded-2xl border border-border bg-card p-1.5 shadow-xl min-w-[160px] z-[100]"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-foreground/80 hover:text-primary hover:bg-secondary/80 transition-all cursor-pointer"
          >
            <span>{lang.name}</span>
            {currentLanguage === lang.code && <Check className="h-3.5 w-3.5 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
