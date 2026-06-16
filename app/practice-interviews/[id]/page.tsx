import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PracticeInterviewSession } from "@/components/PracticeInterviewSession";
import { SiteNavMarketing } from "@/components/SiteNav";
import { buildPageMetadata } from "@/lib/seo";
import { getPracticeInterviewById } from "@/lib/practiceInterviewsData";

type Props = { params: { id: string } };

export function generateMetadata({ params }: Props): Metadata {
  const interview = getPracticeInterviewById(params.id);
  if (!interview) {
    return buildPageMetadata({
      title: "Practice interview",
      description: "AI mock interview practice for internship roles.",
      path: "/practice-interviews",
      noIndex: true,
    });
  }

  const description = `${interview.description} ${interview.durationMinutes}-minute ${interview.roleType} mock interview at ${interview.companyName}.`;

  return buildPageMetadata({
    title: `${interview.companyName} ${interview.title}`,
    description,
    path: `/practice-interviews/${interview.id}`,
    keywords: [
      `${interview.companyName} interview`,
      "mock interview",
      interview.roleType,
      "internship interview prep",
    ],
  });
}

export default function PracticeInterviewDetailPage({ params }: Props) {
  const interview = getPracticeInterviewById(params.id);
  if (!interview) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SiteNavMarketing />
      <main id="main-content" className="flex-1">
        <PracticeInterviewSession interview={interview} />
      </main>
    </div>
  );
}
