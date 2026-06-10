"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { LoginLink } from "@/components/LoginLink";
import { SiteNavMarketing } from "@/components/SiteNav";
import { ProductHubCards } from "@/components/ProductHubCards";

/** Honest product facts — no invented users. */
const TICKER_LINES = [
  "US internships synced daily from real company career pages",
  "AI reads your Gmail (read-only) and tracks every application for you",
  "25+ AI mock interviews for top companies — practice before the real thing",
  "50+ student discounts and free tools in one place",
  "Verified students get unlimited tracking, completely free",
] as const;

function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) {
      setOn(true);
      return;
    }

    const reveal = () => setOn(true);
    const fallback = window.setTimeout(reveal, 600);

    if (typeof IntersectionObserver === "undefined") {
      reveal();
      return () => clearTimeout(fallback);
    }

    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          reveal();
          ob.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -24px 0px" }
    );
    ob.observe(el);
    return () => {
      clearTimeout(fallback);
      ob.disconnect();
    };
  }, []);
  return (
    <div
      ref={ref}
      className={`transition-all duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 ${
        on ? "translate-y-0" : "translate-y-3"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function CheckIcon({ className = "w-4 h-4 text-emerald-500" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "Is RethinkJobs really free for students?",
    a: "Yes. Verify your student status once and you get unlimited application tracking, Gmail syncs, and all five tools at no cost — no card required.",
  },
  {
    q: "What is RethinkJobs?",
    a: "RethinkJobs is a student job-search hub: find US internships from company career pages, track applications automatically from Gmail, practice AI mock interviews, find mentors and recruiters at any company, and grab student discounts — all in one account.",
  },
  {
    q: "Is my email data secure?",
    a: "We request minimal, read-only Gmail scopes for job-related messages only. Your data powers your dashboard and is handled according to our privacy policy. You can revoke access anytime from your Google account.",
  },
  {
    q: "Can I fix a wrong status?",
    a: "Yes. You can edit any application's status and details if the AI misclassifies something.",
  },
  {
    q: "I'm not a student — can I still use it?",
    a: "Absolutely. The Free plan tracks up to 50 applications, and Professional unlocks unlimited tracking for $9.99/month.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Create your free account",
    desc: "Sign in with Google or email in seconds. Students: verify once and everything is free, forever.",
  },
  {
    step: "2",
    title: "Find roles & apply",
    desc: "Browse US internships pulled straight from company career pages — fewer applicants than the big job boards.",
  },
  {
    step: "3",
    title: "We track everything",
    desc: "Connect Gmail (read-only) and AI builds your pipeline automatically: interviews, assessments, offers, deadlines.",
  },
];

const STUDENT_STATS: [string, string][] = [
  ["$0", "for verified students"],
  ["Daily", "internship syncs from career pages"],
  ["25+", "AI mock interviews"],
  ["50+", "student deals & free tools"],
];

export function LandingPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <SiteNavMarketing />
      <main id="main-content">
      {/* Hero */}
      <section
        className="relative overflow-hidden landing-hero-mesh pb-20 pt-10 sm:pb-28 sm:pt-14 lg:pb-32 lg:pt-16"
        aria-labelledby="hero-heading"
      >
        <div className="pointer-events-none absolute inset-0 landing-hero-grid" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20">
          <div className="landing-hero-stagger text-center lg:text-left">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur-sm">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
              Built for students · Free with student verification
            </p>
            <h1
              id="hero-heading"
              className="mb-6 text-[2.1rem] font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem]"
            >
              Land your{" "}
              <span className="text-hero-gradient">first internship</span>
              <br className="hidden sm:block" />
              {" "}without the chaos
            </h1>
            <p className="mx-auto mb-8 max-w-lg text-base leading-relaxed text-slate-600 lg:mx-0 lg:text-lg">
              Find real internships, track every application automatically, practice
              interviews with AI, and meet mentors who can refer you — all in one place.
            </p>
            <div className="mx-auto mb-8 grid max-w-md gap-3 sm:grid-cols-2 lg:mx-0 lg:max-w-none">
              <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 text-left shadow-sm backdrop-blur-sm">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-900">Real internships</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">Straight from company career pages, not crowded boards.</p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 text-left shadow-sm backdrop-blur-sm">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-900">Auto-tracked</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">Gmail sync builds your pipeline. No spreadsheets, ever.</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <LoginLink
                callbackUrl="/"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-scale-purple px-8 py-4 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(107,70,254,0.3),0_12px_32px_-8px_rgba(107,70,254,0.45)] transition-all hover:bg-scale-purple-dark hover:shadow-lg active:scale-[0.98] sm:w-auto"
              >
                <GoogleIcon />
                Start free — no card needed
              </LoginLink>
              <a
                href="#products"
                className="inline-flex w-full items-center justify-center rounded-2xl border-2 border-slate-200/90 bg-white/90 px-8 py-4 text-sm font-semibold text-slate-700 backdrop-blur-sm transition-all hover:border-scale-purple/40 hover:bg-white sm:w-auto"
              >
                See the five tools
              </a>
            </div>
            <p className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-500 lg:justify-start">
              <span>Free for verified students</span>
              <span className="text-slate-300" aria-hidden>·</span>
              <span>Gmail is optional</span>
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">
            <div
              className="relative landing-pipeline-glow rounded-3xl border border-white/80 bg-white/95 p-1 backdrop-blur-sm animate-float-slow motion-reduce:animate-none"
              style={{ animationDelay: "-1s" }}
            >
              <div className="rounded-[1.35rem] bg-gradient-to-br from-scale-lavender/90 via-white to-slate-50 p-6 sm:p-8">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-scale-purple">Your pipeline</p>
                    <p className="text-2xl font-bold text-slate-900">Internship tracker</p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-scale-purple/10">
                    <span className="text-lg font-bold text-scale-purple">🎓</span>
                  </div>
                </div>
                <div className="mb-5 flex h-3 gap-1 overflow-hidden rounded-full bg-white/80 p-0.5 shadow-inner">
                  <div className="w-[38%] rounded-full bg-scale-purple" />
                  <div className="w-[18%] rounded-full bg-violet-400" />
                  <div className="w-[22%] rounded-full bg-amber-400" />
                  <div className="w-[14%] rounded-full bg-emerald-400" />
                  <div className="flex-1 rounded-full bg-slate-200" />
                </div>
                <div className="space-y-2.5">
                  {[
                    { company: "Google", role: "Software Engineering Intern", status: "Interviewing", chip: "bg-violet-100 text-violet-700" },
                    { company: "Stripe", role: "New Grad Engineer", status: "Applied", chip: "bg-blue-100 text-blue-700" },
                    { company: "Shopify", role: "Frontend Intern", status: "Assessment", chip: "bg-amber-100 text-amber-800" },
                    { company: "Figma", role: "Product Design Intern", status: "Offer", chip: "bg-emerald-100 text-emerald-700" },
                  ].map((r) => (
                    <div
                      key={r.company}
                      className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-sm transition-transform hover:scale-[1.01]"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{r.company}</p>
                        <p className="text-xs text-slate-500">{r.role}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${r.chip}`}>{r.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div className="relative mx-auto mt-16 max-w-6xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-2xl border border-scale-purple/10 bg-white/70 py-4 shadow-sm backdrop-blur-md ring-1 ring-slate-200/50">
            <div className="flex animate-[scroll_56s_linear_infinite] gap-8 motion-reduce:animate-none">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex shrink-0 items-stretch gap-6 pl-6">
                  {TICKER_LINES.map((line) => (
                    <div
                      key={`${i}-${line}`}
                      className="flex max-w-[min(100vw-3rem,26rem)] shrink-0 items-center rounded-2xl border border-scale-purple/15 bg-white/95 px-4 py-3 text-left shadow-sm sm:max-w-[26rem]"
                    >
                      <span className="text-[11px] font-semibold leading-snug text-slate-700 sm:text-xs">{line}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ProductHubCards />

      {/* Big stat line */}
      <Reveal>
        <section className="border-y border-slate-100 bg-gradient-to-b from-white via-scale-mist/40 to-white py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <p className="text-xl font-bold leading-snug tracking-tight text-slate-800 sm:text-2xl md:text-[1.75rem] md:leading-snug">
              Built for students juggling{" "}
              <span className="text-scale-purple">classes, deadlines, and dozens of applications</span>{" "}
              — so nothing slips through the cracks.
            </p>
          </div>
        </section>
      </Reveal>

      {/* How it works */}
      <section id="how-it-works" className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-scale-purple">
                How it works
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                From “where do I start?” to offer letter
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                Three steps. Then your whole internship search runs itself while you
                focus on classes and interviews.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((s, i) => (
              <Reveal key={s.step} className={i === 1 ? "md:mt-6" : i === 2 ? "md:mt-12" : ""}>
                <div className="group h-full rounded-3xl border border-slate-200/80 bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-scale-purple/25 hover:shadow-scale-soft">
                  <div
                    className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-scale-purple text-lg font-bold text-white shadow-lg shadow-violet-500/25"
                    aria-hidden
                  >
                    {s.step}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-slate-900">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Student stats strip */}
      <Reveal>
        <section className="border-y border-scale-purple/10 bg-scale-lavender/50 py-12">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 sm:grid-cols-4 sm:px-6">
            {STUDENT_STATS.map(([n, l]) => (
              <div key={l} className="text-center">
                <p className="text-2xl font-extrabold text-scale-purple sm:text-3xl">{n}</p>
                <p className="mt-1 text-xs text-slate-600 sm:text-sm">{l}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Feature grid */}
      <section id="features" className="py-20 lg:py-28" aria-labelledby="features-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-scale-purple">
                The tracker
              </span>
              <h2
                id="features-heading"
                className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
              >
                Your internship search, organized for you
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                From first application to final offer — searchable, sorted, and always
                up to date. Built to survive campus recruiting season.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Full Gmail sync",
                desc: "Read-only access. We scan for job threads and keep your pipeline in sync.",
                path: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75",
              },
              {
                title: "AI classification",
                desc: "Extracts company, role, status, recruiters, and deadlines automatically.",
                path: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z",
              },
              {
                title: "Pipeline dashboard",
                desc: "Applied through offer: visual stages, filters, and date ranges at a glance.",
                path: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
              },
              {
                title: "Deadline reminders",
                desc: "Assessments and offer deadlines surface before they sneak up on you.",
                path: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
              },
              {
                title: "Search & filters",
                desc: "Slice by status, company, role, or time window — however you think about your search.",
                path: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
              },
              {
                title: "Mentor reach-out",
                desc: "Find recruiters and hiring contacts at any company when you're ready to go beyond the portal.",
                path: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.646-6.374-1.666m13.5-1.372A8.25 8.25 0 0119.5 10.5",
              },
            ].map((f) => (
              <Reveal key={f.title}>
                <div className="group h-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card transition-all duration-300 hover:border-scale-purple/20 hover:shadow-scale-soft">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-scale-purple/10 text-scale-purple transition-colors group-hover:bg-scale-purple group-hover:text-white">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={f.path} />
                    </svg>
                  </div>
                  <h3 className="mb-1.5 text-base font-bold text-slate-900">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-scale-lavender/30 py-20 lg:py-28" aria-labelledby="pricing-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="mb-12 text-center sm:mb-14">
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-scale-purple">
                Pricing
              </span>
              <h2 id="pricing-heading" className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Students never pay. Seriously.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
                Verify your student status once and everything is free. Everyone else
                starts free and can upgrade anytime.{" "}
                <Link href="/blog" className="font-semibold text-scale-purple hover:underline">
                  Read the blog
                </Link>{" "}
                for job-search playbooks.
              </p>
            </div>
          </Reveal>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:gap-6 lg:grid-cols-3 lg:items-stretch lg:gap-5 xl:gap-6">
            {/* Free */}
            <Reveal className="min-w-0 lg:min-h-0">
              <article className="flex h-full flex-col rounded-2xl border-2 border-slate-200/90 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:p-7">
                <div className="mb-4 flex min-h-[1.75rem] items-center justify-center">
                  <span className="sr-only">No badge</span>
                </div>
                <h3 className="text-center text-xs font-bold uppercase tracking-[0.15em] text-slate-400">Free</h3>
                <div className="mt-3 flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-extrabold tabular-nums text-slate-900 sm:text-5xl">$0</span>
                  <span className="text-sm text-slate-500">forever</span>
                </div>
                <p className="mt-2 text-center text-sm text-slate-500">Perfect for getting started</p>
                <ul className="mt-6 flex-1 space-y-2.5 border-t border-slate-100 pt-6">
                  {["Track up to 50 applications", "AI email classification", "Pipeline dashboard", "All five tools included"].map(
                    (x) => (
                      <li key={x} className="flex gap-2.5 text-sm leading-snug text-slate-600">
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-scale-purple" />
                        <span>{x}</span>
                      </li>
                    )
                  )}
                </ul>
                <LoginLink
                  callbackUrl="/"
                  label="Get started free"
                  className="mt-8 block w-full rounded-xl border-2 border-slate-200 bg-white py-3 text-center text-sm font-semibold text-slate-800 transition-colors hover:border-scale-purple/35 hover:bg-scale-mist/80"
                />
              </article>
            </Reveal>

            {/* Student — the hero plan */}
            <Reveal className="min-w-0 lg:min-h-0">
              <article className="flex h-full flex-col rounded-2xl border-2 border-emerald-400 bg-gradient-to-b from-white to-emerald-50/50 p-6 shadow-[0_8px_30px_-8px_rgba(16,185,129,0.3)] sm:p-7">
                <div className="mb-4 flex min-h-[1.75rem] items-center justify-center">
                  <span className="rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                    For students
                  </span>
                </div>
                <h3 className="text-center text-xs font-bold uppercase tracking-[0.15em] text-emerald-700">Student</h3>
                <div className="mt-3 flex justify-center">
                  <span className="text-4xl font-extrabold tabular-nums text-slate-900 sm:text-5xl">Free</span>
                </div>
                <p className="mt-2 text-center text-sm text-slate-500">Verify once with your school</p>
                <ul className="mt-6 flex-1 space-y-2.5 border-t border-emerald-100/80 pt-6">
                  {[
                    "Unlimited applications",
                    "Unlimited Gmail syncs",
                    "AI mock interviews",
                    "Mentor & recruiter search",
                    "All student deals",
                  ].map((x) => (
                    <li key={x} className="flex gap-2.5 text-sm leading-snug text-slate-600">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
                <LoginLink
                  callbackUrl="/"
                  label="Verify & get everything free"
                  className="mt-8 block w-full rounded-xl bg-emerald-600 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                />
              </article>
            </Reveal>

            {/* Pro */}
            <Reveal className="min-w-0 lg:min-h-0">
              <article className="flex h-full flex-col rounded-2xl border-2 border-scale-purple/40 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:p-7">
                <div className="mb-4 flex min-h-[1.75rem] items-center justify-center">
                  <span className="rounded-full bg-scale-purple px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                    Professionals
                  </span>
                </div>
                <h3 className="text-center text-xs font-bold uppercase tracking-[0.15em] text-scale-purple">Professional</h3>
                <div className="mt-3 flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-extrabold tabular-nums text-slate-900 sm:text-5xl">$9.99</span>
                  <span className="text-sm text-slate-500">/mo</span>
                </div>
                <p className="mt-2 text-center text-sm text-slate-500">For everyone out of school</p>
                <ul className="mt-6 flex-1 space-y-2.5 border-t border-scale-purple/15 pt-6">
                  {[
                    "Unlimited applications",
                    "Unlimited Gmail syncs",
                    "AI classification",
                    "Full pipeline & timeline",
                    "Priority support",
                  ].map((x) => (
                    <li key={x} className="flex gap-2.5 text-sm leading-snug text-slate-600">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-scale-purple" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
                <LoginLink
                  callbackUrl="/"
                  label="Start Pro"
                  className="mt-8 block w-full rounded-xl bg-scale-purple py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-scale-purple-dark"
                />
                <p className="mt-3 text-center text-xs text-slate-400">Cancel anytime · Stripe</p>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-slate-600">
              Still stuck?{" "}
              <Link
                href="/contact-us"
                className="font-semibold text-scale-purple hover:underline"
              >
                Contact us
              </Link>
              .
            </p>
          </Reveal>
          <div className="lg:col-span-8">
            <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              {FAQ_ITEMS.map((item, i) => {
                const open = faqOpen === i;
                return (
                  <div key={item.q}>
                    <button
                      type="button"
                      onClick={() => setFaqOpen(open ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-scale-mist/50 sm:px-6"
                      aria-expanded={open}
                    >
                      <span className="font-semibold text-slate-900">{item.q}</span>
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-transform ${open ? "rotate-180 bg-scale-purple/10 text-scale-purple" : ""}`}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-4 text-sm leading-relaxed text-slate-600 sm:px-6">{item.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-scale-purple via-violet-600 to-scale-purple-deep py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
        <Reveal>
          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Your future self will thank you
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-violet-100">
              Set up your account in seconds — find internships, track applications,
              and start practicing today. Free for students.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <LoginLink
                callbackUrl="/"
                className="inline-flex items-center gap-3 rounded-2xl bg-white px-10 py-4 text-sm font-bold text-scale-purple shadow-xl transition-all hover:bg-scale-mist hover:shadow-2xl active:scale-[0.98]"
              >
                <GoogleIcon />
                Get started free
              </LoginLink>
              <LoginLink
                callbackUrl="/"
                label="Sign in"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/80 bg-transparent px-10 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-white/10 active:scale-[0.98]"
              />
            </div>
          </div>
        </Reveal>
      </section>
      </main>
    </div>
  );
}
