import type { Metadata } from "next";
import { Suspense } from "react";
import { FindMentorsApp } from "@/components/FindMentorsApp";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Find mentors for Summer 2027 internship search",
  description:
    "Find mentors, recruiters, and campus hiring contacts for Summer 2027 internships. Reach out on LinkedIn for advice, referrals, and coffee chats — free for students.",
  path: "/find-mentors",
  keywords: [
    "Summer 2027 Internships",
    "find mentors",
    "recruiter search",
    "internship networking",
    "LinkedIn outreach",
  ],
});

export default function FindMentorsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-scale-purple border-t-transparent" />
        </div>
      }
    >
      <FindMentorsApp />
    </Suspense>
  );
}
