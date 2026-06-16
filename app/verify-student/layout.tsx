import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Verify student status",
  description:
    "Verify your student email to unlock free unlimited access to internships, tracking, mock interviews, and member perks.",
  path: "/verify-student",
  keywords: ["student verification", "free internship tools"],
});

export default function VerifyStudentLayout({ children }: { children: ReactNode }) {
  return children;
}
