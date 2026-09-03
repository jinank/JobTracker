import { PRICING_PLANS } from "@/lib/pricingPlans";
import { getSiteOrigin, SITE_NAME } from "@/lib/site";

function planPriceAmount(price: string): number {
  return Number.parseFloat(price.replace(/[^0-9.]+/g, ""));
}

export function RootJsonLd() {
  const origin = getSiteOrigin();
  const logoUrl = `${origin}/superinterns-icon.png`;
  const planPrices = PRICING_PLANS.map((plan) => planPriceAmount(plan.price));
  const lowPrice = Math.min(...planPrices);
  const highPrice = Math.max(...planPrices);

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
          "SuperInterns helps students find Summer 2027 internships, track applications from Gmail, and prepare for interviews.",
      },
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        name: SITE_NAME,
        url: origin,
        publisher: { "@id": `${origin}/#organization` },
        description:
          "Summer 2027 internship search, application tracking, and interview prep for students. Sync Gmail, browse company career pages, and manage your pipeline in one place.",
        inLanguage: "en-US",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${origin}/find-internships?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${origin}/#software`,
        name: `${SITE_NAME} internship platform`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        browserRequirements: "Requires JavaScript. Modern browser recommended.",
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: lowPrice.toFixed(2),
          highPrice: highPrice.toFixed(2),
          offerCount: String(PRICING_PLANS.length),
        },
        description:
          "SuperInterns helps people find USA internships, track applications from Gmail with read-only sync, practice interviews, and Auto Apply on supported listings.",
        url: origin,
        author: { "@id": `${origin}/#organization` },
        publisher: { "@id": `${origin}/#organization` },
        featureList: [
          "Daily-updated USA internship listings from company career pages",
          "Gmail read-only sync for job-related email",
          "AI classification of company, role, and application status",
          "Auto Apply on supported internship listings",
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
