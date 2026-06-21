import Link from "next/link";
import { SUMMER_2027_PROGRAMS_OPEN } from "@/lib/blog/summer2027ProgramsOpen";

export function Summer2027ProgramsOpen() {
  return (
    <>
      <p>
        If you did not land a Summer 2026 internship, you should not wait until next spring to
        start applying again. A lot of major companies are already opening Summer 2027 internships,
        early-talent programs, and student pipelines.
      </p>
      <p>
        Below is a running list of Summer 2027 internship applications that are currently live or
        have active application pages. These roles can close quickly, so always check the company
        page directly before applying.
      </p>

      <nav
        aria-label="On this page"
        className="rounded-xl border border-slate-200 bg-white p-5 not-prose"
      >
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
          On this page
        </p>
        <ol className="mt-3 grid gap-1.5 sm:grid-cols-2">
          {SUMMER_2027_PROGRAMS_OPEN.map((section, index) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="text-sm font-medium text-scale-purple hover:underline"
              >
                {String(index + 1).padStart(2, "0")} {section.company}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {SUMMER_2027_PROGRAMS_OPEN.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24 pt-2">
          <h2 className="text-2xl font-bold text-slate-900">{section.company}</h2>
          <ul className="mt-3 space-y-2">
            {section.roles.map((role) => (
              <li key={role.applyUrl} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span>{role.title}</span>
                <span className="text-slate-400" aria-hidden>
                  —
                </span>
                <a
                  href={role.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 font-semibold text-scale-purple hover:underline"
                >
                  Apply
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <blockquote className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-sm text-slate-700 not-prose">
        <p className="font-semibold text-slate-900">Important note</p>
        <p className="mt-1">
          Internship postings can close at any time. If a link stops working, search the exact
          company name plus the exact internship title on the company&apos;s official careers site.
        </p>
      </blockquote>

      <p>
        As you apply, log every role in one place so nothing slips through the cracks. Browse live
        listings synced from company career boards on{" "}
        <Link href="/find-jobs" className="font-semibold text-scale-purple hover:underline">
          SuperInterns
        </Link>
        , or track applications and follow-ups from your dashboard after you{" "}
        <Link href="/login" className="font-semibold text-scale-purple hover:underline">
          create a free account
        </Link>
        .
      </p>
    </>
  );
}
