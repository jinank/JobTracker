import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Summer 2027 Internships — find USA roles",
  description:
    "Browse Summer 2027 internships on company career pages, not buried on LinkedIn or Indeed. Built for students. Apply directly and track applications.",
  path: "/find-jobs",
  keywords: [
    "Summer 2027 Internships",
    "USA internships",
    "summer internships",
    "internship search",
    "student internships",
    "Greenhouse internships",
    "Lever internships",
  ],
  ogTitle: "Summer 2027 Internships — find USA roles",
});

export default function FindJobsLayout({ children }: { children: ReactNode }) {
  return children;
}
