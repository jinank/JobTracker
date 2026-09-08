import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Practice interviews",
  description:
    "Improve your interview skills with AI-powered mock interviews tailored to top companies and internship roles.",
  path: "/practice-interviews",
  keywords: [
    "mock interview",
    "AI interview practice",
    "internship interview prep",
    "behavioral interview",
  ],
});

export default function PracticeInterviewsLayout({ children }: { children: ReactNode }) {
  return children;
}
