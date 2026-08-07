export type MemberResource = {
  id: string;
  title: string;
  tagline: string;
};

/** Free member perks for SuperInterns accounts. */
export const MEMBER_RESOURCES: MemberResource[] = [
  {
    id: "ai-prompt-guide",
    title: "AI Prompt Guide (PDF)",
    tagline: "15 playbooks from resume to offer. Request access.",
  },
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

export const RESOURCE_IDS = new Set(MEMBER_RESOURCES.map((r) => r.id));

export function resourceTitle(id: string): string {
  return MEMBER_RESOURCES.find((r) => r.id === id)?.title ?? id;
}
