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
        title: "Software Engineering Intern, BS, Summer 2027",
        applyUrl:
          "https://www.google.com/about/careers/applications/jobs/results/100648618540573382-software-engineering-intern-bs-summer-2027",
      },
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
      {
        title: "2027 Software Engineer Intern",
        applyUrl:
          "https://boards.greenhouse.io/andurilindustries/jobs/5231488007?gh_jid=5231488007",
      },
      {
        title: "2027 Electrical Engineer Intern",
        applyUrl:
          "https://job-boards.greenhouse.io/andurilindustries/jobs/5148101007?gh_jid=5148101007",
      },
      {
        title: "2027 Mechanical Engineer Intern",
        applyUrl:
          "https://job-boards.greenhouse.io/andurilindustries/jobs/5153187007?gh_jid=5153187007",
      },
      {
        title: "2027 Manufacturing Engineer Intern",
        applyUrl:
          "https://job-boards.greenhouse.io/andurilindustries/jobs/5153218007?gh_jid=5153218007",
      },
      {
        title: "2027 Hardware Engineer Intern",
        applyUrl:
          "https://boards.greenhouse.io/andurilindustries/jobs/5231555007?gh_jid=5231555007",
      },
      {
        title: "2027 Quality & Test Engineer Intern",
        applyUrl:
          "https://boards.greenhouse.io/andurilindustries/jobs/5231653007?gh_jid=5231653007",
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
    id: "imc",
    company: "IMC",
    roles: [
      {
        title: "Software Engineer Intern - Summer 2027",
        applyUrl: "https://job-boards.eu.greenhouse.io/imc/jobs/4823924101",
      },
      {
        title: "Quantitative Research Intern (BS/MS) - Summer 2027",
        applyUrl: "https://job-boards.eu.greenhouse.io/imc/jobs/4907399101",
      },
      {
        title: "Quantitative Research Intern (PhD) - Summer 2027",
        applyUrl: "https://job-boards.eu.greenhouse.io/imc/jobs/4907400101",
      },
      {
        title: "Quantitative Trader Intern - Summer 2027",
        applyUrl: "https://job-boards.eu.greenhouse.io/imc/jobs/4823923101",
      },
      {
        title: "Hardware Engineer Intern - Summer 2027",
        applyUrl: "https://job-boards.eu.greenhouse.io/imc/jobs/4823945101",
      },
      {
        title: "Machine Learning Research Intern - Summer 2027",
        applyUrl: "https://job-boards.eu.greenhouse.io/imc/jobs/4907430101",
      },
    ],
  },
  {
    id: "morgan-stanley",
    company: "Morgan Stanley",
    roles: [
      {
        title: "2027 Summer Analyst Program, Americas",
        applyUrl:
          "https://morganstanley.tal.net/vx/lang-en-GB/mobile-0/brand-2/xf-8f354508211d/candidate",
      },
    ],
  },
  {
    id: "bank-of-america",
    company: "Bank of America",
    roles: [
      {
        title: "Campus Internship and Full-Time Opportunities",
        applyUrl: "https://campus.bankofamerica.com/en-us",
      },
    ],
  },
  {
    id: "capital-one",
    company: "Capital One",
    roles: [
      {
        title: "Campus Internship Programs",
        applyUrl: "https://www.capitalonecareers.com/students",
      },
    ],
  },
  {
    id: "deloitte",
    company: "Deloitte",
    roles: [
      {
        title: "Campus Internship Opportunities",
        applyUrl: "https://apply.deloitte.com/careers/SearchJobs/?524=%5B729%5D",
      },
    ],
  },
  {
    id: "optiver",
    company: "Optiver",
    roles: [
      {
        title: "Software Engineer Intern (Summer 2027 - Chicago)",
        applyUrl: "https://www.optiver.com/join-us/jobs/8604760002/?gh_jid=8604760002",
      },
      {
        title: "Software Engineer Intern (Summer 2027 - Austin)",
        applyUrl: "https://www.optiver.com/join-us/jobs/8401052002/?gh_jid=8401052002",
      },
      {
        title: "Quantitative Intern (Summer 2027)",
        applyUrl: "https://www.optiver.com/join-us/jobs/8402215002/?gh_jid=8402215002",
      },
      {
        title: "Quantitative Research Intern, PhD (Summer 2027)",
        applyUrl: "https://www.optiver.com/join-us/jobs/8451781002/?gh_jid=8451781002",
      },
    ],
  },
  {
    id: "point72",
    company: "Point72",
    roles: [
      {
        title: "Summer 2027 Quantitative Research Internship",
        applyUrl:
          "https://boards.greenhouse.io/point72/jobs/7297642002?gh_jid=7297642002",
      },
      {
        title: "Point72 Academy Investment Analyst Program for Upcoming Graduates (2027 – US)",
        applyUrl:
          "https://boards.greenhouse.io/point72/jobs/8541241002?gh_jid=8541241002",
      },
    ],
  },
  {
    id: "virtu",
    company: "Virtu Financial",
    roles: [
      {
        title: "2027 Internship - Quant Research (Undergrad)",
        applyUrl: "https://job-boards.greenhouse.io/virtu/jobs/8142539002",
      },
      {
        title: "2027 Internship - Software Engineer",
        applyUrl: "https://job-boards.greenhouse.io/virtu/jobs/8624410002",
      },
      {
        title: "2027 Internship - Quantitative Trading",
        applyUrl: "https://job-boards.greenhouse.io/virtu/jobs/8624408002",
      },
    ],
  },
  {
    id: "aquatic-capital",
    company: "Aquatic Capital Management",
    roles: [
      {
        title: "Software Engineer, Intern (Summer 2027)",
        applyUrl:
          "https://job-boards.greenhouse.io/aquaticcapitalmanagement/jobs/8489233002",
      },
      {
        title: "Quantitative Researcher, Intern (Summer 2027)",
        applyUrl:
          "https://job-boards.greenhouse.io/aquaticcapitalmanagement/jobs/8489186002",
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
  {
    id: "spacex",
    company: "SpaceX",
    roles: [
      {
        title: "Summer 2027 Software Engineering Internship/Co-op",
        applyUrl: "https://boards.greenhouse.io/spacex/jobs/8621757002?gh_jid=8621757002",
      },
      {
        title: "Summer 2027 Engineering Internship/Co-op",
        applyUrl: "https://boards.greenhouse.io/spacex/jobs/8621740002?gh_jid=8621740002",
      },
      {
        title: "Spring 2027 Software Engineering Internship/Co-op",
        applyUrl: "https://boards.greenhouse.io/spacex/jobs/8621756002?gh_jid=8621756002",
      },
    ],
  },
  {
    id: "dropbox",
    company: "Dropbox",
    roles: [
      {
        title: "Software Engineering Intern (Summer 2027)",
        applyUrl: "https://jobs.dropbox.com/listing/8106224?gh_jid=8106224",
      },
    ],
  },
  {
    id: "roblox",
    company: "Roblox",
    roles: [
      {
        title: "[Summer 2027] Software Engineer Intern",
        applyUrl: "https://careers.roblox.com/jobs/8072713?gh_jid=8072713",
      },
      {
        title: "[Summer 2027] Product Management Intern",
        applyUrl: "https://careers.roblox.com/jobs/8143981?gh_jid=8143981",
      },
      {
        title: "[Summer 2027] Product Design Intern",
        applyUrl: "https://careers.roblox.com/jobs/8143984?gh_jid=8143984",
      },
    ],
  },
  {
    id: "vercel",
    company: "Vercel",
    roles: [
      {
        title: "Software Engineering Intern - Summer '27",
        applyUrl: "https://job-boards.greenhouse.io/vercel/jobs/6181759004",
      },
      {
        title: "Software Engineering Intern - Winter '27",
        applyUrl: "https://job-boards.greenhouse.io/vercel/jobs/6181755004",
      },
    ],
  },
  {
    id: "figma",
    company: "Figma",
    roles: [
      {
        title: "Software Engineer Intern (Winter 2027)",
        applyUrl: "https://boards.greenhouse.io/figma/jobs/6131089004?gh_jid=6131089004",
      },
    ],
  },
  {
    id: "databricks",
    company: "Databricks",
    roles: [
      {
        title: "Software Engineering Intern (2027 Start) - Winter",
        applyUrl:
          "https://databricks.com/company/careers/open-positions/job?gh_jid=8732364002",
      },
      {
        title: "Product Management Intern (Summer 2027)",
        applyUrl:
          "https://databricks.com/company/careers/open-positions/job?gh_jid=6883068002",
      },
    ],
  },
  {
    id: "nvidia",
    company: "NVIDIA",
    roles: [
      {
        title: "NVIDIA 2027 Internships: Software Engineering",
        applyUrl: "https://jobs.nvidia.com/careers/job/893397026205",
      },
      {
        title: "NVIDIA 2027 Internships: Systems Software Engineering",
        applyUrl: "https://jobs.nvidia.com/careers/job/893397026201",
      },
    ],
  },
  {
    id: "workiva",
    company: "Workiva",
    roles: [
      {
        title: "Summer 2027 Intern - Software Engineering",
        applyUrl:
          "https://workiva.wd503.myworkdayjobs.com/en-US/careers/job/USA---Remote/Summer-2027-Intern---Software-Engineering_R12190",
      },
    ],
  },
  {
    id: "mastercard",
    company: "Mastercard",
    roles: [
      {
        title: "Software Engineer Intern, Summer 2027 – United States",
        applyUrl:
          "https://mastercard.wd1.myworkdayjobs.com/en-US/Campus/job/OFallon-Missouri/Software-Engineer-Intern--Summer-2027---United-States_R-287618-1",
      },
    ],
  },
  {
    id: "mckesson",
    company: "McKesson",
    roles: [
      {
        title: "Software Engineer Intern - Summer 2027 (Longmont)",
        applyUrl:
          "https://mckesson.wd3.myworkdayjobs.com/en-US/External_Careers/job/USA-CO-Longmont/Software-Engineer-Intern---Summer-2027_JR0152469",
      },
      {
        title: "Software Engineer Intern - Summer 2027 (Atlanta)",
        applyUrl:
          "https://mckesson.wd3.myworkdayjobs.com/en-US/External_Careers/job/USA-GA-Atlanta/Software-Engineer-Intern---Summer-2027_JR0153235",
      },
    ],
  },
  {
    id: "c3-ai",
    company: "C3 AI",
    roles: [
      {
        title: "Software Engineer - Intern (Summer 2027)",
        applyUrl: "https://job-boards.greenhouse.io/c3ascend/jobs/8739036002",
      },
      {
        title: "Data Science - Intern (Summer 2027)",
        applyUrl: "https://job-boards.greenhouse.io/c3ascend/jobs/8738917002",
      },
    ],
  },
  {
    id: "appian",
    company: "Appian",
    roles: [
      {
        title: "Software Engineering Intern",
        applyUrl: "https://job-boards.greenhouse.io/appian/jobs/8041237",
      },
    ],
  },
  {
    id: "commure",
    company: "Commure",
    roles: [
      {
        title: "Software Engineering Intern, Summer 2027",
        applyUrl:
          "https://jobs.ashbyhq.com/commure/62841aa1-3ee5-4547-8380-637b737b2cb3",
      },
    ],
  },
  {
    id: "dv-trading",
    company: "DV Trading",
    roles: [
      {
        title: "Software Engineer Intern - Summer 2027 (DV Commodities)",
        applyUrl: "https://job-boards.greenhouse.io/dvtrading/jobs/4719119005",
      },
      {
        title: "Software Developer Intern - Summer 2027 (DV Equities)",
        applyUrl: "https://job-boards.greenhouse.io/dvtrading/jobs/4733138005",
      },
      {
        title: "AI Engineer Intern - Summer 2027",
        applyUrl: "https://job-boards.greenhouse.io/dvtrading/jobs/4732429005",
      },
    ],
  },
  {
    id: "akuna-capital",
    company: "Akuna Capital",
    roles: [
      {
        title: "Software Engineer Intern - C++, Summer 2027",
        applyUrl: "https://www.akunacapital.com/careers/job/8018847/?gh_jid=8018847",
      },
      {
        title: "Software Engineer Intern - Python, Summer 2027",
        applyUrl: "https://www.akunacapital.com/careers/job/8018853/?gh_jid=8018853",
      },
      {
        title: "Software Engineer Intern - Full Stack Web, Summer 2027",
        applyUrl: "https://www.akunacapital.com/careers/job/8018893/?gh_jid=8018893",
      },
      {
        title: "Quantitative Research Intern, Summer 2027",
        applyUrl: "https://www.akunacapital.com/careers/job/8036614/?gh_jid=8036614",
      },
    ],
  },
  {
    id: "five-rings",
    company: "Five Rings",
    roles: [
      {
        title: "Summer Intern 2027 - Software Developer",
        applyUrl: "https://job-boards.greenhouse.io/fiveringsllc/jobs/5349707008",
      },
      {
        title: "Summer Intern 2027 - Quantitative Trader",
        applyUrl: "https://job-boards.greenhouse.io/fiveringsllc/jobs/5139668008",
      },
    ],
  },
  {
    id: "waymo",
    company: "Waymo",
    roles: [
      {
        title: "2027 Summer Intern, BS, SysEng Software Engineer",
        applyUrl: "https://careers.withwaymo.com/jobs?gh_jid=8174099",
      },
      {
        title: "2027 Summer Intern, MS, Software Engineering, Behavior Test",
        applyUrl: "https://careers.withwaymo.com/jobs?gh_jid=8174504",
      },
      {
        title: "2027 Summer Intern, BS/MS, Pipeline and Test Health Engineer",
        applyUrl: "https://careers.withwaymo.com/jobs?gh_jid=8177651",
      },
    ],
  },
  {
    id: "lyft",
    company: "Lyft",
    roles: [
      {
        title: "Software Engineer Intern, Backend (Summer 2027)",
        applyUrl:
          "https://app.careerpuck.com/job-board/lyft/job/8767726002?gh_jid=8767726002",
      },
      {
        title: "Software Engineer Intern, Frontend (Summer 2027)",
        applyUrl:
          "https://app.careerpuck.com/job-board/lyft/job/8797819002?gh_jid=8797819002",
      },
      {
        title: "Software Engineer Intern, Fullstack (Summer 2027)",
        applyUrl:
          "https://app.careerpuck.com/job-board/lyft/job/8797859002?gh_jid=8797859002",
      },
      {
        title: "Software Engineer Intern, Machine Learning (Summer 2027)",
        applyUrl:
          "https://app.careerpuck.com/job-board/lyft/job/8802332002?gh_jid=8802332002",
      },
    ],
  },
  {
    id: "scale-ai",
    company: "Scale AI",
    roles: [
      {
        title: "Software Engineering Intern (Summer 2027)",
        applyUrl: "https://job-boards.greenhouse.io/scaleai/jobs/4730845005",
      },
    ],
  },
];
