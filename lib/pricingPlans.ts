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
    id: "student",
    name: "Student",
    price: "Free",
    cadence: "with verification",
    note: "Verify once with your school",
    features: [
      "Track up to 50 applications",
      ...SHARED_FEATURES,
      UNLIMITED_TRACKING,
      "AI mock interviews",
      "Mentor & recruiter search",
      "All student deals & resources",
    ],
    cta: "Verify & unlock everything",
    highlight: true,
    badge: "For students",
    href: "/verify-student",
  },
  {
    id: "professional",
    name: "Pro Plan",
    price: "$9.99",
    cadence: "/month",
    note: "For everyone out of school",
    features: [
      UNLIMITED_TRACKING,
      ...SHARED_FEATURES,
      "Full pipeline & timeline",
      "Priority support",
      "Cancel anytime via Stripe",
    ],
    cta: "Start Pro",
    badge: "Most Popular",
    href: "/pricing",
  },
  {
    id: "premium",
    name: "Premium",
    price: "$49",
    cadence: "lifetime",
    note: "100 applications on your behalf + portfolio website",
    features: [
      UNLIMITED_TRACKING,
      ...SHARED_FEATURES,
      "100 internship applications on your behalf",
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
