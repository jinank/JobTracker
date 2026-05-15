import { StudentDealsExplorer } from "@/components/StudentDealsExplorer";
import { SiteNavMarketing } from "@/components/SiteNav";

export default function ResourcesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SiteNavMarketing />
      <main className="flex-1">
        <StudentDealsExplorer />
      </main>
    </div>
  );
}
