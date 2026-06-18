"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardShell } from "@/components/site/DashboardShell";
import { adminNav } from "@/lib/dashboard-nav";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink, Pencil, Building2, Search, Check, Star } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import Image from "next/image";

interface CompanyRow {
  id: string;
  name: string;
  logo_url: string | null;
  industry: string | null;
  location: string | null;
  website_url: string | null;
  featured: boolean;
  slug: string;
  open_jobs_count: number;
}

export default function ManageCompanies() {
  const qc = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["admin-companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw error;
      return (data || []) as CompanyRow[];
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("companies").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Company deleted successfully");
      qc.invalidateQueries({ queryKey: ["admin-companies"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleFeatured = useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      const { error } = await supabase
        .from("companies")
        .update({ featured })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Featured status updated");
      qc.invalidateQueries({ queryKey: ["admin-companies"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = companies.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardShell title="Manage Companies" nav={adminNav} requireRole="admin">
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        {/* Header Search & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-foreground">
              All Companies ({filtered.length})
            </span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-border bg-background py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <Link href="/admin/add-company">
              <Button size="sm" className="rounded-full cursor-pointer shrink-0">
                Add Company
              </Button>
            </Link>
          </div>
        </div>

        {/* Table/List */}
        {isLoading ? (
          <div className="flex justify-center p-12 text-muted-foreground">
            <span className="flex h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin mr-3" />
            Loading companies list...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No companies found. Add your first company to get started.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((c) => (
              <div
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-4 p-4 hover:bg-secondary/20 transition duration-150"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background p-1 shadow-inner overflow-hidden">
                    {c.logo_url ? (
                      <Image
                        src={c.logo_url}
                        alt={`${c.name} logo`}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    ) : (
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                      {c.name}
                      {c.featured && (
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {c.industry || "No Industry"} &bull; {c.location || "No Location"} &bull;{" "}
                      <span className="font-semibold text-emerald-700">
                        {c.open_jobs_count || 0} Open Jobs
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Website link */}
                  {c.website_url && (
                    <a
                      href={c.website_url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-block"
                    >
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 cursor-pointer">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  )}

                  {/* Toggle Featured */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toggleFeatured.mutate({ id: c.id, featured: !c.featured })
                    }
                    className={`h-8 px-2.5 text-xs font-semibold rounded-lg cursor-pointer ${
                      c.featured ? "bg-amber-100 text-amber-900 border-amber-200" : ""
                    }`}
                  >
                    Featured
                  </Button>

                  {/* Edit Button */}
                  <Link href={`/admin/edit-company/${c.id}`}>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 cursor-pointer">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>

                  {/* Delete Button */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      confirm(`Are you sure you want to delete "${c.name}"? This action cannot be undone.`) &&
                      del.mutate(c.id)
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
