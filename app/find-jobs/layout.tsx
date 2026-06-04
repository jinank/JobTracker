import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Hidden Job Search – Find roles on company sites | Rethinkjobs",
  description:
    "Discover jobs posted on company career pages—not buried on LinkedIn or Indeed. Less competition, apply directly.",
};

export default function FindJobsLayout({ children }: { children: ReactNode }) {
  return children;
}
