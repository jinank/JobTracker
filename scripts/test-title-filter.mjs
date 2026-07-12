import { shouldExcludeInternshipTitle } from "../lib/jobs/internshipTitleQuality.ts";

const titles = [
  "Omni Care Internship Culinary | Winter 2027",
  "Omni Care Internship Rooms | Winter 2027",
  "Omni Care Internship Pastry | Winter 2027",
  "Omni Care Internship Food & Beverage | Winter 2027",
  "Tech & Data Program Summer 2027 - Software Engineer Intern",
  "2027 Agronomy Internship",
  "Investment Banking Analyst Internship | Summer 2027 (NC)",
  "Genworth Finance Development Program Intern – Summer 2027",
  "Fall 2026/Spring 2027 - Project Management Intern - 904",
  "Summer 2027 Undergraduate Internship - FidHacks (Westlake)",
  "Engineering Internship- Alternative Fuels (Summer 2027)",
  "Intern Software Engineer - API Proxy Platform",
  "Cyber Security Intern",
  "Render ATL - Leadership Development Internship 2027",
  "Housing Summer Intern, CAMBA Legal Services,",
];

for (const t of titles) {
  console.log(shouldExcludeInternshipTitle(t) ? "EXCL" : "ok  ", t.slice(0, 60));
}
