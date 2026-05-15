export type InterviewType = "BEHAVIOURAL" | "PRODUCT_SENSE" | "TECHNICAL";

export type PracticeInterview = {
  id: string;
  companySlug: string;
  companyName: string;
  interviewType: InterviewType;
  roleType: string;
  title: string;
  description: string;
  durationMinutes: number;
  /** Extra context for the AI mock interviewer. */
  interviewerBrief: string;
};

export const INTERVIEW_TYPE_LABELS: Record<InterviewType, string> = {
  BEHAVIOURAL: "Behavioural",
  PRODUCT_SENSE: "Product sense",
  TECHNICAL: "Technical",
};

export const INTERVIEW_TYPE_OPTIONS: InterviewType[] = [
  "BEHAVIOURAL",
  "PRODUCT_SENSE",
  "TECHNICAL",
];

const shared = {
  microsoft: { companySlug: "microsoft", companyName: "Microsoft" },
  google: { companySlug: "google", companyName: "Google" },
  amazon: { companySlug: "amazon", companyName: "Amazon" },
} as const;

export const PRACTICE_INTERVIEWS: PracticeInterview[] = [
  {
    id: "microsoft-ai-engineer-behavioural",
    ...shared.microsoft,
    interviewType: "BEHAVIOURAL",
    roleType: "AI Engineer",
    title: "AI Engineer Interview",
    durationMinutes: 8,
    description:
      "Evaluates growth mindset, customer orientation, and cross-team collaboration in an AI engineering context.",
    interviewerBrief:
      "Conduct a Microsoft-style behavioural interview for an AI Engineer. Use STAR prompts about learning from failure, customer obsession, and collaboration across PM/Eng/Design.",
  },
  {
    id: "microsoft-ai-engineer-product-sense",
    ...shared.microsoft,
    interviewType: "PRODUCT_SENSE",
    roleType: "AI Engineer",
    title: "AI Engineer Interview",
    durationMinutes: 8,
    description:
      "Design an enterprise-ready feature that summarizes meetings and generates action items. Discuss Responsible AI, privacy, reliability, and cost.",
    interviewerBrief:
      "Run a product-sense case for an AI Engineer: meeting summarization with action items. Probe Responsible AI, privacy, reliability, latency, and cost trade-offs.",
  },
  {
    id: "microsoft-data-analyst-behavioural",
    ...shared.microsoft,
    interviewType: "BEHAVIOURAL",
    roleType: "Data Analyst",
    title: "Data Analyst Interview",
    durationMinutes: 8,
    description:
      "Focus on influencing stakeholders, improving processes, exceeding expectations, and handling complex challenges.",
    interviewerBrief:
      "Microsoft behavioural loop for Data Analyst: stakeholder influence, process improvement, ambiguity, and delivering beyond expectations.",
  },
  {
    id: "microsoft-data-analyst-product-sense",
    ...shared.microsoft,
    interviewType: "PRODUCT_SENSE",
    roleType: "Data Analyst",
    title: "Data Analyst Interview",
    durationMinutes: 8,
    description:
      "Use analytics to solve business problems, evaluate marketing strategies, and influence strategic decisions.",
    interviewerBrief:
      "Product/analytics case: define metrics, diagnose a feature or campaign, recommend experiments, and communicate insights to leadership.",
  },
  {
    id: "microsoft-product-designer-behavioural",
    ...shared.microsoft,
    interviewType: "BEHAVIOURAL",
    roleType: "Product Designer",
    title: "Product Designer Interview",
    durationMinutes: 8,
    description:
      "Assess leadership, decision-making, and collaboration in complex product environments aligned to Microsoft culture.",
    interviewerBrief:
      "Behavioural interview for Product Designer: conflict with PM/Eng, design critiques, inclusive design decisions, and shipping under constraints.",
  },
  {
    id: "microsoft-product-designer-product-sense",
    ...shared.microsoft,
    interviewType: "PRODUCT_SENSE",
    roleType: "Product Designer",
    title: "Product Designer Interview",
    durationMinutes: 8,
    description:
      "Comprehensive product thinking, inclusive design, and collaboration applied to real-world problems.",
    interviewerBrief:
      "Product design case at Microsoft scale: personas, flows, accessibility, Fluent/Material-adjacent patterns, and success metrics.",
  },
  {
    id: "microsoft-pm-product-sense",
    ...shared.microsoft,
    interviewType: "PRODUCT_SENSE",
    roleType: "Product Manager",
    title: "Microsoft Product Manager Product Sense Interview",
    durationMinutes: 6,
    description:
      "Strategic thinking on a real Microsoft product problem: analyze the opportunity, propose solutions, and outline implementation aligned to mission and values.",
    interviewerBrief:
      "PM product sense case tied to a Microsoft product. Expect problem framing, prioritization, GTM/experiment outline, and risks.",
  },
  {
    id: "microsoft-swe-technical",
    ...shared.microsoft,
    interviewType: "TECHNICAL",
    roleType: "Software Engineer",
    title: "Microsoft Software Engineer Technical Interview",
    durationMinutes: 6,
    description:
      "Problem-solving with algorithms and data structures. Discuss approach, optimization, and follow-up questions.",
    interviewerBrief:
      "Technical screen: one coding problem (medium difficulty), clarify constraints, expect optimal approach discussion and complexity analysis.",
  },
  {
    id: "google-ai-engineer-behavioural",
    ...shared.google,
    interviewType: "BEHAVIOURAL",
    roleType: "AI Engineer",
    title: "AI Engineer Interview",
    durationMinutes: 8,
    description:
      "Leadership, cognitive ability, and role knowledge—problem-solving, decision-making, cross-functional collaboration, and resilience.",
    interviewerBrief:
      "Google behavioural (Googliness + leadership): AI/ML project ownership, ambiguity, and collaboration with research or infra teams.",
  },
  {
    id: "google-ai-engineer-product-sense",
    ...shared.google,
    interviewType: "PRODUCT_SENSE",
    roleType: "AI Engineer",
    title: "AI Engineer Interview",
    durationMinutes: 8,
    description:
      "Design systems and data strategy challenges. Evaluate communication and collaboration skills.",
    interviewerBrief:
      "Product/ML systems case: ranking, safety, evaluation metrics, data pipelines, and how to ship an AI feature in a Google surface.",
  },
  {
    id: "google-data-analyst-behavioural",
    ...shared.google,
    interviewType: "BEHAVIOURAL",
    roleType: "Data Analyst",
    title: "Data Analyst Behavioral Interview",
    durationMinutes: 8,
    description:
      "Data-driven decisions, stakeholder management, prioritization, and learning from failures.",
    interviewerBrief:
      "Behavioural loop for analysts: influence without authority, conflicting data narratives, and prioritization under deadlines.",
  },
  {
    id: "google-data-analyst-product-sense",
    ...shared.google,
    interviewType: "PRODUCT_SENSE",
    roleType: "Data Analyst",
    title: "Data Analyst Interview",
    durationMinutes: 8,
    description:
      "Diagnose impact of a feature change, propose an experiment plan, and communicate insights effectively.",
    interviewerBrief:
      "Analytics case: define north-star and guardrails, experiment design, interpretation, and executive summary of results.",
  },
  {
    id: "google-product-designer-behavioural",
    ...shared.google,
    interviewType: "BEHAVIOURAL",
    roleType: "Product Designer",
    title: "Product Designer Behavioral Interview",
    durationMinutes: 8,
    description:
      "Balance user needs and business goals, cross-functional collaboration, ambiguity, leadership, and adaptability.",
    interviewerBrief:
      "Google design behavioural: trade-offs with PM/Eng, accessibility advocacy, and handling critical feedback.",
  },
  {
    id: "google-product-designer-case",
    ...shared.google,
    interviewType: "PRODUCT_SENSE",
    roleType: "Product Designer",
    title:
      "Google Product Designer Case Interview — Product Sense, Systems Thinking, and Execution",
    durationMinutes: 8,
    description:
      "Ambiguous user problem on a core Google surface (Maps, Photos, Search, YouTube, or Workspace). End-to-end design with engineering awareness at billions-of-users scale.",
    interviewerBrief:
      "Full design case with timeboxes: clarify users/constraints, metrics, solution exploration, feasibility, v0/v1, experiments, and recap. Emphasize privacy, abuse, a11y, and i18n.",
  },
  {
    id: "google-product-designer-product-sense-short",
    ...shared.google,
    interviewType: "PRODUCT_SENSE",
    roleType: "Product Designer",
    title: "Product Designer Interview",
    durationMinutes: 4,
    description:
      "Problem-solving, design thinking, user-first thinking, accessibility, inclusion, and data-informed decisions.",
    interviewerBrief:
      "Shorter product sense prompt for designers: one focused improvement on a Google product with clear success metrics.",
  },
  {
    id: "google-product-designer-behavioural-short",
    ...shared.google,
    interviewType: "BEHAVIOURAL",
    roleType: "Product Designer",
    title: "Product Designer Interview",
    durationMinutes: 4,
    description:
      "Collaboration, problem definition, decision making, and inclusive design.",
    interviewerBrief:
      "Compact behavioural: one deep STAR story on inclusive design or cross-functional conflict resolution.",
  },
  {
    id: "google-pm-product-sense",
    ...shared.google,
    interviewType: "PRODUCT_SENSE",
    roleType: "Product Manager",
    title: "Product Manager Interview",
    durationMinutes: 6,
    description:
      "Strategize, solve problems, and make decisions through real-world product challenges.",
    interviewerBrief:
      "Google PM product sense: user segmentation, problem prioritization, solution sketch, metrics, and launch risks.",
  },
  {
    id: "google-swe-product-sense",
    ...shared.google,
    interviewType: "PRODUCT_SENSE",
    roleType: "Software Engineer",
    title: "Software Engineer Interview",
    durationMinutes: 6,
    description:
      "Problem-solving and clear articulation of thought process on product-tinged technical questions.",
    interviewerBrief:
      "SWE product/technical hybrid: system design light or coding with emphasis on clarity, trade-offs, and testing.",
  },
  {
    id: "amazon-ai-engineer-behavioural",
    ...shared.amazon,
    interviewType: "BEHAVIOURAL",
    roleType: "AI Engineer",
    title: "AI Engineer Interview",
    durationMinutes: 8,
    description:
      "Decision-making, leadership, and customer obsession within AI Engineering (Leadership Principles).",
    interviewerBrief:
      "Amazon LP behavioural for AI Engineer: Customer Obsession, Dive Deep, Invent and Simplify, and Earn Trust with STAR format.",
  },
  {
    id: "amazon-ai-engineer-product-sense",
    ...shared.amazon,
    interviewType: "PRODUCT_SENSE",
    roleType: "AI Engineer",
    title: "AI Engineer Interview",
    durationMinutes: 8,
    description:
      "Conceptual design of AI systems: datasets, model choices, categorization, and recommendation strategies.",
    interviewerBrief:
      "Amazon-style AI product case: personalization/recommendations, data needs, offline/online eval, and operational metrics.",
  },
  {
    id: "meta-swe-technical",
    companySlug: "meta",
    companyName: "Meta",
    interviewType: "TECHNICAL",
    roleType: "Software Engineer",
    title: "Software Engineer Technical Interview",
    durationMinutes: 6,
    description:
      "Coding and problem decomposition with emphasis on clean communication and iterative refinement.",
    interviewerBrief:
      "Meta technical: one algorithm problem, follow-ups on optimization and edge cases. Keep pace brisk.",
  },
  {
    id: "apple-pm-product-sense",
    companySlug: "apple",
    companyName: "Apple",
    interviewType: "PRODUCT_SENSE",
    roleType: "Product Manager",
    title: "Product Manager Interview",
    durationMinutes: 8,
    description:
      "Craft and simplicity: improve a core Apple experience with privacy-first, hardware-software integration in mind.",
    interviewerBrief:
      "Apple PM case: minimal, opinionated product direction; privacy; ecosystem constraints; premium UX.",
  },
  {
    id: "stripe-swe-technical",
    companySlug: "stripe",
    companyName: "Stripe",
    interviewType: "TECHNICAL",
    roleType: "Software Engineer",
    title: "Software Engineer Technical Interview",
    durationMinutes: 6,
    description:
      "Practical coding with attention to API design, reliability, and clear reasoning about trade-offs.",
    interviewerBrief:
      "Stripe-flavored technical: practical problem, discuss API/errors/idempotency if relevant to solution.",
  },
  {
    id: "netflix-data-analyst-product-sense",
    companySlug: "netflix",
    companyName: "Netflix",
    interviewType: "PRODUCT_SENSE",
    roleType: "Data Analyst",
    title: "Data Analyst Interview",
    durationMinutes: 8,
    description:
      "Metrics for engagement, experimentation on content surfaces, and communicating insights to product partners.",
    interviewerBrief:
      "Netflix analytics case: retention/engagement metrics, experiment on content discovery, and stakeholder-ready insights.",
  },
];

export const ROLE_TYPE_OPTIONS: string[] = [
  ...new Set(PRACTICE_INTERVIEWS.map((i) => i.roleType)),
].sort();

export const COMPANY_OPTIONS: { slug: string; name: string }[] = (() => {
  const map = new Map<string, string>();
  for (const i of PRACTICE_INTERVIEWS) {
    map.set(i.companySlug, i.companyName);
  }
  return [...map.entries()]
    .map(([slug, name]) => ({ slug, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
})();

export function getPracticeInterviewById(id: string): PracticeInterview | undefined {
  return PRACTICE_INTERVIEWS.find((i) => i.id === id);
}

const INTERVIEW_TYPE_SHORT: Record<InterviewType, string> = {
  BEHAVIOURAL: "behavioural",
  PRODUCT_SENSE: "product sense",
  TECHNICAL: "technical",
};

const OPENING_PROMPTS: Record<InterviewType, (i: PracticeInterview) => string> = {
  BEHAVIOURAL: () =>
    "Tell me about a time you had to learn something quickly to deliver on a commitment. What was the situation, what did you do, and what was the outcome?",
  PRODUCT_SENSE: (i) =>
    `Imagine you're improving a flagship ${i.companyName} product for a specific user segment. Which segment would you pick first, and what problem would you solve? Walk me through your reasoning.`,
  TECHNICAL: () =>
    "Let's work through a problem together. I'll describe a scenario—ask clarifying questions, then outline your approach before we go deeper. Ready? Here's the setup: design a system that ingests job-application emails and surfaces structured updates to users. What questions do you have?",
};

/** Client-safe opening line for mock interview UI (no OpenAI import). */
export function openingInterviewerMessage(interview: PracticeInterview): string {
  return `Thanks for joining this mock ${INTERVIEW_TYPE_SHORT[interview.interviewType]} session for ${interview.companyName} (${interview.roleType}). I'll keep this to about ${interview.durationMinutes} minutes.

To start: ${OPENING_PROMPTS[interview.interviewType](interview)}`;
}

export const COMPANY_BRAND_COLORS: Record<string, string> = {
  microsoft: "from-blue-600 to-sky-500",
  google: "from-red-500 via-yellow-400 to-green-500",
  amazon: "from-amber-500 to-orange-600",
  meta: "from-blue-600 to-indigo-600",
  apple: "from-slate-700 to-slate-900",
  stripe: "from-violet-600 to-indigo-600",
  netflix: "from-red-600 to-red-800",
};
