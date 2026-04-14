import Link from "next/link";

export const metadata = {
  title: "Contact Us – Rethinkjobs",
  description:
    "Contact support at info.rethinksoft@gmail.com if you have any issues.",
};

export default function ContactUsPage() {
  return (
    <div className="min-h-0 flex-1 flex flex-col bg-slate-50">
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors"
          >
            ← Rethinkjobs
          </Link>
          <Link
            href="/pricing"
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Buy Premium
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Contact Us</h1>
        <p className="text-slate-600 text-sm mb-8">
          If any student or user has an issue, you can reach us by email and we&apos;ll
          get back to you as soon as possible.
        </p>

        <div className="bg-white rounded-xl border border-slate-200/80 shadow-card p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Email
            </h2>
            <a
              href="mailto:info.rethinksoft@gmail.com"
              className="text-blue-600 font-medium hover:text-blue-700 text-lg"
            >
              info.rethinksoft@gmail.com
            </a>
            <p className="text-xs text-slate-500 mt-2">
              Please include screenshots (if relevant) and the email you use to sign in.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Billing &amp; Premium
            </h2>
            <p className="text-sm text-slate-600 mb-3">
              For plan changes or receipts, visit pricing or reply from your account email.
            </p>
            <Link
              href="/pricing"
              className="inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View plans →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

