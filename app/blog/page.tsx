import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Job search tips, internship advice, and product updates from RethinkJobs—the AI job application tracker built for students and professionals.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "RethinkJobs Blog — Job search & internship tips",
    description:
      "Guides and updates to help you track job applications and run a smarter internship search.",
    url: "/blog",
    siteName: "RethinkJobs",
    type: "website",
  },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-scale-purple transition-colors"
          >
            <LogoMark className="h-8 w-8" iconClassName="w-4 h-4" />
            RethinkJobs
          </Link>
          <nav className="flex gap-4 text-xs font-medium text-slate-600" aria-label="Blog navigation">
            <Link href="/#features" className="hover:text-slate-900">
              Features
            </Link>
            <Link href="/pricing" className="hover:text-slate-900">
              Pricing
            </Link>
          </nav>
        </div>
      </header>
      <main id="main-content" className="flex-1 mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <article>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Blog</h1>
          <p className="mt-4 text-slate-600 leading-relaxed">
            We&apos;re preparing articles on how to{" "}
            <strong className="font-semibold text-slate-800">track job applications</strong>, use an{" "}
            <strong className="font-semibold text-slate-800">AI job search tool</strong> responsibly, and
            run a structured <strong className="font-semibold text-slate-800">internship search</strong>.
            Check back soon, or{" "}
            <Link href="/" className="font-semibold text-scale-purple hover:underline">
              start organizing your pipeline with RethinkJobs
            </Link>
            .
          </p>
          <ul className="mt-8 space-y-4 text-sm text-slate-600">
            <li className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Coming soon
              </span>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                How to track job applications without a spreadsheet
              </h2>
            </li>
            <li className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Coming soon
              </span>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                Internship tracker checklist for campus recruiting season
              </h2>
            </li>
          </ul>
        </article>
      </main>
    </div>
  );
}
