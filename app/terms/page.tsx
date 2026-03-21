import Link from "next/link";

export const metadata = {
  title: "Terms – Rethinkjobs",
  description: "Terms of use for Rethinkjobs.",
};

export default function TermsPage() {
  return (
    <div className="min-h-0 flex-1 flex flex-col bg-slate-50">
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <Link
            href="/"
            className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors"
          >
            ← Rethinkjobs
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Terms of use</h1>
        <p className="text-slate-600 text-sm leading-relaxed mb-4">
          This is a placeholder terms page. Replace with counsel-approved terms before
          production. Typical sections include: acceptable use, account
          responsibilities, subscription and billing (e.g. Stripe), disclaimers, and
          limitation of liability.
        </p>
        <p className="text-sm text-slate-500">
          Questions?{" "}
          <Link href="/contact" className="text-blue-600 hover:underline">
            Contact us
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
