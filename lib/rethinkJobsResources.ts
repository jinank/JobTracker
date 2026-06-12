export type RethinkJobsResource = {
  id: string;
  title: string;
  tagline: string;
};

/** Free member perks from RethinkJobs. */
export const RETHINKJOBS_MEMBER_RESOURCES: RethinkJobsResource[] = [
  {
    id: "linkedin-profile-review",
    title: "LinkedIn review",
    tagline: "Profile feedback, free.",
  },
  {
    id: "resume-review",
    title: "Resume review",
    tagline: "Quick, actionable tips.",
  },
  {
    id: "linkedin-headshot",
    title: "Headshot generator",
    tagline: "LinkedIn-ready photo.",
  },
];

/** @deprecated Use RETHINKJOBS_MEMBER_RESOURCES */
export const RETHINKJOBS_COMING_SOON_RESOURCES = RETHINKJOBS_MEMBER_RESOURCES;

export const RESOURCE_IDS = new Set(
  RETHINKJOBS_MEMBER_RESOURCES.map((r) => r.id)
);

export function resourceTitle(id: string): string {
  return RETHINKJOBS_MEMBER_RESOURCES.find((r) => r.id === id)?.title ?? id;
}
