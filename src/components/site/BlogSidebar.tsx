"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { ARTICLES } from "@/lib/data";

interface BlogSidebarProps {
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  selectedCategory?: string;
  setSelectedCategory?: (c: string) => void;
  selectedTag?: string | null;
  setSelectedTag?: (t: string | null) => void;
  setCurrentPage?: (page: number) => void;
}

export function BlogSidebar({
  searchQuery = "",
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedTag = null,
  setSelectedTag,
  setCurrentPage,
}: BlogSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search");
  const urlCategory = searchParams.get("category") || "";
  const urlTag = searchParams.get("tag") || "";

  const activeCategory = selectedCategory || urlCategory || "";
  const activeTag = selectedTag || urlTag || null;

  // Get initial search query: first try search params, then sessionStorage, then default prop
  const initialSearch = useMemo(() => {
    if (typeof window !== "undefined") {
      if (pathname === "/career-guidance") {
        if (urlSearch !== null) {
          sessionStorage.setItem("lastSearchQuery", urlSearch);
          return urlSearch;
        }
        sessionStorage.removeItem("lastSearchQuery");
        return "";
      } else {
        if (urlSearch !== null) {
          sessionStorage.setItem("lastSearchQuery", urlSearch);
          return urlSearch;
        }
        return sessionStorage.getItem("lastSearchQuery") || searchQuery;
      }
    }
    return searchQuery;
  }, [pathname, urlSearch, searchQuery]);

  const [localSearch, setLocalSearch] = useState(initialSearch);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Sync state when pathname, props, or search params change
  useEffect(() => {
    if (pathname === "/career-guidance") {
      if (urlSearch !== null) {
        setLocalSearch(urlSearch);
        sessionStorage.setItem("lastSearchQuery", urlSearch);
      } else {
        setLocalSearch("");
        sessionStorage.removeItem("lastSearchQuery");
      }
    } else {
      if (urlSearch !== null) {
        setLocalSearch(urlSearch);
        sessionStorage.setItem("lastSearchQuery", urlSearch);
      } else if (searchQuery) {
        setLocalSearch(searchQuery);
      } else {
        const stored = sessionStorage.getItem("lastSearchQuery") || "";
        setLocalSearch(stored);
      }
    }
  }, [pathname, urlSearch, searchQuery]);

  const BLOG_CATEGORIES = ["Interview", "Jobs", "Resume", "Tips", "Uncategorized"] as const;

  // Track mouse coordinates for the spotlight animation
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Handle Search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      sessionStorage.setItem("lastSearchQuery", localSearch);
    }
    if (setSearchQuery) {
      setSearchQuery(localSearch);
      if (setCurrentPage) setCurrentPage(1);
    } else {
      router.push(
        `/career-guidance?category=${encodeURIComponent(selectedCategory || "Interview")}&search=${encodeURIComponent(localSearch)}`,
      );
    }
  };

  // Handle Category Select
  const handleCategoryClick = (cat: string) => {
    if (setSelectedCategory) {
      setSelectedCategory(cat);
      if (setSelectedTag) setSelectedTag(null);
      if (setCurrentPage) setCurrentPage(1);
      router.push(`/career-guidance?category=${encodeURIComponent(cat)}`);
    } else {
      router.push(`/career-guidance?category=${encodeURIComponent(cat)}`);
    }
  };

  // Handle Tag Select
  const handleTagClick = (tag: string) => {
    if (setSelectedTag) {
      setSelectedTag(selectedTag === tag ? null : tag);
      if (setCurrentPage) setCurrentPage(1);
    } else {
      const nextTag = activeTag === tag ? "" : tag;
      const cat = activeCategory || "Interview";
      router.push(
        `/career-guidance?category=${encodeURIComponent(cat)}` +
          (nextTag ? `&tag=${encodeURIComponent(nextTag)}` : ""),
      );
    }
  };

  // Get 5 most recent posts
  const recentPosts = useMemo(() => {
    return [...ARTICLES]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, []);

  return (
    <aside
      onMouseMove={handleMouseMove}
      style={
        {
          "--mouse-x": `${mousePos.x}px`,
          "--mouse-y": `${mousePos.y}px`,
        } as React.CSSProperties
      }
      className="w-full transition-all duration-500 hover:shadow-[0_20px_50px_rgba(13,27,62,0.06)] hover:border-primary/25 rounded-[32px] border border-[#f0e4d7] bg-[#FAF6F0] p-8 space-y-8 animate-fade-in-up spotlight-card hover:-translate-y-1 h-fit"
    >
      {/* 1. Search Articles */}
      <div className="space-y-4">
        <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-[#0d1b3e]">
          Search Articles
        </h4>
        <form onSubmit={handleSearchSubmit} className="relative group/search">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              if (typeof window !== "undefined") {
                sessionStorage.setItem("lastSearchQuery", e.target.value);
              }
              if (setSearchQuery) setSearchQuery(e.target.value);
            }}
            placeholder="Search by keyword"
            className="w-full rounded-full border border-[#e5d8cc] bg-white py-3 pl-5 pr-12 text-sm text-[#0d1b3e] placeholder:text-[#0d1b3e]/40 transition-all duration-300 focus:outline-none focus:border-[#006000] focus:ring-4 focus:ring-[#006000]/10 shadow-sm"
          />
          <button
            type="submit"
            className="absolute right-4 top-3.5 text-[#0d1b3e]/70 hover:text-[#006000] transition-colors cursor-pointer group-focus-within/search:scale-110 duration-300"
          >
            <Search className="h-4.5 w-4.5" />
          </button>
        </form>
      </div>

      {/* 2. Categories */}
      <div className="space-y-4">
        <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-[#0d1b3e]">
          Categories
        </h4>
        <ul className="space-y-2.5">
          {BLOG_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <li key={cat}>
                <button
                  onClick={() => handleCategoryClick(cat)}
                  className={`w-full text-left text-sm py-1 font-semibold transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? "text-primary font-extrabold translate-x-1.5"
                      : "text-foreground/80 hover:text-primary hover:translate-x-1.5"
                  }`}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006000] animate-pulse" />
                  )}
                  <span>{cat}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 3. Recent Posts */}
      <div className="space-y-4">
        <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-[#0d1b3e]">
          Recent Posts
        </h4>
        <ul className="space-y-5">
          {recentPosts.map((post) => (
            <li key={post.slug} className="group/item">
              <Link href={`/career-guidance/${post.slug}`} className="block">
                <span className="text-[13px] font-extrabold text-[#0d1b3e] leading-snug group-hover/item:text-[#006000] transition-colors line-clamp-2">
                  {post.title}
                </span>
                <span className="text-[11px] text-muted-foreground/75 block mt-1 font-medium">
                  {post.date}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 4. Tags Cloud */}
      <div className="space-y-4">
        <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-[#0d1b3e]">
          Tags
        </h4>
        <div className="grid grid-cols-3 gap-1.5">
          {["Career", "Future", "Interview", "Job", "Resume", "Tips"].map((tag) => {
            const isSelected = activeTag === tag;
            return (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`py-1.5 rounded-full text-[10.5px] font-bold border text-center transition-all duration-300 shadow-sm cursor-pointer w-full truncate px-0.5 ${
                  isSelected
                    ? "bg-[#006000] text-white border-transparent scale-105"
                    : "bg-white border-[#e5d8cc] text-[#0d1b3e]/85 hover:bg-[#006000] hover:text-white hover:border-transparent hover:-translate-y-0.5"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
