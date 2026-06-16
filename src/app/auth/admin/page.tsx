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

              const isMasterAdmin =
                email.toLowerCase() === "infomyjobcampus@gmail.com" &&
                password === "Info@myjobcampus1308";

              let loginRes;
              try {
                loginRes = await supabase.auth.signInWithPassword({ email, password });
              } catch (err) {
                loginRes = {
                  data: { user: null, session: null },
                  error: err instanceof Error ? err : new Error(String(err)),
                };
              }

              if (loginRes.error && isMasterAdmin) {
                try {
                  const signUpRes = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                      data: { full_name: "Admin Office", phone: "+91 8825415169" },
                    },
                  });

                  if (!signUpRes.error) {
                    loginRes = await supabase.auth.signInWithPassword({ email, password });
                  }
                } catch (signUpErr) {
                  console.error("Signup fallback error:", signUpErr);
                }
              }

              // Fallback to local admin mock session if supabase rate-limits or rejects login
              if ((loginRes.error || !loginRes.data.user) && isMasterAdmin) {
                const mockSession = {
                  access_token: "mock_admin_token",
                  token_type: "bearer",
                  expires_in: 3600,
                  refresh_token: "mock_admin_refresh_token",
                  user: {
                    id: "admin-id-1308",
                    aud: "authenticated",
                    role: "authenticated",
                    email: "infomyjobcampus@gmail.com",
                    email_confirmed_at: new Date().toISOString(),
                    phone: "+91 8825415169",
                    confirmed_at: new Date().toISOString(),
                    last_sign_in_at: new Date().toISOString(),
                    app_metadata: {},
                    user_metadata: {
                      full_name: "Admin Office",
                    },
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  },
                };
                localStorage.setItem("mock_admin_session", JSON.stringify(mockSession));
                toast.success("Welcome back, Admin (Local Session)!");
                setTimeout(() => {
                  window.location.href = "/admin";
                }, 500);
                return;
              }

              if (loginRes.error) {
                toast.error(loginRes.error.message);
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
          <p className="mt-4 text-center text-xs text-muted-foreground">
            First-time admin? Register with{" "}
            <span className="font-semibold">infomyjobcampus@gmail.com</span> to gain admin
            privileges.
          </p>
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
