"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { toast } from "sonner";
import { z } from "zod";
import { useTranslation } from "@/lib/i18n";

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
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <SiteLayout>
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <span className="text-xl font-bold">!</span>
          </div>
          <h1 className="font-display text-2xl font-extrabold text-foreground">Registration Closed</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Public registration, candidate signup, and employer registration are not allowed on this platform.
          </p>
          <div className="mt-8 border-t border-border pt-6">
            <Link href="/auth/login">
              <Button className="w-full rounded-full cursor-pointer">
                Go to Sign In
              </Button>
            </Link>
          </div>
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
