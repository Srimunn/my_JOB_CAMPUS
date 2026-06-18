"use client";

import { SiteLayout } from "@/components/site/SiteLayout";
import { useState, useEffect, Suspense } from "react";
import { BlogSidebar } from "@/components/site/BlogSidebar";
import { useTranslation } from "@/lib/i18n";

export default function Terms() {
  const { t } = useTranslation();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) setScrollProgress((window.scrollY / totalHeight) * 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    const relX = (x / rect.width - 0.5) * 2;
    const relY = (y / rect.height - 0.5) * 2;
    setParallaxOffset({ x: relX, y: relY });
  };

  return (
    <SiteLayout>
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-accent z-[999] transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />
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

        {/* Header */}
        <section className="pt-[10px] pb-16 text-center animate-fade-in-up">
          <div className="mx-auto max-w-5xl px-4">
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight lg:whitespace-nowrap">
              {t("terms.title")}
            </h1>
            <p className="mt-4 text-base font-semibold text-muted-foreground/80">
              {t("terms.subtitle")}
            </p>
          </div>
        </section>

        {/* Grid Layout */}
        <div className="mx-auto max-w-7xl px-6 pb-24 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 items-start">
          {/* Main Content Column */}
          <article
            style={
              {
                "--mouse-x": `${mousePos.x}px`,
                "--mouse-y": `${mousePos.y}px`,
              } as React.CSSProperties
            }
            className="rounded-3xl spotlight-card glass-panel p-8 sm:p-10 shadow-lg space-y-8 text-foreground/80 leading-relaxed text-base animate-fade-in-up text-justify"
          >
            {/* 1. Acceptance of Terms */}
            <section
              style={{ animationDelay: "100ms" }}
              className="space-y-3 p-6 rounded-2xl border-l-2 border-transparent hover:border-accent hover:bg-white/40 dark:hover:bg-slate-950/20 hover:shadow-sm transition-all duration-300 animate-fade-in-up"
            >
              <h2 className="font-display text-xl font-bold text-foreground">
                {t("terms.acceptance")}
              </h2>
              <p>
                By accessing and using myjobcampus.com ("the Website"), you agree to be bound by
                these Terms &amp; Conditions. If you do not agree with any part of these terms,
                please refrain from using the Website.
              </p>
            </section>

            {/* 2. Eligibility */}
            <section
              style={{ animationDelay: "150ms" }}
              className="space-y-3 p-6 rounded-2xl border-l-2 border-transparent hover:border-accent hover:bg-white/40 dark:hover:bg-slate-950/20 hover:shadow-sm transition-all duration-300 animate-fade-in-up"
            >
              <h2 className="font-display text-xl font-bold text-foreground">
                {t("terms.eligibility")}
              </h2>
              <p>
                Users must be at least 18 years old or the age of majority in their jurisdiction to
                use this Website. By using the Website, you represent and warrant that you meet this
                requirement.
              </p>
            </section>

            {/* 3. User Accounts */}
            <section
              style={{ animationDelay: "200ms" }}
              className="space-y-4 p-6 rounded-2xl border-l-2 border-transparent hover:border-accent hover:bg-white/40 dark:hover:bg-slate-950/20 hover:shadow-sm transition-all duration-300 animate-fade-in-up"
            >
              <h2 className="font-display text-xl font-bold text-foreground">
                {t("terms.userAccounts")}
              </h2>
              <div className="space-y-3">
                <p>
                  <strong className="text-foreground">Registration:</strong> To access certain
                  features, you may need to register and create an account. You agree to provide
                  accurate and complete information during registration and to update such
                  information to keep it accurate and complete.
                </p>
                <p>
                  <strong className="text-foreground">Account Security:</strong> You are responsible
                  for maintaining the confidentiality of your account credentials and for all
                  activities that occur under your account. Notify us immediately of any
                  unauthorized use of your account.
                </p>
              </div>
            </section>

            {/* 4. Use of the Website */}
            <section
              style={{ animationDelay: "250ms" }}
              className="space-y-4 p-6 rounded-2xl border-l-2 border-transparent hover:border-accent hover:bg-white/40 dark:hover:bg-slate-950/20 hover:shadow-sm transition-all duration-300 animate-fade-in-up"
            >
              <h2 className="font-display text-xl font-bold text-foreground">
                {t("terms.useOfWebsite")}
              </h2>
              <p>
                You agree to use the Website only for lawful purposes and in accordance with these
                Terms. You shall not:
              </p>
              <ul className="list-disc list-inside ml-2 space-y-2">
                <li>Use the Website in any way that violates applicable laws or regulations.</li>
                <li>
                  Engage in any conduct that restricts or inhibits anyone’s use or enjoyment of the
                  Website.
                </li>
                <li>
                  Introduce any viruses, trojan horses, worms, or other material that is malicious
                  or technologically harmful.
                </li>
              </ul>
            </section>

            {/* 5. Intellectual Property Rights */}
            <section
              style={{ animationDelay: "300ms" }}
              className="space-y-3 p-6 rounded-2xl border-l-2 border-transparent hover:border-accent hover:bg-white/40 dark:hover:bg-slate-950/20 hover:shadow-sm transition-all duration-300 animate-fade-in-up"
            >
              <h2 className="font-display text-xl font-bold text-foreground">
                {t("terms.intellectualProperty")}
              </h2>
              <p>
                All content on the Website, including text, graphics, logos, and software, is the
                property of myjobcampus.com or its content suppliers and is protected by
                intellectual property laws. You may not reproduce, distribute, or create derivative
                works from any content without our express written permission.
              </p>
            </section>

            {/* 6. Job Listings and Applications */}
            <section
              style={{ animationDelay: "350ms" }}
              className="space-y-4 p-6 rounded-2xl border-l-2 border-transparent hover:border-accent hover:bg-white/40 dark:hover:bg-slate-950/20 hover:shadow-sm transition-all duration-300 animate-fade-in-up"
            >
              <h2 className="font-display text-xl font-bold text-foreground">
                {t("terms.jobListings")}
              </h2>
              <div className="space-y-3">
                <p>
                  <strong className="text-foreground">Accuracy:</strong> We strive to ensure that
                  job listings are accurate and up-to-date but do not guarantee the authenticity or
                  accuracy of any job postings.
                </p>
                <p>
                  <strong className="text-foreground">Third-Party Links:</strong> The Website may
                  contain links to third-party websites. We are not responsible for the content or
                  practices of these external sites.
                </p>
              </div>
            </section>

            {/* 7. Privacy */}
            <section
              style={{ animationDelay: "400ms" }}
              className="space-y-3 p-6 rounded-2xl border-l-2 border-transparent hover:border-accent hover:bg-white/40 dark:hover:bg-slate-950/20 hover:shadow-sm transition-all duration-300 animate-fade-in-up"
            >
              <h2 className="font-display text-xl font-bold text-foreground">
                {t("terms.privacy")}
              </h2>
              <p>
                Your use of the Website is also governed by our{" "}
                <a href="/privacy" className="text-primary hover:underline font-semibold">
                  {t("nav.privacyPolicy")}
                </a>
                , which outlines how we collect, use, and protect your personal information.
              </p>
            </section>

            {/* 8. Limitation of Liability */}
            <section
              style={{ animationDelay: "450ms" }}
              className="space-y-3 p-6 rounded-2xl border-l-2 border-transparent hover:border-accent hover:bg-white/40 dark:hover:bg-slate-950/20 hover:shadow-sm transition-all duration-300 animate-fade-in-up"
            >
              <h2 className="font-display text-xl font-bold text-foreground">
                {t("terms.limitation")}
              </h2>
              <p>
                To the fullest extent permitted by law, myjobcampus.com shall not be liable for any
                indirect, incidental, special, consequential, or punitive damages resulting from
                your use of or inability to use the Website.
              </p>
            </section>

            {/* 9. Indemnification */}
            <section
              style={{ animationDelay: "500ms" }}
              className="space-y-3 p-6 rounded-2xl border-l-2 border-transparent hover:border-accent hover:bg-white/40 dark:hover:bg-slate-950/20 hover:shadow-sm transition-all duration-300 animate-fade-in-up"
            >
              <h2 className="font-display text-xl font-bold text-foreground">
                {t("terms.indemnification")}
              </h2>
              <p>
                You agree to indemnify and hold harmless myjobcampus.com, its affiliates, and their
                respective officers, directors, employees, and agents from any claims, liabilities,
                damages, losses, or expenses arising out of your use of the Website or violation of
                these Terms.
              </p>
            </section>

            {/* 10. Modifications to Terms */}
            <section
              style={{ animationDelay: "550ms" }}
              className="space-y-3 p-6 rounded-2xl border-l-2 border-transparent hover:border-accent hover:bg-white/40 dark:hover:bg-slate-950/20 hover:shadow-sm transition-all duration-300 animate-fade-in-up"
            >
              <h2 className="font-display text-xl font-bold text-foreground">
                {t("terms.modifications")}
              </h2>
              <p>
                We reserve the right to modify these Terms at any time. Changes will be effective
                immediately upon posting on the Website. Your continued use of the Website after
                changes are posted constitutes your acceptance of the revised Terms.
              </p>
            </section>

            {/* 11. Governing Law */}
            <section
              style={{ animationDelay: "600ms" }}
              className="space-y-3 p-6 rounded-2xl border-l-2 border-transparent hover:border-accent hover:bg-white/40 dark:hover:bg-slate-950/20 hover:shadow-sm transition-all duration-300 animate-fade-in-up"
            >
              <h2 className="font-display text-xl font-bold text-foreground">
                {t("terms.governingLaw")}
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India,
                without regard to its conflict of law principles.
              </p>
            </section>

            {/* 12. Contact Information */}
            <section
              style={{ animationDelay: "650ms" }}
              className="space-y-3 p-6 rounded-2xl border-l-2 border-transparent hover:border-accent hover:bg-white/40 dark:hover:bg-slate-950/20 hover:shadow-sm transition-all duration-300 animate-fade-in-up"
            >
              <h2 className="font-display text-xl font-bold text-foreground">
                {t("terms.contactInfo")}
              </h2>
              <p>
                For any questions or concerns regarding these Terms, please contact us at{" "}
                <a
                  href="mailto:infomyjobcampus@gmail.com"
                  className="text-primary hover:underline font-semibold"
                >
                  infomyjobcampus@gmail.com
                </a>
                .
              </p>
            </section>
          </article>

          {/* Sidebar Column */}
          <div className="h-fit">
            <Suspense
              fallback={<div className="h-96 w-full bg-[#FAF6F0] rounded-[32px] animate-pulse" />}
            >
              <BlogSidebar />
            </Suspense>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
