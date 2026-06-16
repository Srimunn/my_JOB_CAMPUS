"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { toast } from "sonner";
import { z } from "zod";

const schema = z
  .object({
    full_name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(255),
    phone: z.string().trim().min(7).max(20),
    password: z.string().min(6).max(72),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [resume, setResume] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-lg px-4 py-12">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h1 className="font-display text-2xl font-extrabold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Free for job seekers. No spam.</p>
          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              const parsed = schema.safeParse(form);
              if (!parsed.success) {
                toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
                return;
              }
              setLoading(true);
              const redirectTo =
                typeof window !== "undefined" ? `${window.location.origin}/seeker` : undefined;
              const { data, error } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
                options: {
                  emailRedirectTo: redirectTo,
                  data: { full_name: form.full_name, phone: form.phone },
                },
              });
              if (error) {
                setLoading(false);
                toast.error(error.message);
                return;
              }

              // Upload resume if provided (requires session)
              if (resume && data.user) {
                const path = `${data.user.id}/${Date.now()}-${resume.name}`;
                const { error: upErr } = await supabase.storage
                  .from("resumes")
                  .upload(path, resume);
                if (!upErr) {
                  await supabase
                    .from("profiles")
                    .update({ resume_url: path })
                    .eq("id", data.user.id);
                }
              }
              setLoading(false);
              toast.success("Account created — welcome!");
              router.push("/seeker");
            }}
          >
            <Field
              label="Full Name"
              value={form.full_name}
              onChange={(v) => setForm({ ...form, full_name: v })}
            />
            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
            />
            <Field
              label="Phone"
              value={form.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
            />
            <Field
              label="Password"
              type="password"
              value={form.password}
              onChange={(v) => setForm({ ...form, password: v })}
            />
            <Field
              label="Confirm Password"
              type="password"
              value={form.confirm}
              onChange={(v) => setForm({ ...form, confirm: v })}
            />
            <div>
              <label className="mb-1 block text-sm font-medium">Upload Resume (PDF/DOC)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files?.[0] ?? null)}
                className="w-full text-sm"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full rounded-full cursor-pointer">
              {loading ? "Creating…" : "Register"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />
    </div>
  );
}
