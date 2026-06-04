import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Resources – Free member perks & student discounts | Rethinkjobs",
  description:
    "Free LinkedIn review, resume review, and headshot tools for RethinkJobs members, plus curated student discounts on AI, dev tools, and more.",
};

export default function ResourcesLayout({ children }: { children: ReactNode }) {
  return children;
}
