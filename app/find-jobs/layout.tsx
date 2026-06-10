import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Find USA Internships – Student internship search | RethinkJobs",
  description:
    "Discover US internships on company career pages—not buried on LinkedIn or Indeed. Built for students. Apply directly and track applications.",
};

export default function FindJobsLayout({ children }: { children: ReactNode }) {
  return children;
}
