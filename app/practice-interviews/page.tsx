import { PracticeInterviewsExplorer } from "@/components/PracticeInterviewsExplorer";
import { SiteNavMarketing } from "@/components/SiteNav";

export default function PracticeInterviewsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SiteNavMarketing />
      <main className="flex-1">
        <PracticeInterviewsExplorer />
      </main>
    </div>
  );
}
