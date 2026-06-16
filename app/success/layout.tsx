import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Subscription confirmed",
  description: "Your Summer Internships Pro subscription is active.",
  path: "/success",
  noIndex: true,
});

export default function SuccessLayout({ children }: { children: ReactNode }) {
  return children;
}
