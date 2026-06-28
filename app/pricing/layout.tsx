import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Pricing: Free for students, Pro & Premium upgrades",
  description:
    "Free unlimited access for verified students. Upgrade to Pro ($9.99/mo) or Premium for done-for-you internship applications and a portfolio website.",
  path: "/pricing",
  keywords: [
    "internship tracker pricing",
    "free student plan",
    "upgrade to pro",
    "premium internship applications",
  ],
});

export default function PricingLayout({ children }: { children: ReactNode }) {
  return children;
}
