import type { Metadata } from "next";
import { LocationInternshipsLanding } from "@/components/LocationInternshipsLanding";
import { YC_SUMMER_2027_INTERNSHIPS_PAGE } from "@/lib/internshipTopicPages";
import { queryInternships } from "@/lib/jobs/queryInternships";
import { buildPageMetadata } from "@/lib/seo";

const page = YC_SUMMER_2027_INTERNSHIPS_PAGE;

export const metadata: Metadata = buildPageMetadata({
  title: page.title,
  description: page.description,
  path: page.path,
  keywords: page.keywords,
  ogTitle: page.title,
});

export default async function YcSummer2027InternshipsPage() {
  const initial = await queryInternships({
    search: "",
    roleCategory: "All roles",
    workType: "all",
    experienceLevel: "all",
    postedPreset: "all",
    locationQuery: "",
    companyMatchers: page.companyMatchers,
    sortField: "posted",
    sortDir: "asc",
    limit: 5000,
  });

  return <LocationInternshipsLanding page={page} initial={initial} />;
}
