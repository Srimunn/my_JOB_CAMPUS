import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/login")({
  head: () => ({ meta: [{ title: "Job Seeker Login — My Job Campus" }, { name: "description", content: "Sign in to apply and track applications." }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h1 className="font-display text-2xl font-extrabold">Job Seeker Login</h1>
          <p className="mt-1 text-sm text-muted-foreground">Welcome back — pick up where you left off.</p>
          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              const { error } = await supabase.auth.signInWithPassword({ email, password });
              setLoading(false);
              if (error) { toast.error(error.message); return; }
              toast.success("Signed in!");
              navigate({ to: "/seeker" });
            }}
          >
            <div><label className="mb-1 block text-sm font-medium">Email</label><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" /></div>
            <div><label className="mb-1 block text-sm font-medium">Password</label><input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" /></div>
            <Button type="submit" disabled={loading} className="w-full rounded-full">{loading ? "Signing in…" : "Login"}</Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            New here? <Link to="/auth/register" className="text-primary underline">Create an account</Link>
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}