import Link from "next/link";
import { StudentDealsExplorer } from "@/components/StudentDealsExplorer";
import { LogoMark } from "@/components/LogoMark";

export default function ResourcesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-scale-purple transition-colors"
          >
            <LogoMark className="h-8 w-8" iconClassName="w-4 h-4" />
            Rethinkjobs
          </Link>
          <nav className="flex items-center gap-4 text-xs font-medium text-slate-600">
            <Link href="/pricing" className="hover:text-slate-900 transition-colors">
              Pricing
            </Link>
            <Link
              href="/"
              className="rounded-lg bg-scale-purple px-3 py-1.5 text-white hover:bg-scale-purple-dark transition-colors"
            >
              Home
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <StudentDealsExplorer />
      </main>
    </div>
  );
}
