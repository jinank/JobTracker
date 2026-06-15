import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Practice Interviews – AI mock interviews | ${SITE_NAME}`,
  description:
    "Improve your interview skills with AI-powered mock interviews tailored to top companies and roles.",
};

export default function PracticeInterviewsLayout({ children }: { children: ReactNode }) {
  return children;
}
