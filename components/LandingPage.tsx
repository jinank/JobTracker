"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { LoginLink } from "@/components/LoginLink";
import {
  HeroVisuals,
  ScrollProgress,
  ScrollReveal,
  useScrollParallax,
} from "@/components/landing/LandingMotion";
import { LandingInternshipsSection } from "@/components/LandingInternshipsSection";
import { LandingReferEarnSection } from "@/components/LandingReferEarnSection";
import { SiteNavMarketing } from "@/components/SiteNav";
import { MarketingFaqJsonLd } from "@/components/seo/MarketingFaqJsonLd";
import { getBlogPostsNewestFirst } from "@/lib/blogPosts";
import { MARKETING_FAQ_ITEMS } from "@/lib/marketingFaq";
import { PRICING_PLANS } from "@/lib/pricingPlans";
import { CANONICAL_SITE_HOST } from "@/lib/site";

function SectionDivider() {
  return (
    <div className="py-8 sm:py-10">
      <ScrollReveal className="mx-auto max-w-6xl px-4 sm:px-6" duration={900}>
        <div
          className="h-px w-full bg-gradient-to-r from-transparent via-scale-purple/25 to-transparent"
          aria-hidden
        />
      </ScrollReveal>
    </div>
  );
}

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

function CheckIcon({ className = "h-4 w-4" }: { className?: string }) {
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

/** Faux browser window with a live-looking pipeline, honest preview of the dashboard. */
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
          {CANONICAL_SITE_HOST}
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

/* ── Tool deep-dive vignettes ─────────────────────────────── */

function VignetteFindJobs() {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">1,200+ open internships</span>
        <span className="text-xs text-slate-400">Synced today</span>
      </div>
      {[
        ["Anthropic", "Research Intern · San Francisco, CA", "New"],
        ["Ramp", "Data Science Intern · New York, NY", "1d"],
        ["Vercel", "Frontend Intern · Remote (US)", "2d"],
      ].map(([co, role, age]) => (
        <div key={co} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
          <div>
            <p className="text-sm font-semibold text-slate-900">{co}</p>
            <p className="text-xs text-slate-500">{role}</p>
          </div>
          <span className={`text-[11px] font-bold ${age === "New" ? "text-emerald-600" : "text-slate-400"}`}>{age}</span>
        </div>
      ))}
    </div>
  );
}

function VignetteTrack() {
  return (
    <div className="space-y-2.5">
      <div className="flex h-3 gap-1 overflow-hidden rounded-full bg-slate-100 p-0.5">
        <div className="w-[42%] rounded-full bg-scale-purple" />
        <div className="w-[20%] rounded-full bg-amber-400" />
        <div className="w-[14%] rounded-full bg-violet-400" />
        <div className="w-[10%] rounded-full bg-emerald-400" />
      </div>
      {[
        ["Datadog", "SWE Intern · Final round Thursday", "Interviewing", "bg-violet-100 text-violet-700"],
        ["Duolingo", "PM Intern · Assessment due in 2 days", "Assessment", "bg-amber-100 text-amber-800"],
        ["Spotify", "Backend Intern · Recruiter replied", "Applied", "bg-blue-100 text-blue-700"],
      ].map(([co, role, status, chip]) => (
        <div key={co} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
          <div>
            <p className="text-sm font-semibold text-slate-900">{co}</p>
            <p className="text-xs text-slate-500">{role}</p>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${chip}`}>{status}</span>
        </div>
      ))}
    </div>
  );
}

function VignetteInterview() {
  return (
    <div className="space-y-3">
      <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 shadow-sm ring-1 ring-slate-100">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-amber-600">AI Interviewer · Google · SWE</p>
        “Tell me about a time you had to ship something with an unrealistic deadline. What did you cut, and why?”
      </div>
      <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-amber-500/90 px-4 py-3 text-sm leading-relaxed text-white shadow-sm">
        “In my robotics club we had two weeks to demo, so I scoped the controller down to…”
      </div>
      <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-white px-4 py-3 text-xs leading-relaxed text-slate-600 shadow-sm ring-1 ring-slate-100">
        <span className="font-bold text-emerald-600">Good structure.</span> Try quantifying the result, what did the demo win you?
      </div>
    </div>
  );
}

function VignetteMentors() {
  return (
    <div className="space-y-2">
      {[
        ["AK", "from-rose-500 to-rose-600", "Alicia K.", "University Recruiter · Stripe"],
        ["JM", "from-violet-500 to-violet-600", "Jordan M.", "Campus Hiring Lead · Figma"],
        ["RT", "from-emerald-500 to-emerald-600", "Ravi T.", "Talent Partner · Notion"],
      ].map(([init, grad, name, title]) => (
        <div key={name} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${grad} text-xs font-bold text-white`} aria-hidden>
            {init}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">{name}</p>
            <p className="truncate text-xs text-slate-500">{title}</p>
          </div>
          <span className="rounded-lg bg-[#0A66C2] px-3 py-1.5 text-[11px] font-bold text-white">Connect</span>
        </div>
      ))}
    </div>
  );
}

function VignetteResources() {
  return (
    <div className="flex flex-wrap gap-2">
      {[
        "GitHub Student Pack, free",
        "Figma Education, free",
        "Notion Plus, free",
        "JetBrains, free",
        "Spotify Premium, 50% off",
        "Adobe CC, 60% off",
        "AWS Educate, credits",
        "+ 40 more",
      ].map((d) => (
        <span key={d} className="rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-sky-800 shadow-sm ring-1 ring-sky-100">
          {d}
        </span>
      ))}
    </div>
  );
}

/* ── Page data ────────────────────────────────────────────── */

const QUICK_FACTS: [string, string][] = [
  ["$4.99", "Starter Plan, core toolkit included"],
  ["Daily", "internship syncs from company career pages"],
  ["25+", "AI mock interviews by company & role"],
  ["50+", "student discounts & free tools"],
];

type ToolSection = {
  id: string;
  eyebrow: string;
  eyebrowColor: string;
  title: string;
  desc: string;
  bullets: string[];
  checkColor: string;
  href: string;
  linkLabel: string;
  linkColor: string;
  panelBg: string;
  vignette: ReactNode;
};

const TOOL_SECTIONS: ToolSection[] = [
  {
    id: "tool-find-internships",
    eyebrow: "Find Internships",
    eyebrowColor: "text-emerald-600",
    title: "Real openings, straight from company career pages",
    desc: "We sync US internships every day from employers' own job boards (Greenhouse and Lever), so you see real, current roles instead of expired reposts. Auto Apply submits on supported listings.",
    bullets: [
      "US-based internships, including US-eligible remote roles",
      "Filter by role category, work type, location, and date posted",
      "Software, product, design, data, marketing, and operations roles",
      "Auto Apply on supported listings, or open the company site",
    ],
    checkColor: "text-emerald-600",
    href: "/find-internships",
    linkLabel: "Browse internships",
    linkColor: "text-emerald-700",
    panelBg: "border-emerald-100 bg-emerald-50/60",
    vignette: <VignetteFindJobs />,
  },
  {
    id: "tool-track",
    eyebrow: "Track Applications",
    eyebrowColor: "text-scale-purple",
    title: "Your inbox becomes your pipeline, automatically",
    desc: "Connect Gmail once (read-only). AI scans for job-related threads and builds a live board with every application's company, role, stage, and deadline. No spreadsheet, no manual logging.",
    bullets: [
      "AI extracts company, role, status, recruiters, and deadlines",
      "Pipeline stages from applied to offer, with search, filters, and sorting",
      "Deadline reminders for assessments and expiring offers",
      "Weekly goals and a leaderboard to keep momentum during recruiting season",
      "Edit anything the AI gets wrong with one click",
    ],
    checkColor: "text-scale-purple",
    href: "/tracker",
    linkLabel: "Open the tracker",
    linkColor: "text-scale-purple",
    panelBg: "border-scale-purple/15 bg-scale-lavender/60",
    vignette: <VignetteTrack />,
  },
  {
    id: "tool-interviews",
    eyebrow: "Interview Prep",
    eyebrowColor: "text-amber-600",
    title: "Practice interviews until the real one feels easy",
    desc: "AI mock interviews tailored to the exact company and role you're chasing, behavioral, technical, and case formats. Practice at 2am in your dorm if you want; nobody's judging.",
    bullets: [
      "25+ interviews modeled on top companies' real formats",
      "Behavioral, technical, and role-specific question styles",
      "Instant feedback on your answers as you go",
      "Unlimited retries, repeat until your answers are second nature",
    ],
    checkColor: "text-amber-600",
    href: "/practice-interviews",
    linkLabel: "Start practicing",
    linkColor: "text-amber-700",
    panelBg: "border-amber-100 bg-amber-50/60",
    vignette: <VignetteInterview />,
  },
  {
    id: "tool-mentors",
    eyebrow: "Find Mentors",
    eyebrowColor: "text-rose-600",
    title: "Meet the people who can actually open doors",
    desc: "A referral or a fifteen-minute chat beats a hundred cold applications. Search any company and we'll surface recruiters, campus hiring teams, and people-team contacts you can reach on LinkedIn.",
    bullets: [
      "Search recruiters and hiring contacts at any company",
      "Campus recruiting and university-relations contacts highlighted",
      "One-click LinkedIn connect for advice, referrals, or coffee chats",
      "Outreach tips written for students, not sales reps",
    ],
    checkColor: "text-rose-600",
    href: "/find-mentors",
    linkLabel: "Find your people",
    linkColor: "text-rose-600",
    panelBg: "border-rose-100 bg-rose-50/60",
    vignette: <VignetteMentors />,
  },
  {
    id: "tool-resources",
    eyebrow: "Student Resources",
    eyebrowColor: "text-sky-600",
    title: "Your .edu email is worth hundreds of dollars",
    desc: "A curated, searchable list of 50+ student discounts and free tools, developer software, design apps, courses, and more. Plus free member perks launching soon: resume reviews, LinkedIn profile reviews, and headshots.",
    bullets: [
      "50+ verified student deals across software, courses, and services",
      "Filter by category, dev tools, design, productivity, learning",
      "Direct links to each provider's official student offer",
      "Free member resources launching soon (resume & LinkedIn reviews)",
    ],
    checkColor: "text-sky-600",
    href: "/resources",
    linkLabel: "Browse perks",
    linkColor: "text-sky-700",
    panelBg: "border-sky-100 bg-sky-50/60",
    vignette: <VignetteResources />,
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Create your account",
    desc: "Sign in with Google or email in seconds. Pick Starter, Pro, or Premium and start tracking applications right away.",
  },
  {
    step: "2",
    title: "Find roles & apply",
    desc: "Browse internships synced daily from company career pages. Apply yourself, or use Auto Apply on supported listings.",
  },
  {
    step: "3",
    title: "Let SuperInterns run the rest",
    desc: "Connect Gmail (read-only) and your pipeline tracks itself, while you prep interviews and message mentors from the same account.",
  },
];

const PRIVACY_POINTS = [
  {
    title: "Read-only Gmail access",
    desc: "We can read job-related threads to build your pipeline, we can never send, delete, or modify your email.",
  },
  {
    title: "Only job-search emails",
    desc: "Scanning targets application confirmations, assessments, interview invites, offers, and rejections. Your personal mail isn't what we're here for.",
  },
  {
    title: "Revoke anytime",
    desc: "Disconnect from your Google account settings in two clicks. Gmail is optional in the first place, you can use every other tool without it.",
  },
  {
    title: "You stay in control",
    desc: "Every AI-classified application can be edited or corrected. Your data powers your dashboard, governed by our privacy policy.",
  },
];

export function LandingPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const latestPosts = getBlogPostsNewestFirst().slice(0, 3);
  const productParallaxRef = useScrollParallax<HTMLDivElement>(0.12);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <ScrollProgress />
      <SiteNavMarketing />
      <main id="main-content">

      {/* ── Hero ───────────────────────────────────────────── */}
      <section
        id="hero"
        className="landing-section relative overflow-hidden landing-hero-mesh pb-8 pt-16 sm:pb-10 sm:pt-24"
        aria-labelledby="hero-heading"
      >
        <HeroVisuals />
        <div className="pointer-events-none absolute inset-0 landing-hero-grid" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="landing-hero-stagger">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-scale-purple/20 bg-white/70 px-4 py-1.5 text-xs font-semibold text-scale-purple shadow-sm backdrop-blur-sm sm:text-sm">
              Your Internships Search on Autopilot
            </span>
            <h1
              id="hero-heading"
              className="mx-auto max-w-3xl font-extrabold leading-[1.1] tracking-tight"
            >
              <span className="block whitespace-nowrap text-[clamp(1.25rem,4.8vw,2.5rem)] text-scale-purple">
                Internships on Auto Pilot
              </span>
              <span className="relative mt-1 inline-block whitespace-nowrap text-[clamp(1.25rem,4.8vw,2.5rem)] text-hero-gradient">
                Your internship search in one place
                <Squiggle />
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
              Find real Internships, track every application straight from Gmail, practice
              interviews, and meet the mentors who can refer you. 
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <LoginLink
                callbackUrl="/pricing"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-scale-purple px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-scale-purple-dark active:scale-[0.98] sm:w-auto"
              >
                <GoogleIcon />
                Get started
              </LoginLink>
              <Link
                href="#latest-internships"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
              >
                Browse internships
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
            <p className="mt-5 text-xs text-slate-400">
              Find from everywhere · Auto Apply · Track and Reach out to mentors
            </p>
          </div>
        </div>
      </section>

      <LandingInternshipsSection />

      <SectionDivider />

      {/* ── Tracker preview ─────────────────────────────────── */}
      <section className="landing-section pb-20 pt-4 sm:pb-24" aria-label="Application tracker preview">
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <ScrollReveal delay={100} direction="scale" duration={900}>
            <div ref={productParallaxRef}>
              <div className="landing-product-float">
                <ProductWindow />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* ── What is SuperInterns ─────────────────────── */}
      <section id="about" className="landing-section py-20 sm:py-24" aria-labelledby="about-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-scale-purple">
                What is SuperInterns?
              </span>
              <h2 id="about-heading" className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                One account for the entire internship hunt
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-500 sm:text-lg">
                SuperInterns is a student job-search hub that puts the whole process in one
                place: a daily-updated board of US internships, an AI tracker that builds
                your application pipeline from Gmail, mock interviews tailored to real
                companies, a mentor finder for referrals and advice, and a library of
                student discounts. Auto Apply on supported listings. Five tools, one
                login, start with Starter at $4.99/mo.
              </p>
            </div>
          </ScrollReveal>
          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-slate-200/70 bg-slate-200/70 lg:grid-cols-4">
            {QUICK_FACTS.map(([n, l], i) => (
              <ScrollReveal key={l} className="h-full" delay={i * 90} direction="scale">
                <div className="landing-stat-shine flex h-full flex-col bg-white p-7 text-center">
                  <p className="text-3xl font-bold tracking-tight text-scale-purple">{n}</p>
                  <p className="mt-2 text-sm leading-snug text-slate-500">{l}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── Tool deep-dives ────────────────────────────────── */}
      <section id="features" className="landing-section bg-slate-50/70 py-20 sm:py-24" aria-labelledby="features-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-scale-purple">
                The toolkit
              </span>
              <h2 id="features-heading" className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Five tools. Zero spreadsheets.
              </h2>
              <p className="mx-auto mt-4 text-base text-slate-500 sm:text-lg">
                Everything below is included with every account, here&apos;s exactly what
                each one does.
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-14 lg:space-y-20">
            {TOOL_SECTIONS.map((t, i) => (
              <ScrollReveal key={t.id} direction={i % 2 === 0 ? "left" : "right"} delay={80}>
                <div id={t.id} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
                  <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                    <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${t.eyebrowColor}`}>{t.eyebrow}</p>
                    <h3 className="mt-2.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.75rem]">
                      {t.title}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-slate-500">{t.desc}</p>
                    <ul className="mt-5 space-y-2.5">
                      {t.bullets.map((b) => (
                        <li key={b} className="flex gap-2.5 text-sm leading-snug text-slate-600">
                          <CheckIcon className={`mt-0.5 h-4 w-4 shrink-0 ${t.checkColor}`} />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href={t.href} className={`mt-6 inline-flex items-center gap-1 text-sm font-semibold ${t.linkColor}`}>
                      {t.linkLabel}
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                  <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                    <div className="landing-panel-hover rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm sm:p-7">
                      {t.vignette}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── How it works ───────────────────────────────────── */}
      <section id="how-it-works" className="landing-section py-20 sm:py-24" aria-labelledby="how-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="mb-14 text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-scale-purple">
                How it works
              </span>
              <h2 id="how-heading" className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Up and running in under a minute
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid gap-5 md:grid-cols-3">
            {HOW_IT_WORKS.map((s, i) => (
              <ScrollReveal key={s.step} className="h-full" delay={i * 120} direction="up">
                <div className="landing-panel-hover h-full rounded-3xl border border-slate-200/70 bg-white p-8">
                  <div
                    className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-scale-purple/10 text-base font-bold text-scale-purple"
                    aria-hidden
                  >
                    {s.step}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-slate-900">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── Privacy & trust ────────────────────────────────── */}
      <section id="privacy" className="landing-section bg-slate-50/70 py-20 sm:py-24" aria-labelledby="privacy-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <ScrollReveal className="lg:col-span-5" direction="left">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-scale-purple">
                Privacy
              </span>
              <h2 id="privacy-heading" className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Your inbox stays yours
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-500 sm:text-lg">
                The Gmail connection is the most personal thing you could hand a job-search
                tool, so the rules are strict and simple.
              </p>
              <Link href="/privacy" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-scale-purple hover:underline">
                Read the privacy policy
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </ScrollReveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {PRIVACY_POINTS.map((p, i) => (
                <ScrollReveal key={p.title} className="h-full" delay={i * 80} direction="scale">
                  <div className="landing-panel-hover h-full rounded-3xl border border-slate-200/70 bg-white p-6">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <CheckIcon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{p.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── Pricing ────────────────────────────────────────── */}
      <section id="pricing" className="landing-section py-20 sm:py-24" aria-labelledby="pricing-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal direction="scale">
            <div className="mx-auto mb-12 max-w-xl text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-scale-purple">
                Pricing
              </span>
              <h2 id="pricing-heading" className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Simple plans for your internship search
              </h2>
              <p className="mx-auto mt-4 text-base text-slate-500 sm:text-lg">
                Start with Starter at $4.99/mo. Pro and Premium add unlimited tracking and
                100 Auto Apply applications.{" "}
                <Link href="/pricing" className="font-semibold text-scale-purple hover:underline">
                  Full comparison
                </Link>
                .
              </p>
            </div>
          </ScrollReveal>
          <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {PRICING_PLANS.map((p, i) => (
              <ScrollReveal key={p.id} className="h-full" delay={i * 100} direction="up">
                <article
                  className={`landing-panel-hover flex h-full flex-col rounded-3xl bg-white p-7 ${
                    p.highlight
                      ? "border-2 border-scale-purple shadow-sm"
                      : "border border-slate-200/70"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                      {p.name}
                    </h3>
                    {p.badge && (
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
                          p.highlight
                            ? "bg-scale-purple text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-baseline gap-1.5">
                    <span className="text-4xl font-bold tabular-nums text-slate-900">{p.price}</span>
                    <span className="text-sm text-slate-500">{p.cadence}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{p.note}</p>
                  <ul className="mt-6 flex-1 space-y-2.5 border-t border-slate-100 pt-6">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2.5 text-sm leading-snug text-slate-600">
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-scale-purple" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  {p.href ? (
                    <Link
                      href={p.href}
                      className={`mt-7 block w-full rounded-xl py-3 text-center text-sm font-semibold transition-colors ${
                        p.highlight
                          ? "bg-scale-purple text-white hover:bg-scale-purple-dark"
                          : "border border-slate-200 bg-white text-slate-800 hover:border-scale-purple/35 hover:bg-slate-50"
                      }`}
                    >
                      {p.cta}
                    </Link>
                  ) : (
                    <LoginLink
                      callbackUrl="/pricing"
                      label={p.cta}
                      className={`mt-7 block w-full rounded-xl py-3 text-center text-sm font-semibold transition-colors ${
                        p.highlight
                          ? "bg-scale-purple text-white hover:bg-scale-purple-dark"
                          : "border border-slate-200 bg-white text-slate-800 hover:border-scale-purple/35 hover:bg-slate-50"
                      }`}
                    />
                  )}
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      <LandingReferEarnSection />

      <SectionDivider />

      {/* ── Blog ─────────────────────────────────────────── */}
      <section id="blog" className="landing-section bg-slate-50/70 py-20 sm:py-24" aria-labelledby="blog-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-scale-purple">
                  Blog
                </span>
                <h2 id="blog-heading" className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Internship search guides
                </h2>
                <p className="mt-3 max-w-xl text-slate-500">
                  Tips on finding USA internships, tracking applications, and prepping for interviews.
                </p>
              </div>
              <Link
                href="/blog"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-scale-purple hover:underline"
              >
                View all articles
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </ScrollReveal>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {latestPosts.map((post, i) => (
              <ScrollReveal key={post.slug} className="h-full" delay={i * 100} direction="up">
                <article className="landing-panel-hover flex h-full flex-col rounded-2xl border border-slate-200/70 bg-white p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-scale-purple">
                    {post.category}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-slate-900">
                    <Link href={`/blog/${post.slug}`} className="hover:text-scale-purple hover:underline">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500 line-clamp-3">
                    {post.description}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-scale-purple hover:underline"
                  >
                    Read more
                  </Link>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section id="faq" className="landing-section py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Questions students actually ask
              </h2>
              <p className="mt-4 text-slate-500">
                Something else on your mind?{" "}
                <Link
                  href="/contact-us"
                  className="font-semibold text-scale-purple hover:underline"
                >
                  Contact us
                </Link>
                .
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div className="divide-y divide-slate-200/80 rounded-2xl border border-slate-200/70 bg-white">
            {MARKETING_FAQ_ITEMS.map((item, i) => {
              const open = faqOpen === i;
              return (
                <div key={item.q}>
                  <button
                    type="button"
                    onClick={() => setFaqOpen(open ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50 sm:px-6"
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
          </ScrollReveal>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────── */}
      <section className="pb-20 sm:pb-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <ScrollReveal direction="scale" duration={900}>
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-scale-purple via-violet-600 to-scale-purple-deep px-6 py-16 text-center sm:px-12">
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_50%)]"
                aria-hidden
              />
              <div className="landing-orb landing-float-slow pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" aria-hidden />
              <div className="landing-orb landing-float pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-violet-300/20 blur-3xl" aria-hidden />
              <div className="relative">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  This semester&apos;s the one.
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-violet-100">
                  Set up in under a minute. Auto Apply on supported listings.
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <LoginLink
                    callbackUrl="/pricing"
                    className="inline-flex items-center gap-3 rounded-xl bg-white px-9 py-3.5 text-sm font-bold text-scale-purple shadow-lg transition-all hover:bg-scale-mist active:scale-[0.98]"
                  >
                    <GoogleIcon />
                    Get started
                  </LoginLink>
                  <LoginLink
                    callbackUrl="/pricing"
                    label="Sign in"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/70 bg-transparent px-9 py-3.5 text-sm font-bold text-white transition-all hover:bg-white/10 active:scale-[0.98]"
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      </main>
      <MarketingFaqJsonLd />
    </div>
  );
}
