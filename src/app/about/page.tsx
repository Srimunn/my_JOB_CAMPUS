"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, Compass, Target, Star } from "lucide-react";

// Image Assets
import aboutHeroImg from "@/assets/about_hero.png";
import aboutWhoWeAreImg from "@/assets/about_who_we_are.png";
import offerJobsImg from "@/assets/offer_jobs.png";
import offerNewsImg from "@/assets/offer_news.png";
import offerAffairsImg from "@/assets/offer_affairs.png";

export default function About() {
  const testimonials = [
    {
      initials: "ST",
      name: "Swetha Trivedi",
      location: "Delhi",
      text: "My Job Campus made my job search so much easier. With personalised job recommendations and constant updates, I found the perfect role faster than I expected. I truly appreciate how they connect candidates with top employers.",
    },
    {
      initials: "PP",
      name: "Pratima Pareek",
      location: "Bengaluru",
      text: "My Job Campus has been a game-changer in my job search. The platform connects me with relevant opportunities and provides valuable career insights.",
    },
    {
      initials: "VP",
      name: "Vijay Prabhakar",
      location: "Chennai",
      text: "Every day at My Job Campus, I feel inspired by the opportunities and support provided. The platform’s innovative approach has made a real difference.",
    },
  ];

  const [activeIdx, setActiveIdx] = useState(0);

  const handlePrev = () => {
    setActiveIdx((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  // Decorative floating background avatars for Why Customers Love Us section
  const floatingAvatars = [
    {
      style: "absolute top-[12%] left-[10%] w-20 h-20 animate-float-slow hidden md:block",
      svg: (
        <svg
          className="w-full h-full p-2"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="32" cy="32" r="32" fill="#E0E7FF" />
          <circle cx="32" cy="24" r="12" fill="#4F46E5" />
          <path d="M12 54C12 43.5 20.5 35 32 35C43.5 35 52 43.5 52 54" fill="#4F46E5" />
          <rect x="16" y="20" width="4" height="8" rx="2" fill="#1E1B4B" />
          <rect x="44" y="20" width="4" height="8" rx="2" fill="#1E1B4B" />
          <path
            d="M20 20C20 14 24 12 32 12C40 12 44 14 44 20"
            stroke="#1E1B4B"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      style: "absolute bottom-[10%] left-[8%] w-24 h-24 animate-float-medium hidden md:block",
      svg: (
        <svg
          className="w-full h-full p-2"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="32" cy="32" r="32" fill="#E2F1E8" />
          <circle cx="32" cy="22" r="10" fill="#15803d" />
          <path d="M14 50C14 41 22 34 32 34C42 34 50 41 50 50" fill="#166534" />
          <path d="M30 34L32 44L34 34Z" fill="#EAB308" />
        </svg>
      ),
    },
    {
      style: "absolute top-[48%] left-[18%] w-16 h-16 animate-float-fast hidden lg:block",
      svg: (
        <svg
          className="w-full h-full p-1.5"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="32" cy="32" r="32" fill="#FFEFEA" />
          <circle cx="32" cy="24" r="11" fill="#EA580C" />
          <path d="M12 52C12 42 21 35 32 35C43 35 52 42 52 52" fill="#EA580C" />
        </svg>
      ),
    },
    {
      style: "absolute top-[18%] right-[12%] w-20 h-20 animate-float-fast hidden md:block",
      svg: (
        <svg
          className="w-full h-full p-2"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="32" cy="32" r="32" fill="#F3E8FF" />
          <circle cx="32" cy="23" r="10" fill="#7C3AED" />
          <path d="M14 52C14 43 22 35 32 35C42 35 50 43 50 52" fill="#6D28D9" />
        </svg>
      ),
    },
    {
      style: "absolute bottom-[18%] right-[4%] w-18 h-18 animate-float-slow hidden md:block",
      svg: (
        <svg
          className="w-full h-full p-2"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="32" cy="32" r="32" fill="#FEF9C3" />
          <circle cx="32" cy="22" r="9" fill="#CA8A04" />
          <path d="M15 50C15 42 23 34 32 34C41 34 49 42 49 50" fill="#CA8A04" />
        </svg>
      ),
    },
    {
      style: "absolute bottom-[8%] right-[22%] w-24 h-24 animate-float-medium hidden lg:block",
      svg: (
        <svg
          className="w-full h-full p-2.5"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="32" cy="32" r="32" fill="#EFF6FF" />
          <circle cx="32" cy="21" r="11" fill="#2563EB" />
          <path d="M13 49C13 40 21.5 33 32 33C42.5 33 51 40 51 49" fill="#1D4ED8" />
        </svg>
      ),
    },
  ];

  return (
    <SiteLayout>
      {/* Injecting CSS Keyframes locally for floating effects */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes floatSlow {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(1.5deg); }
          }
          @keyframes floatMedium {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(-1deg); }
          }
          @keyframes floatFast {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-6px) rotate(0.8deg); }
          }
          .animate-float-slow {
            animation: floatSlow 7s ease-in-out infinite;
          }
          .animate-float-medium {
            animation: floatMedium 5.5s ease-in-out infinite;
          }
          .animate-float-fast {
            animation: floatFast 4s ease-in-out infinite;
          }
        `,
        }}
      />

      {/* 1. Hero Section */}
      <section className="relative w-full h-[320px] md:h-[400px] overflow-hidden flex items-center justify-center">
        <Image
          src={aboutHeroImg}
          alt="Office meeting discussion group"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#0f172a]/60" />
        <h1 className="relative z-10 text-center font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-white max-w-4xl px-4 tracking-tight leading-tight">
          We help you find the right job!
        </h1>
      </section>

      {/* 2. About Us Section */}
      <section className="mx-auto max-w-6xl px-4 py-20 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-4xl font-extrabold text-[#1e293b] tracking-tight relative inline-block">
            About Us
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[-10px] w-20 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
          </h2>
          <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
            Connecting Talent with Opportunity – Empowering Your Career Journey Every Step of the
            Way.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mt-12">
          {/* Welcome Card */}
          <div className="group relative rounded-3xl border border-border/60 bg-gradient-to-br from-white to-slate-50/50 p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden">
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-6 shadow-sm border border-emerald-100 group-hover:scale-110 transition-transform duration-300">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[#1e293b]">
                Welcome to My Job Campus
              </h3>
              <p className="mt-4 text-sm md:text-base text-foreground/75 leading-relaxed text-justify">
                Welcome to <span className="font-bold text-foreground">My Job Campus</span> – your
                go-to platform for the latest job updates, educational news, and current affairs.
                Our mission is simple: to keep you informed and help you stay ahead in your career
                journey.
              </p>
            </div>
            <div className="mt-8 text-xs font-semibold text-emerald-700 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Empowering talent worldwide ✦
            </div>
          </div>

          {/* Why Us Card */}
          <div className="group relative rounded-3xl border border-border/60 bg-gradient-to-br from-white to-slate-50/50 p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden">
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-colors" />
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 mb-6 shadow-sm border border-teal-100 group-hover:scale-110 transition-transform duration-300">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[#1e293b]">Why My Job Campus?</h3>
              <p className="mt-4 text-sm md:text-base text-foreground/75 leading-relaxed text-justify">
                Finding the right job opportunities and staying updated with educational trends can
                be overwhelming. My Job Campus simplifies this by bringing you timely,
                well-researched updates—all in one place. Whether you’re a student, a job seeker, or
                someone looking to switch careers, we ensure you never miss an important
                opportunity.
              </p>
            </div>
            <div className="mt-8 text-xs font-semibold text-teal-700 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Simplifying your career path ✦
            </div>
          </div>
        </div>
      </section>

      {/* 3. Who's Behind Section */}
      <section className="bg-slate-50/50 border-t border-b border-border/80 py-20 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 lg:px-8 grid gap-12 lg:grid-cols-12 items-center">
          {/* Left Side: Picture and Stat Overlays */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[340px] aspect-[4/5] mr-0 md:mr-8 md:-translate-x-5">
              {/* Backing decorative colored card */}
              <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl bg-indigo-50/70 -z-10" />

              {/* Main Photo container */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-lg border border-border bg-card">
                <Image
                  src={aboutWhoWeAreImg}
                  alt="Lady at workspace with laptop"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Overlapping Stats Badges (visible on md+) */}
              <div className="hidden md:block">
                {/* Badge 1 */}
                <div className="absolute -right-16 top-[15%] w-[210px] bg-white rounded-2xl p-4 shadow-xl border border-border/40 flex items-center gap-4 transition-all duration-300 hover:translate-x-2 z-20">
                  <div className="font-display text-3xl font-extrabold text-[#111827]">130</div>
                  <div className="text-left">
                    <div className="text-xs font-extrabold text-[#111827] leading-none">
                      Job Offers
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 leading-none">
                      Across Different Industries
                    </div>
                  </div>
                </div>

                {/* Badge 2 */}
                <div className="absolute -right-22 top-[44%] w-[210px] bg-white rounded-2xl p-4 shadow-xl border border-border/40 flex items-center gap-4 transition-all duration-300 hover:translate-x-2 z-20">
                  <div className="font-display text-3xl font-extrabold text-[#111827]">100+</div>
                  <div className="text-left">
                    <div className="text-xs font-extrabold text-[#111827] leading-none">
                      Active Employers
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 leading-none">
                      Connect with Top Companies
                    </div>
                  </div>
                </div>

                {/* Badge 3 */}
                <div className="absolute -right-16 top-[73%] w-[210px] bg-white rounded-2xl p-4 shadow-xl border border-border/40 flex items-center gap-4 transition-all duration-300 hover:translate-x-2 z-20">
                  <div className="font-display text-3xl font-extrabold text-[#111827]">80+</div>
                  <div className="text-left">
                    <div className="text-xs font-extrabold text-[#111827] leading-none">
                      Career Resources
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 leading-none">
                      Tips, Guides and Insights
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile-only Stats Grid */}
            <div className="grid grid-cols-1 gap-4 w-full mt-8 md:hidden">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-border flex items-center gap-4">
                <div className="font-display text-3xl font-extrabold text-[#111827]">130</div>
                <div className="text-left">
                  <div className="text-xs font-bold text-foreground">Job Offers</div>
                  <div className="text-[10px] text-muted-foreground">
                    Across Different Industries
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-border flex items-center gap-4">
                <div className="font-display text-3xl font-extrabold text-[#111827]">100+</div>
                <div className="text-left">
                  <div className="text-xs font-bold text-foreground">Active Employers</div>
                  <div className="text-[10px] text-muted-foreground">
                    Connect with Top Companies
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-border flex items-center gap-4">
                <div className="font-display text-3xl font-extrabold text-[#111827]">80+</div>
                <div className="text-left">
                  <div className="text-xs font-bold text-foreground">Career Resources</div>
                  <div className="text-[10px] text-muted-foreground">Tips, Guides and Insights</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Who's Behind Copy and Checklist */}
          <div className="lg:col-span-7 lg:pl-10 text-left">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[#1e293b] leading-tight">
              Who’s Behind My Job Campus?
            </h2>
            <p className="mt-5 text-base text-foreground/80 leading-relaxed">
              Hrithik, a Civil Engineer turned Digital Marketer with a passion for writing and
              social media management, created My Job Campus to provide an end-to-end guide for job
              seekers—helping you navigate job applications, exams, and industry trends
              effortlessly.
            </p>

            {/* Checklist */}
            <ul className="mt-8 space-y-4">
              {[
                "Bookmark this page for daily updates.",
                "Follow us on social media for quick alerts.",
                "Subscribe to never miss an opportunity!",
              ].map((bullet, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3.5 text-base font-semibold text-foreground/90"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <Link href="/jobs">
              <Button className="mt-10 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-8 py-6 shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer">
                Get Started Now <ChevronRight className="h-4.5 w-4.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. What We Offer Section */}
      <section className="bg-slate-50/30 border-t border-border/80 py-24">
        <div className="mx-auto max-w-6xl px-4 lg:px-8 text-center">
          <h2 className="font-display text-4xl font-extrabold text-[#1e293b] tracking-tight mb-14">
            What We Offer
          </h2>

          <div className="grid gap-8 md:grid-cols-3 text-left">
            {/* Card 1 */}
            <div className="rounded-3xl border border-border/70 bg-card shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5 flex flex-col overflow-hidden group">
              <div className="relative w-full h-[180px] overflow-hidden">
                <Image
                  src={offerJobsImg}
                  alt="Cozy office lounge couch"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    Latest Job Openings
                  </h3>
                  <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
                    Get real-time job alerts across the country from various industries - tailored
                    to your preferences.
                  </p>
                </div>
                <Link
                  href="/jobs"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  Read more <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-3xl border border-border/70 bg-card shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5 flex flex-col overflow-hidden group">
              <div className="relative w-full h-[180px] overflow-hidden">
                <Image
                  src={offerNewsImg}
                  alt="Office presentation creative whiteboard session"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    Educational News
                  </h3>
                  <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
                    Stay informed about academic updates, scholarships, and government schemes.
                  </p>
                </div>
                <Link
                  href="/govt-jobs"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  Read more <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-3xl border border-border/70 bg-card shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5 flex flex-col overflow-hidden group">
              <div className="relative w-full h-[180px] overflow-hidden">
                <Image
                  src={offerAffairsImg}
                  alt="Modern coworking plan workspace desks"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    Current Affairs
                  </h3>
                  <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
                    Stay up-to-date with news and trends that directly impact your career growth and
                    development.
                  </p>
                </div>
                <Link
                  href="/career-guidance"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  Read more <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Customers Love Us Section */}
      <section className="relative py-24 bg-slate-50/60 bg-dot-grid border-t border-border/80 overflow-hidden">
        {/* Bottom soft glowing orb */}
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10" />

        <div className="mx-auto max-w-6xl px-4 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-4xl font-extrabold text-[#1e293b] tracking-tight relative inline-block">
              Why Customers Love Us
              <div className="absolute left-1/2 -translate-x-1/2 bottom-[-10px] w-20 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
            </h2>
            <p className="mt-6 text-base text-muted-foreground">What our customers say about us</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="group relative rounded-3xl border border-border/60 bg-white/95 backdrop-blur-sm p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between h-full overflow-hidden"
              >
                {/* Decorative quote mark */}
                <span className="absolute right-6 top-3 text-7xl font-serif text-emerald-500/5 select-none group-hover:text-emerald-500/10 transition-colors duration-300">
                  ”
                </span>

                <div>
                  {/* Stars */}
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4.5 w-4.5 fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform duration-300"
                        style={{ transitionDelay: `${i * 50}ms` }}
                      />
                    ))}
                  </div>

                  <p className="text-sm md:text-base text-foreground/80 italic leading-relaxed text-justify mb-8">
                    "{t.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3.5 border-t border-border/50 pt-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold text-xs shadow-md border-2 border-white group-hover:scale-105 transition-transform duration-300">
                    {t.initials}
                  </div>
                  <div className="text-left">
                    <div className="font-extrabold text-sm text-foreground group-hover:text-emerald-600 transition-colors">
                      {t.name}
                    </div>
                    <div className="text-xs text-muted-foreground">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
