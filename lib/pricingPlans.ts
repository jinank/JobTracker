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

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    cadence: "forever",
    note: "Perfect for getting started",
    features: [
      "Track up to 50 applications",
      "AI email classification",
      "Pipeline dashboard with filters",
      "All five tools included",
    ],
    cta: "Get started free",
  },
  {
    id: "student",
    name: "Student",
    price: "Free",
    cadence: "with verification",
    note: "Verify once with your school",
    features: [
      "Unlimited applications & syncs",
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
    name: "Professional",
    price: "$9.99",
    cadence: "/month",
    note: "For everyone out of school",
    features: [
      "Unlimited applications & syncs",
      "Full pipeline & timeline",
      "Priority support",
      "Cancel anytime via Stripe",
    ],
    cta: "Start Pro",
    href: "/pricing",
  },
  {
    id: "premium",
    name: "Premium",
    price: "$49",
    cadence: "one-time",
    note: "We apply for you + launch your site",
    features: [
      "100 internship applications on your behalf",
      "Free portfolio website",
      "Unlimited application tracking",
      "Unlimited Gmail syncs & AI classification",
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
