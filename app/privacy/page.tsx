import Link from "next/link";

export const metadata = {
  title: "Privacy – Rethinkjobs",
  description: "How Rethinkjobs handles your data.",
};

export default function PrivacyPage() {
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
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Privacy policy</h1>
        <p className="text-slate-600 text-sm leading-relaxed mb-4">
          This is a placeholder privacy policy. Replace with your final legal text
          before launch. Rethinkjobs connects to your Google account to read Gmail
          (read-only scope) for job-related messages, stores derived application data
          in your database, and may use third-party APIs (e.g. OpenAI) for
          classification as described in your product.
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
          <li>What data you collect and why</li>
          <li>How users can export or delete data</li>
          <li>Subprocessors and regions</li>
          <li>Contact for privacy requests</li>
        </ul>
        <p className="text-sm text-slate-500 mt-8">
          <Link href="/contact" className="text-blue-600 hover:underline">
            Contact us
          </Link>{" "}
          for privacy questions.
        </p>
      </main>
    </div>
  );
}
