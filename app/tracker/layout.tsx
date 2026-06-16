import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Application tracker",
  description: "Track internship and job applications synced from Gmail in one pipeline dashboard.",
  path: "/tracker",
  noIndex: true,
});

export default function TrackerLayout({ children }: { children: ReactNode }) {
  return children;
}
