import Link from "next/link";
import { BlogFigure } from "@/components/blog/BlogFigure";

const IMG = {
  planning: "/blog/2027-summer-internships-planning.png",
  whereToFind: "/blog/2027-summer-internships-where-to-find.png",
  gmail: "/blog/2027-summer-internships-gmail-workflow.png",
  tracker: "/blog/2027-summer-internships-tracker.png",
  mentors: "/blog/2027-summer-internships-mentors.png",
  resources: "/blog/2027-summer-internships-resources.png",
  checklist: "/blog/2027-summer-internships-checklist.png",
};

export function Summer2027InternshipsPracticalGuide() {
  return (
    <>
      <p>
        If you are searching for <strong>2027 summer internships</strong>, you are already thinking
        like a strong candidate. The best internships often go to students who start early, stay
        organized, and keep applying even when recruiting feels chaotic.
      </p>
      <p>
        This guide is built for students who want a clear plan. You will learn when to apply, where
        to find U.S. internships, how to use Gmail to manage your search, how to track applications,
        how to ask for referrals, and how to prepare for interviews without burning out.
      </p>
      <p>
        Whether you are a first-year student, sophomore, junior, community college student,
        graduate student, international student, or career changer, the same basic rule applies:
        start before you feel ready.
      </p>

      <BlogFigure
        src={IMG.planning}
        alt="Student planning a 2027 summer internship search with laptop and calendar"
        caption="Start your 2027 summer internship search early with a clear plan and weekly routine."
      />

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        Quick answer: when should you apply for 2027 summer internships?
      </h2>
      <p>
        For many competitive U.S. internship programs, you should start preparing in{" "}
        <strong>spring or summer 2026</strong> and begin applying as soon as roles open in{" "}
        <strong>late summer and fall 2026</strong>. Some industries recruit very early, while others
        post roles closer to winter or spring.
      </p>
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
              <td className="px-4 py-3 font-medium">Spring 2026</td>
              <td className="px-4 py-3">
                Update your resume, LinkedIn, portfolio, and target company list
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Summer 2026</td>
              <td className="px-4 py-3">
                Browse internships, create job alerts, practice interview basics, contact mentors
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">August–November 2026</td>
              <td className="px-4 py-3">
                Apply heavily to early recruiting industries like tech, finance, consulting,
                engineering, and large corporate programs
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">December 2026–February 2027</td>
              <td className="px-4 py-3">
                Keep applying, follow up, interview, and expand your company list
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">March–May 2027</td>
              <td className="px-4 py-3">
                Apply to smaller companies, startups, local employers, nonprofits, research labs,
                and late-posting roles
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Summer 2027</td>
              <td className="px-4 py-3">
                Start your internship, build relationships, and document wins for your resume
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The earlier you start, the more options you create. But if you are reading this later, do not
        panic. Many companies hire interns in waves, and smaller organizations often post closer to
        the start date.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        Why 2027 summer internships are worth planning for now
      </h2>
      <p>Summer internships are not just resume fillers. A good internship can help you:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Test a career path before committing to it</li>
        <li>Build real-world skills outside the classroom</li>
        <li>Earn money or academic credit</li>
        <li>Meet mentors and future references</li>
        <li>Turn an internship into a return offer or full-time job</li>
        <li>Strengthen graduate school or scholarship applications</li>
        <li>Learn what kind of workplace you actually like</li>
      </ul>
      <p>
        The 2027 internship market will likely be competitive, especially for roles at well-known
        companies. But competition does not mean you need perfect grades, elite connections, or a
        flawless resume. You need a repeatable system.
      </p>
      <p>Think of your search as a project with four parts:</p>
      <ol className="list-decimal space-y-2 pl-6">
        <li>Find the right opportunities.</li>
        <li>Apply with strong materials.</li>
        <li>Track every application and follow-up.</li>
        <li>Prepare for interviews and networking conversations.</li>
      </ol>
      <p>That system matters more than sending one perfect application and waiting.</p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        Step 1: Choose your internship targets
      </h2>
      <p>
        Before you start applying, get specific about what you want. You do not need your entire
        career figured out, but you should know what kinds of roles are worth your time.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Start with role categories</h3>
      <p>
        Search by job function, not just by major. Many students miss great internships because
        they only search for their major title.
      </p>
      <p>Examples:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>
          Computer science: software engineering intern, data science intern, product intern,
          cybersecurity intern, QA intern
        </li>
        <li>
          Business: marketing intern, finance intern, operations intern, business analyst intern,
          sales intern
        </li>
        <li>
          Design: UX intern, graphic design intern, product design intern, content design intern
        </li>
        <li>Science: research intern, lab assistant, biotech intern, environmental intern</li>
        <li>
          Humanities and social science: policy intern, communications intern, editorial intern,
          nonprofit program intern, legal intern
        </li>
        <li>
          Engineering: mechanical engineering intern, electrical engineering intern, manufacturing
          intern, civil engineering intern
        </li>
      </ul>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Build a target list of companies</h3>
      <p>Create a list of 30–100 organizations. Include:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Big-name employers in your field</li>
        <li>Mid-size companies with structured internship programs</li>
        <li>Local businesses near your school or hometown</li>
        <li>Startups</li>
        <li>Government agencies</li>
        <li>Nonprofits</li>
        <li>Research labs</li>
        <li>Hospitals or clinics, if relevant</li>
        <li>University departments and campus offices</li>
      </ul>
      <p>
        Do not only chase famous companies. A smaller internship with real responsibility can teach
        you more than a brand-name internship where you do basic admin work.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Consider location and work style</h3>
      <p>For U.S. internships, decide what you can realistically accept:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Remote, hybrid, or in-person near campus or home</li>
        <li>Relocation required</li>
        <li>Paid housing or relocation stipend</li>
        <li>Public transit accessible</li>
        <li>Part-time during school year leading into summer</li>
      </ul>
      <p>
        If money is a factor, look closely at pay, housing, transportation, and cost of living. A
        paid internship in a lower-cost city may be better than a higher hourly rate in an expensive
        location with no housing support.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        Step 2: Know where to find 2027 summer internships
      </h2>
      <p>
        Do not rely on one job board. The best search uses several sources because companies post in
        different places.
      </p>

      <BlogFigure
        src={IMG.whereToFind}
        alt="Where to find 2027 summer internships across job boards and career sites"
        caption="Use multiple sources to find internships, including job boards, company pages, alumni networks, and campus portals."
      />

      <h3 className="pt-1 text-lg font-bold text-slate-900">Best places to search</h3>
      <p>Use a mix of these:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>
          Internship search platforms , {" "}
          <Link href="/find-internships" className="font-semibold text-scale-purple hover:underline">
            browse USA internships
          </Link>{" "}
          synced from company career pages on SuperInterns
        </li>
        <li>Your university career portal</li>
        <li>Company career pages</li>
        <li>LinkedIn job search</li>
        <li>Alumni networks</li>
        <li>Professional associations</li>
        <li>GitHub, design communities, or industry-specific boards</li>
        <li>Government job portals for public sector internships</li>
        <li>Research program databases</li>
        <li>Campus newsletters and department emails</li>
        <li>Career fairs and employer info sessions</li>
      </ul>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Search terms to try</h3>
      <p>Use different versions of the same search. Companies title internships differently.</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>2027 summer internship</li>
        <li>summer 2027 intern</li>
        <li>2027 intern program</li>
        <li>undergraduate intern summer 2027</li>
        <li>software engineering intern 2027</li>
        <li>finance intern summer 2027</li>
        <li>marketing internship 2027</li>
        <li>remote summer internship 2027</li>
        <li>sophomore internship 2027</li>
        <li>freshman internship 2027</li>
      </ul>
      <p>Set alerts for your strongest searches so you are not manually checking every day.</p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Browse early, apply when ready enough</h3>
      <p>
        It is smart to browse internships before your resume feels perfect. Browsing helps you
        understand common requirements, tools, skills, and keywords.
      </p>
      <p>As you read postings, save details like required skills, preferred majors, application
        deadlines, resume keywords, interview format, work location, pay range, and sponsorship or
        work authorization notes. Then use that information to improve your resume and decide which
        skills to practice.</p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        Step 3: Make a resume that passes the first scan
      </h2>
      <p>Your resume does not need to be fancy. It needs to be easy to read and relevant.</p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">What to include</h3>
      <p>For most students, a one-page resume works best. Include:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Name, email, phone, location, LinkedIn, portfolio or GitHub if relevant</li>
        <li>Education, graduation date, major, minor, GPA if strong or required</li>
        <li>Work experience, internships, campus jobs, or part-time roles</li>
        <li>Projects, research, leadership, volunteering, or coursework</li>
        <li>Skills, tools, languages, certifications, or technical abilities</li>
      </ul>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Use accomplishment bullets</h3>
      <p>
        A weak bullet says what you were assigned. A strong bullet shows what you did and why it
        mattered.
      </p>
      <p>Instead of &ldquo;Helped with social media posts,&rdquo; try:</p>
      <p>
        Created 20+ social media posts for a student organization, increasing event sign-ups by 35%
        over one semester.
      </p>
      <p>Instead of &ldquo;Worked on Python project,&rdquo; try:</p>
      <p>
        Built a Python script to clean 5,000+ survey responses, reducing manual formatting time for
        a class research project.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">
        Match the role without copying the posting
      </h3>
      <p>
        If a posting mentions Excel, SQL, customer research, or Figma, and you have used those
        skills, make sure they appear naturally on your resume. Do not lie, but do make your
        experience easy to find.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Create a base resume plus versions</h3>
      <p>
        You do not need 50 resumes. Create one strong base resume, then make 2–4 versions for your
        main role types: software engineering, data analyst, product or business, marketing or
        communications.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        Step 4: Build a Gmail-based workflow that keeps you organized
      </h2>
      <p>
        Internship searches get messy fast. You will receive application confirmations, recruiter
        emails, interview invites, rejections, assessment links, and follow-up reminders. A simple
        Gmail workflow can save you.
      </p>

      <BlogFigure
        src={IMG.gmail}
        alt="Gmail workflow for organizing internship applications with labels and filters"
        caption="Gmail labels, filters, and stars can help you avoid missing recruiter emails and interview invites."
      />

      <h3 className="pt-1 text-lg font-bold text-slate-900">Create Gmail labels</h3>
      <p>Set up labels like:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Internships – Applied</li>
        <li>Internships – Interviewing</li>
        <li>Internships – Assessment</li>
        <li>Internships – Follow Up</li>
        <li>Internships – Offers</li>
        <li>Internships – Rejections</li>
        <li>Internships – Networking</li>
      </ul>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Use filters for common emails</h3>
      <p>
        Create filters for phrases like thank you for applying, your application has been received,
        interview invitation, complete your assessment, schedule a call, and internship application.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Star urgent messages</h3>
      <p>
        Use stars for anything that needs action within 48 hours: interview scheduling links,
        take-home assignments, recruiter questions, offer deadlines, and referral follow-ups.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Keep a professional email setup</h3>
      <p>
        Use a clean email address based on your name. Check your spam folder at least twice a week
        during recruiting season. Make sure your Gmail display name is professional, recruiters
        should see your actual name, not an old nickname.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        Step 5: Track every internship application
      </h2>
      <p>
        You will not remember where you applied, what version of your resume you used, or when to
        follow up. Use a tracker from day one , {" "}
        <Link href="/tracker" className="font-semibold text-scale-purple hover:underline">
          SuperInterns Track Applications
        </Link>{" "}
        builds your pipeline from Gmail automatically.
      </p>

      <BlogFigure
        src={IMG.tracker}
        alt="2027 internship application tracker with statuses deadlines and follow ups"
        caption="Track every role, deadline, referral, interview, and outcome so your search stays manageable."
      />

      <h3 className="pt-1 text-lg font-bold text-slate-900">What to track</h3>
      <p>
        Create columns for company, role title, location, remote/hybrid/in-person, application link,
        date applied, deadline, status, resume version, contact person, referral source, follow-up
        date, interview date, notes, and outcome.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Suggested status labels</h3>
      <p>
        Saved, Applied, Referred, Assessment, Interview 1, Interview 2, Final, Offer, Rejected,
        Withdrawn, No response.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Weekly tracker routine</h3>
      <p>Once a week, spend 30 minutes updating your tracker:</p>
      <ol className="list-decimal space-y-2 pl-6">
        <li>Move stale applications to no response.</li>
        <li>Add follow-up reminders.</li>
        <li>Record interview notes.</li>
        <li>Save new roles to apply to.</li>
        <li>Check deadlines.</li>
        <li>Review your response rate.</li>
      </ol>
      <p>
        If you apply to 40 internships and get no interviews, change your resume strategy. If you
        get interviews but no offers, focus on interview practice. Your tracker shows where the
        problem is.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        Step 6: Apply early, but do not apply randomly
      </h2>
      <p>
        Yes, applying early helps. But sending rushed applications to roles you barely understand
        is not the goal.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">The 20-minute application method</h3>
      <p>For each role:</p>
      <ol className="list-decimal space-y-2 pl-6">
        <li>Read the posting carefully.</li>
        <li>Confirm you meet enough requirements to be credible.</li>
        <li>Save the role in your tracker.</li>
        <li>Adjust your resume headline, skills, or project bullets if needed.</li>
        <li>Submit the application.</li>
        <li>Save the confirmation email with your Gmail label.</li>
        <li>Add a follow-up date if you have a contact.</li>
      </ol>

      <h3 className="pt-1 text-lg font-bold text-slate-900">
        How many internships should you apply to?
      </h3>
      <p>
        Competitive fields may require 50–150 applications. A good goal during peak season is 5–10
        quality applications per week if you are busy with classes, 10–20 per week during breaks, 2–3
        networking messages per week, and 1–2 interview practice sessions per week.
      </p>
      <p>Consistency beats one huge application sprint followed by three weeks of silence.</p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        Step 7: Get referrals without feeling awkward
      </h2>
      <p>
        A referral can help your application get noticed. It does not guarantee an interview, but it
        can move you out of the giant pile. Ask respectfully and make it easy for the other person
        to help.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Who to ask</h3>
      <p>
        Start with alumni from your school, former interns, friends of friends, professors, club
        alumni, family friends, mentors, and people you met at career fairs.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Referral message template</h3>
      <div className="not-prose rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
        <p>Hi [Name],</p>
        <p className="mt-2">
          I am a [year] studying [major] at [school], and I saw the [role title] internship at
          [company]. I noticed your experience in [team/field] and would really appreciate any
          advice on applying. If you feel comfortable after reviewing my resume, would you be open
          to referring me?
        </p>
        <p className="mt-2">
          I attached my resume and the role link. Thank you either way.
        </p>
        <p className="mt-2">
          Best,
          <br />
          [Your Name]
        </p>
      </div>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Important referral rules</h3>
      <ul className="list-disc space-y-2 pl-6">
        <li>Do not ask strangers for a referral in the first sentence without context.</li>
        <li>Always include the exact role link.</li>
        <li>Attach or link your resume.</li>
        <li>Give them a graceful way to say no.</li>
        <li>Thank them even if they cannot help.</li>
        <li>Update them if you get an interview or offer.</li>
      </ul>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        Step 8: Contact mentors and recruiters the smart way
      </h2>
      <p>
        Networking is not begging for a job. It is starting career conversations before you need
        something urgently.
      </p>

      <BlogFigure
        src={IMG.mentors}
        alt="Student contacting mentors and recruiters for internship advice and referrals"
        caption="Mentors, alumni, and recruiters can help you understand roles, improve your materials, and find referrals."
      />

      <h3 className="pt-1 text-lg font-bold text-slate-900">What to ask mentors</h3>
      <ul className="list-disc space-y-2 pl-6">
        <li>What skills should I build before applying to this type of internship?</li>
        <li>What made your resume stronger when you were a student?</li>
        <li>Are there companies students often overlook?</li>
        <li>How should I prepare for interviews in this field?</li>
        <li>Would you be willing to review my resume for 10 minutes?</li>
      </ul>
      <p>
        <Link href="/find-mentors" className="font-semibold text-scale-purple hover:underline">
          Find Mentors
        </Link>{" "}
        on SuperInterns surfaces recruiters and campus hiring contacts at any company.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">What to say to recruiters</h3>
      <div className="not-prose rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
        <p>
          Hi [Name], I am a [year] at [school] interested in [role type]. I applied for the
          [internship name] role and wanted to share my interest because my experience with
          [specific project/skill] matches the posting. Thank you for your time, and I would be
          grateful for any next steps or advice.
        </p>
        <p className="mt-2">
          Best,
          <br />
          [Your Name]
        </p>
      </div>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Follow-up timing</h3>
      <p>
        If you had a real conversation or interview, follow up within 24 hours with a thank-you note.
        If you applied and have a contact, wait 7–10 business days before following up.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        Step 9: Prepare for interviews before you get one
      </h2>
      <p>
        Many students wait until an interview is scheduled to practice. Start early, even if you
        only practice 20 minutes a week.{" "}
        <Link
          href="/practice-interviews"
          className="font-semibold text-scale-purple hover:underline"
        >
          Practice interviews
        </Link>{" "}
        with AI mock sessions tailored to the company and role you want.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Common internship interview questions</h3>
      <p>
        Prepare answers for tell me about yourself, why this internship, why this company, teamwork
        and challenge stories, strengths and learning areas, resume walkthrough, a project you are
        proud of, and questions for the interviewer.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Use the STAR method</h3>
      <p>
        For behavioral questions: Situation, Task, Action, Result. Keep answers focused, usually
        60–90 seconds.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Practice role-specific skills</h3>
      <p>
        Depending on your field, practice coding problems, case interviews, Excel exercises,
        portfolio walkthroughs, writing samples, data analysis questions, design critiques, lab
        explanations, or sales role plays.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Record yourself</h3>
      <p>
        Record a practice answer and check whether you rambled, gave a clear result, sounded
        interested, used too many filler words, and matched your example to the question.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        Step 10: Use student discounts and free career resources
      </h2>
      <p>
        Internship searching can get expensive if you pay for every tool, course, and resume review.
        Start with free or discounted resources.
      </p>

      <BlogFigure
        src={IMG.resources}
        alt="Student career resources and discounts checklist for internship search tools"
        caption="Before paying for tools, check free campus resources and student discounts that support your search."
      />

      <p>
        Check your campus career center, resume review events, mock interview programs, alumni
        mentoring platforms, library databases, professor office hours, student clubs, employer info
        sessions, and{" "}
        <Link href="/resources" className="font-semibold text-scale-purple hover:underline">
          student discounts
        </Link>{" "}
        on SuperInterns.
      </p>
      <p>
        Do not buy tools just because you are stressed. Pay for something only if it directly helps
        you apply, practice, organize, or build a required skill.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        Industry-specific tips for 2027 internships
      </h2>
      <ul className="list-disc space-y-3 pl-6">
        <li>
          <strong>Tech:</strong> Apply early. Build projects that show your skills. Keep GitHub or
          portfolio clean. Practice coding interviews consistently.
        </li>
        <li>
          <strong>Finance:</strong> Many programs recruit very early. Networking and campus events
          matter. Practice technical finance questions for banking and analyst roles.
        </li>
        <li>
          <strong>Consulting:</strong> Expect case interviews and behavioral questions. Practice
          cases with peers and structure ambiguous problems clearly.
        </li>
        <li>
          <strong>Marketing and communications:</strong> Create proof of work, social content,
          writing samples, campaign ideas, analytics screenshots, or newsletters.
        </li>
        <li>
          <strong>Engineering:</strong> Highlight hands-on projects, lab work, CAD tools, research,
          or competition teams. Apply to both big programs and local companies.
        </li>
        <li>
          <strong>Healthcare, policy, nonprofit, and research:</strong> Deadlines vary widely.
          Professors, department newsletters, local organizations, and government agencies can be
          especially helpful.
        </li>
      </ul>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">Common mistakes to avoid</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>Waiting until spring 2027 to start looking</li>
        <li>Applying only to famous companies</li>
        <li>Using one generic resume for every role</li>
        <li>Forgetting to track applications</li>
        <li>Ignoring Gmail and missing interview emails</li>
        <li>Not practicing interviews until the night before</li>
        <li>Asking for referrals with no role link or resume</li>
        <li>Skipping smaller companies and local opportunities</li>
        <li>Applying without checking work authorization requirements</li>
        <li>Letting rejection stop your entire search</li>
      </ul>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        A simple weekly internship search schedule
      </h2>

      <h3 className="pt-1 text-lg font-bold text-slate-900">During the semester</h3>
      <p>Try this 3-hour weekly plan:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>45 minutes: browse internships and save roles</li>
        <li>60 minutes: submit 3–5 applications</li>
        <li>30 minutes: update tracker and Gmail labels</li>
        <li>30 minutes: send networking or referral messages</li>
        <li>15 minutes: practice one interview answer</li>
      </ul>

      <h3 className="pt-1 text-lg font-bold text-slate-900">During winter or summer break</h3>
      <p>Try this 6-hour weekly plan:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>90 minutes: research companies and roles</li>
        <li>2 hours: submit applications</li>
        <li>60 minutes: interview practice</li>
        <li>45 minutes: networking and follow-ups</li>
        <li>45 minutes: resume, portfolio, or project improvements</li>
      </ul>
      <p>
        Small weekly actions add up quickly. Ten weeks of steady work can produce dozens of
        applications, multiple conversations, and much better interview confidence.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        Your 2027 summer internship checklist
      </h2>
      <ul className="space-y-2 pl-0">
        {[
          "Create a target role list",
          "Build a company list",
          "Update your resume",
          "Create role-specific resume versions",
          "Update LinkedIn, portfolio, GitHub, or writing samples",
          "Set up Gmail labels and filters",
          "Create or activate an internship tracker",
          "Browse internships weekly",
          "Set job alerts for 2027 summer internships",
          "Apply early to competitive programs",
          "Contact mentors or alumni",
          "Ask for referrals respectfully",
          "Practice behavioral interview answers",
          "Practice technical or field-specific interviews",
          "Use free campus career resources",
          "Review student discounts before paying for tools",
          "Follow up after interviews",
          "Keep going after rejections",
        ].map((item) => (
          <li key={item} className="flex gap-2.5 text-slate-700">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-violet-200 bg-violet-50 text-xs text-scale-purple">
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>

      <BlogFigure
        src={IMG.checklist}
        alt="2027 summer internship checklist with steps for applications interviews and referrals"
        caption="Use this checklist to turn a stressful internship search into a step-by-step process."
      />

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        Final advice: build a system, then keep moving
      </h2>
      <p>
        Getting a 2027 summer internship is not about being perfect. It is about being prepared,
        organized, and persistent.
      </p>
      <p>
        Start by{" "}
        <Link href="/find-internships" className="font-semibold text-scale-purple hover:underline">
          browsing internships
        </Link>{" "}
        and saving roles that interest you. Create a free account on SuperInterns, set up your
        tracker, label your Gmail inbox, and apply before deadlines sneak up on you. Reach out to
        mentors, ask thoughtful questions, practice interviews early, and keep improving your
        materials as you learn what employers want.
      </p>
      <p>
        Your first application does not have to be your best one. Your first interview does not have
        to be flawless. The goal is progress. Open your tracker, find three internships you would be
        excited to apply for, and take the next step today.
      </p>
    </>
  );
}
