import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Resources & student perks",
  description:
    "LinkedIn and resume reviews, headshot tools, and curated student discounts.",
  path: "/resources",
  keywords: [
    "student discounts",
    "resume review",
    "LinkedIn review",
    "AI prompt guide",
    "internship resources",
  ],
});

export default function ResourcesLayout({ children }: { children: ReactNode }) {
  return children;
}
