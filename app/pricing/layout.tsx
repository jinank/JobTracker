import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Pricing",
  description:
    "Free for students. Pro Plan at $9.99/mo. Premium includes 100 applications on your behalf plus a free portfolio website.",
  path: "/pricing",
  keywords: ["internship tracker pricing", "free student plan", "job application tracker"],
});

export default function PricingLayout({ children }: { children: ReactNode }) {
  return children;
}
