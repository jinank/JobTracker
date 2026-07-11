/**
 * Y Combinator portfolio companies we sync (and common Fantastic.jobs aliases).
 * Used by /y-combinator-summer-2027-internships company filter.
 */
import { listingMatchesCompanyMatchers } from "@/lib/findJobsFilters";

export type YcCompanySeed = {
  name: string;
  /** Matches job.companySlug and normalized job.company */
  matchers: string[];
};

export const YC_COMPANIES: YcCompanySeed[] = [
  { name: "Stripe", matchers: ["stripe"] },
  { name: "Airbnb", matchers: ["airbnb"] },
  { name: "DoorDash", matchers: ["doordash"] },
  { name: "Coinbase", matchers: ["coinbase"] },
  { name: "Instacart", matchers: ["instacart"] },
  { name: "Dropbox", matchers: ["dropbox"] },
  { name: "Reddit", matchers: ["reddit"] },
  { name: "Scale AI", matchers: ["scaleai", "scale ai"] },
  { name: "Gusto", matchers: ["gusto"] },
  { name: "Brex", matchers: ["brex"] },
  { name: "Ramp", matchers: ["ramp"] },
  { name: "Plaid", matchers: ["plaid"] },
  { name: "Flexport", matchers: ["flexport"] },
  { name: "Checkr", matchers: ["checkr"] },
  { name: "Webflow", matchers: ["webflow"] },
  { name: "Replit", matchers: ["replit"] },
  { name: "Mercury", matchers: ["mercury"] },
  { name: "Verkada", matchers: ["verkada"] },
  { name: "Labelbox", matchers: ["labelbox"] },
  { name: "Rippling", matchers: ["rippling"] },
  { name: "Faire", matchers: ["faire"] },
  { name: "Retool", matchers: ["retool"] },
  { name: "Zapier", matchers: ["zapier"] },
  { name: "Amplitude", matchers: ["amplitude"] },
  { name: "Segment", matchers: ["segment"] },
  { name: "Weebly", matchers: ["weebly"] },
  { name: "Close", matchers: ["close", "close.io", "closeio"] },
  { name: "Mixpanel", matchers: ["mixpanel"] },
  { name: "Heap", matchers: ["heap"] },
  { name: "Optimizely", matchers: ["optimizely"] },
  { name: "Loom", matchers: ["loom"] },
  { name: "Clipboard Health", matchers: ["clipboard health", "clipboardhealth"] },
  { name: "Whatnot", matchers: ["whatnot"] },
  { name: "Deel", matchers: ["deel"] },
  { name: "Ironclad", matchers: ["ironclad"] },
  { name: "Lattice", matchers: ["lattice"] },
  { name: "Ginkgo Bioworks", matchers: ["ginkgo", "ginkgo bioworks"] },
  { name: "Benchling", matchers: ["benchling"] },
  { name: "Meesho", matchers: ["meesho"] },
  { name: "Razorpay", matchers: ["razorpay"] },
];

/** Flat matcher list for internship filters (company name / slug). */
export const YC_COMPANY_MATCHERS: string[] = Array.from(
  new Set(YC_COMPANIES.flatMap((c) => c.matchers.map((m) => m.toLowerCase())))
);

export function isYcCompanyListing(company: string, companySlug: string): boolean {
  return listingMatchesCompanyMatchers(company, companySlug, YC_COMPANY_MATCHERS);
}
