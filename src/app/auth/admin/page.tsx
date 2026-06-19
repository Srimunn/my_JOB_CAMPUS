"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { toast } from "sonner";
import { Shield } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("infomyjobcampus@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-extrabold">Admin Login</h1>
              <p className="text-sm text-muted-foreground">
                Sign in to manage jobs and applications
              </p>
            </div>
          </div>
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);

              let loginRes;
              try {
                loginRes = await supabase.auth.signInWithPassword({ email, password });
              } catch (err) {
                loginRes = {
                  data: { user: null, session: null },
                  error: err instanceof Error ? err : new Error(String(err)),
                };
              }

              if (loginRes.error) {
                toast.error("Invalid Credentials");
                setLoading(false);
                return;
              }

              const user = loginRes.data.user;
              if (!user) {
                toast.error("An unexpected error occurred.");
                setLoading(false);
                return;
              }

              if (email.toLowerCase() === "infomyjobcampus@gmail.com") {
                try {
                  await supabase.from("user_roles").insert({ user_id: user.id, role: "admin" });
                } catch (err) {
                  console.log("Admin role already assigned or error:", err);
                }
              }

              const { data: roles } = await supabase
                .from("user_roles")
                .select("role")
                .eq("user_id", user.id);
              const is_admin =
                email.toLowerCase() === "infomyjobcampus@gmail.com" ||
                (roles ?? []).some((r) => r.role === "admin");

              if (!is_admin) {
                toast.error("This account is not an admin.");
                await supabase.auth.signOut();
                setLoading(false);
                return;
              }

              toast.success("Welcome back, Admin!");
              router.push("/admin");
            }}
          >
            <Input label="Email" type="email" value={email} onChange={setEmail} />
            <Input label="Password" type="password" value={password} onChange={setPassword} />
            <Button type="submit" disabled={loading} className="w-full rounded-full cursor-pointer">
              {loading ? "Signing in…" : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </SiteLayout>
  );
}

function Input({
  label,
  type,
  value,
  onChange,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />
    </div>
  );
}
