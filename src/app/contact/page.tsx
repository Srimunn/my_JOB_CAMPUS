"use client";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Mail, MapPin, Phone, User, MessageSquare, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useTranslation } from "@/lib/i18n";

export default function Contact() {
  const { t } = useTranslation();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shakeForm, setShakeForm] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    // Calculate coordinates relative to center (-1 to 1) for parallax shapes
    const relX = (x / rect.width - 0.5) * 2;
    const relY = (y / rect.height - 0.5) * 2;
    setParallaxOffset({ x: relX, y: relY });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement)?.value;

    if (!name || !email || !message) {
      setShakeForm(true);
      setTimeout(() => setShakeForm(false), 500);
      return;
    }

    setIsSubmitting(true);
    setIsSuccess(false);

    // Simulate premium API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success(t("contact.success"));
      form.reset();

      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }, 1800);
  };

  return (
    <SiteLayout>
      <div
        onMouseMove={handleMouseMove}
        style={
          {
            "--mouse-x": `${mousePos.x}px`,
            "--mouse-y": `${mousePos.y}px`,
          } as React.CSSProperties
        }
        className="relative overflow-hidden bg-background bg-dot-grid py-12 spotlight-container"
      >
        {/* Ambient Glowing Background Orbs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div
            className="glow-orb bg-amber-100/40 dark:bg-amber-950/10 w-[400px] h-[400px] -top-20 left-10 animate-pulse-glow"
            style={{
              transform: `translate(${parallaxOffset.x * 20}px, ${parallaxOffset.y * 20}px)`,
              transition: "transform 0.8s cubic-bezier(0.1, 0.8, 0.2, 1)",
            }}
          />
          <div
            className="glow-orb bg-[#ebdcd0]/55 dark:bg-[#2e251d]/10 w-[350px] h-[350px] bottom-10 right-10 animate-pulse-glow"
            style={{
              animationDelay: "2s",
              transform: `translate(${parallaxOffset.x * -20}px, ${parallaxOffset.y * -20}px)`,
              transition: "transform 0.8s cubic-bezier(0.1, 0.8, 0.2, 1)",
            }}
          />
          <div
            className="glow-orb bg-accent/10 w-[200px] h-[200px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-glow"
            style={{
              animationDelay: "1s",
              transform: `translate(${parallaxOffset.x * 10}px, ${parallaxOffset.y * 10}px)`,
              transition: "transform 0.8s cubic-bezier(0.1, 0.8, 0.2, 1)",
            }}
          />
        </div>

        {/* Floating Shapes / Particles with Cursor Proximity Interaction */}
        <div
          className="absolute left-12 top-1/4 text-primary/15 animate-float hidden lg:block"
          style={{
            transform: `translate(${parallaxOffset.x * -25}px, ${parallaxOffset.y * -25}px) rotate(${parallaxOffset.x * 20}deg)`,
            transition: "transform 0.5s cubic-bezier(0.1, 0.8, 0.2, 1)",
          }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle
              cx="20"
              cy="20"
              r="18"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>
        </div>

        {/* Header */}
        <section className="pt-[10px] pb-16 text-center animate-fade-in-up">
          <div className="mx-auto max-w-5xl px-4">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
              {t("contact.heroTitle")}
            </h1>
            <p className="mt-4 text-base font-semibold text-muted-foreground/80">
              {t("contact.heroSub")}
            </p>
          </div>
        </section>

        {/* Feature Cards Grid (Staggered Entrance Animation & Glass Finishing) */}
        <section className="mx-auto max-w-5xl px-6 pb-16">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Card 1: Address */}
            <div
              style={{
                animationDelay: "100ms",
              }}
              className="group relative flex flex-col items-center text-center p-8 rounded-3xl spotlight-card glass-panel hover:-translate-y-2 hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.15)] hover:border-primary/25 transition-all duration-300 animate-fade-in-up"
            >
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white dark:bg-muted text-primary shadow-sm transition-all duration-300 mb-6 z-10 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-md">
                <MapPin className="h-6 w-6" />
              </div>
              <p className="text-xs font-bold tracking-wider text-black dark:text-white uppercase leading-relaxed max-w-[200px] z-10">
                28, MADHAVA KRISHNA STREET, ERODE - 638001
              </p>
            </div>

            {/* Card 2: Phone */}
            <div
              style={{
                animationDelay: "200ms",
              }}
              className="group relative flex flex-col items-center text-center p-8 rounded-3xl spotlight-card glass-panel hover:-translate-y-2 hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.15)] hover:border-primary/25 transition-all duration-300 animate-fade-in-up"
            >
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white dark:bg-muted text-primary shadow-sm transition-all duration-300 mb-6 z-10 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-md">
                <Phone className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-foreground z-10">+91 8825415169</p>
            </div>

            {/* Card 3: Email */}
            <div
              style={{
                animationDelay: "300ms",
              }}
              className="group relative flex flex-col items-center text-center p-8 rounded-3xl spotlight-card glass-panel hover:-translate-y-2 hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.15)] hover:border-primary/25 transition-all duration-300 animate-fade-in-up"
            >
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white dark:bg-muted text-primary shadow-sm transition-all duration-300 mb-6 z-10 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-md">
                <Mail className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-foreground break-all z-10">
                infomyjobcampus@gmail.com
              </p>
            </div>
          </div>
        </section>

        {/* Form Section (Premium Glass Finish) */}
        <section
          className={`mx-auto max-w-2xl px-6 pb-24 animate-fade-in-up ${shakeForm ? "animate-shake" : ""}`}
          style={{ animationDelay: "400ms" }}
        >
          <div className="rounded-3xl spotlight-card glass-panel p-8 shadow-md space-y-8 h-fit animate-fade-in-up transition-all duration-300 hover:shadow-2xl hover:border-primary/20">
            <h2 className="font-display text-3xl font-extrabold text-center text-foreground mb-8">
              {t("contact.title")}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Field
                name="name"
                label={t("contact.nameLabel")}
                placeholder={t("contact.namePlaceholder")}
                icon={<User className="h-5 w-5" />}
              />
              <Field
                name="email"
                label={t("contact.emailLabel")}
                placeholder={t("contact.emailPlaceholder")}
                type="email"
                icon={<Mail className="h-5 w-5" />}
              />

              <div className="space-y-1.5 group">
                <label className="block text-sm font-semibold text-foreground/80 group-focus-within:text-primary transition-colors duration-200">
                  {t("contact.messageLabel")}
                </label>
                <div className="relative rounded-2xl">
                  <div className="absolute top-3.5 left-0 pl-4 flex items-start pointer-events-none text-muted-foreground transition-all duration-300 group-focus-within:text-primary group-focus-within:scale-105">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <textarea
                    name="message"
                    required
                    placeholder={t("contact.messagePlaceholder")}
                    rows={6}
                    className="w-full rounded-2xl border border-border/80 bg-white/70 dark:bg-background/70 pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] focus:bg-white dark:focus:bg-background"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`group w-full rounded-full text-white py-3.5 px-6 font-bold transition-all duration-300 cursor-pointer shadow-sm text-center flex justify-center items-center gap-2 relative overflow-hidden ${
                  isSuccess
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-[0_6px_20px_rgba(16,185,129,0.3)]"
                    : isSubmitting
                      ? "bg-[#004a00]/70 cursor-not-allowed"
                      : "bg-[#006000] hover:bg-[#004a00] hover:shadow-[0_6px_20px_rgba(0,96,0,0.3)] hover:scale-[1.01]"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>{t("contact.sending")}</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <Check className="h-5 w-5 animate-morph-check text-white" />
                    <span>{t("contact.success")}</span>
                  </>
                ) : (
                  <>
                    <span>{t("contact.sendButton")}</span>
                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                  </>
                )}
              </button>
            </form>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}

function Field({
  name,
  label,
  placeholder,
  icon,
  type = "text",
}: {
  name: string;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  type?: string;
}) {
  return (
    <div className="space-y-1.5 group">
      <label className="block text-sm font-semibold text-foreground/80 group-focus-within:text-primary transition-colors duration-200">
        {label}
      </label>
      <div className="relative rounded-2xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground transition-all duration-300 group-focus-within:text-primary group-focus-within:scale-105">
          {icon}
        </div>
        <input
          name={name}
          type={type}
          required
          placeholder={placeholder}
          className="w-full rounded-2xl border border-border/80 bg-white/70 dark:bg-background/70 pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] focus:bg-white dark:focus:bg-background"
        />
      </div>
    </div>
  );
}
