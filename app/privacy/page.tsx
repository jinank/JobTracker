import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Privacy policy for student internship accounts",
  description: "How SuperInterns handles your data, Gmail access, and account information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="min-h-0 flex-1 flex flex-col bg-slate-50">
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <Link
            href="/"
            className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors"
          >
            ← SuperInterns
          </Link>
        </div>
      </header>
      <main id="main-content" className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-4">
          <p>
            This is a placeholder privacy policy. Update with your legal text
            before launch. SuperInterns connects to your Google account to read Gmail
            messages related to job applications only (read-only). We do not send email on
            your behalf.
          </p>
        </div>
      </main>
    </div>
  );
}
