export type RethinkJobsResource = {
  id: string;
  title: string;
  tagline: string;
};

/** Free member perks from RethinkJobs (rolling out soon). */
export const RETHINKJOBS_COMING_SOON_RESOURCES: RethinkJobsResource[] = [
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
