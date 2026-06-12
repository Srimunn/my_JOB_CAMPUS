import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { toast } from "sonner";
import { Shield } from "lucide-react";

export const Route = createFileRoute("/auth/admin")({
  head: () => ({ meta: [{ title: "Admin Login — My Job Campus" }, { name: "description", content: "Admin sign-in for My Job Campus." }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@myjobcampus.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground"><Shield className="h-5 w-5" /></div>
            <div>
              <h1 className="font-display text-2xl font-extrabold">Admin Login</h1>
              <p className="text-sm text-muted-foreground">Sign in to manage jobs and applications</p>
            </div>
          </div>
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              const { data, error } = await supabase.auth.signInWithPassword({ email, password });
              if (error) { toast.error(error.message); setLoading(false); return; }
              const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
              if (!(roles ?? []).some((r) => r.role === "admin")) {
                toast.error("This account is not an admin.");
                await supabase.auth.signOut();
                setLoading(false);
                return;
              }
              toast.success("Welcome back, admin!");
              navigate({ to: "/admin" });
            }}
          >
            <Input label="Email" type="email" value={email} onChange={setEmail} />
            <Input label="Password" type="password" value={password} onChange={setPassword} />
            <Button type="submit" disabled={loading} className="w-full rounded-full">{loading ? "Signing in…" : "Login"}</Button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            First-time admin? <Link to="/auth/register" className="text-primary underline">Register with admin@myjobcampus.com</Link> and you'll be auto-promoted.
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}

function Input({ label, type, value, onChange }: { label: string; type: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input type={type} required value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
    </div>
  );
}