import Link from "next/link";
import { BlogFigure } from "@/components/blog/BlogFigure";

const IMG = {
  dashboard: "/blog/remote-summer-2027-internship-search-dashboard.webp",
  whereToFind: "/blog/remote-summer-2027-where-to-find.webp",
  preparation: "/blog/remote-summer-2027-preparation-checklist.webp",
  gmail: "/blog/remote-summer-2027-gmail-tracker-workflow.webp",
  referral: "/blog/remote-summer-2027-referral-outreach.webp",
  interview: "/blog/remote-summer-2027-interview-prep.webp",
  plan30: "/blog/remote-summer-2027-30-day-plan.webp",
};

export function RemoteSummer2027InternshipsGuide() {
  return (
    <>
      <p>
        If you are looking for <strong>remote summer 2027 internships</strong>, the smartest move
        is to start earlier than feels necessary. Remote roles are popular because they offer
        flexibility, save commuting costs, and open up opportunities beyond your campus city. The
        tradeoff: competition can be intense, application windows can open months in advance, and it
        is easy to lose track of where you applied.
      </p>
      <p>
        This guide gives you a clear, student-friendly plan for finding U.S.-based remote
        internships for summer 2027, applying on time, staying organized with Gmail-based
        workflows, preparing for interviews, asking for referrals, and using campus and student
        resources without burning out.
      </p>

      <BlogFigure
        src={IMG.dashboard}
        alt="Remote summer 2027 internship search dashboard for students"
        caption="Start early, stay organized, and track every remote internship application."
      />

      <h2 className="pt-2 text-2xl font-bold text-slate-900">Quick takeaways</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>
          Start researching roles in <strong>summer or early fall 2026</strong> for summer 2027
          internships.
        </li>
        <li>Build a simple tracking system before you apply to your first role.</li>
        <li>
          Search beyond big-name companies. Remote internships also exist at startups, nonprofits,
          agencies, research labs, media companies, and local businesses hiring nationally.
        </li>
        <li>
          Use Gmail labels, filters, and templates to keep recruiting emails from getting buried.
        </li>
        <li>Referrals, mentor conversations, and recruiter outreach can help you stand out.</li>
        <li>
          Practice remote interviews early, especially video setup, behavioral answers, and
          role-specific skills.
        </li>
      </ul>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        When do remote summer 2027 internships open?
      </h2>
      <p>
        For U.S. internships, timelines vary by industry. Some companies recruit nearly a year in
        advance, while others hire closer to the summer. Remote internships can appear in every
        wave, but they often fill quickly because students from many locations can apply.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">
        Common summer 2027 recruiting timeline
      </h3>
      <div className="not-prose overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Time period</th>
              <th className="px-4 py-3">What to do</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            <tr>
              <td className="px-4 py-3 font-medium">May–August 2026</td>
              <td className="px-4 py-3">
                Build your resume, create a target list, set up your tracker, browse early postings
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">August–October 2026</td>
              <td className="px-4 py-3">
                Apply to large companies, finance, consulting, tech, engineering, and competitive
                programs
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">November–December 2026</td>
              <td className="px-4 py-3">
                Follow up, interview, keep applying, use winter break for projects and networking
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">January–March 2027</td>
              <td className="px-4 py-3">
                Apply to mid-size companies, startups, nonprofits, agencies, and remote-first teams
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">April–May 2027</td>
              <td className="px-4 py-3">
                Watch for last-minute openings, unpaid-to-paid changes, cancellations, and
                short-term projects
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">June 2027</td>
              <td className="px-4 py-3">
                Confirm onboarding, equipment, time zone expectations, and schedule
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Why early applications matter</h3>
      <p>
        Many students wait until spring and then discover that the best-known summer roles closed
        months earlier. Applying early gives you more chances, but it also gives you time to improve.
        Your first few applications may not be perfect. That is normal. The goal is to start, learn,
        and refine your approach.
      </p>
      <p>
        A good rule: by the time September 2026 starts, you should already have a resume draft, a
        target role list, and a way to track every application.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">What counts as a remote internship?</h2>
      <p>
        A remote internship means you can complete most or all work online. But the details matter.
        Read every posting carefully because companies use different labels.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Remote terms you may see</h3>
      <ul className="list-disc space-y-2 pl-6">
        <li>
          <strong>Remote:</strong> Work from anywhere, usually within the U.S. or approved states.
        </li>
        <li>
          <strong>Remote U.S.:</strong> You must be physically located in the United States.
        </li>
        <li>
          <strong>Hybrid:</strong> You work partly online and partly in an office.
        </li>
        <li>
          <strong>Flexible location:</strong> The company may allow remote work, but location rules
          can vary.
        </li>
        <li>
          <strong>Distributed team:</strong> Team members work across multiple locations and time
          zones.
        </li>
        <li>
          <strong>Virtual internship:</strong> Often used for structured student programs, sometimes
          part-time.
        </li>
      </ul>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Questions to confirm before accepting</h3>
      <p>Ask these questions before you sign an offer:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Is the internship fully remote for the entire summer?</li>
        <li>Do I need to live in a specific state or time zone?</li>
        <li>What are the expected working hours?</li>
        <li>Will I receive a company laptop or software access?</li>
        <li>Is the internship paid? If yes, what is the hourly rate or stipend?</li>
        <li>Will there be mentorship, manager check-ins, or final presentations?</li>
        <li>Are international students eligible if they have proper work authorization?</li>
      </ul>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        Best places to find remote summer 2027 internships
      </h2>
      <p>
        Finding remote roles is partly about using the right platforms and partly about searching
        with the right keywords. Do not rely on one job board. Build a repeatable search routine.
      </p>

      <BlogFigure
        src={IMG.whereToFind}
        alt="Where students can find remote summer 2027 internships"
        caption="Use multiple sources so you do not miss remote internship openings."
      />

      <h3 className="pt-1 text-lg font-bold text-slate-900">
        1. Internship databases and student job boards
      </h3>
      <p>
        Start with internship-focused platforms where you can browse openings, save roles, create a
        free account, and track your progress. Use filters for remote, summer 2027, paid, industry,
        and skill level. If the platform has an application tracker, use it from day one so you can
        see what is pending, submitted, interviewing, or closed.
      </p>
      <p>Search phrases to try:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>remote summer 2027 internships</li>
        <li>virtual summer 2027 internship</li>
        <li>remote software engineering intern summer 2027</li>
        <li>remote marketing intern summer 2027</li>
        <li>remote data analyst intern summer 2027</li>
        <li>summer 2027 internship United States remote</li>
        <li>paid remote internship summer 2027</li>
      </ul>
      <p>
        Browse live listings on{" "}
        <Link href="/find-internships" className="font-semibold text-scale-purple hover:underline">
          SuperInterns
        </Link>{" "}
        and filter by location or keywords like &quot;remote&quot; to see roles synced from company
        career pages.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">2. Company career pages</h3>
      <p>
        Some internships appear on company websites before they show up elsewhere. Make a list of
        30–50 target companies and check their student careers pages weekly during peak recruiting.
      </p>
      <p>Look for sections like:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Students and graduates</li>
        <li>Early careers</li>
        <li>University recruiting</li>
        <li>Internships</li>
        <li>Remote jobs</li>
        <li>Emerging talent programs</li>
      </ul>

      <h3 className="pt-1 text-lg font-bold text-slate-900">3. LinkedIn and alumni networks</h3>
      <p>
        LinkedIn is useful for finding postings, but it is even better for finding people. Search for
        employees who are alumni from your school, past interns, recruiters, or hiring managers. A
        polite message can lead to advice, a referral, or a clearer understanding of the role.
      </p>
      <p>Example search:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>School name + company + intern</li>
        <li>Company + university recruiter</li>
        <li>Remote intern + role title</li>
        <li>Summer intern + 2026 + company, to find past interns who may share timeline clues</li>
      </ul>

      <h3 className="pt-1 text-lg font-bold text-slate-900">4. Campus career centers</h3>
      <p>
        Even if you are applying to remote roles, your career center can help. Many schools have
        exclusive employer relationships, resume reviews, mock interviews, alumni databases, and
        career fairs that include remote-friendly employers.
      </p>
      <p>Use your school resources for:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Resume review</li>
        <li>Cover letter feedback</li>
        <li>Interview practice</li>
        <li>Salary and offer guidance</li>
        <li>Career fair prep</li>
        <li>Alumni introductions</li>
        <li>Internship funding or grants</li>
      </ul>

      <h3 className="pt-1 text-lg font-bold text-slate-900">
        5. Startups, nonprofits, and smaller organizations
      </h3>
      <p>
        Large companies are not the only path. Smaller teams may hire remote interns for content,
        operations, design, product research, data cleanup, customer success, community management,
        or software projects. These roles can be excellent if you want more responsibility.
      </p>
      <p>Where to look:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Startup job boards</li>
        <li>Nonprofit career pages</li>
        <li>Remote-first company lists</li>
        <li>Local businesses with online teams</li>
        <li>University incubators</li>
        <li>Founder communities</li>
      </ul>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        Roles that often offer remote summer internships
      </h2>
      <p>
        Remote internships are easier to find in roles where the work can be done with a laptop,
        online tools, and regular check-ins. Here are common categories.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Tech and data</h3>
      <ul className="list-disc space-y-2 pl-6">
        <li>Software engineering intern</li>
        <li>Web development intern</li>
        <li>QA testing intern</li>
        <li>Data analyst intern</li>
        <li>Machine learning research intern</li>
        <li>Cybersecurity intern</li>
        <li>Product management intern</li>
      </ul>
      <p>
        What helps: GitHub projects, class projects, hackathons, technical interview practice, and
        clear examples of what you built.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Business and operations</h3>
      <ul className="list-disc space-y-2 pl-6">
        <li>Business operations intern</li>
        <li>Strategy intern</li>
        <li>Sales operations intern</li>
        <li>Customer success intern</li>
        <li>Recruiting intern</li>
        <li>Project management intern</li>
      </ul>
      <p>
        What helps: spreadsheets, communication skills, research examples, process improvement
        projects, and comfort with tools like Google Sheets, Notion, Airtable, or CRM platforms.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Marketing, media, and communications</h3>
      <ul className="list-disc space-y-2 pl-6">
        <li>Digital marketing intern</li>
        <li>Social media intern</li>
        <li>Content marketing intern</li>
        <li>SEO intern</li>
        <li>Email marketing intern</li>
        <li>Communications intern</li>
        <li>Public relations intern</li>
      </ul>
      <p>
        What helps: writing samples, campaign examples, analytics screenshots, social content,
        newsletters, portfolio links, and proof you can meet deadlines.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Design and creative</h3>
      <ul className="list-disc space-y-2 pl-6">
        <li>Graphic design intern</li>
        <li>UX research intern</li>
        <li>Product design intern</li>
        <li>Video editing intern</li>
        <li>Motion graphics intern</li>
        <li>Brand design intern</li>
      </ul>
      <p>
        What helps: portfolio, case studies, before-and-after examples, Figma files, and a simple
        explanation of your design process.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        How to prepare before applications open
      </h2>
      <p>
        You do not need everything perfect before you start, but you do need the basics ready.
      </p>

      <BlogFigure
        src={IMG.preparation}
        alt="Remote internship preparation checklist for students"
        caption="Prepare your resume, portfolio, and search tools before applications open."
      />

      <h3 className="pt-1 text-lg font-bold text-slate-900">Build a one-page resume</h3>
      <p>
        Your resume should be easy to scan and tailored to the roles you want. Use bullets that show
        action and results.
      </p>
      <p>Instead of:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Helped with social media for club</li>
      </ul>
      <p>Try:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>
          Created 20 Instagram posts for a student organization, increasing average post engagement
          by 35 percent over one semester
        </li>
      </ul>
      <p>Resume checklist:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>One page unless you have a strong reason for more</li>
        <li>Education, expected graduation date, and relevant coursework</li>
        <li>Experience, projects, leadership, and skills</li>
        <li>Metrics where possible</li>
        <li>Strong action verbs</li>
        <li>No typos</li>
        <li>PDF file name like Firstname-Lastname-Resume.pdf</li>
      </ul>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Create role-specific resume versions</h3>
      <p>
        If you are applying to different roles, create different versions. A data resume should
        highlight analytics projects. A marketing resume should show writing, campaigns, and audience
        growth. A software resume should emphasize coding languages, projects, and technical
        experience.
      </p>
      <p>Keep versions organized with file names like:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Firstname-Lastname-Resume-Data.pdf</li>
        <li>Firstname-Lastname-Resume-Marketing.pdf</li>
        <li>Firstname-Lastname-Resume-SWE.pdf</li>
      </ul>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Build a simple portfolio or project page</h3>
      <p>
        A portfolio is not just for designers. It can help students in many fields prove their
        skills.
      </p>
      <p>Include:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>2–4 projects</li>
        <li>Short descriptions of the problem, your work, and the result</li>
        <li>Tools used</li>
        <li>Links to GitHub, writing samples, dashboards, Figma, videos, or slides</li>
        <li>A contact email</li>
      </ul>
      <p>
        If you do not have professional experience yet, use class projects, student organization
        work, personal projects, volunteer work, or case studies.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        How to track internship applications without getting overwhelmed
      </h2>
      <p>
        Remote recruiting gets messy fast. You might apply to 40 roles and receive emails from job
        boards, company portals, recruiters, calendar tools, and automated systems. A tracker
        prevents missed deadlines and repeated applications.
      </p>

      <BlogFigure
        src={IMG.gmail}
        alt="Gmail workflow and application tracker for internship search"
        caption="A simple Gmail workflow can keep recruiting emails from getting buried."
      />

      <h3 className="pt-1 text-lg font-bold text-slate-900">What to track</h3>
      <p>At minimum, track:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Company</li>
        <li>Role title</li>
        <li>Location or remote status</li>
        <li>Application link</li>
        <li>Date applied</li>
        <li>Deadline</li>
        <li>Status</li>
        <li>Recruiter or contact name</li>
        <li>Next step</li>
        <li>Follow-up date</li>
        <li>Notes</li>
      </ul>
      <p>Statuses can be simple:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Saved</li>
        <li>Applied</li>
        <li>Assessment</li>
        <li>Interviewing</li>
        <li>Offer</li>
        <li>Rejected</li>
        <li>Closed</li>
      </ul>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Use a Gmail-based workflow</h3>
      <p>If Gmail is where your recruiting emails land, turn it into your command center.</p>

      <h4 className="pt-1 text-base font-bold text-slate-900">Step 1: Create labels</h4>
      <p>Create labels like:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Internships - To Apply</li>
        <li>Internships - Applied</li>
        <li>Internships - Interviews</li>
        <li>Internships - Follow Up</li>
        <li>Internships - Offers</li>
        <li>Internships - Rejections</li>
      </ul>

      <h4 className="pt-1 text-base font-bold text-slate-900">Step 2: Use filters</h4>
      <p>Set filters for common recruiting words:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>internship</li>
        <li>application received</li>
        <li>interview</li>
        <li>assessment</li>
        <li>coding challenge</li>
        <li>recruiter</li>
        <li>schedule</li>
        <li>offer</li>
      </ul>
      <p>Have Gmail automatically apply labels or star messages that need action.</p>

      <h4 className="pt-1 text-base font-bold text-slate-900">Step 3: Create email templates</h4>
      <p>Save templates for common messages:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Thank-you email after interview</li>
        <li>Follow-up after applying</li>
        <li>Referral request</li>
        <li>Recruiter introduction</li>
        <li>Scheduling response</li>
      </ul>

      <h4 className="pt-1 text-base font-bold text-slate-900">Step 4: Connect Gmail to your tracker</h4>
      <p>
        After you apply, immediately add the role to your tracker. When an email comes in, update
        the status.{" "}
        <Link href="/tracker" className="font-semibold text-scale-purple hover:underline">
          SuperInterns
        </Link>{" "}
        syncs read-only Gmail to build a pipeline from recruiting emails, so you can keep everything
        in one place.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">A simple weekly tracking routine</h3>
      <p>Every Friday or Sunday:</p>
      <ol className="list-decimal space-y-2 pl-6">
        <li>Review all open applications.</li>
        <li>Move stale roles to closed if postings disappeared.</li>
        <li>Add follow-up dates for promising roles.</li>
        <li>Save 5–10 new internships.</li>
        <li>Apply to your top matches first.</li>
        <li>Check Gmail labels for anything you missed.</li>
      </ol>
      <p>This routine keeps your search active without making it your whole life.</p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        How many internships should you apply to?
      </h2>
      <p>
        There is no perfect number, but remote roles are competitive. A realistic target is{" "}
        <strong>5–10 quality applications per week</strong> during peak recruiting. Quality matters
        more than mass applying, but you still need enough volume to create opportunities.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">A balanced application strategy</h3>
      <p>Use a mix:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>40 percent roles that match your background well</li>
        <li>40 percent roles where you meet most requirements</li>
        <li>20 percent stretch roles at competitive companies</li>
      </ul>
      <p>
        Do not self-reject too much. If you meet around 60–70 percent of the listed qualifications
        and can explain your interest, apply.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        How to tailor your application quickly
      </h2>
      <p>
        Tailoring does not mean rewriting your resume from scratch each time. It means making small,
        smart edits so the employer can see the match.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">The 10-minute tailoring method</h3>
      <ol className="list-decimal space-y-2 pl-6">
        <li>Read the job description.</li>
        <li>Highlight 5–7 repeated skills or responsibilities.</li>
        <li>Move the most relevant resume bullets higher.</li>
        <li>Add keywords naturally where true.</li>
        <li>Adjust your project descriptions to match the role.</li>
        <li>Write a short cover letter only if it adds something useful.</li>
        <li>Save the exact resume version used in your tracker.</li>
      </ol>

      <h3 className="pt-1 text-lg font-bold text-slate-900">
        Example: tailoring for a remote marketing internship
      </h3>
      <p>
        If the posting mentions SEO, email campaigns, content calendars, and analytics, your resume
        should feature bullets about writing, research, traffic, engagement, newsletters, or Google
        Analytics. Your cover letter can briefly explain why you like remote content work and how you
        stay organized without in-person supervision.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        How to get referrals for remote internships
      </h2>
      <p>
        Referrals are not magic, but they can help your application get noticed. The best referral
        requests are specific, respectful, and easy to answer.
      </p>

      <BlogFigure
        src={IMG.referral}
        alt="Student referral outreach message example for internships"
        caption="A clear, respectful referral message makes it easier for people to help."
      />

      <h3 className="pt-1 text-lg font-bold text-slate-900">Who to ask</h3>
      <ul className="list-disc space-y-2 pl-6">
        <li>Alumni from your school</li>
        <li>Former interns</li>
        <li>Professors with industry connections</li>
        <li>Club leaders or older students</li>
        <li>Family friends in relevant fields</li>
        <li>People you met at career fairs or info sessions</li>
        <li>Mentors from programs, bootcamps, or communities</li>
      </ul>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Referral request template</h3>
      <div className="not-prose rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
        <p className="font-semibold text-slate-900">Subject: Quick question about Company Name internship</p>
        <p className="mt-3">Hi Name,</p>
        <p className="mt-2">
          I am a student at School studying Major, and I saw the Role Name internship at Company Name
          for summer 2027. I noticed your experience with Team or Field and would love to ask one or
          two quick questions about the role and company.
        </p>
        <p className="mt-2">
          If you think my background could be a fit, I would also be grateful for any advice on
          applying or whether referrals are possible. Here is my resume and the job link for context.
        </p>
        <p className="mt-2">
          Thank you for your time,
          <br />
          Name
        </p>
      </div>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Referral etiquette</h3>
      <ul className="list-disc space-y-2 pl-6">
        <li>Do not ask a stranger for a referral in the first sentence.</li>
        <li>Make it easy by including the role link and resume.</li>
        <li>Give them time to respond.</li>
        <li>Say thank you, even if they cannot help.</li>
        <li>Update them if you get an interview or offer.</li>
      </ul>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        How to contact recruiters and mentors
      </h2>
      <p>
        Recruiters and mentors can help you understand timelines, role fit, and interview
        expectations. Keep messages short and clear.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Recruiter message template</h3>
      <div className="not-prose rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
        <p>Hi Name,</p>
        <p className="mt-2">
          I am interested in the Remote Role Name internship for summer 2027. I recently applied and
          wanted to introduce myself. I am studying Major at School and have experience with Skill,
          Project, or Tool. I am excited about Company because Specific Reason.
        </p>
        <p className="mt-2">
          Thank you for your time, and I would appreciate any guidance on the recruiting timeline.
        </p>
        <p className="mt-2">
          Best,
          <br />
          Name
        </p>
      </div>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Mentor message template</h3>
      <div className="not-prose rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
        <p>Hi Name,</p>
        <p className="mt-2">
          I am preparing for remote summer 2027 internships in Field and noticed your background in
          Specific Area. Would you be open to a 15-minute chat sometime in the next two weeks? I
          would love advice on skills to build, applications, and interviews.
        </p>
        <p className="mt-2">
          Thank you,
          <br />
          Name
        </p>
      </div>

      <h3 className="pt-1 text-lg font-bold text-slate-900">What to ask in a mentor chat</h3>
      <ul className="list-disc space-y-2 pl-6">
        <li>What skills matter most for entry-level interns in this field?</li>
        <li>What would make a student resume stand out?</li>
        <li>How should I prepare for interviews?</li>
        <li>Are there companies or programs I should know about?</li>
        <li>What mistakes should I avoid?</li>
        <li>Is there anyone else you recommend I talk to?</li>
      </ul>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        How to prepare for remote internship interviews
      </h2>
      <p>
        Remote interviews test your skills and your ability to communicate online. Practicing ahead
        of time makes a huge difference.
      </p>

      <BlogFigure
        src={IMG.interview}
        alt="Remote internship interview preparation setup for students"
        caption="Practice your video setup and interview answers before the real call."
      />

      <h3 className="pt-1 text-lg font-bold text-slate-900">Set up your interview space</h3>
      <p>Before your first interview:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Test your camera and microphone.</li>
        <li>Use headphones if your environment is noisy.</li>
        <li>Sit facing light, not with a bright window behind you.</li>
        <li>Clean your background or use a simple virtual background.</li>
        <li>Close extra tabs and notifications.</li>
        <li>Keep your resume, job description, and notes nearby.</li>
        <li>Join 3–5 minutes early.</li>
      </ul>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Prepare behavioral stories</h3>
      <p>Use the STAR method:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Situation: What was happening?</li>
        <li>Task: What was your responsibility?</li>
        <li>Action: What did you do?</li>
        <li>Result: What changed?</li>
      </ul>
      <p>Prepare stories for:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Teamwork</li>
        <li>Leadership</li>
        <li>Conflict</li>
        <li>Learning something new</li>
        <li>Handling feedback</li>
        <li>Managing deadlines</li>
        <li>Solving a problem independently</li>
        <li>Working remotely or asynchronously</li>
      </ul>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Practice role-specific interviews</h3>
      <p>Different roles require different preparation.</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Software: coding problems, data structures, projects, debugging</li>
        <li>Data: SQL, spreadsheets, statistics, dashboards, business questions</li>
        <li>Marketing: writing samples, campaign ideas, analytics, audience research</li>
        <li>Design: portfolio walkthroughs, design decisions, user feedback</li>
        <li>Product: user problems, prioritization, product sense, communication</li>
        <li>Operations: process thinking, organization, spreadsheets, examples of ownership</li>
      </ul>
      <p>
        Use mock interviews, campus career services, peer practice, or{" "}
        <Link
          href="/practice-interviews"
          className="font-semibold text-scale-purple hover:underline"
        >
          AI mock interviews
        </Link>
        . Record yourself once if you can. It may feel awkward, but you will notice filler words,
        unclear answers, or lighting issues quickly.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Questions to ask the interviewer</h3>
      <p>Ask questions that show you care about doing the job well:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>What would a successful intern accomplish by the end of the summer?</li>
        <li>How does the team support remote interns?</li>
        <li>How often would I meet with my manager or mentor?</li>
        <li>What tools does the team use to collaborate?</li>
        <li>Are interns assigned one main project or multiple smaller tasks?</li>
        <li>How is feedback shared during the internship?</li>
      </ul>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        How to evaluate remote internship offers
      </h2>
      <p>
        An offer is exciting, but remote internships can differ a lot in quality. Compare more than
        the company name.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Offer evaluation checklist</h3>
      <ul className="list-disc space-y-2 pl-6">
        <li>Pay rate or stipend</li>
        <li>Expected weekly hours</li>
        <li>Start and end dates</li>
        <li>Remote location restrictions</li>
        <li>Time zone requirements</li>
        <li>Equipment or software provided</li>
        <li>Manager and mentor support</li>
        <li>Project clarity</li>
        <li>Learning opportunities</li>
        <li>Return offer potential</li>
        <li>Company reputation</li>
        <li>Fit with your academic schedule</li>
      </ul>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Red flags to watch for</h3>
      <p>Be careful if a posting or offer has:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>No clear company information</li>
        <li>Requests for payment to participate</li>
        <li>Vague unpaid work with full-time expectations</li>
        <li>No manager or learning plan</li>
        <li>Pressure to accept immediately</li>
        <li>Communication only through personal messaging apps</li>
        <li>Tasks that seem unrelated to the role</li>
      </ul>
      <p>
        If something feels off, ask your career center, a mentor, or a trusted adult to review it.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        Student discounts and resources that can help
      </h2>
      <p>
        Internship searching can involve resume tools, interview prep, project hosting, transportation
        for occasional events, and professional clothing for video interviews. Use student discounts
        and free resources wherever possible.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Free or discounted resources to check</h3>
      <ul className="list-disc space-y-2 pl-6">
        <li>Campus career center services</li>
        <li>University alumni database</li>
        <li>Student LinkedIn Learning access</li>
        <li>Free GitHub Student Developer Pack if eligible</li>
        <li>Notion, Figma, Canva, or design tool education plans</li>
        <li>Library access to business databases</li>
        <li>Student discounts on software and productivity tools</li>
        <li>Career grants or internship funding from your school</li>
        <li>Department newsletters and professor referrals</li>
      </ul>
      <p>
        Browse curated perks on{" "}
        <Link href="/resources" className="font-semibold text-scale-purple hover:underline">
          SuperInterns student resources
        </Link>
        .
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Build a low-cost internship search kit</h3>
      <p>You do not need fancy tools. Start with:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>A resume PDF</li>
        <li>A basic portfolio or project page</li>
        <li>A Gmail workflow</li>
        <li>A free internship tracker</li>
        <li>A calendar for deadlines and interviews</li>
        <li>A spreadsheet or notes app for networking contacts</li>
        <li>A short list of mentors, alumni, and recruiters</li>
      </ul>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        A 30-day plan to start your remote summer 2027 internship search
      </h2>
      <p>If you are not sure where to begin, follow this plan.</p>

      <BlogFigure
        src={IMG.plan30}
        alt="30 day plan for finding remote summer 2027 internships"
        caption="Follow a 30-day plan to build momentum in your remote internship search."
      />

      <h3 className="pt-1 text-lg font-bold text-slate-900">Week 1: Set up your foundation</h3>
      <ul className="list-disc space-y-2 pl-6">
        <li>Draft or update your resume.</li>
        <li>Create a free account on your preferred internship platform.</li>
        <li>Set up your application tracker.</li>
        <li>Create Gmail labels and filters.</li>
        <li>Write a basic outreach message.</li>
        <li>List 20 target companies.</li>
      </ul>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Week 2: Build proof of skills</h3>
      <ul className="list-disc space-y-2 pl-6">
        <li>Choose 1–2 projects to polish.</li>
        <li>Add project descriptions to your resume or portfolio.</li>
        <li>Ask a career center advisor or mentor to review your resume.</li>
        <li>Save 15 remote internship postings, even if some are not open yet.</li>
      </ul>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Week 3: Start applying and networking</h3>
      <ul className="list-disc space-y-2 pl-6">
        <li>Apply to 5–10 roles.</li>
        <li>Message 5 alumni, past interns, or mentors.</li>
        <li>Attend one career event, webinar, or info session.</li>
        <li>Update your tracker after every application.</li>
      </ul>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Week 4: Practice interviews and improve</h3>
      <ul className="list-disc space-y-2 pl-6">
        <li>Prepare 6 STAR stories.</li>
        <li>Practice one mock interview.</li>
        <li>Review common role-specific questions.</li>
        <li>Follow up on promising applications.</li>
        <li>Adjust your resume based on what postings keep asking for.</li>
      </ul>
      <p>Repeat this cycle monthly, increasing application volume during peak recruiting.</p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">Common mistakes to avoid</h2>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Waiting until spring 2027</h3>
      <p>
        Some roles will still open in spring, but you will miss many structured programs if you wait.
        Start early and keep checking.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Applying without tracking</h3>
      <p>
        You may forget deadlines, miss interview emails, or apply twice to the same role. Track
        everything.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Using the same resume for every role</h3>
      <p>
        A generic resume makes recruiters do the matching work. Make the match obvious.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Ignoring smaller companies</h3>
      <p>
        Remote internships at smaller teams can offer hands-on experience, mentorship, and real
        portfolio projects.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Not practicing video interviews</h3>
      <p>
        Strong answers can fall flat if your audio is poor, your environment is distracting, or your
        examples are unclear.
      </p>

      <h3 className="pt-1 text-lg font-bold text-slate-900">Forgetting to follow up</h3>
      <p>
        A short thank-you note after interviews and polite follow-ups after networking chats can help
        people remember you.
      </p>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">
        Final checklist for remote summer 2027 internships
      </h2>
      <ul className="space-y-2 pl-0">
        {[
          "A polished one-page resume",
          "Role-specific resume versions",
          "A basic portfolio or project page",
          "A list of target companies and roles",
          "A free account on an internship search platform",
          "An application tracker",
          "Gmail labels, filters, and templates",
          "5–10 outreach contacts",
          "Interview stories and practice plan",
          "A weekly search routine",
        ].map((item) => (
          <li key={item} className="flex gap-2.5 text-slate-700">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-violet-200 bg-violet-50 text-xs text-scale-purple">
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>

      <h2 className="pt-2 text-2xl font-bold text-slate-900">Your next step</h2>
      <p>
        The best way to reduce internship stress is to make the search visible and organized. Browse{" "}
        <Link href="/find-internships" className="font-semibold text-scale-purple hover:underline">
          remote summer 2027 internships
        </Link>
        , save roles that match your goals,{" "}
        <Link href="/login" className="font-semibold text-scale-purple hover:underline">
          create a free account
        </Link>
        , and start tracking applications before deadlines pile up.
      </p>
      <p>
        You do not need to have everything figured out today. Start with one resume update, one saved
        role, and one tracker entry. Then keep going. Small, consistent actions now can turn into
        interviews, referrals, and a remote internship offer for summer 2027.
      </p>
    </>
  );
}
