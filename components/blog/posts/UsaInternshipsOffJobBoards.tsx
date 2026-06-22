import Link from "next/link";

export function UsaInternshipsOffJobBoards() {
  return (
    <>
      <p>
        LinkedIn and Handshake are useful discovery tools, but they are also where competition
        spikes fastest. When a role is reposted across three aggregators, you may be applicant
        number 400—not applicant number 12.
      </p>
      <p>
        Many of the best USA internship openings live on company career pages first. Here is how to
        find them before the crowd arrives.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">Start at the source: ATS career boards</h2>
      <p>
        Large tech and growth companies often host jobs on applicant tracking systems like
        Greenhouse or Lever. These pages list current openings directly from the hiring team, with
        apply links that go straight to the employer.
      </p>
      <p>
        Searching <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">site:boards.greenhouse.io internship</code>{" "}
        or bookmarking company boards you care about beats refreshing a generic job feed.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">Why job boards lag behind company sites</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>Aggregators may show stale roles that already closed on the company site.</li>
        <li>Some internships never get reposted off the employer domain at all.</li>
        <li>Board listings often strip location details you need for US eligibility.</li>
        <li>High applicant volume on popular platforms lowers your signal-to-noise ratio.</li>
      </ul>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">Build a company-first watchlist</h2>
      <p>
        Instead of keyword searching every day, maintain a watchlist of 40–60 employers. Check their
        careers pages on a schedule—or use a tool that syncs US internship listings automatically.
      </p>
      <p>
        <Link href="/find-internships" className="font-semibold text-scale-purple hover:underline">
          SuperInterns
        </Link>{" "}
        pulls from public Greenhouse and Lever boards, filters to US internships, and updates daily.
        You browse openings, apply on the company site, then track replies in your pipeline.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">Combine discovery with tracking</h2>
      <p>
        Finding a role is only half the job. You still need to know which applications are live,
        which assessments are due, and which recruiters replied.
      </p>
      <p>
        The strongest workflow is company-page discovery → direct apply → inbox-driven status
        updates. That keeps your search fast on the front end and accurate on the back end.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">Quick weekly routine</h2>
      <ol className="list-decimal space-y-2 pl-6">
        <li>Scan new US internships from your target companies.</li>
        <li>Apply to a small batch with tailored materials.</li>
        <li>Log each application and watch for recruiter email updates.</li>
        <li>Follow up on roles with no response after 10–14 days.</li>
      </ol>
      <p>
        Repeat weekly. Consistency beats one heroic weekend of mass applying.
      </p>
    </>
  );
}
