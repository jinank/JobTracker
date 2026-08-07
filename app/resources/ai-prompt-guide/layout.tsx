import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "AI Prompt Guide PDF",
  description:
    "SuperInterns AI Prompt Guide — 15 playbooks from resume to offer. Request access and receive the PDF after approval.",
  path: "/resources/ai-prompt-guide",
  keywords: [
    "AI job search prompts",
    "internship resume prompts",
    "ChatGPT job search",
    "interview prep prompts",
  ],
});

export default function AiPromptGuideLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
