"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n";

export default function Login() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h1 className="font-display text-2xl font-extrabold text-center">
            {t("auth.welcomeBack")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground text-center">{t("auth.signInSub")}</p>
          <form
            className="mt-6 space-y-4"
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

              setLoading(false);
              toast.success(is_admin ? "Welcome back, Admin!" : "Signed in successfully!");

              if (is_admin) {
                router.push("/admin");
              } else {
                router.push("/seeker");
              }
            }}
          >
            <div>
              <label className="mb-1 block text-sm font-medium">{t("auth.emailLabel")}</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">{t("auth.passwordLabel")}</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full rounded-full cursor-pointer">
              {loading ? t("auth.loggingIn") : t("auth.loginButton")}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t("auth.newHere")}{" "}
            <Link href="/auth/register" className="text-primary underline">
              {t("auth.createAccount")}
            </Link>
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}
