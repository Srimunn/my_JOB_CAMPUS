"use client";

import { SiteLayout } from "@/components/site/SiteLayout";
import { useState, useEffect, Suspense } from "react";
import { BlogSidebar } from "@/components/site/BlogSidebar";

export default function PrivacyPolicy() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

        {/* Header (Aligned directly to layout, matching Contact page) */}
        <section className="pt-[10px] pb-16 text-center animate-fade-in-up">
          <div className="mx-auto max-w-5xl px-4">
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight lg:whitespace-nowrap">
              Privacy Policy
            </h1>
            <p className="mt-4 text-base font-semibold text-muted-foreground/80">
              How My Job Campus protects your information
            </p>
          </div>
        </section>

        {/* Grid Column Layout */}
        <div className="mx-auto max-w-7xl px-6 pb-24 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 items-start">
          {/* Main Content Column (Glass Panel) */}
          <article
            style={
              {
                "--mouse-x": `${mousePos.x}px`,
                "--mouse-y": `${mousePos.y}px`,
              } as React.CSSProperties
            }
            className="rounded-3xl spotlight-card glass-panel p-8 sm:p-10 shadow-lg space-y-8 text-foreground/80 leading-relaxed text-base animate-fade-in-up text-justify"
          >
            {/* Who we are */}
            <section
              style={{ animationDelay: "100ms" }}
              className="space-y-3 p-6 rounded-2xl border-l-2 border-transparent hover:border-accent hover:bg-white/40 dark:hover:bg-slate-950/20 hover:shadow-sm transition-all duration-300 animate-fade-in-up"
            >
              <h2 className="font-display text-2xl font-bold text-foreground">Who we are</h2>
              <p>
                Our website address is:{" "}
                <a
                  href="https://myjobcampus.com"
                  className="text-primary hover:underline font-semibold"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  https://myjobcampus.com
                </a>
                .
              </p>
            </section>

            {/* Comments */}
            <section
              style={{ animationDelay: "150ms" }}
              className="space-y-4 p-6 rounded-2xl border-l-2 border-transparent hover:border-accent hover:bg-white/40 dark:hover:bg-slate-950/20 hover:shadow-sm transition-all duration-300 animate-fade-in-up"
            >
              <h2 className="font-display text-2xl font-bold text-foreground">Comments</h2>
              <p>
                When visitors leave comments on the site we collect the data shown in the comments
                form, and also the visitor's IP address and browser user agent string to help spam
                detection.
              </p>
              <p>
                An anonymized string created from your email address (also called a hash) may be
                provided to the Gravatar service to see if you are using it. The Gravatar service
                privacy policy is available here:{" "}
                <a
                  href="https://automattic.com/privacy/"
                  className="text-primary hover:underline font-semibold"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  https://automattic.com/privacy/
                </a>
                . After approval of your comment, your profile picture is visible to the public in
                the context of your comment.
              </p>
            </section>

            {/* Media */}
            <section
              style={{ animationDelay: "200ms" }}
              className="space-y-3 p-6 rounded-2xl border-l-2 border-transparent hover:border-accent hover:bg-white/40 dark:hover:bg-slate-950/20 hover:shadow-sm transition-all duration-300 animate-fade-in-up"
            >
              <h2 className="font-display text-2xl font-bold text-foreground">Media</h2>
              <p>
                If you upload images to the website, you should avoid uploading images with embedded
                location data (EXIF GPS) included. Visitors to the website can download and extract
                any location data from images on the website.
              </p>
            </section>

            {/* Cookies */}
            <section
              style={{ animationDelay: "250ms" }}
              className="space-y-4 p-6 rounded-2xl border-l-2 border-transparent hover:border-accent hover:bg-white/40 dark:hover:bg-slate-950/20 hover:shadow-sm transition-all duration-300 animate-fade-in-up"
            >
              <h2 className="font-display text-2xl font-bold text-foreground">Cookies</h2>
              <p>
                If you leave a comment on our site you may opt-in to saving your name, email address
                and website in cookies. These are for your convenience so that you do not have to
                fill in your details again when you leave another comment. These cookies will last
                for one year.
              </p>
              <p>
                If you visit our login page, we will set a temporary cookie to determine if your
                browser accepts cookies. This cookie contains no personal data and is discarded when
                you close your browser.
              </p>
              <p>
                When you log in, we will also set up several cookies to save your login information
                and your screen display choices. Login cookies last for two days, and screen options
                cookies last for a year. If you select "Remember Me", your login will persist for
                two weeks. If you log out of your account, the login cookies will be removed.
              </p>
              <p>
                If you edit or publish an article, an additional cookie will be saved in your
                browser. This cookie includes no personal data and simply indicates the post ID of
                the article you just edited. It expires after 1 day.
              </p>
            </section>

            {/* Embedded content */}
            <section
              style={{ animationDelay: "300ms" }}
              className="space-y-4 p-6 rounded-2xl border-l-2 border-transparent hover:border-accent hover:bg-white/40 dark:hover:bg-slate-950/20 hover:shadow-sm transition-all duration-300 animate-fade-in-up"
            >
              <h2 className="font-display text-2xl font-bold text-foreground">
                Embedded content from other websites
              </h2>
              <p>
                Articles on this site may include embedded content (e.g. videos, images, articles,
                etc.). Embedded content from other websites behaves in the exact same way as if the
                visitor has visited the other website.
              </p>
              <p>
                These websites may collect data about you, use cookies, embed additional third-party
                tracking, and monitor your interaction with that embedded content, including
                tracking your interaction with the embedded content if you have an account and are
                logged in to that website.
              </p>
            </section>

            {/* Who we share your data with */}
            <section
              style={{ animationDelay: "350ms" }}
              className="space-y-3 p-6 rounded-2xl border-l-2 border-transparent hover:border-accent hover:bg-white/40 dark:hover:bg-slate-950/20 hover:shadow-sm transition-all duration-300 animate-fade-in-up"
            >
              <h2 className="font-display text-2xl font-bold text-foreground">
                Who we share your data with
              </h2>
              <p>
                If you request a password reset, your IP address will be included in the reset
                email.
              </p>
            </section>

            {/* How long we retain your data */}
            <section
              style={{ animationDelay: "400ms" }}
              className="space-y-4 p-6 rounded-2xl border-l-2 border-transparent hover:border-accent hover:bg-white/40 dark:hover:bg-slate-950/20 hover:shadow-sm transition-all duration-300 animate-fade-in-up"
            >
              <h2 className="font-display text-2xl font-bold text-foreground">
                How long we retain your data
              </h2>
              <p>
                If you leave a comment, the comment and its metadata are retained indefinitely. This
                is so we can recognize and approve any follow-up comments automatically instead of
                holding them in a moderation queue.
              </p>
              <p>
                For users that register on our website (if any), we also store the personal
                information they provide in their user profile. All users can see, edit, or delete
                their personal information at any time (except they cannot change their username).
                Website administrators can also see and edit that information.
              </p>
            </section>

            {/* What rights you have over your data */}
            <section
              style={{ animationDelay: "450ms" }}
              className="space-y-3 p-6 rounded-2xl border-l-2 border-transparent hover:border-accent hover:bg-white/40 dark:hover:bg-slate-950/20 hover:shadow-sm transition-all duration-300 animate-fade-in-up"
            >
              <h2 className="font-display text-2xl font-bold text-foreground">
                What rights you have over your data
              </h2>
              <p>
                If you have an account on this site, or have left comments, you can request to
                receive an exported file of the personal data we hold about you, including any data
                you have provided to us. You can also request that we erase any personal data we
                hold about you. This does not include any data we are obliged to keep for
                administrative, legal, or security purposes.
              </p>
            </section>

            {/* Where your data is sent */}
            <section
              style={{ animationDelay: "500ms" }}
              className="space-y-3 p-6 rounded-2xl border-l-2 border-transparent hover:border-accent hover:bg-white/40 dark:hover:bg-slate-950/20 hover:shadow-sm transition-all duration-300 animate-fade-in-up"
            >
              <h2 className="font-display text-2xl font-bold text-foreground">
                Where your data is sent
              </h2>
              <p>Visitor comments may be checked through an automated spam detection service.</p>
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
