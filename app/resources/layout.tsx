import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Resources – Student discounts & tools | Rethinkjobs",
  description:
    "Curated student discounts on AI, dev tools, cloud credits, design software, and more. Verify offers on each provider's site.",
};

export default function ResourcesLayout({ children }: { children: ReactNode }) {
  return children;
}
