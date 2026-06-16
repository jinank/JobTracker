import Link from "next/link";

export function TrackApplicationsWithoutSpreadsheet() {
  return (
    <>
      <p>
        Spreadsheets work until they do not. One missed row, a duplicate company name, and suddenly
        you are not sure whether you applied to Stripe twice or never followed up with the recruiter
        who asked for your availability.
      </p>
      <p>
        If you are running a serious internship search, you need a system that stays accurate when
        volume picks up. Here is a lightweight approach that scales better than a manual sheet.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">Track one row per company + role</h2>
      <p>
        The most common spreadsheet mistake is mixing multiple applications into one line or splitting
        the same role across tabs. Use a single record for each unique pairing of company and role
        title. If you apply to two teams at the same company, that is two records, not one.
      </p>
      <p>
        Each record should answer four questions at a glance:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Where did you apply?</li>
        <li>What stage are you in right now?</li>
        <li>When was the last recruiter touchpoint?</li>
        <li>What is the next action and deadline?</li>
      </ul>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">Use stages, not free-text status</h2>
      <p>
        Free-text status fields drift fast. &ldquo;Waiting&rdquo; could mean a week or a month.
        Standard stages like Applied, Assessment, Interview, Offer, and Rejected make it easier to
        filter what needs attention today.
      </p>
      <p>
        Add a short notes field for context, but keep the stage canonical. That is what powers useful
        reminders and weekly reviews.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">Pull updates from email instead of memory</h2>
      <p>
        Most application changes arrive in your inbox: confirmations, OA links, interview invites,
        and rejections. Updating a spreadsheet from memory at midnight is how pipelines go stale.
      </p>
      <p>
        A better workflow is to classify recruiter mail automatically and push updates into your
        tracker. That is exactly what{" "}
        <Link href="/tracker" className="font-semibold text-scale-purple hover:underline">
          Summer Internships
        </Link>{" "}
        does with read-only Gmail sync: you apply on company sites, and the pipeline updates when
        employers reply.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">Review twice a week, not twice a day</h2>
      <p>
        Checking your tracker constantly creates anxiety without improving outcomes. Block two short
        reviews per week:
      </p>
      <ol className="list-decimal space-y-2 pl-6">
        <li>Monday: follow-ups due, stale applications, new postings to apply to.</li>
        <li>Thursday: interview prep, recruiter replies, and stage corrections.</li>
      </ol>
      <p>
        Keep the review under 20 minutes. If your system is clean, that is enough to stay ahead of
        most applicants.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">When to graduate from a spreadsheet</h2>
      <p>
        Stay on a sheet if you are applying to fewer than ten roles. Once you cross that line, switch
        to a dedicated tracker with email sync, filters, and stage history. The time you save on
        admin becomes time for applications, referrals, and interview prep.
      </p>
    </>
  );
}
