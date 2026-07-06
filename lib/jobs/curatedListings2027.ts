/** Manually curated 2027 software internship listings (US). */
export type CuratedListingSeed = {
  externalId: string;
  title: string;
  company: string;
  applyUrl: string;
  postedAt: string;
  workType: "Remote" | "Hybrid" | "On-site";
  location: string;
  season?: string;
  salary?: string;
  industries?: string[];
  description: string;
};

export const CURATED_SOURCE = {
  company: "Curated listings",
  company_slug: "curated",
  ats: "greenhouse" as const,
  board_token: "superinterns-curated-2027",
  careers_url: "https://www.summer2027internships.com/find-internships",
};

export const CURATED_LISTINGS_2027: CuratedListingSeed[] = [
  {
    externalId: "6a2d15adfc0644749054bc60",
    title: "Software Engineer Intern - Backend Focused - Winter 2027",
    company: "Rippling",
    applyUrl:
      "https://jobright.ai/jobs/info/6a2d15adfc0644749054bc60?utm_source=1099&utm_campaign=Software%20Engineer",
    postedAt: "2026-06-16",
    workType: "Hybrid",
    location: "San Francisco, CA; New York, NY; Seattle, WA",
    season: "2027-Winter",
    industries: ["Bookkeeping and Payroll", "Employment"],
    description:
      "Previous internship/co-op experience in software engineering utilizing Python. Currently enrolled in a Bachelor's or Master's degree in computer science or related field graduating after the internship. Excellent cross-functional communication skills.",
  },
  {
    externalId: "6a2aab7ed3ec8317fe1448c6",
    title: "Full Stack Software Engineer Intern - Winter 2027",
    company: "Rippling",
    applyUrl:
      "https://jobright.ai/jobs/info/6a2aab7ed3ec8317fe1448c6?utm_source=1099&utm_campaign=Software%20Engineer",
    postedAt: "2026-06-16",
    workType: "On-site",
    location: "San Francisco, CA; New York, NY; Seattle, WA",
    season: "2027-Winter",
    industries: ["Bookkeeping and Payroll", "Employment"],
    description:
      "Backend Python and frontend JavaScript/HTML/CSS internship experience preferred. Enrolled in CS or related degree with graduation after the internship. Strong cross-functional communication.",
  },
  {
    externalId: "6a314c1ac477a5075f48c448",
    title: "Software Engineering Intern (Summer 2027)",
    company: "Circleback",
    applyUrl:
      "https://jobright.ai/jobs/info/6a314c1ac477a5075f48c448?utm_source=1099&utm_campaign=Software%20Engineer",
    postedAt: "2026-06-16",
    workType: "On-site",
    location: "San Francisco, CA",
    season: "2027-Summer",
    industries: ["Artificial Intelligence (AI)", "SaaS"],
    description:
      "Build features end-to-end: database models, API endpoints, and UI for web, desktop, and mobile. Improve AI-powered outcomes, search, transcription, app/API performance, and automations.",
  },
  {
    externalId: "6a2a484b495d985b994285aa",
    title: "Trading System Engineering Internship: Summer 2027",
    company: "Susquehanna International Group",
    applyUrl:
      "https://jobright.ai/jobs/info/6a2a484b495d985b994285aa?utm_source=1099&utm_campaign=Software%20Engineer",
    postedAt: "2026-06-12",
    workType: "On-site",
    location: "Bala Cynwyd, PA (Philadelphia Area)",
    season: "2027-Summer",
    industries: ["Finance", "Financial Services"],
    description:
      "Enrolled in bachelor's or master's in CS, CE, math, or related STEM. Strong C++, C, Rust, C#, or Java and some Python. Intended graduation with bachelor's and full-time start by August 2028.",
  },
  {
    externalId: "6a2bb8261de59e0682a89fce",
    title: "Internship – Engineer, NodeJS Services & AI (Spring 2027)",
    company: "Universal Orlando Resort",
    applyUrl:
      "https://jobright.ai/jobs/info/6a2bb8261de59e0682a89fce?utm_source=1099&utm_campaign=Software%20Engineer",
    postedAt: "2026-06-12",
    workType: "On-site",
    location: "Orlando, FL",
    season: "2027-Spring",
    description:
      "Pursuing Associate, Bachelor, or Graduate degree (sophomore+). Minimum 2.8 GPA. Transcript required upon application.",
  },
  {
    externalId: "6a2a29e72cde2824469c0471",
    title: "2027 Software Engineer Intern",
    company: "Anduril Industries",
    applyUrl:
      "https://job-boards.greenhouse.io/andurilindustries/jobs/5148079007?gh_jid=5148079007",
    postedAt: "2026-06-10",
    workType: "On-site",
    location: "Seattle, WA; Costa Mesa, CA; Boston, MA; Irvine, CA; Atlanta, GA",
    season: "2027",
    salary: "$45–$50/hr",
    industries: ["Aerospace", "Artificial Intelligence (AI)"],
    description:
      "Pursuing Bachelor's in CS, software engineering, math, physics, or related field. Rising senior returning to school after internship. Familiarity with algorithms, data structures, cloud, and front-end frameworks.",
  },
  {
    externalId: "6a2a2ba52cde2824469c0824",
    title: "Software Engineering Intern (Summer 2027)",
    company: "Circleback",
    applyUrl:
      "https://jobright.ai/jobs/info/6a2a2ba52cde2824469c0824?utm_source=1099&utm_campaign=Software%20Engineer",
    postedAt: "2026-06-10",
    workType: "On-site",
    location: "San Francisco, CA",
    season: "2027-Summer",
    salary: "$7K–$10K",
    industries: ["Artificial Intelligence (AI)", "SaaS"],
    description:
      "End-to-end feature development and product foundations including AI outcomes, search, transcription, streaming, performance, and automations.",
  },
  {
    externalId: "6a29efca2cde2824469bf6dd",
    title: "Spring 2027 Software Developer Internship - Undergraduate",
    company: "Blue Origin",
    applyUrl:
      "https://jobright.ai/jobs/info/6a29efca2cde2824469bf6dd?utm_source=1099&utm_campaign=Software%20Engineer",
    postedAt: "2026-06-10",
    workType: "On-site",
    location: "Denver, CO; Los Angeles, CA; Greater Seattle Area",
    season: "2027-Spring",
    salary: "$32/hr",
    industries: ["Aerospace", "Manufacturing"],
    description:
      "U.S. citizen or permanent resident. Undergraduate with at least one semester remaining after internship. Sophomore standing or above.",
  },
  {
    externalId: "6a2a2dd2495d985b99427900",
    title: "Spring 2027 Software Developer Internship - Graduate",
    company: "Blue Origin",
    applyUrl:
      "https://jobright.ai/jobs/info/6a2a2dd2495d985b99427900?utm_source=1099&utm_campaign=Software%20Engineer",
    postedAt: "2026-06-10",
    workType: "On-site",
    location: "Longmont, CO; Greater Seattle Area; Los Angeles, CA; Denver, CO",
    season: "2027-Spring",
    salary: "$38/hr",
    industries: ["Aerospace", "Manufacturing"],
    description:
      "U.S. citizen or permanent resident. Enrolled in graduate program with semester remaining after internship. Available full time for minimum 15 weeks.",
  },
  {
    externalId: "6a29e3c5495d985b99426849",
    title: "Spring 2027 Software Developer Internship - Graduate",
    company: "Blue Origin",
    applyUrl:
      "https://jobright.ai/jobs/info/6a29e3c5495d985b99426849?utm_source=1099&utm_campaign=Software%20Engineer",
    postedAt: "2026-06-10",
    workType: "On-site",
    location: "Denver, CO; Los Angeles, CA; Greater Seattle Area",
    season: "2027-Spring",
    salary: "$38/hr",
    industries: ["Aerospace", "Manufacturing"],
    description:
      "U.S. citizen or permanent resident. Graduate student with semester remaining after internship. Full-time availability for 15+ weeks.",
  },
  {
    externalId: "6a29c92f2cde2824469be97c",
    title: "Software Engineering Intern (Summer 2027)",
    company: "Circleback",
    applyUrl:
      "https://jobright.ai/jobs/info/6a29c92f2cde2824469be97c?utm_source=1099&utm_campaign=Software%20Engineer",
    postedAt: "2026-06-10",
    workType: "On-site",
    location: "San Francisco, CA",
    season: "2027-Summer",
    salary: "$7,000–$10,000/mo",
    industries: ["Artificial Intelligence (AI)", "SaaS"],
    description: "Junior and above. Experience with PostgreSQL and React.",
  },
  {
    externalId: "6a29ab70d3ec8317fe13fbb9",
    title: "Spring 2027 Software Developer Internship - Undergraduate",
    company: "Blue Origin",
    applyUrl:
      "https://jobright.ai/jobs/info/6a29ab70d3ec8317fe13fbb9?utm_source=1099&utm_campaign=Software%20Engineer",
    postedAt: "2026-06-10",
    workType: "On-site",
    location: "Denver, CO; Los Angeles, CA; Greater Seattle Area",
    season: "2027-Spring",
    salary: "$32/hr",
    industries: ["Aerospace", "Manufacturing"],
    description:
      "U.S. citizen or permanent resident. Undergraduate with semester remaining. Sophomore standing or above.",
  },
  {
    externalId: "6a2285ee94d89a1392b5202a",
    title: "Software Engineering Intern (Spring 2027)",
    company: "ASM",
    applyUrl:
      "https://jobright.ai/jobs/info/6a2285ee94d89a1392b5202a?utm_source=1099&utm_campaign=Software%20Engineer",
    postedAt: "2026-06-05",
    workType: "On-site",
    location: "Phoenix, AZ (Greater Phoenix Area)",
    season: "2027-Spring",
    industries: ["Electronics", "Manufacturing"],
    description:
      "Pursuing Bachelor's or Master's in CS, software engineering, computer engineering, or related field.",
  },
  {
    externalId: "6a2217ae7c30cc2cc516d5f4",
    title: "Software Developer Intern (New York) – Summer 2027",
    company: "The D. E. Shaw Group",
    applyUrl:
      "https://jobright.ai/jobs/info/6a2217ae7c30cc2cc516d5f4?utm_source=1099&utm_campaign=Software%20Engineer",
    postedAt: "2026-06-04",
    workType: "On-site",
    location: "New York, NY",
    season: "2027-Summer",
    salary: "$25,000/mo",
    industries: ["Financial Services", "Real Estate"],
    description:
      "Strong academic record in math, stats, physics, engineering, or CS. Problem-solving and programming in Python, Java, or C/C++.",
  },
  {
    externalId: "6a1f746ca507373dff6c15ea",
    title: "Software Engineer, Intern (Summer 2027)",
    company: "Aquatic Capital Management",
    applyUrl:
      "https://job-boards.greenhouse.io/aquaticcapitalmanagement/jobs/8489233002",
    postedAt: "2026-06-02",
    workType: "On-site",
    location: "Chicago, IL (Greater Chicago Area)",
    season: "2027-Summer",
    industries: ["Consulting", "Financial Services"],
    description:
      "BS, MS, or PhD in math, stats, ML, physics, or CS with graduation Fall 2027–Spring 2028. Python and/or C++. Strong algorithms and systems fundamentals.",
  },
  {
    externalId: "6a1e06efc2a87d6cd3e0f942",
    title: "Software Developer, Ph.D. Intern (New York) – Summer 2027",
    company: "The D. E. Shaw Group",
    applyUrl:
      "https://jobright.ai/jobs/info/6a1e06efc2a87d6cd3e0f942?utm_source=1099&utm_campaign=Software%20Engineer",
    postedAt: "2026-06-01",
    workType: "On-site",
    location: "New York, NY",
    season: "2027-Summer",
    salary: "$30,000/mo",
    industries: ["Financial Services", "Real Estate"],
    description:
      "PhD-track candidate with research productivity and strong programming in Python, Java, or C/C++.",
  },
  {
    externalId: "6a1d74a26b135014dbc96345",
    title: "Volatility Trading Developer Intern (Summer 2027)",
    company: "Walleye Capital",
    applyUrl:
      "https://job-boards.greenhouse.io/walleyecapital-external-students/jobs/4679434006",
    postedAt: "2026-06-01",
    workType: "On-site",
    location: "New York, NY",
    season: "2027-Summer",
    salary: "$14,000/mo",
    industries: ["Financial Services"],
    description:
      "Undergraduate or non-MBA master's with graduation Dec 2027–Jun 2028. Python, Java, or C++. Quantitative and analytical skills.",
  },
  {
    externalId: "6a1d749ce24ef36525837b4f",
    title: "Technology Intern (Summer 2027)",
    company: "Walleye Capital",
    applyUrl:
      "https://job-boards.greenhouse.io/walleyecapital-external-students/jobs/4681002006",
    postedAt: "2026-06-01",
    workType: "On-site",
    location: "New York, NY",
    season: "2027-Summer",
    salary: "$14,000/mo",
    industries: ["Financial Services"],
    description:
      "Undergraduate or non-MBA master's in CS or engineering, graduating Dec 2027–Jun 2028. Strong programming and problem-solving.",
  },
  {
    externalId: "6a2239fd4bdf8a5a96bdacff",
    title: "Infrastructure Engineer Co-op (Fall 2026 or Spring 2027)",
    company: "General Dynamics Mission Systems",
    applyUrl:
      "https://jobright.ai/jobs/info/6a2239fd4bdf8a5a96bdacff?utm_source=1099&utm_campaign=Software%20Engineer",
    postedAt: "2026-05-31",
    workType: "Hybrid",
    location: "Pittsfield, MA",
    season: "2027-Spring",
    industries: ["Collaboration", "Communication Hardware"],
    description:
      "Enrolled in CE, systems, software, EE, or ME (sophomore+ preferred). U.S. citizenship required.",
  },
  {
    externalId: "69fb9cb9ffa73664aeb0146f",
    title: "Software Engineer Intern Fall 2026/Winter 2027",
    company: "Skydio",
    applyUrl:
      "https://jobright.ai/jobs/info/69fb9cb9ffa73664aeb0146f?utm_source=1099&utm_campaign=Software%20Engineer",
    postedAt: "2026-05-28",
    workType: "On-site",
    location: "San Mateo, CA",
    season: "2027-Winter",
    salary: "$47–$58/hr",
    industries: ["Artificial Intelligence (AI)", "Drone Management"],
    description:
      "Solid CS fundamentals. Experience building web apps or backend systems. Python, Golang, and/or TypeScript.",
  },
  {
    externalId: "69f8e5710b36ff035475b297",
    title: "Spring 2027 Internship - Software",
    company: "Stoke Space",
    applyUrl:
      "https://jobright.ai/jobs/info/69f8e5710b36ff035475b297?utm_source=1099&utm_campaign=Software%20Engineer",
    postedAt: "2026-05-15",
    workType: "On-site",
    location: "Kent, WA",
    season: "2027-Spring",
    salary: "$28/hr",
    industries: ["Aerospace", "Product Design"],
    description:
      "Pursuing STEM degree. Project experience with Python, C, or Rust. Strong engineering fundamentals.",
  },
  {
    externalId: "69fae0acd21cf86d1e3cd79c",
    title: "Spring 2027 Internship - Software",
    company: "Stoke Space",
    applyUrl:
      "https://jobright.ai/jobs/info/69fae0acd21cf86d1e3cd79c?utm_source=1099&utm_campaign=Software%20Engineer",
    postedAt: "2026-05-04",
    workType: "On-site",
    location: "Kent, WA",
    season: "2027-Spring",
    salary: "$28–$40/hr",
    industries: ["Aerospace", "Product Design"],
    description:
      "Pursuing STEM degree. Project experience with Python, C, or Rust. Strong engineering fundamentals.",
  },
  {
    externalId: "69c59fe7aa9a29199e808355",
    title: "Software Engineer - 2027 Interns",
    company: "Ellipsis Labs",
    applyUrl:
      "https://jobright.ai/jobs/info/69c59fe7aa9a29199e808355?utm_source=1099&utm_campaign=Software%20Engineer",
    postedAt: "2026-03-26",
    workType: "Hybrid",
    location: "New York, NY",
    season: "2027",
    salary: "$10,000/mo",
    industries: ["Blockchain", "DeFi"],
    description:
      "Software experience in TypeScript, Python, Rust, Java, or C/C++. Solid CS fundamentals and Git. High agency, team-first mindset.",
  },
  {
    externalId: "6a26424ddedf78312c7b182a",
    title: "Software Engineering Intern (Fall 2026, Winter 2027)",
    company: "Waypoint",
    applyUrl:
      "https://jobright.ai/jobs/info/6a26424ddedf78312c7b182a?utm_source=1099&utm_campaign=Software%20Engineer",
    postedAt: "2026-03-09",
    workType: "On-site",
    location: "San Francisco, CA",
    season: "2027-Winter",
    salary: "$6K–$8K",
    industries: ["Artificial Intelligence (AI)", "Construction"],
    description:
      "Autonomy, persistence, and passion for details. Take tasks to completion on hard problems.",
  },
  {
    externalId: "linkedin-4432012069",
    title: "Construction Management Internship - Summer 2027",
    company: "Enerfab",
    applyUrl:
      "https://www.linkedin.com/jobs/view/construction-management-internship-summer-2027-at-enerfab-4432012069",
    postedAt: "2026-06-25",
    workType: "On-site",
    location: "Cincinnati, OH",
    season: "2027-Summer",
    industries: ["Construction", "Project Management"],
    description:
      "Enerfab is hiring a Summer 2027 construction management intern in Cincinnati. Sourced from InternPilot's Summer 2027 internship index; confirm details on LinkedIn before applying.",
  },
  {
    externalId: "linkedin-4317491342",
    title: "Tax Intern - Summer 2027",
    company: "Bennett Thrasher",
    applyUrl:
      "https://www.linkedin.com/jobs/view/tax-intern-summer-2027-at-bennett-thrasher-4317491342",
    postedAt: "2026-06-25",
    workType: "On-site",
    location: "Denver, CO",
    season: "2027-Summer",
    industries: ["Accounting", "Tax"],
    description:
      "Bennett Thrasher is hiring a Summer 2027 tax intern in Denver. Sourced from InternPilot's Summer 2027 internship index; confirm details on LinkedIn before applying.",
  },
  {
    externalId: "linkedin-4428026778",
    title: "Software Engineering Intern (Summer 2027)",
    company: "Circleback",
    applyUrl:
      "https://www.linkedin.com/jobs/view/software-engineering-intern-summer-2027-at-circleback-4428026778",
    postedAt: "2026-06-25",
    workType: "On-site",
    location: "San Francisco, CA",
    season: "2027-Summer",
    industries: ["Artificial Intelligence (AI)", "SaaS"],
    description:
      "Circleback is hiring a Summer 2027 software engineering intern in San Francisco. Sourced from InternPilot's Summer 2027 internship index; confirm details on LinkedIn before applying.",
  },
  {
    externalId: "linkedin-4429364433",
    title: "Philadelphia - Tax JD - Intern - Summer 2027",
    company: "PwC",
    applyUrl:
      "https://www.linkedin.com/jobs/view/philadelphia-tax-jd-intern-summer-2027-at-pwc-4429364433",
    postedAt: "2026-06-25",
    workType: "On-site",
    location: "Philadelphia, PA",
    season: "2027-Summer",
    industries: ["Accounting", "Tax"],
    description:
      "PwC is hiring a Summer 2027 Tax JD intern in Philadelphia. Sourced from InternPilot's Summer 2027 internship index; confirm details on LinkedIn before applying.",
  },
  {
    externalId: "linkedin-4429353465",
    title: "Irvine - Tax JD - Intern - Summer 2027",
    company: "PwC",
    applyUrl:
      "https://www.linkedin.com/jobs/view/irvine-tax-jd-intern-summer-2027-at-pwc-4429353465",
    postedAt: "2026-06-25",
    workType: "On-site",
    location: "Irvine, CA",
    season: "2027-Summer",
    industries: ["Accounting", "Tax"],
    description:
      "PwC is hiring a Summer 2027 Tax JD intern in Irvine. Sourced from InternPilot's Summer 2027 internship index; confirm details on LinkedIn before applying.",
  },
  {
    externalId: "linkedin-4429353468",
    title: "Cincinnati - Tax JD - Intern - Summer 2027",
    company: "PwC",
    applyUrl:
      "https://www.linkedin.com/jobs/view/cincinnati-tax-jd-intern-summer-2027-at-pwc-4429353468",
    postedAt: "2026-06-25",
    workType: "On-site",
    location: "Cincinnati, OH",
    season: "2027-Summer",
    industries: ["Accounting", "Tax"],
    description:
      "PwC is hiring a Summer 2027 Tax JD intern in Cincinnati. Sourced from InternPilot's Summer 2027 internship index; confirm details on LinkedIn before applying.",
  },
  {
    externalId: "linkedin-4429348729",
    title: "Detroit - Tax JD - Intern - Summer 2027",
    company: "PwC",
    applyUrl:
      "https://www.linkedin.com/jobs/view/detroit-tax-jd-intern-summer-2027-at-pwc-4429348729",
    postedAt: "2026-06-25",
    workType: "On-site",
    location: "Detroit, MI",
    season: "2027-Summer",
    industries: ["Accounting", "Tax"],
    description:
      "PwC is hiring a Summer 2027 Tax JD intern in Detroit. Sourced from InternPilot's Summer 2027 internship index; confirm details on LinkedIn before applying.",
  },
  {
    externalId: "linkedin-4426875202",
    title: "Summer 2027 Audit Internship",
    company: "Baker Tilly US",
    applyUrl:
      "https://www.linkedin.com/jobs/view/summer-2027-audit-internship-at-baker-tilly-us-4426875202",
    postedAt: "2026-06-25",
    workType: "On-site",
    location: "Pittston, PA",
    season: "2027-Summer",
    industries: ["Accounting", "Audit"],
    description:
      "Baker Tilly US is hiring a Summer 2027 audit intern in Pittston. Sourced from InternPilot's Summer 2027 internship index; confirm details on LinkedIn before applying.",
  },
  {
    externalId: "linkedin-4426874196",
    title: "Summer 2027 Tax Internship",
    company: "Baker Tilly US",
    applyUrl:
      "https://www.linkedin.com/jobs/view/summer-2027-tax-internship-at-baker-tilly-us-4426874196",
    postedAt: "2026-06-25",
    workType: "On-site",
    location: "Philadelphia, PA",
    season: "2027-Summer",
    industries: ["Accounting", "Tax"],
    description:
      "Baker Tilly US is hiring a Summer 2027 tax intern in Philadelphia. Sourced from InternPilot's Summer 2027 internship index; confirm details on LinkedIn before applying.",
  },
  {
    externalId: "linkedin-4429367078",
    title: "Cleveland - Tax JD - Intern - Summer 2027",
    company: "PwC",
    applyUrl:
      "https://www.linkedin.com/jobs/view/cleveland-tax-jd-intern-summer-2027-at-pwc-4429367078",
    postedAt: "2026-06-25",
    workType: "On-site",
    location: "Cleveland, OH",
    season: "2027-Summer",
    industries: ["Accounting", "Tax"],
    description:
      "PwC is hiring a Summer 2027 Tax JD intern in Cleveland. Sourced from InternPilot's Summer 2027 internship index; confirm details on LinkedIn before applying.",
  },
  {
    externalId: "linkedin-4429356481",
    title: "Pittsburgh - Tax JD - Intern - Summer 2027",
    company: "PwC",
    applyUrl:
      "https://www.linkedin.com/jobs/view/pittsburgh-tax-jd-intern-summer-2027-at-pwc-4429356481",
    postedAt: "2026-06-25",
    workType: "On-site",
    location: "Pittsburgh, PA",
    season: "2027-Summer",
    industries: ["Accounting", "Tax"],
    description:
      "PwC is hiring a Summer 2027 Tax JD intern in Pittsburgh. Sourced from InternPilot's Summer 2027 internship index; confirm details on LinkedIn before applying.",
  },
  {
    externalId: "linkedin-4429355502",
    title: "Atlanta - Tax JD - Intern - Summer 2027",
    company: "PwC",
    applyUrl:
      "https://www.linkedin.com/jobs/view/atlanta-tax-jd-intern-summer-2027-at-pwc-4429355502",
    postedAt: "2026-06-25",
    workType: "On-site",
    location: "Atlanta, GA",
    season: "2027-Summer",
    industries: ["Accounting", "Tax"],
    description:
      "PwC is hiring a Summer 2027 Tax JD intern in Atlanta. Sourced from InternPilot's Summer 2027 internship index; confirm details on LinkedIn before applying.",
  },
  {
    externalId: "linkedin-4429360471",
    title: "Chicago - Tax JD - Intern - Summer 2027",
    company: "PwC",
    applyUrl:
      "https://www.linkedin.com/jobs/view/chicago-tax-jd-intern-summer-2027-at-pwc-4429360471",
    postedAt: "2026-06-25",
    workType: "On-site",
    location: "Chicago, IL",
    season: "2027-Summer",
    industries: ["Accounting", "Tax"],
    description:
      "PwC is hiring a Summer 2027 Tax JD intern in Chicago. Sourced from InternPilot's Summer 2027 internship index; confirm details on LinkedIn before applying.",
  },
  {
    externalId: "linkedin-4426887079",
    title: "Summer 2027 Tax Internship",
    company: "Baker Tilly US",
    applyUrl:
      "https://www.linkedin.com/jobs/view/summer-2027-tax-internship-at-baker-tilly-us-4426887079",
    postedAt: "2026-06-25",
    workType: "On-site",
    location: "Lancaster, PA",
    season: "2027-Summer",
    industries: ["Accounting", "Tax"],
    description:
      "Baker Tilly US is hiring a Summer 2027 tax intern in Lancaster. Sourced from InternPilot's Summer 2027 internship index; confirm details on LinkedIn before applying.",
  },
  {
    externalId: "linkedin-4426884130",
    title: "Summer 2027 Tax Internship",
    company: "Baker Tilly US",
    applyUrl:
      "https://www.linkedin.com/jobs/view/summer-2027-tax-internship-at-baker-tilly-us-4426884130",
    postedAt: "2026-06-25",
    workType: "On-site",
    location: "Lehigh, PA",
    season: "2027-Summer",
    industries: ["Accounting", "Tax"],
    description:
      "Baker Tilly US is hiring a Summer 2027 tax intern in Lehigh. Sourced from InternPilot's Summer 2027 internship index; confirm details on LinkedIn before applying.",
  },
  {
    externalId: "linkedin-4426882116",
    title: "Summer 2027 Audit Internship",
    company: "Baker Tilly US",
    applyUrl:
      "https://www.linkedin.com/jobs/view/summer-2027-audit-internship-at-baker-tilly-us-4426882116",
    postedAt: "2026-06-25",
    workType: "On-site",
    location: "Lancaster, PA",
    season: "2027-Summer",
    industries: ["Accounting", "Audit"],
    description:
      "Baker Tilly US is hiring a Summer 2027 audit intern in Lancaster. Sourced from InternPilot's Summer 2027 internship index; confirm details on LinkedIn before applying.",
  },
  {
    externalId: "linkedin-4426874197",
    title: "Summer 2027 Tax Internship",
    company: "Baker Tilly US",
    applyUrl:
      "https://www.linkedin.com/jobs/view/summer-2027-tax-internship-at-baker-tilly-us-4426874197",
    postedAt: "2026-06-25",
    workType: "On-site",
    location: "Pittston, PA",
    season: "2027-Summer",
    industries: ["Accounting", "Tax"],
    description:
      "Baker Tilly US is hiring a Summer 2027 tax intern in Pittston. Sourced from InternPilot's Summer 2027 internship index; confirm details on LinkedIn before applying.",
  },
  {
    externalId: "linkedin-4429349487",
    title: "Houston - Tax JD - Intern - Summer 2027",
    company: "PwC",
    applyUrl:
      "https://www.linkedin.com/jobs/view/houston-tax-jd-intern-summer-2027-at-pwc-4429349487",
    postedAt: "2026-06-25",
    workType: "On-site",
    location: "Houston, TX",
    season: "2027-Summer",
    industries: ["Accounting", "Tax"],
    description:
      "PwC is hiring a Summer 2027 Tax JD intern in Houston. Sourced from InternPilot's Summer 2027 internship index; confirm details on LinkedIn before applying.",
  },
  {
    externalId: "linkedin-4429349483",
    title: "Sacramento - Tax JD - Intern - Summer 2027",
    company: "PwC",
    applyUrl:
      "https://www.linkedin.com/jobs/view/sacramento-tax-jd-intern-summer-2027-at-pwc-4429349483",
    postedAt: "2026-06-25",
    workType: "On-site",
    location: "Sacramento, CA",
    season: "2027-Summer",
    industries: ["Accounting", "Tax"],
    description:
      "PwC is hiring a Summer 2027 Tax JD intern in Sacramento. Sourced from InternPilot's Summer 2027 internship index; confirm details on LinkedIn before applying.",
  },
  {
    externalId: "linkedin-4426874198",
    title: "Summer 2027 Audit Internship",
    company: "Baker Tilly US",
    applyUrl:
      "https://www.linkedin.com/jobs/view/summer-2027-audit-internship-at-baker-tilly-us-4426874198",
    postedAt: "2026-06-25",
    workType: "On-site",
    location: "Lehigh, PA",
    season: "2027-Summer",
    industries: ["Accounting", "Audit"],
    description:
      "Baker Tilly US is hiring a Summer 2027 audit intern in Lehigh. Sourced from InternPilot's Summer 2027 internship index; confirm details on LinkedIn before applying.",
  },
];
