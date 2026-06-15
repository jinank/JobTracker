import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Resources – Free member perks & student discounts | ${SITE_NAME}`,
  description:
    `Free LinkedIn review, resume review, and headshot tools for ${SITE_NAME} members, plus curated student discounts on AI, dev tools, and more.`,
};

export default function ResourcesLayout({ children }: { children: ReactNode }) {
  return children;
}
