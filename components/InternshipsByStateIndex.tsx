import Link from "next/link";
import { SiteNavMarketing } from "@/components/SiteNav";
import {
  INTERNSHIP_CITY_LOCATION_PAGES,
  INTERNSHIP_STATE_LOCATION_PAGES,
} from "@/lib/internshipLocationPages";

function stateShortLabel(title: string): string {
  return title.replace(/ Summer 2027 Internships$/, "");
}

export function InternshipsByStateIndex() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteNavMarketing />
      <main id="main-content" className="flex-1">
        <section className="border-b border-slate-200/80 bg-slate-50/80">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
            <p className="text-sm font-semibold text-emerald-600">Summer 2027 · US internships</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Internships by state and city
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
              Browse summer 2027 internships by location. Each page lists roles synced from company
              career pages in that state or metro area.
            </p>
            <Link
              href="/find-internships"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-scale-purple px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-scale-purple-dark"
            >
              Browse all internships
            </Link>
          </div>
        </section>

        <section className="py-10 sm:py-12" aria-labelledby="states-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 id="states-heading" className="text-xl font-bold text-slate-900">
              By state
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {INTERNSHIP_STATE_LOCATION_PAGES.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={page.path}
                    className="flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-scale-purple/30 hover:text-scale-purple"
                  >
                    {stateShortLabel(page.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {INTERNSHIP_CITY_LOCATION_PAGES.length > 0 && (
          <section
            className="border-t border-slate-200/80 bg-slate-50/50 py-10 sm:py-12"
            aria-labelledby="cities-heading"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <h2 id="cities-heading" className="text-xl font-bold text-slate-900">
                By city
              </h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {INTERNSHIP_CITY_LOCATION_PAGES.map((page) => (
                  <li key={page.slug}>
                    <Link
                      href={page.path}
                      className="flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-scale-purple/30 hover:text-scale-purple"
                    >
                      {page.footerLabel ?? stateShortLabel(page.title)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
