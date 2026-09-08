export type MarketingFaqItem = {
  q: string;
  a: string;
};

/** Visible homepage FAQ — also the source for FAQPage JSON-LD. */
export const MARKETING_FAQ_ITEMS: MarketingFaqItem[] = [
  {
    q: "What does SuperInterns do with my Gmail?",
    a: "We request minimal, read-only access and only look for job-related threads, confirmations, assessments, interview invites, offers. You can revoke access anytime from your Google account, and Gmail is optional to start.",
  },
  {
    q: "How is this different from LinkedIn or Handshake?",
    a: "Internship listings come straight from company career pages, not crowded job boards. And instead of you maintaining a spreadsheet, AI builds your pipeline from your own inbox.",
  },
  {
    q: "What if the AI gets a status wrong?",
    a: "Click and fix it. You can edit any application's company, role, or stage whenever the AI misreads something.",
  },
  {
    q: "What is Auto Apply?",
    a: "Save your resume and apply profile, then click Apply on a listing. Auto Apply submits on the company career page for supported systems. Pro and Premium include 100 Auto Apply applications. If a listing is not supported, we open the company site instead.",
  },
  {
    q: "I'm not a student. Can I use it?",
    a: "Starter Plan is $4.99/month with the core toolkit. Pro Plan is $9.99/month for unlimited tracking and 100 Auto Apply applications. Premium is $49 lifetime with the same 100 Auto Apply applications plus a free portfolio website.",
  },
];
