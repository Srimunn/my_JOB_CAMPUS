import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CITIES } from "@/lib/data";

export function SearchBar({ defaultCategory }: { defaultCategory?: string } = {}) {
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (loc) params.set("loc", loc);
        const path = defaultCategory === "Government-jobs" ? "/govt-jobs" : "/jobs";
        const qs = params.toString();
        router.push(qs ? `${path}?${qs}` : path);
      }}
      className="flex w-full items-center gap-2 rounded-full bg-white p-2 shadow-[var(--shadow-soft)]"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Job Title or Keyword"
        className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
      <div className="hidden h-6 w-px bg-border sm:block" />
      <select
        value={loc}
        onChange={(e) => setLoc(e.target.value)}
        className="hidden bg-transparent px-3 py-2 text-sm text-foreground outline-none sm:block"
      >
        <option value="">All Locations</option>
        {CITIES.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        aria-label="Search"
        className="grid h-11 w-11 place-items-center rounded-full bg-accent text-accent-foreground transition-transform hover:scale-105"
      >
        <Search className="h-5 w-5" />
      </button>
    </form>
  );
}
