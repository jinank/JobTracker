import { getSiteOrigin } from "@/lib/site";

const SITE_NAME = "RethinkJobs";

export function RootJsonLd() {
  const origin = getSiteOrigin();
  const logoUrl = `${origin}/icon.svg`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${origin}/#organization`,
        name: SITE_NAME,
        url: origin,
        logo: { "@type": "ImageObject", url: logoUrl },
        description:
          "RethinkJobs builds AI-powered tools to track job applications and internships from Gmail with read-only sync.",
      },
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        name: SITE_NAME,
        url: origin,
        publisher: { "@id": `${origin}/#organization` },
        description:
          "AI job application tracker and internship tracker for students and professionals—sync Gmail, organize your pipeline, and track job applications in one place.",
        inLanguage: "en-US",
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${origin}/#software`,
        name: `${SITE_NAME} — Job application tracker`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        browserRequirements: "Requires JavaScript. Modern browser recommended.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          description: "Free tier available; student and paid plans offered.",
        },
        description:
          "RethinkJobs is an AI job search tool that helps you track job applications automatically. Connect Gmail (read-only), classify recruiter email with AI, and manage your internship and full-time pipeline from one dashboard.",
        url: origin,
        author: { "@id": `${origin}/#organization` },
        publisher: { "@id": `${origin}/#organization` },
        featureList: [
          "Gmail read-only sync for job-related email",
          "AI classification of company, role, and application status",
          "Pipeline dashboard and filters",
          "Timeline and deadline tracking",
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
