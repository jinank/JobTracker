import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Summer 2027 internship application tracker",
  description:
    "Track Summer 2027 internship and job applications synced from Gmail in one pipeline dashboard.",
  path: "/tracker",
});

export default function TrackerLayout({ children }: { children: ReactNode }) {
  return children;
}
