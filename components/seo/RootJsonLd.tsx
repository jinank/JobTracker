import { getSiteOrigin, SITE_NAME } from "@/lib/site";

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
          "Summer Internships helps students find USA internships, track applications from Gmail, and prepare for interviews.",
      },
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        name: SITE_NAME,
        url: origin,
        publisher: { "@id": `${origin}/#organization` },
        description:
          "USA internship search, application tracking, and interview prep for students. Sync Gmail, browse company career pages, and manage your pipeline in one place.",
        inLanguage: "en-US",
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${origin}/#software`,
        name: `${SITE_NAME} internship platform`,
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
          "Summer Internships is a student hub for finding USA internships, tracking applications from Gmail with read-only sync, practicing interviews with AI, and unlocking member perks.",
        url: origin,
        author: { "@id": `${origin}/#organization` },
        publisher: { "@id": `${origin}/#organization` },
        featureList: [
          "Daily-updated USA internship listings from company career pages",
          "Gmail read-only sync for job-related email",
          "AI classification of company, role, and application status",
          "Pipeline dashboard, mock interviews, and member resources",
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
