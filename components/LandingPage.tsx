"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { LoginLink } from "@/components/LoginLink";
import { SiteNavMarketing } from "@/components/SiteNav";

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

/** Hand-drawn squiggle under a hero word — the one playful flourish. */
function Squiggle() {
  return (
    <svg
      className="absolute -bottom-2 left-0 h-3 w-full text-scale-purple/70"
      viewBox="0 0 220 12"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
    >
      <path
        d="M3 9c18-7 36-7 54 0s36 7 54 0 36-7 54 0 36 7 52 0"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Faux browser window with a live-looking pipeline — honest preview of the dashboard. */
function ProductWindow() {
  const rows = [
    { letter: "G", grad: "from-blue-500 to-blue-600", company: "Google", role: "STEP Intern, Summer 2027", status: "Interviewing", chip: "bg-violet-100 text-violet-700", when: "2h ago" },
    { letter: "F", grad: "from-rose-500 to-orange-500", company: "Figma", role: "Product Design Intern", status: "Offer 🎉", chip: "bg-emerald-100 text-emerald-700", when: "1d ago" },
    { letter: "S", grad: "from-indigo-500 to-violet-600", company: "Stripe", role: "Software Engineer Intern", status: "Assessment", chip: "bg-amber-100 text-amber-800", when: "3d ago" },
    { letter: "N", grad: "from-slate-700 to-slate-900", company: "Notion", role: "Growth Marketing Intern", status: "Applied", chip: "bg-blue-100 text-blue-700", when: "4d ago" },
  ];
  return (
    <div className="landing-pipeline-glow overflow-hidden rounded-3xl border border-slate-200/80 bg-white">
      {/* Window chrome */}
      <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/80 px-4 py-3">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        </div>
        <div className="mx-auto flex w-full max-w-xs items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-1 text-[11px] text-slate-400 ring-1 ring-slate-200/80">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          rethinkjobs.com
        </div>
        <div className="w-10" aria-hidden />
      </div>

      <div className="p-5 sm:p-7">
        {/* Stage summary chips */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {[
            ["Applied", "24", "bg-blue-50 text-blue-700 ring-blue-100"],
            ["Assessment", "6", "bg-amber-50 text-amber-800 ring-amber-100"],
            ["Interview", "4", "bg-violet-50 text-violet-700 ring-violet-100"],
            ["Offer", "1", "bg-emerald-50 text-emerald-700 ring-emerald-100"],
          ].map(([label, n, cls]) => (
            <span key={label} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${cls}`}>
              {label}
              <span className="font-extrabold">{n}</span>
            </span>
          ))}
          <span className="ml-auto hidden items-center gap-1 rounded-full bg-scale-purple/10 px-3 py-1.5 text-xs font-bold text-scale-purple sm:inline-flex">
            +12 this week
          </span>
        </div>

        {/* Application rows */}
        <div className="space-y-2">
          {rows.map((r) => (
            <div
              key={r.company}
              className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-3.5 py-3 shadow-sm sm:gap-4 sm:px-4"
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${r.grad} text-sm font-bold text-white`} aria-hidden>
                {r.letter}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{r.company}</p>
                <p className="truncate text-xs text-slate-500">{r.role}</p>
              </div>
              <span className="hidden text-[11px] text-slate-400 sm:block">{r.when}</span>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${r.chip}`}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Recruiting-season journey, mapped to the four core tools. */
const TIMELINE = [
  {
    season: "Fall semester",
    title: "Find real openings",
    desc: "Browse US internships synced daily from company career pages — before the crowd finds them.",
    href: "/find-jobs",
    accent: "border-emerald-200 bg-emerald-50/60",
    dot: "bg-emerald-500",
    link: "text-emerald-700",
    label: "Find Internships",
  },
  {
    season: "Application season",
    title: "Apply & let it track itself",
    desc: "Connect Gmail once. Every confirmation, assessment, and interview invite lands in your pipeline automatically.",
    href: "/",
    accent: "border-scale-purple/20 bg-scale-lavender/60",
    dot: "bg-scale-purple",
    link: "text-scale-purple",
    label: "Track Applications",
  },
  {
    season: "Interview weeks",
    title: "Practice till it's boring",
    desc: "AI mock interviews tailored to the exact company and role. No scheduling, no judgment, unlimited retries.",
    href: "/practice-interviews",
    accent: "border-amber-200 bg-amber-50/60",
    dot: "bg-amber-500",
    link: "text-amber-700",
    label: "Interview Prep",
  },
  {
    season: "Crunch time",
    title: "Get a human on your side",
    desc: "Find recruiters and campus hiring contacts at any company — for advice, referrals, and real answers.",
    href: "/find-mentors",
    accent: "border-rose-200 bg-rose-50/60",
    dot: "bg-rose-500",
    link: "text-rose-600",
    label: "Find Mentors",
  },
];

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "Is it actually free for students?",
    a: "Yes. Verify your student status once and everything is unlocked — unlimited tracking, Gmail syncs, mock interviews, mentor search, and all the deals. No card, no trial that expires mid-semester.",
  },
  {
    q: "What does RethinkJobs do with my Gmail?",
    a: "We request minimal, read-only access and only look for job-related threads — confirmations, assessments, interview invites, offers. You can revoke access anytime from your Google account, and Gmail is optional to start.",
  },
  {
    q: "How is this different from LinkedIn or Handshake?",
    a: "Internship listings come straight from company career pages, not crowded job boards. And instead of you maintaining a spreadsheet, AI builds your pipeline from your own inbox.",
  },
  {
    q: "What if the AI gets a status wrong?",
    a: "Click and fix it. You can edit any application's company, role, or stage whenever the AI misreads something.",
  },
  {
    q: "I'm not a student — can I use it?",
    a: "Sure. The Free plan tracks up to 50 applications, and Professional unlocks unlimited everything for $9.99/month.",
  },
];

export function LandingPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <SiteNavMarketing />
      <main id="main-content">

      {/* ── Hero ───────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden landing-hero-mesh pb-16 pt-14 sm:pt-20"
        aria-labelledby="hero-heading"
      >
        <div className="pointer-events-none absolute inset-0 landing-hero-grid" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="landing-hero-stagger">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur-sm">
              🎓 Free for students — verify once, everything unlocked
            </p>
            <h1
              id="hero-heading"
              className="mx-auto mb-6 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl"
            >
              Your whole internship search,{" "}
              <span className="relative inline-block whitespace-nowrap text-hero-gradient">
                in one tab
                <Squiggle />
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Find real openings, track every application straight from Gmail, practice
              interviews with AI, and meet the people who can refer you. Close the other
              forty tabs.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <LoginLink
                callbackUrl="/"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-scale-purple px-8 py-4 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(107,70,254,0.3),0_12px_32px_-8px_rgba(107,70,254,0.45)] transition-all hover:bg-scale-purple-dark hover:shadow-lg active:scale-[0.98] sm:w-auto"
              >
                <GoogleIcon />
                Get started free
              </LoginLink>
              <Link
                href="/find-jobs"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-2xl border-2 border-slate-200/90 bg-white/90 px-8 py-4 text-sm font-semibold text-slate-700 backdrop-blur-sm transition-all hover:border-scale-purple/40 hover:bg-white sm:w-auto"
              >
                Browse internships
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
            <p className="mt-5 text-xs text-slate-500">
              No card · No trial countdown · Gmail optional
            </p>
          </div>
        </div>

        <div className="relative mx-auto mt-14 max-w-4xl px-4 sm:px-6">
          <Reveal>
            <ProductWindow />
          </Reveal>
        </div>
      </section>

      {/* ── Semester timeline ──────────────────────────────── */}
      <section className="py-20 lg:py-28" aria-labelledby="timeline-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-scale-purple">
                One school year, sorted
              </span>
              <h2 id="timeline-heading" className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                A tool for every part of the season
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                Recruiting season has phases. RethinkJobs is built around them.
              </p>
            </div>
          </Reveal>
          <ol className="relative grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.title} className="h-full">
                <li className={`flex h-full flex-col rounded-3xl border-2 p-6 ${t.accent}`}>
                  <div className="mb-4 flex items-center gap-2.5">
                    <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold text-white ${t.dot}`} aria-hidden>
                      {i + 1}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{t.season}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{t.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{t.desc}</p>
                  <Link href={t.href} className={`mt-5 inline-flex items-center gap-1 text-sm font-semibold ${t.link}`}>
                    {t.label}
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ol>
          <Reveal>
            <Link
              href="/resources"
              className="mt-5 flex flex-col items-center justify-between gap-3 rounded-3xl border-2 border-sky-200 bg-sky-50/60 px-6 py-5 text-center transition-colors hover:bg-sky-50 sm:flex-row sm:text-left"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">All year long</p>
                <p className="mt-1 text-sm text-slate-700">
                  <span className="font-bold text-slate-900">Student Resources:</span>{" "}
                  50+ discounts and free tools your student email unlocks — laptops to design software.
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-sky-700">
                Browse perks
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Bento grid ─────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-white via-scale-mist/60 to-white py-20 lg:py-28" aria-labelledby="bento-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-scale-purple">
                The toolkit
              </span>
              <h2 id="bento-heading" className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Five tools. Zero spreadsheets.
              </h2>
            </div>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Track — hero card */}
            <Reveal className="md:col-span-2 lg:row-span-2">
              <Link
                href="/"
                className="group flex h-full flex-col rounded-3xl border-2 border-slate-200/80 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-scale-purple/40 hover:shadow-scale-soft"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-scale-purple">Track Applications</p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">
                  Your inbox becomes your pipeline
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
                  Read-only Gmail sync. AI extracts the company, role, stage, and deadline
                  from every recruiter email — you just watch the board update.
                </p>
                <div className="mt-6 flex-1 space-y-2">
                  <div className="flex h-2.5 gap-1 overflow-hidden rounded-full bg-slate-100 p-0.5">
                    <div className="w-[42%] rounded-full bg-scale-purple" />
                    <div className="w-[20%] rounded-full bg-amber-400" />
                    <div className="w-[14%] rounded-full bg-violet-400" />
                    <div className="w-[10%] rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Datadog</p>
                      <p className="text-xs text-slate-500">SWE Intern · Final round Thursday</p>
                    </div>
                    <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-bold text-violet-700">Interviewing</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Duolingo</p>
                      <p className="text-xs text-slate-500">PM Intern · Assessment due in 2 days</p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800">Assessment</span>
                  </div>
                </div>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-scale-purple">
                  Open the tracker
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </Link>
            </Reveal>

            {/* Find internships */}
            <Reveal className="h-full">
              <Link
                href="/find-jobs"
                className="group flex h-full flex-col rounded-3xl border-2 border-slate-200/80 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-card-hover"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">Find Internships</p>
                <h3 className="mt-2 text-lg font-bold text-slate-900">Fresh roles, less competition</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  US internships synced daily from Greenhouse and Lever career pages.
                </p>
                <div className="mt-4 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between rounded-xl bg-emerald-50/70 px-3 py-2">
                    <span className="font-semibold text-slate-800">Anthropic · Research Intern</span>
                    <span className="font-bold text-emerald-700">New</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-emerald-50/70 px-3 py-2">
                    <span className="font-semibold text-slate-800">Ramp · Data Intern</span>
                    <span className="text-slate-400">2d</span>
                  </div>
                </div>
              </Link>
            </Reveal>

            {/* Interview prep */}
            <Reveal className="h-full">
              <Link
                href="/practice-interviews"
                className="group flex h-full flex-col rounded-3xl border-2 border-slate-200/80 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-card-hover"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-amber-600">Interview Prep</p>
                <h3 className="mt-2 text-lg font-bold text-slate-900">Rehearse with AI</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  Company-specific mock interviews — behavioral, technical, case.
                </p>
                <div className="mt-4 rounded-2xl bg-amber-50/80 px-4 py-3 text-xs italic leading-relaxed text-slate-700">
                  “Tell me about a time you shipped something under a deadline…”
                </div>
              </Link>
            </Reveal>

            {/* Mentors */}
            <Reveal className="h-full">
              <Link
                href="/find-mentors"
                className="group flex h-full flex-col rounded-3xl border-2 border-slate-200/80 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-rose-300 hover:shadow-card-hover"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-rose-600">Find Mentors</p>
                <h3 className="mt-2 text-lg font-bold text-slate-900">Referrals beat portals</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  Recruiters and campus hiring contacts at any company, ready for a coffee chat.
                </p>
                <div className="mt-4 flex -space-x-2" aria-hidden>
                  {["bg-rose-400", "bg-violet-400", "bg-emerald-400", "bg-amber-400"].map((c, i) => (
                    <span key={i} className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white ${c}`}>
                      {["AK", "JL", "MR", "+9"][i]}
                    </span>
                  ))}
                </div>
              </Link>
            </Reveal>

            {/* Resources */}
            <Reveal className="h-full">
              <Link
                href="/resources"
                className="group flex h-full flex-col rounded-3xl border-2 border-slate-200/80 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-card-hover"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-sky-600">Student Resources</p>
                <h3 className="mt-2 text-lg font-bold text-slate-900">Your .edu email is a coupon</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  50+ curated student discounts and free tools, all in one list.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5 text-[11px] font-semibold">
                  <span className="rounded-full bg-sky-50 px-2.5 py-1 text-sky-700 ring-1 ring-sky-100">GitHub Pack</span>
                  <span className="rounded-full bg-sky-50 px-2.5 py-1 text-sky-700 ring-1 ring-sky-100">Figma free</span>
                  <span className="rounded-full bg-sky-50 px-2.5 py-1 text-sky-700 ring-1 ring-sky-100">Notion free</span>
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Free means free ────────────────────────────────── */}
      <section id="pricing" className="py-20 lg:py-28" aria-labelledby="pricing-heading">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal>
            <div className="rounded-[2rem] border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/80 via-white to-scale-mist p-8 sm:p-12">
              <div className="text-center">
                <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                  Pricing
                </span>
                <h2 id="pricing-heading" className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  Students never pay. That&apos;s the pricing page.
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
                  Verify your student status once — unlimited everything, free forever.
                  No card, no countdown.
                </p>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { name: "Student", price: "Free", note: "Unlimited everything with verification", highlight: true },
                  { name: "Free", price: "$0", note: "Up to 50 tracked applications", highlight: false },
                  { name: "Pro", price: "$9.99/mo", note: "Unlimited, for non-students", highlight: false },
                ].map((p) => (
                  <div
                    key={p.name}
                    className={`rounded-2xl border-2 bg-white p-5 text-center ${
                      p.highlight ? "border-emerald-400 shadow-[0_8px_30px_-8px_rgba(16,185,129,0.3)]" : "border-slate-200/80"
                    }`}
                  >
                    <p className={`text-xs font-bold uppercase tracking-wide ${p.highlight ? "text-emerald-700" : "text-slate-400"}`}>
                      {p.name}
                    </p>
                    <p className="mt-2 text-2xl font-extrabold text-slate-900">{p.price}</p>
                    <p className="mt-1 text-xs text-slate-500">{p.note}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <LoginLink
                  callbackUrl="/"
                  label="Verify & get everything free"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 sm:w-auto"
                />
                <Link
                  href="/pricing"
                  className="text-sm font-semibold text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline"
                >
                  Compare plans in detail
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section id="faq" className="pb-20 lg:pb-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Questions students actually ask
            </h2>
            <p className="mt-4 text-slate-600">
              Something else on your mind?{" "}
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

      {/* ── Final CTA ──────────────────────────────────────── */}
      <section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-scale-purple via-violet-600 to-scale-purple-deep px-6 py-16 text-center sm:px-12">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_50%)]" aria-hidden />
              <div className="relative">
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  This semester&apos;s the one.
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-violet-100">
                  Set up in under a minute. Free for students, forever.
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
            </div>
          </Reveal>
        </div>
      </section>

      </main>
    </div>
  );
}
