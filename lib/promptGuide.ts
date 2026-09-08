export const PROMPT_GUIDE_RESOURCE_ID = "ai-prompt-guide";
export const PROMPT_GUIDE_PATH = "/resources/ai-prompt-guide";

export const PROMPT_GUIDE_STAGES = [
  {
    stage: 1 as const,
    title: "A resume that earns the interview",
    blurb: "Positioning, metrics, master resume, and ATS-ready tailoring.",
  },
  {
    stage: 2 as const,
    title: "Proof that makes you memorable",
    blurb: "Credibility portfolio, pitch, and LinkedIn that converts.",
  },
  {
    stage: 3 as const,
    title: "Conversations that unlock the door",
    blurb: "Recruiter outreach and mentor talks with a clear ask.",
  },
  {
    stage: 4 as const,
    title: "Walk in prepared. Walk out with the offer.",
    blurb: "Research, screening, technical prep, behavioral answers, and negotiation.",
  },
];

/** Outline only - full prompts ship as a PDF after access is approved. */
export const PROMPT_GUIDE_PLAYBOOK_TITLES = [
  "01 · Review Your Current Resume",
  "02 · Build Your Why-How-What Narrative",
  "03 · Add Metrics to Your Bullets",
  "04 · Build Your Master Resume",
  "05 · Tailoring & ATS Readiness",
  "06 · Credibility Portfolio",
  "07 · Credibility Pitch",
  "08 · LinkedIn: Headline, About & Featured",
  "09 · Outreach to Recruiters & Hiring Managers",
  "10 · Mentor Talks: Scripts, Intros & Questions",
  "11 · Interview Research",
  "12 · Tricky Screening Questions",
  "13 · Technical Interview Prep",
  "14 · Situational Answers",
  "15 · Salary Expectations & Negotiation",
] as const;
