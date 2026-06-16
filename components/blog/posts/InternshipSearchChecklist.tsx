import Link from "next/link";

export function InternshipSearchChecklist() {
  return (
    <>
      <p>
        Campus recruiting season moves fast. The students who land strong USA internships usually
        are not the ones applying randomly on weekends—they run a repeatable weekly rhythm.
      </p>
      <p>
        Use this checklist as a baseline. Adjust dates for your target cycle (summer 2027, fall
        co-op, and so on), but keep the sequence.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">8–10 weeks out: build your target list</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>Pick 30–50 companies you would actually join, not a list copied from a ranking site.</li>
        <li>Split them into reach, match, and safety tiers.</li>
        <li>
          Find where each company posts internships—Greenhouse, Lever, or their own careers page.
        </li>
        <li>
          Browse live US listings on{" "}
          <Link href="/find-jobs" className="font-semibold text-scale-purple hover:underline">
            Summer Internships
          </Link>{" "}
          to spot roles synced from company boards.
        </li>
      </ul>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">6–8 weeks out: fix your materials once</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>One strong resume version for your primary track (SWE, product, data, etc.).</li>
        <li>A short project story you can explain in 60 seconds.</li>
        <li>LinkedIn headline and About section aligned with the roles you want.</li>
        <li>Two references or mentors who can respond quickly if asked.</li>
      </ul>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">4–6 weeks out: apply in batches</h2>
      <p>
        Batch applications to protect quality. A good weekly target for most students is 5–8
        thoughtful applications, not 30 copy-paste submissions.
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Apply on the employer site whenever possible.</li>
        <li>Log company, role, date, and link immediately.</li>
        <li>Track stage changes from confirmation and recruiter emails.</li>
      </ul>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">2–4 weeks out: prep interviews in parallel</h2>
      <p>
        Do not wait for an invite to start prep. Run one behavioral story bank and one technical
        refresh block per week.
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Practice STAR answers for leadership, conflict, and failure questions.</li>
        <li>
          Run mock interviews for your target companies on{" "}
          <Link href="/practice-interviews" className="font-semibold text-scale-purple hover:underline">
            Summer Internships interview prep
          </Link>
          .
        </li>
        <li>Research each team&apos;s product before every live interview.</li>
      </ul>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">Every week: run a 20-minute pipeline review</h2>
      <ol className="list-decimal space-y-2 pl-6">
        <li>Which applications have had no response for 10+ days?</li>
        <li>Who do you owe a reply to this week?</li>
        <li>Which interviews need prep in the next 72 hours?</li>
        <li>Are any stages wrong and need a quick correction?</li>
      </ol>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">Student advantage: verify once, stay organized free</h2>
      <p>
        Verified students get unlimited tracking, Gmail sync, mock interviews, and member resources on
        Summer Internships. If you are eligible,{" "}
        <Link href="/verify-student" className="font-semibold text-scale-purple hover:underline">
          verify your student status
        </Link>{" "}
        early so you are not juggling tools mid-season.
      </p>
    </>
  );
}
