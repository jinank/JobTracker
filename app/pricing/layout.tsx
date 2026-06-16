import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Pricing",
  description:
    "Free for students with verification. Track up to 50 applications on the free plan, or upgrade to Pro for unlimited Gmail sync and pipeline tracking.",
  path: "/pricing",
  keywords: ["internship tracker pricing", "free student plan", "job application tracker"],
});

export default function PricingLayout({ children }: { children: ReactNode }) {
  return children;
}
