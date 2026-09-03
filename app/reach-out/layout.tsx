import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Reach out to recruiters",
  description:
    "Find recruiters and hiring contacts at target companies to support your internship search.",
  path: "/reach-out",
  noIndex: true,
});

export default function ReachOutLayout({ children }: { children: ReactNode }) {
  return children;
}
