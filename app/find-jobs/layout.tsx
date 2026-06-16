import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Find USA Internships",
  description:
    "Discover US internships on company career pages, not buried on LinkedIn or Indeed. Built for students. Apply directly and track applications.",
  path: "/find-jobs",
  keywords: [
    "USA internships",
    "summer internships",
    "internship search",
    "student internships",
    "Greenhouse internships",
    "Lever internships",
  ],
  ogTitle: "Find USA Internships — Student internship search",
});

export default function FindJobsLayout({ children }: { children: ReactNode }) {
  return children;
}
