"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardShell } from "@/components/site/DashboardShell";
import { adminNav } from "@/lib/dashboard-nav";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink, Pencil, Newspaper, Search, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import Image from "next/image";

interface ArticleRow {
  id: string;
  title: string;
  category: string;
  author_name: string;
  slug: string;
  featured_image: string | null;
  created_at: string;
}

export default function ManageArticles() {
  const qc = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("id, title, category, author_name, slug, featured_image, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as ArticleRow[];
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Article deleted");
      qc.invalidateQueries({ queryKey: ["admin-articles"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = articles.filter((a) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardShell title="Manage Career Guidance" nav={adminNav} requireRole="admin">
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-4">
          <span className="font-semibold text-foreground">
            All Articles ({filtered.length})
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-border bg-background py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <Link href="/admin/add-article">
              <Button size="sm" className="rounded-full cursor-pointer shrink-0">
                Add Article
              </Button>
            </Link>
          </div>
        </div>

        {/* Article Listings */}
        {isLoading ? (
          <div className="flex justify-center p-12 text-muted-foreground">
            <span className="flex h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin mr-3" />
            Loading articles...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No articles found. Add your first career guidance guide to get started.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((a) => (
              <div
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-4 p-4 hover:bg-secondary/20 transition duration-150"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="relative flex h-11 w-16 shrink-0 items-center justify-center rounded-lg border border-border bg-background shadow-inner overflow-hidden">
                    {a.featured_image ? (
                      <Image
                        src={a.featured_image}
                        alt={`${a.title} image`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Newspaper className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-foreground truncate">{a.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Slug: <span className="font-semibold">{a.slug}</span> &bull; By {a.author_name} &bull; Category: {a.category}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* View Live */}
                  <Link href={`/career-guidance/${a.slug}`}>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 cursor-pointer">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>

                  {/* Edit */}
                  <Link href={`/admin/edit-article/${a.id}`}>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 cursor-pointer">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>

                  {/* Delete */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      confirm(`Are you sure you want to delete "${a.title}"?`) &&
                      del.mutate(a.id)
                    }
                    className="h-8 w-8 p-0 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
