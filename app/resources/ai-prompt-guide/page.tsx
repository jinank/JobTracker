import { Suspense } from "react";
import { SiteNavMarketing } from "@/components/SiteNav";
import { PromptGuideApp } from "@/components/PromptGuideApp";

export default function AiPromptGuidePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SiteNavMarketing />
      <main id="main-content" className="flex-1">
        <Suspense
          fallback={
            <div className="mx-auto max-w-3xl px-4 py-16 text-sm text-slate-500">
              Loading guide…
            </div>
          }
        >
          <PromptGuideApp />
        </Suspense>
      </main>
    </div>
  );
}
