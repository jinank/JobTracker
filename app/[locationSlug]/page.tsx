import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocationInternshipsLanding } from "@/components/LocationInternshipsLanding";
import {
  getInternshipLocationPage,
  INTERNSHIP_LOCATION_PAGES,
} from "@/lib/internshipLocationPages";
import { queryInternships } from "@/lib/jobs/queryInternships";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: { locationSlug: string } };

export function generateStaticParams() {
  return INTERNSHIP_LOCATION_PAGES.map((page) => ({ locationSlug: page.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const page = getInternshipLocationPage(params.locationSlug);
  if (!page) {
    return buildPageMetadata({
      title: "Internships by location",
      description: "Browse US summer internships by city and state.",
      path: "/find-internships",
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: page.path,
    keywords: page.keywords,
    ogTitle: page.title,
  });
}

export default async function LocationInternshipsPage({ params }: Props) {
  const page = getInternshipLocationPage(params.locationSlug);
  if (!page) notFound();

  const initial = await queryInternships({
    search: "",
    roleCategory: "All roles",
    workType: "all",
    experienceLevel: "all",
    postedPreset: "all",
    locationQuery: "",
    locationMatchers: page.locationMatchers,
    sortField: "posted",
    sortDir: "asc",
    limit: 5000,
  });

  return <LocationInternshipsLanding page={page} initial={initial} />;
}
