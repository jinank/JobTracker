import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Resources & student perks",
  description:
    "Free LinkedIn review, resume review, and headshot tools for members, plus curated student discounts on AI, dev tools, and more.",
  path: "/resources",
  keywords: ["student discounts", "resume review", "LinkedIn review", "internship resources"],
});

export default function ResourcesLayout({ children }: { children: ReactNode }) {
  return children;
}
