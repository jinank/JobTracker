import type { Metadata } from "next";
import { InternshipsByStateIndex } from "@/components/InternshipsByStateIndex";
import { INTERNSHIP_LOCATION_INDEX_PATH } from "@/lib/internshipLocationPages";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Internships by State and City",
  description:
    "Browse summer 2027 internships by U.S. state and major city. New York, California, Texas, Florida, Illinois, and more from company career pages.",
  path: INTERNSHIP_LOCATION_INDEX_PATH,
  keywords: [
    "summer 2027 internships by state",
    "internships by state",
    "statewise internships",
    "USA internships",
    "summer 2027 internships",
  ],
  ogTitle: "Summer 2027 Internships by State and City",
});

export default function InternshipsByStatePage() {
  return <InternshipsByStateIndex />;
}
