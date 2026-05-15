import { notFound } from "next/navigation";
import { PracticeInterviewSession } from "@/components/PracticeInterviewSession";
import { SiteNavMarketing } from "@/components/SiteNav";
import { getPracticeInterviewById } from "@/lib/practiceInterviewsData";

export default function PracticeInterviewDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const interview = getPracticeInterviewById(params.id);
  if (!interview) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SiteNavMarketing />
      <main className="flex-1">
        <PracticeInterviewSession interview={interview} />
      </main>
    </div>
  );
}
