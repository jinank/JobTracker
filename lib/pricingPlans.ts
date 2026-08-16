export type PricingPlan = {
  id: string;
  name: string;
  price: string;
  cadence: string;
  note: string;
  features: string[];
  cta: string;
  highlight?: boolean;
  badge?: string;
  /** When set, CTA is a link instead of sign-in. */
  href?: string;
};

const SHARED_FEATURES = [
  "AI email classification",
  "Pipeline dashboard with filters",
  "All five tools included",
] as const;

const UNLIMITED_TRACKING = "Unlimited applications & syncs";

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter Plan",
    price: "$4.99",
    cadence: "/month",
    note: "Everything you need to start your internship search",
    features: [
      "Track up to 50 applications",
      ...SHARED_FEATURES,
      UNLIMITED_TRACKING,
      "AI mock interviews",
      "Mentor & recruiter search",
      "All student deals & resources",
    ],
    cta: "Get Starter",
    badge: "Best value",
    href: "/pricing",
  },
  {
    id: "professional",
    name: "Pro Plan",
    price: "$9.99",
    cadence: "/month",
    note: "For everyone in/out of school",
    features: [
      UNLIMITED_TRACKING,
      ...SHARED_FEATURES,
      "Auto Apply from the internship board",
      "100 Auto Apply applications",
      "Full pipeline & timeline",
      "Priority support",
      "Cancel anytime",
      "100% refund guaranteed if you don't like it",
    ],
    cta: "Start Pro",
    highlight: true,
    badge: "Most Popular",
    href: "/pricing",
  },
  {
    id: "premium",
    name: "Premium",
    price: "$49",
    cadence: "lifetime",
    note: "100 Auto Apply applications + portfolio website",
    features: [
      UNLIMITED_TRACKING,
      ...SHARED_FEATURES,
      "Auto Apply from the internship board",
      "100 Auto Apply applications",
      "Free portfolio website",
      "AI mock interviews & mentor search",
      "Priority support",
    ],
    cta: "Get Premium",
    badge: "Done-for-you",
    href: "/contact-us?plan=premium",
  },
];

export function getPricingPlan(id: string): PricingPlan | undefined {
  return PRICING_PLANS.find((p) => p.id === id);
}
