"use client";

import { useSession, signIn } from "next-auth/react";
import { Dashboard } from "@/components/Dashboard";

/* ── Shared ── */

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
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

/* ── Landing Page ── */

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-900">Rethinkjobs</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Pricing</a>
            <button
              onClick={() => signIn("google")}
              className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>
          </div>
          <button
            onClick={() => signIn("google")}
            className="md:hidden px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-white to-white" />
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-blue-600 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full mb-6">
              AI-Powered Job Tracking
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
              One Sync. All Applications.{" "}
              <span className="text-blue-600">Zero Manual Work.</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Rethinkjobs connects to your Gmail, detects every job-related email, and
              automatically builds a pipeline of your applications -- powered by AI
              classification.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => signIn("google")}
                className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25"
              >
                <GoogleIcon />
                Get Started Free
              </button>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                Learn More
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Mock Dashboard */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs text-slate-400">rethinkjobs.com/dashboard</span>
              </div>
              <div className="flex gap-0.5 mb-5 h-4 rounded-full overflow-hidden bg-slate-100">
                <div className="bg-blue-500 w-[38%] rounded-l-full" />
                <div className="bg-amber-400 w-[16%]" />
                <div className="bg-purple-500 w-[22%]" />
                <div className="bg-emerald-500 w-[12%]" />
                <div className="bg-slate-300 w-[12%] rounded-r-full" />
              </div>
              <div className="space-y-2.5">
                {[
                  { company: "Google", role: "Senior Software Engineer", status: "Interviewing", color: "bg-purple-50 text-purple-600" },
                  { company: "Stripe", role: "Full Stack Developer", status: "Applied", color: "bg-blue-50 text-blue-600" },
                  { company: "Shopify", role: "Frontend Engineer", status: "Assessment", color: "bg-amber-50 text-amber-600" },
                  { company: "Netflix", role: "Platform Engineer", status: "Offer", color: "bg-emerald-50 text-emerald-600" },
                ].map((r) => (
                  <div key={r.company} className="flex items-center justify-between rounded-xl px-4 py-3 bg-slate-50 border border-slate-100">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{r.company}</p>
                      <p className="text-xs text-slate-400">{r.role}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${r.color}`}>{r.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Value Prop Cards ── */}
      <section id="features" className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Build Your Job Search Pipeline
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Rethinkjobs is a tracking platform made for every job seeker. Connect once,
              and your entire application history is organized automatically.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                ),
                title: "Full Gmail Sync",
                desc: "Automatically scans your inbox for job-related emails. Read-only, privacy-first.",
                color: "bg-blue-50 text-blue-600",
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                ),
                title: "AI Classification",
                desc: "Extracts company, role, status, recruiter, and deadlines from every email.",
                color: "bg-purple-50 text-purple-600",
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                ),
                title: "Pipeline Dashboard",
                desc: "Visual overview: Applied, Assessment, Interviewing, Offer -- all in one place.",
                color: "bg-emerald-50 text-emerald-600",
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
                title: "Timeline & Deadlines",
                desc: "Never miss a follow-up. Track every event, recruiter contact, and deadline.",
                color: "bg-amber-50 text-amber-600",
              },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card hover:shadow-card-hover hover:border-slate-300 transition-all">
                <div className={`w-11 h-11 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    {f.icon}
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Three steps to organized job hunting
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Create Your Account",
                desc: "Sign in with Google and grant read-only Gmail access. Instantly unlock your full application history.",
              },
              {
                step: "2",
                title: "AI Scans & Classifies",
                desc: "Our AI reads every job email and extracts the company, role, status, and deadlines into structured data.",
              },
              {
                step: "3",
                title: "Track Your Pipeline",
                desc: "View, filter, search, and manage all your applications from one clean dashboard. Never lose track again.",
              },
            ].map((s) => (
              <div key={s.step} className="bg-white rounded-2xl border border-slate-200/80 p-7 shadow-card hover:shadow-card-hover transition-all">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-bold mb-5 shadow-sm">
                  {s.step}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href="#pricing" className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
              Learn More
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── Why Rethinkjobs ── */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Why Rethinkjobs?
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              A platform designed with job seekers in mind
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Job Seekers */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-7 shadow-card">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-900">For Job Seekers</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Free to start, no credit card needed",
                  "Track up to 50 applications free",
                  "AI-powered email classification",
                  "Search, filter, and sort applications",
                  "Edit status if AI gets it wrong",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <CheckIcon className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            {/* Pro */}
            <div className="bg-white rounded-2xl border-2 border-blue-500 p-7 shadow-sm relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                Pro
              </div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-900">For Power Users</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Unlimited application tracking",
                  "Unlimited Gmail syncs",
                  "Full pipeline dashboard",
                  "Timeline & deadline tracking",
                  "Priority support",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <CheckIcon className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">
              Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Start free. Upgrade when you need unlimited tracking.
            </p>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Free */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm hover:shadow-md transition-all">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-1">Free</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-bold text-slate-900">$0</span>
                <span className="text-sm text-slate-400">forever</span>
              </div>
              <p className="text-sm text-slate-400 mb-6">Perfect for getting started</p>
              <ul className="space-y-3 mb-8">
                {[
                  "Track up to 50 applications",
                  "AI email classification",
                  "Pipeline dashboard",
                  "Edit & manage applications",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => signIn("google")}
                className="w-full py-3 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors"
              >
                Get Started Free
              </button>
            </div>

            {/* Student */}
            <div className="bg-white rounded-2xl border border-emerald-200/80 p-8 relative shadow-card hover:shadow-card-hover transition-all">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                Students
              </div>
              <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wide mb-1">Student</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-bold text-slate-900">Free</span>
              </div>
              <p className="text-sm text-slate-400 mb-6">Verify your student status</p>
              <ul className="space-y-3 mb-8">
                {[
                  "Unlimited applications",
                  "Unlimited Gmail syncs",
                  "AI email classification",
                  "Full pipeline dashboard",
                  "Timeline & deadline tracking",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => signIn("google")}
                className="w-full py-3 rounded-full bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
              >
                Verify & Get Free Access
              </button>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-2xl border-2 border-blue-500 p-8 relative shadow-card hover:shadow-card-hover transition-all">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                Most Popular
              </div>
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-1">Professional</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-bold text-slate-900">$9.99</span>
                <span className="text-sm text-slate-400">/month</span>
              </div>
              <p className="text-sm text-slate-400 mb-6">For serious job seekers</p>
              <ul className="space-y-3 mb-8">
                {[
                  "Unlimited applications",
                  "Unlimited Gmail syncs",
                  "AI email classification",
                  "Full pipeline dashboard",
                  "Timeline & deadline tracking",
                  "Priority support",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => signIn("google")}
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                Start Pro
              </button>
              <p className="text-xs text-slate-400 mt-3 text-center">
                Cancel anytime. Secure payment via Stripe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission / CTA Banner ── */}
      <section className="bg-blue-600 py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Start Tracking. Stay Organized. Land the Job.
          </h2>
          <p className="text-lg text-blue-100 mb-10 max-w-xl mx-auto">
            Free for students. $9.99/month for professionals. No surprises.
          </p>
          <button
            onClick={() => signIn("google")}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-blue-700 text-sm font-semibold hover:bg-blue-50 transition-all shadow-lg"
          >
            <GoogleIcon />
            Get Started
          </button>
        </div>
      </section>

      {/* ── Scrolling Ticker ── */}
      <div className="bg-blue-700 py-3 overflow-hidden">
        <div className="flex animate-[scroll_20s_linear_infinite] whitespace-nowrap gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-6 shrink-0">
              {[
                "Free for Students",
                "$9.99/mo Professional",
                "AI Classification",
                "Gmail Sync",
                "Pipeline Dashboard",
                "Timeline Tracking",
                "Edit Any Status",
                "Search & Filter",
                "Date Range Filters",
                "Secure & Private",
              ].map((t) => (
                <span key={`${i}-${t}`} className="text-xs font-medium text-blue-100 px-4 py-1 rounded-full border border-blue-500/40 bg-blue-600/50">
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-slate-200 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <span className="text-sm font-bold text-slate-900">Rethinkjobs</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">How It Works</a>
              <a href="#pricing" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Pricing</a>
            </div>
            <p className="text-xs text-slate-400">
              &copy; {new Date().getFullYear()} Rethinkjobs. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Root Page ── */

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <LandingPage />;
  }

  return <Dashboard />;
}
