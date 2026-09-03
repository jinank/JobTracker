import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Verify student status",
  description:
    "Verify your student email so we can keep your status on file for member perks. Tracking and Auto Apply are on paid plans.",
  path: "/verify-student",
  keywords: ["student verification", "internship tools"],
});

export default function VerifyStudentLayout({ children }: { children: ReactNode }) {
  return children;
}
