import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Pricing: Starter, Pro & Premium plans",
  description:
    "Starter Plan at $4.99/mo, Pro at $9.99/mo with 100 internship applications on your behalf, or Premium lifetime with a portfolio website.",
  path: "/pricing",
  keywords: [
    "internship tracker pricing",
    "starter plan",
    "upgrade to pro",
    "premium internship applications",
  ],
});

export default function PricingLayout({ children }: { children: ReactNode }) {
  return children;
}
