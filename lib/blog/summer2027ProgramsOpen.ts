export type ProgramListing = {
  title: string;
  applyUrl: string;
};

export type ProgramCompanySection = {
  id: string;
  company: string;
  roles: ProgramListing[];
};

/** Summer 2027 internship programs with live application pages (June 2026). */
export const SUMMER_2027_PROGRAMS_OPEN: ProgramCompanySection[] = [
  {
    id: "amazon",
    company: "Amazon",
    roles: [
      {
        title: "2027 Amazon Operations Finance Rotational Program Summer Internship",
        applyUrl:
          "https://www.amazon.jobs/en/jobs/10435673/2027-amazon-operations-finance-rotational-program-summer-internship",
      },
      {
        title: "2027 Amazon Finance Rotation Program, Accounting Intern",
        applyUrl:
          "https://amazon.jobs/en/jobs/10435671/2027-amazon-finance-rotation-program-accounting-intern",
      },
      {
        title: "2027 Amazon Finance Rotation Program, Business Unit Finance Intern",
        applyUrl:
          "https://amazon.jobs/en/jobs/10435672/2027-amazon-finance-rotation-program-business-unit-finance-intern",
      },
      {
        title: "2027 Tax Intern, Summer Internship",
        applyUrl: "https://www.amazon.jobs/en/jobs/10435122/2027-tax-intern-summer-internship",
      },
      {
        title: "2027 Applied Science Intern, Computer Vision",
        applyUrl:
          "https://www.amazon.jobs/en/jobs/10423323/2027-applied-science-intern-computer-vision-amazon-international-machine-learning",
      },
      {
        title: "2027 Applied Science Intern, Machine Learning search",
        applyUrl: "https://www.amazon.jobs/en/search?base_query=2027+applied+science+intern",
      },
    ],
  },
  {
    id: "goldman-sachs",
    company: "Goldman Sachs",
    roles: [
      {
        title: "2027 Summer Analyst Program, Americas",
        applyUrl:
          "https://www.goldmansachs.com/careers/students/programs-and-internships/americas/2027-summer-analyst-program",
      },
    ],
  },
  {
    id: "jpmorgan-chase",
    company: "JPMorgan Chase",
    roles: [
      {
        title: "2027 Markets Summer Analyst Program",
        applyUrl:
          "https://www.jpmorganchase.com/careers/explore-opportunities/programs/markets-summer-analyst",
      },
      {
        title: "2027 Commercial & Specialized Industries Summer Analyst Program",
        applyUrl:
          "https://www.jpmorganchase.com/careers/explore-opportunities/programs/csi-summer",
      },
      {
        title: "2027 Commercial & Investment Bank Risk Management Summer Analyst Program",
        applyUrl:
          "https://www.jpmorganchase.com/careers/explore-opportunities/programs/risk-summer-analyst",
      },
      {
        title: "2027 Asset Management Summer Analyst Program",
        applyUrl:
          "https://www.jpmorganchase.com/careers/explore-opportunities/programs/asset-management-summer-analyst",
      },
      {
        title: "2027 Global Payments Summer Analyst Program",
        applyUrl:
          "https://www.jpmorganchase.com/careers/explore-opportunities/programs/payments-summer",
      },
      {
        title: "2027 Commercial Real Estate Summer Analyst Program",
        applyUrl:
          "https://www.jpmorganchase.com/careers/explore-opportunities/programs/cre-summer",
      },
      {
        title: "2027 Global Private Bank Summer Analyst Program",
        applyUrl:
          "https://www.jpmorganchase.com/careers/explore-opportunities/programs/wealth-management-summer-analyst",
      },
    ],
  },
  {
    id: "citi",
    company: "Citi",
    roles: [
      {
        title: "Services Summer Analyst Program, New York City, US, 2027",
        applyUrl:
          "https://jobs.citi.com/job/new-york/services-summer-analyst-program-new-york-city-us-2027/287/93724104768",
      },
      {
        title: "Markets, Sales and Trading Summer Analyst, New York City, US, 2027",
        applyUrl:
          "https://jobs.citi.com/job/new-york/markets-sales-and-trading-summer-analyst-new-york-city-us-2027/287/89809477504",
      },
      {
        title: "Markets, Quantitative Analysis Summer Analyst, New York City, US, 2027",
        applyUrl:
          "https://jobs.citi.com/job/new-york/markets-quantitative-analysis-summer-analyst-new-york-city-us-2027/287/89809477472",
      },
    ],
  },
  {
    id: "blackrock",
    company: "BlackRock",
    roles: [
      {
        title: "2027 Summer Internship Program, Americas",
        applyUrl:
          "https://careers.blackrock.com/job/new-york/2027-summer-internship-program-amers/45831/90628276544",
      },
    ],
  },
  {
    id: "wells-fargo",
    company: "Wells Fargo",
    roles: [
      {
        title:
          "2027 Summer Internship, Corporate & Investment Banking Chief Operating Office",
        applyUrl:
          "https://www.wellsfargojobs.com/en/jobs/r-548718/2027-summer-internship-early-careers-corporate-investment-banking-chief-operating-office-coo/",
      },
    ],
  },
  {
    id: "barclays",
    company: "Barclays",
    roles: [
      {
        title: "Barclays internship and early careers search",
        applyUrl: "https://search.jobs.barclays/",
      },
    ],
  },
  {
    id: "rbc-capital-markets",
    company: "RBC Capital Markets",
    roles: [
      {
        title: "2027 Capital Markets Municipal Finance Summer Analyst",
        applyUrl:
          "https://rbc.wd3.myworkdayjobs.com/en-US/RBCEARLYTALENT1/job/XMLNAME-2027-Capital-Markets--Municipal-Finance-Summer-Analyst_R-0000157582-1",
      },
    ],
  },
  {
    id: "macquarie",
    company: "Macquarie",
    roles: [
      {
        title: "2026/2027 Summer Internship Program",
        applyUrl: "https://www.macquarie.com/au/en/careers/graduates-and-interns/our-programs.html",
      },
    ],
  },
  {
    id: "pwc",
    company: "PwC",
    roles: [
      {
        title: "Tax JD Intern, Summer 2027",
        applyUrl:
          'https://jobs.us.pwc.com/search-jobs?acm=ALL&alrpm=ALL&ascf=[{"key":"custom_fields.JobSeekerType","value":"Entry+Level"}]',
      },
      {
        title: "Washington DC Tax JD Intern, Summer 2027",
        applyUrl:
          "https://jobs.us.pwc.com/job/washington-d-c/washington-dc-tax-jd-intern-summer-2027/932/96571974576",
      },
    ],
  },
  {
    id: "ey",
    company: "EY",
    roles: [
      {
        title: "Assurance, Audit, 360 Careers Intern, Summer 2027",
        applyUrl: "https://eyglobal.yello.co/jobs/nX-4sKd1Sxb5NkR6umkZeQ?locale=en",
      },
    ],
  },
  {
    id: "ey-parthenon",
    company: "EY-Parthenon",
    roles: [
      {
        title: "Deals, Financial Diligence Summer Associate, Summer 2027",
        applyUrl: "https://eyglobal.yello.co/jobs/o09sZU2D4M1ok2vB14FlLg",
      },
    ],
  },
  {
    id: "google",
    company: "Google",
    roles: [
      {
        title: "Software Engineering Intern, Summer 2027",
        applyUrl:
          "https://www.google.com/about/careers/applications/jobs/results/120997883141857990-software-engineering-intern/",
      },
    ],
  },
  {
    id: "salesforce",
    company: "Salesforce",
    roles: [
      {
        title: "Summer 2027 Intern, Software Engineer",
        applyUrl:
          "https://salesforce.wd12.myworkdayjobs.com/External_Career_Site/job/California---San-Francisco/Summer-2027-Intern---Software-Engineer_JR340771-1",
      },
    ],
  },
  {
    id: "anduril",
    company: "Anduril",
    roles: [
      {
        title: "2027 Software Engineer Intern",
        applyUrl:
          "https://job-boards.greenhouse.io/andurilindustries/jobs/5148079007?gh_jid=5148079007",
      },
    ],
  },
  {
    id: "tsmc-arizona",
    company: "TSMC Arizona",
    roles: [
      {
        title: "Summer 2027 Internship Opportunities, Engineering Roles",
        applyUrl:
          "https://ro.careers.tsmc.com/job/Phoenix-Summer-2027-TSMC-AZ-Internship-Opportunities-Engineering-Roles-AZ-85001/1361003166/",
      },
      {
        title: "Summer 2027 Internship Opportunities, Facility Roles",
        applyUrl:
          "https://ro.careers.tsmc.com/job/Phoenix-Summer-2027-TSMC-AZ-Internship-Opportunities-Facility-Roles-AZ-85001/1362768366/",
      },
    ],
  },
  {
    id: "cargill",
    company: "Cargill",
    roles: [
      {
        title: "Food Safety, Quality and Regulatory Intern, Summer 2027",
        applyUrl:
          "https://careers.cargill.com/en/job/wichita/food-safety-quality-and-regulatory-intern-summer-2027/23251/93636462640",
      },
      {
        title: "Applications Food Scientist R&D Intern",
        applyUrl:
          "https://careers.cargill.com/en/job/wichita/applications-food-scientist-r-and-d-intern/23251/96621352544",
      },
      {
        title: "Campus Internship Search Page",
        applyUrl:
          'https://careers.cargill.com/en/search-jobs?acm=ALL&alrpm=ALL&ascf=[{"key":"job_type","value":"Campus"},{"key":"job_type","value":"University"}]',
      },
    ],
  },
  {
    id: "delta-air-lines",
    company: "Delta Air Lines",
    roles: [
      {
        title: "MBA Intern, Supply Chain Management, Summer 2027",
        applyUrl:
          "https://delta.avature.net/en_US/careers/JobDetail/MBA-Intern-Supply-Chain-Management-Summer-2027/32119",
      },
      {
        title: "MBA Intern, Commercial Strategy, Summer 2027",
        applyUrl:
          "https://delta.avature.net/en_US/careers/JobDetail/MBA-Intern-Commercial-Strategy-Summer-2027/32042",
      },
    ],
  },
  {
    id: "procter-gamble",
    company: "Procter & Gamble",
    roles: [
      {
        title: "2027 Legal Patent 2L Summer Intern",
        applyUrl: "https://www.pgcareers.com/us/en/legal-patent",
      },
    ],
  },
  {
    id: "red-ventures",
    company: "Red Ventures",
    roles: [
      {
        title: "Business Analyst Intern, Summer 2027 Prospect Pool",
        applyUrl:
          "https://jobs.leadedge.com/companies/red-ventures/jobs/71202224-we-re-planning-ahead-join-the-talent-pipeline-for-our-2027-business-analyst-internship",
      },
    ],
  },
  {
    id: "arthur-d-little",
    company: "Arthur D. Little",
    roles: [
      {
        title: "Summer Business Analyst 2027",
        applyUrl:
          "https://handshake-adlittle.icims.com/jobs/2117/summer-business-analyst-2027%2C-4---6-months-%28advanced-degree%29/job",
      },
    ],
  },
  {
    id: "koch",
    company: "Koch",
    roles: [
      {
        title: "Summer 2027 Business Analytics Internship",
        applyUrl:
          "https://koch.avature.net/en_US/CollegeRecruiting/JobDetail/United-States-Summer-2027-Business-Analytics-Internship/182558",
      },
      {
        title: "Summer 2027 Finance Analyst Internship",
        applyUrl:
          "https://koch.avature.net/en_US/CollegeRecruiting/JobDetail/United-States-Summer-2027-Finance-Analyst-Internship/182557",
      },
      {
        title: "Summer 2027 Accounting Analyst Internship",
        applyUrl:
          "https://koch.avature.net/en_US/CollegeRecruiting/JobDetail/United-States-Summer-2027-Accounting-Analyst-Internship/182555",
      },
      {
        title: "Spring or Summer 2027 Tax Transformation Internship",
        applyUrl:
          "https://koch.avature.net/en_US/careers/JobDetail/United-States-Spring-or-Summer-2027-Tax-Transformation-Internship/186762",
      },
      {
        title: "Spring or Summer 2027 Tax Internship, Atlanta",
        applyUrl:
          "https://koch.avature.net/en_US/CollegeRecruiting/JobDetail/United-States-Spring-or-Summer-2027-Tax-Internship-Atlanta/183167",
      },
    ],
  },
];
