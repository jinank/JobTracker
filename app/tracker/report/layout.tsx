import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Application report",
  description:
    "See unique job applications by month, day, status, and company from your SuperInterns tracker.",
  path: "/tracker/report",
  noIndex: true,
});

export default function TrackerReportLayout({ children }: { children: ReactNode }) {
  return children;
}
