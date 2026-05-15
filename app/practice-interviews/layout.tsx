import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Practice Interviews – AI mock interviews | Rethinkjobs",
  description:
    "Improve your interview skills with AI-powered mock interviews tailored to top companies and roles.",
};

export default function PracticeInterviewsLayout({ children }: { children: ReactNode }) {
  return children;
}
