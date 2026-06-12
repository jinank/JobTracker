import type { Metadata } from "next";
import { Suspense } from "react";
import { FindMentorsApp } from "@/components/FindMentorsApp";

export const metadata: Metadata = {
  title: "Find Mentors",
  description:
    "Find mentors, recruiters, and campus hiring contacts at any company. Reach out on LinkedIn for advice, referrals, and coffee chats, free for students.",
  alternates: { canonical: "/find-mentors" },
};

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
