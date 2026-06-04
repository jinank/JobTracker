import { HiddenJobsExplorer } from "@/components/HiddenJobsExplorer";
import { SiteNavMarketing } from "@/components/SiteNav";

export default function FindJobsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteNavMarketing />
      <main className="flex-1">
        <HiddenJobsExplorer />
      </main>
    </div>
  );
}
