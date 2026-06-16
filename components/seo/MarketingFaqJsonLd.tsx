import { getSiteOrigin, SITE_NAME } from "@/lib/site";

const FAQ = [
  {
    q: "Is it actually free for students?",
    a: "Yes. Verify your student status once and everything is unlocked: unlimited tracking, Gmail syncs, mock interviews, mentor search, and member perks. No card required.",
  },
  {
    q: "What does Summer Internships do with my Gmail?",
    a: "We request read-only access and only look for job-related threads such as confirmations, assessments, interview invites, and offers. You can revoke access anytime from your Google account.",
  },
  {
    q: "How is this different from LinkedIn or Handshake?",
    a: "Internship listings come straight from company career pages, not crowded job boards. AI builds your application pipeline from your inbox instead of a spreadsheet.",
  },
  {
    q: "What internships are listed?",
    a: "Software engineering, product, design, data, marketing, and operations internships at US companies, synced daily from public Greenhouse and Lever career boards.",
  },
];

/** FAQ rich results for the marketing homepage. */
export function MarketingFaqJsonLd() {
  const origin = getSiteOrigin();
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: origin,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
