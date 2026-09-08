import Link from "next/link";
import { BlogFigure } from "@/components/blog/BlogFigure";

const IMG = {
  timeline: "/blog/summer-internships-timeline.png",
  weekly: "/blog/summer-internships-weekly-workflow.png",
  resume: "/blog/summer-internships-resume-tips.png",
  gmail: "/blog/summer-internships-gmail-workflow.png",
  interview: "/blog/summer-internships-interview-prep.png",
  offer: "/blog/summer-internships-offer-checklist.png",
  sevenDay: "/blog/summer-internships-7-day-plan.png",
};

export function SummerInternshipsGuide() {
  return (
    <>
      <p>
        <strong>Summer internships</strong> can change the direction of your college experience. A
        good internship helps you test a career path, build real skills, meet people in your field,
        and make your resume much stronger before graduation. It can also lead to a return offer, a
        part-time role during the school year, or a full-time job after senior year.
      </p>
      <p>
        But the search can feel confusing. Some companies recruit almost a year early. Others post
        roles in the spring. Application portals are different everywhere. You may wonder whether
        you need a referral, how many internships to apply to, what to write in a cover letter, or
        how to keep track of every deadline.
      </p>
      <p>
        This guide breaks the process into clear steps you can follow today. It focuses on U.S.
        summer internships, campus recruiting timelines, company career pages, Gmail-based tracking,
        interview prep, referrals, student discounts, and practical habits that help students stay
        organized.
      </p>

      <BlogFigure
        src={IMG.timeline}
        alt="Summer internship search timeline for college students"
        caption="A clear recruiting timeline helps students apply before major deadlines pass."
      />

      <h2 className="pt-2 text-2xl font-bold text-slate-900">What are summer internships?</h2>
      <p>
        Summer internships are short-term work experiences that usually happen between May and
        August. They can be paid or unpaid, part-time or full-time, remote or in person. Many are
        designed for college students, recent graduates, or students in specific majors.
      </p>
      <p>A strong summer internship should help you do at least three things:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Learn what a real job in the field looks like</li>
        <li>Build skills you can explain on your resume</li>
        <li>Meet professionals who can give advice or referrals later</li>
        <li>Complete projects with clear outcomes</li>
        <li>Decide whether you want to keep pursuing that career path</li>
      </ul>
      <p>
        Internships are common in business, engineering, finance, marketing, software, healthcare
        administration, media, public policy, research, nonprofits, and many other fields. Some
        industries, like investment banking, consulting, and big tech, recruit early. Others hire
        closer to summer.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">When to apply for summer internships</h2>
      <p>
        For U.S. students, the biggest mistake is waiting until spring to start. Spring applications
        can still work, but many competitive programs open much earlier.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">General recruiting timeline</h3>
      <p>Use this timeline as a planning guide:</p>
      <div className="not-prose overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Timeframe</th>
              <th className="px-4 py-3">What to do</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            <tr>
              <td className="px-4 py-3 font-medium">July to August</td>
              <td className="px-4 py-3">
                Update your resume, LinkedIn, portfolio, and project list. Research companies.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">September to October</td>
              <td className="px-4 py-3">
                Apply to early programs, attend career fairs, contact alumni, and practice
                interviews.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">November to December</td>
              <td className="px-4 py-3">
                Follow up, complete assessments, interview, and apply to new postings before winter
                break.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">January to February</td>
              <td className="px-4 py-3">
                Apply broadly to roles posted after the holidays. Use referrals where possible.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">March to April</td>
              <td className="px-4 py-3">
                Focus on smaller companies, startups, local employers, nonprofits, and school job
                boards.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">May</td>
              <td className="px-4 py-3">
                Look for last-minute openings, research assistant roles, campus jobs, and
                micro-internships.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Industry timing examples</h3>
      <ul className="list-disc space-y-2 pl-6">
        <li>
          <strong>Finance and consulting:</strong> Many large firms recruit in late summer and early
          fall.
        </li>
        <li>
          <strong>Software engineering and product roles:</strong> Large tech companies often open
          roles in late summer or fall, while smaller companies may post through spring.
        </li>
        <li>
          <strong>Marketing, communications, and media:</strong> Many roles open from January through
          April.
        </li>
        <li>
          <strong>Government and public policy:</strong> Deadlines vary widely and may require extra
          paperwork.
        </li>
        <li>
          <strong>Research internships:</strong> Faculty labs, hospitals, and research programs may
          have winter deadlines.
        </li>
        <li>
          <strong>Local businesses and nonprofits:</strong> Many hire in spring when they know their
          summer budgets.
        </li>
      </ul>
      <p>
        If you are reading this late, do not panic. The best time to start is now. There are always
        employers who hire later, especially smaller organizations.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        Start with a simple internship search plan
      </h2>
      <p>
        A strong search does not require perfect connections or a fancy spreadsheet. It requires
        consistency.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Step 1: Pick 2 to 3 target role types</h3>
      <p>
        Do not apply to everything with the word internship in the title. Choose a few role
        categories so your resume, search terms, and interview answers stay focused.
      </p>
      <p>Examples:</p>
      <ul className="list-disc space-y-1 pl-6">
        <li>Marketing intern, social media intern, content intern</li>
        <li>Software engineering intern, data analyst intern, product intern</li>
        <li>Finance intern, accounting intern, business analyst intern</li>
        <li>Public policy intern, nonprofit program intern, research intern</li>
      </ul>
      <p>
        If you are unsure, choose one practical role, one stretch role, and one exploration role.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Step 2: Build a target company list</h3>
      <p>
        Create a list of 30 to 50 organizations. Include a mix of dream companies, realistic
        matches, local employers, startups, nonprofits, and companies that have hired from your
        school before.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Step 3: Set a weekly application goal</h3>
      <p>
        For many students, a realistic goal is 5 to 10 quality applications per week. The key is to
        avoid random mass applications. Each application should be targeted enough that your resume
        matches the role.
      </p>
      <p>A practical weekly routine:</p>
      <ul className="list-disc space-y-1 pl-6">
        <li>Monday: Find 10 roles and save links</li>
        <li>Tuesday: Tailor resumes for 3 to 5 roles</li>
        <li>Wednesday: Apply and log each application</li>
        <li>Thursday: Reach out to 2 alumni or employees</li>
        <li>Friday: Practice one interview story and review your tracker</li>
      </ul>

      <BlogFigure
        src={IMG.weekly}
        alt="Weekly workflow for finding and applying to summer internships"
        caption="A simple weekly routine keeps the internship search manageable."
      />

      <h2 className="pt-2 text-2xl font-bold text-slate-900">Where to find summer internships</h2>
      <p>The best internship searches use several sources. Do not rely on one job board.</p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Company career pages</h3>
      <p>
        Company career pages are often the most reliable source because they show current postings
        directly from the employer.{" "}
        <Link href="/find-internships" className="font-semibold text-scale-purple hover:underline">
          Browse summer internships
        </Link>{" "}
        synced from employer career sites, or check each target company weekly.
      </p>
      <p>Search terms to try: summer intern, internship, university internship, early careers, campus recruiting, student programs, co-op, analyst intern, associate intern.</p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Campus career centers</h3>
      <p>
        Your campus career center may have listings that are not heavily advertised elsewhere.
        Employers that post through your school often want students from your campus, which can
        improve your odds.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">LinkedIn and alumni search</h3>
      <p>
        LinkedIn is useful for finding people, not just postings. Search for alumni who work in your
        target role or company. Keep first messages short and ask for advice, not a job.{" "}
        <Link href="/find-mentors" className="font-semibold text-scale-purple hover:underline">
          Find mentors
        </Link>{" "}
        and alumni at target companies.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Job boards and internship platforms</h3>
      <p>
        Job boards can help you discover opportunities quickly. Use filters for internship, summer,
        remote, location, and major. Always double-check the company career page before applying if
        possible.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Professors, clubs, and local networks</h3>
      <p>
        Faculty, student organizations, and local networks can lead to opportunities that never get
        thousands of online applicants. Ask your department about research roles, club alumni leads,
        and local employer connections.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        Build a resume that gets interviews
      </h2>
      <p>Your resume does not need to be perfect, but it must be clear, targeted, and easy to scan.</p>
      <p>
        For most students, a one-page resume is enough with education, relevant experience, skills,
        and leadership. Use this formula for bullet points: action verb + task + tool or method +
        result.
      </p>
      <p>
        If you do not have formal experience, use class projects, part-time jobs, volunteer work,
        or personal projects. Employers know you are a student. They want evidence that you can
        learn, communicate, and follow through.
      </p>

      <BlogFigure
        src={IMG.resume}
        alt="Resume tips for summer internship applications"
        caption="Strong resume bullets connect your actions to measurable results."
      />

      <h2 className="pt-2 text-2xl font-bold text-slate-900">Track applications so nothing slips</h2>
      <p>
        Once you apply to more than 10 roles, tracking becomes essential. You need to know where
        you applied, when to follow up, which resume version you used, and what interview steps are
        next.
      </p>
      <p>
        Use a spreadsheet, Notion board, Airtable, or{" "}
        <Link href="/tracker" className="font-semibold text-scale-purple hover:underline">
          Track Applications
        </Link>{" "}
        to log company, role, status, referral contact, deadlines, and next actions.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Gmail-based workflow automation</h3>
      <p>
        If you use Gmail for internship applications, create labels like Internships - Applied,
        Internships - Interviews, Internships - Follow Up, Internships - Offers, and Internships -
        Rejections. Create filters for common phrases like application received, schedule your
        interview, and complete your assessment.
      </p>
      <p>
        Use reminders in Google Calendar for application deadlines, interview times, and follow-up
        dates. This simple automation can prevent missed assessments and buried recruiter emails.
      </p>

      <BlogFigure
        src={IMG.gmail}
        alt="Gmail workflow for tracking internship applications and interviews"
        caption="Gmail labels, filters, and reminders can prevent missed recruiter emails."
      />

      <h2 className="pt-2 text-2xl font-bold text-slate-900">Use referrals the right way</h2>
      <p>
        A referral can help your application get noticed, but it is not a shortcut around being
        prepared. Start with warm connections: alumni, former managers, professors, club alumni,
        and students who interned at the company last summer.
      </p>
      <p>
        Before asking, do your homework. Read the job description, prepare your resume, and explain
        why the role fits. Make it easy for them with your resume, the job link, a short reason you
        are a fit, and any deadline.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">Prepare for internship interviews</h2>
      <p>
        Interview preparation is where many students can stand out quickly. Prepare answers for tell
        me about yourself, why this company, teamwork stories, problem-solving examples, and
        questions for the interviewer.
      </p>
      <p>
        Use the STAR method: Situation, Task, Action, Result. Practice role-specific skills for
        software, data, finance, marketing, consulting, or research roles.{" "}
        <Link href="/practice-interviews" className="font-semibold text-scale-purple hover:underline">
          Practice interviews
        </Link>{" "}
        out loud with a friend, mentor, or mock interview tool.
      </p>

      <BlogFigure
        src={IMG.interview}
        alt="College student practicing for a summer internship interview"
        caption="Practicing out loud makes interview answers clearer and more confident."
      />

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        Make the most of career fairs and campus recruiting
      </h2>
      <p>
        Before the fair, review the employer list, pick 8 to 12 priority companies, research each in
        5 minutes, and prepare a short introduction. During the fair, ask specific questions about
        skills, rolling applications, and interview process. After the fair, send a short follow-up
        within 24 to 48 hours.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">Evaluate offers carefully</h2>
      <p>
        When you receive an offer, celebrate. Then review start and end dates, pay rate, expected
        hours, location requirements, housing support, deadline to accept, and any academic credit
        requirements before accepting.
      </p>
      <p>
        Internships can come with extra costs: transportation, housing, professional clothes, and
        software. Look for discounts through your university,{" "}
        <Link href="/resources" className="font-semibold text-scale-purple hover:underline">
          student resources
        </Link>
        , and{" "}
        <Link href="/verify-student" className="font-semibold text-scale-purple hover:underline">
          student verification
        </Link>{" "}
        before paying full price.
      </p>

      <BlogFigure
        src={IMG.offer}
        alt="Checklist for evaluating a summer internship offer"
        caption="Review pay, dates, location, and expectations before accepting an offer."
      />

      <h2 className="pt-2 text-2xl font-bold text-slate-900">What if you do not have experience yet?</h2>
      <p>
        You can create proof of ability before anyone hires you. Build a small project related to
        your target role: a sample marketing campaign, a data analysis, a web app, a company
        analysis, or a design portfolio piece. Put it on your resume and be ready to discuss what
        you learned.
      </p>
      <p>
        Part-time jobs, clubs, tutoring, athletics, and volunteer work count when you describe them
        well. Translate what you did into skills employers understand.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">Common mistakes to avoid</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>Waiting until April to start looking</li>
        <li>Using the same resume for every role</li>
        <li>Applying only to famous companies</li>
        <li>Ignoring company career pages</li>
        <li>Forgetting to track applications</li>
        <li>Missing recruiter emails or assessments</li>
        <li>Asking for referrals without building context</li>
        <li>Going into interviews without practice</li>
        <li>Not asking about pay, dates, or location</li>
        <li>Giving up after a few rejections</li>
      </ul>
      <p>
        Rejection is part of the process. Keep improving the parts you can control.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">A 7-day action plan to start now</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>
          <strong>Day 1:</strong> Choose 2 to 3 internship role types and write down target
          locations and deal-breakers.
        </li>
        <li>
          <strong>Day 2:</strong> Create one base resume and one tailored version. Add projects,
          skills, and measurable bullet points.
        </li>
        <li>
          <strong>Day 3:</strong> Set up your application tracker and Gmail labels. Add at least 10
          saved roles.
        </li>
        <li>
          <strong>Day 4:</strong> Submit three strong applications. Save job descriptions for
          interview prep.
        </li>
        <li>
          <strong>Day 5:</strong> Send three networking messages to alumni or former interns. Ask
          for advice, not a job.
        </li>
        <li>
          <strong>Day 6:</strong> Prepare your tell-me-about-yourself answer and three STAR stories.
          Practice out loud.
        </li>
        <li>
          <strong>Day 7:</strong> Review what worked, update your tracker, and plan next week.{" "}
          <Link href="/find-internships" className="font-semibold text-scale-purple hover:underline">
            Browse internships
          </Link>{" "}
          again and add fresh postings.
        </li>
      </ul>

      <BlogFigure
        src={IMG.sevenDay}
        alt="Seven day action plan for starting a summer internship search"
        caption="Use this one-week plan to build momentum in your internship search."
      />

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        Final thoughts: make the search consistent, not perfect
      </h2>
      <p>
        Landing summer internships is not about being perfect. It is about building a repeatable
        system: find roles, tailor your materials, apply early, track everything, follow up, ask
        for advice, and practice interviews before you need them.
      </p>
      <p>
        Start with one small action today. Browse internships in your target field. Create your
        tracker. Label your Gmail inbox. Message one alum. Practice one interview answer. The
        students who succeed are often the ones who start early, stay organized, learn from each
        application, and keep going.
      </p>
      <p>
        For Summer 2027 specifically, see our{" "}
        <Link
          href="/blog/2027-summer-internships-usa"
          className="font-semibold text-scale-purple hover:underline"
        >
          2027 summer internships USA guide
        </Link>{" "}
        and{" "}
        <Link
          href="/blog/summer-2027-internship-programs-open-now"
          className="font-semibold text-scale-purple hover:underline"
        >
          programs open now
        </Link>
        .
      </p>
    </>
  );
}
