import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { getSupportEmail } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "Contact SuperInterns support for internship help",
  description:
    "Contact SuperInterns support for help with accounts, billing, internships, and student verification.",
  path: "/contact-us",
});
export default function ContactUsPage({
  searchParams,
}: {
  searchParams?: { plan?: string };
}) {
  const supportEmail = getSupportEmail();
  const isPremiumInquiry = searchParams?.plan === "premium";
  return (
    <div className="min-h-0 flex-1 flex flex-col bg-slate-50">
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors"
          >
            ← SuperInterns
          </Link>
          <Link
            href="/pricing"
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Buy Premium
          </Link>
        </div>
      </header>

      <main id="main-content" className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Contact Us</h1>
        {isPremiumInquiry ? (
          <div className="mb-6 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-900">
            <p className="font-semibold">Premium package ($49 one-time)</p>
            <p className="mt-1 text-violet-800">
              Includes 100 internship applications on your behalf and a free portfolio website.
              Email us with your target roles and we&apos;ll get you started.
            </p>
          </div>
        ) : null}
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
              href={`mailto:${supportEmail}`}
              className="text-blue-600 font-medium hover:text-blue-700 text-lg"
            >
              {supportEmail}
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

