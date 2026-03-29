"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";

const TICKER_LINES = [
  "Marcus Harper got 10 assestment in his first month",
  "Sam Ruiz closed 17 interviews in 3 months",
  "William Torres improved his daily applicated to 50 using Rethinkjobs",
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
    if (!el) return;
    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          ob.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`transition-all duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
        on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
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

function StarRow() {
  return (
    <div className="flex gap-0.5 text-amber-400" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const COMPARISON_ROWS: { feature: string; us: boolean; them: boolean }[] = [
  { feature: "Automatic Gmail sync (read-only)", us: true, them: false },
  { feature: "AI extracts company, role & status", us: true, them: false },
  { feature: "Pipeline dashboard & filters", us: true, them: false },
  { feature: "Timeline & deadline tracking", us: true, them: false },
  { feature: "Free tier for students", us: true, them: false },
  { feature: "Manual copy-paste from inbox", us: false, them: true },
];

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "What is Rethinkjobs?",
    a: "Rethinkjobs connects to your Gmail (read-only), finds job-related emails, and uses AI to build a structured pipeline of your applications—company, role, status, and more—so you never rely on a messy spreadsheet again.",
  },
  {
    q: "Is my email data secure?",
    a: "We request minimal Gmail scopes for reading job-related messages. Your data is used to power your dashboard and is handled according to our privacy policy. You can revoke access anytime from your Google account.",
  },
  {
    q: "Can I fix a wrong status?",
    a: "Yes. You can edit any application’s status and details if the AI misclassifies something.",
  },
  {
    q: "What’s the difference between Free, Student, and Pro?",
    a: "Free includes core tracking with limits. Verified students get unlimited tracking at no cost. Professional unlocks unlimited applications and syncs for serious job seekers at $9.99/month.",
  },
];

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="/" className="flex items-center gap-2">
            <LogoMark />
            <span className="text-lg font-bold tracking-tight text-slate-900">Rethinkjobs</span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-scale-purple"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-scale-purple"
            >
              How it works
            </a>
            <Link
              href="/pricing"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-scale-purple"
            >
              Pricing
            </Link>
            <a
              href="#faq"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-scale-purple"
            >
              FAQ
            </a>
            <button
              type="button"
              onClick={() => signIn("google")}
              className="rounded-xl bg-scale-purple px-5 py-2.5 text-sm font-semibold text-white shadow-scale-soft transition-all hover:bg-scale-purple-dark hover:shadow-lg active:scale-[0.98]"
            >
              Get started
            </button>
          </nav>
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => signIn("google")}
              className="rounded-xl bg-scale-purple px-3 py-2 text-xs font-semibold text-white"
            >
              Start
            </button>
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-label="Menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-lg border border-slate-200 p-2 text-slate-600"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {(
                [
                  ["#features", "Features", false],
                  ["#how-it-works", "How it works", false],
                  ["/pricing", "Pricing", true],
                  ["#faq", "FAQ", false],
                ] as const
              ).map(([href, label, isPage]) =>
                isPage ? (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-medium text-slate-700"
                  >
                    {label}
                  </Link>
                ) : (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-medium text-slate-700"
                  >
                    {label}
                  </a>
                )
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-12 sm:pb-24 sm:pt-16 lg:pb-28 lg:pt-20">
        <div
          className="pointer-events-none absolute -right-32 -top-24 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-fuchsia-200/80 via-scale-purple/25 to-violet-200/40 blur-3xl animate-gradient-drift"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-24 top-40 h-[320px] w-[320px] rounded-full bg-gradient-to-tr from-orange-100/90 via-pink-100/60 to-transparent blur-3xl animate-gradient-drift motion-reduce:animate-none"
          style={{ animationDelay: "-4s" }}
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <div className="landing-hero-stagger text-center lg:text-left">
            <span className="mb-5 inline-flex items-center rounded-full border border-orange-200/80 bg-gradient-to-r from-orange-50 to-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-orange-700 shadow-sm">
              For students &amp; new grads
            </span>
            <h1 className="mb-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem]">
              Track internships and job applications in one place.{" "}
              <span className="bg-gradient-to-r from-scale-purple to-violet-600 bg-clip-text text-transparent">
                Cold outreach on LinkedIn—and customized emails that don&apos;t feel generic.
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-slate-600 lg:mx-0">
              Rethinkjobs syncs Gmail, uses AI to sort recruiter mail into a live pipeline, and surfaces who to
              contact—so you spend less time digging through threads and more time on real outreach and follow-ups.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <button
                type="button"
                onClick={() => signIn("google")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-scale-purple px-8 py-4 text-sm font-semibold text-white shadow-scale-soft transition-all hover:bg-scale-purple-dark hover:shadow-lg active:scale-[0.98] sm:w-auto"
              >
                <GoogleIcon />
                Get started free
              </button>
              <a
                href="#how-it-works"
                className="inline-flex w-full items-center justify-center rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 text-sm font-semibold text-slate-700 transition-all hover:border-scale-purple/40 hover:bg-scale-mist sm:w-auto"
              >
                See how it works
              </a>
            </div>
            <p className="mt-5 text-xs text-slate-500">
              Free for verified students · Reach Out + pipeline · No card to start · Read-only Gmail
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">
            <div
              className="relative rounded-3xl border border-slate-200/80 bg-white/90 p-1 shadow-scale-soft backdrop-blur-sm animate-float-slow motion-reduce:animate-none"
              style={{ animationDelay: "-1s" }}
            >
              <div className="rounded-[1.35rem] bg-gradient-to-br from-scale-lavender/90 via-white to-slate-50 p-6 sm:p-8">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-scale-purple">100+ Job Applications</p>
                    <p className="text-2xl font-bold text-slate-900">Job Applications Tracker</p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-scale-purple/10">
                    <span className="text-lg font-bold text-scale-purple">92%</span>
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
        <div className="relative mx-auto mt-14 max-w-6xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-r from-scale-mist via-white to-scale-lavender/40 py-4 shadow-sm">
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

      {/* Big stat line */}
      <Reveal>
        <section className="border-y border-slate-100 bg-scale-mist/50 py-14">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <p className="text-xl font-semibold leading-snug text-slate-800 sm:text-2xl md:text-3xl">
              Built for people who send{" "}
              <span className="text-scale-purple">dozens of applications</span>—and refuse to lose track of a single
              reply.
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
                Seamless sync. Maximum clarity.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                Connect once. We handle classification, pipeline updates, and timelines—so your job search runs on
                autopilot.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Sign in with Google",
                desc: "Grant read-only Gmail access. Your applications appear in minutes—not hours of manual entry.",
              },
              {
                step: "2",
                title: "AI classifies every thread",
                desc: "Company, role, stage, and deadlines are extracted automatically from real recruiter mail.",
              },
              {
                step: "3",
                title: "Own your pipeline",
                desc: "Filter, search, sort, and edit. One dashboard for every application and follow-up.",
              },
            ].map((s, i) => (
              <Reveal key={s.step} className={i === 1 ? "md:mt-6" : i === 2 ? "md:mt-12" : ""}>
                <div className="group h-full rounded-3xl border border-slate-200/80 bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-scale-purple/25 hover:shadow-scale-soft">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-scale-purple to-violet-600 text-lg font-bold text-white shadow-lg shadow-scale-purple/30">
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

      {/* Comparison */}
      <section className="bg-scale-lavender/40 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="mb-12 text-center">
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-scale-purple">
                Comparison
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Rethinkjobs vs. the spreadsheet grind
              </h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-scale-soft">
              <div className="grid grid-cols-[1fr_minmax(0,120px)_minmax(0,120px)] gap-0 text-sm sm:grid-cols-[1fr_140px_140px]">
                <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-4 font-semibold text-slate-700 sm:px-6">
                  Capability
                </div>
                <div className="border-b border-slate-100 bg-scale-purple/10 px-2 py-4 text-center font-bold text-scale-purple sm:px-4">
                  Rethinkjobs
                </div>
                <div className="border-b border-slate-100 bg-slate-50 px-2 py-4 text-center font-semibold text-slate-500 sm:px-4">
                  Manual
                </div>
                {COMPARISON_ROWS.map((row) => (
                  <div key={row.feature} className="contents">
                    <div className="border-b border-slate-100 px-4 py-3.5 text-slate-700 sm:px-6">{row.feature}</div>
                    <div className="flex items-center justify-center border-b border-slate-100 bg-violet-50/50 py-3.5">
                      {row.us ? (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                          <CheckIcon className="h-4 w-4 text-white" />
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </div>
                    <div className="flex items-center justify-center border-b border-slate-100 py-3.5">
                      {row.them ? (
                        <span
                          className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800"
                          title="You handle this manually"
                        >
                          Yes
                        </span>
                      ) : (
                        <span className="text-lg font-bold text-rose-400">✕</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Feature grid */}
      <section id="features" className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-scale-purple">
                Product
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Everything you need to run a serious search
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                From first application to final offer—organized, searchable, and always up to date.
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
                desc: "Applied through offer—visual stages, filters, and date ranges at a glance.",
                path: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
              },
              {
                title: "Timeline & deadlines",
                desc: "Never miss a follow-up—every touchpoint in one chronological view.",
                path: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
              },
              {
                title: "Search & filters",
                desc: "Slice by status, company, role, or time window—however you think about the search.",
                path: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
              },
              {
                title: "Reach-out tools",
                desc: "Find hiring contacts when you’re ready to go beyond the application portal.",
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

      {/* Testimonials */}
      <section className="border-t border-slate-100 bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-scale-purple">
                Social proof
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Trusted by focused job seekers
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                Real workflows. Less chaos. More interviews.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                quote:
                  "I finally stopped maintaining a spreadsheet. Rethinkjobs pulls everything from Gmail and my pipeline is always current.",
                name: "Alex M.",
                role: "Software engineer",
              },
              {
                quote:
                  "The AI isn’t perfect, but editing a status beats hunting through thousands of emails. Huge time saver.",
                name: "Jordan K.",
                role: "Product manager",
              },
              {
                quote:
                  "Student verification was quick. Unlimited tracking for free is exactly what I needed during campus recruiting.",
                name: "Sam T.",
                role: "New grad",
              },
            ].map((t) => (
              <Reveal key={t.name}>
                <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-scale-mist/30 p-6 shadow-sm transition-all hover:shadow-md">
                  <StarRow />
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-700">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-slate-200/60 pt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-scale-purple to-violet-600 text-xs font-bold text-white">
                      {t.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics strip */}
      <Reveal>
        <section className="border-y border-slate-100 bg-gradient-to-r from-slate-900 via-slate-900 to-scale-purple-deep py-12 text-white">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 sm:grid-cols-4 sm:px-6">
            {[
              ["50+", "Apps tracked free"],
              ["1", "Gmail connection"],
              ["AI", "Smart classification"],
              ["24/7", "Your data, your view"],
            ].map(([n, l]) => (
              <div key={l} className="text-center">
                <p className="text-2xl font-extrabold sm:text-3xl">{n}</p>
                <p className="mt-1 text-xs text-white/70 sm:text-sm">{l}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Pricing */}
      <section id="pricing" className="bg-scale-lavender/30 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="mb-12 text-center sm:mb-14">
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-scale-purple">
                Pricing
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Simple, transparent pricing
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
                Start free. Upgrade when you need unlimited tracking.
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
                  {["Track up to 50 applications", "AI email classification", "Pipeline dashboard", "Edit & manage"].map(
                    (x) => (
                      <li key={x} className="flex gap-2.5 text-sm leading-snug text-slate-600">
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-scale-purple" />
                        <span>{x}</span>
                      </li>
                    )
                  )}
                </ul>
                <button
                  type="button"
                  onClick={() => signIn("google")}
                  className="mt-8 w-full rounded-xl border-2 border-slate-200 bg-white py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-scale-purple/35 hover:bg-scale-mist/80"
                >
                  Get started free
                </button>
              </article>
            </Reveal>

            {/* Student */}
            <Reveal className="min-w-0 lg:min-h-0">
              <article className="flex h-full flex-col rounded-2xl border-2 border-emerald-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:p-7">
                <div className="mb-4 flex min-h-[1.75rem] items-center justify-center">
                  <span className="rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                    Students
                  </span>
                </div>
                <h3 className="text-center text-xs font-bold uppercase tracking-[0.15em] text-emerald-700">Student</h3>
                <div className="mt-3 flex justify-center">
                  <span className="text-4xl font-extrabold tabular-nums text-slate-900 sm:text-5xl">Free</span>
                </div>
                <p className="mt-2 text-center text-sm text-slate-500">Verify your student status</p>
                <ul className="mt-6 flex-1 space-y-2.5 border-t border-emerald-100/80 pt-6">
                  {[
                    "Unlimited applications",
                    "Unlimited Gmail syncs",
                    "AI classification",
                    "Full pipeline & timeline",
                  ].map((x) => (
                    <li key={x} className="flex gap-2.5 text-sm leading-snug text-slate-600">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => signIn("google")}
                  className="mt-8 w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  Verify & get access
                </button>
              </article>
            </Reveal>

            {/* Pro */}
            <Reveal className="min-w-0 lg:min-h-0">
              <article className="flex h-full flex-col rounded-2xl border-2 border-scale-purple bg-gradient-to-b from-white to-scale-lavender/30 p-6 shadow-[0_8px_30px_-8px_rgba(107,70,254,0.25)] sm:p-7">
                <div className="mb-4 flex min-h-[1.75rem] items-center justify-center">
                  <span className="rounded-full bg-scale-purple px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                    Most popular
                  </span>
                </div>
                <h3 className="text-center text-xs font-bold uppercase tracking-[0.15em] text-scale-purple">Professional</h3>
                <div className="mt-3 flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-extrabold tabular-nums text-slate-900 sm:text-5xl">$9.99</span>
                  <span className="text-sm text-slate-500">/mo</span>
                </div>
                <p className="mt-2 text-center text-sm text-slate-500">For serious job seekers</p>
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
                <button
                  type="button"
                  onClick={() => signIn("google")}
                  className="mt-8 w-full rounded-xl bg-scale-purple py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-scale-purple-dark"
                >
                  Start Pro
                </button>
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
              <Link href="/contact" className="font-semibold text-scale-purple hover:underline">
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
              Ready to organize your job search?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-violet-100">
              Connect Gmail, sync once, and watch your pipeline build itself.
            </p>
            <button
              type="button"
              onClick={() => signIn("google")}
              className="mt-10 inline-flex items-center gap-3 rounded-2xl bg-white px-10 py-4 text-sm font-bold text-scale-purple shadow-xl transition-all hover:bg-scale-mist hover:shadow-2xl active:scale-[0.98]"
            >
              <GoogleIcon />
              Get started free
            </button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
