export type NavLinkItem = {
  href: string;
  label: string;
  /** In-page anchor on the home page (e.g. #features). */
  anchor?: boolean;
};

export const APP_NAV_LINKS: NavLinkItem[] = [
  { href: "/", label: "Track Jobs" },
  { href: "/practice-interviews", label: "Practice Interviews" },
  { href: "/resources", label: "Resources" },
];

export const MARKETING_NAV_LINKS: NavLinkItem[] = [
  { href: "/#features", label: "Features", anchor: true },
  { href: "/#how-it-works", label: "How it works", anchor: true },
  { href: "/pricing", label: "Pricing" },
  { href: "/resources", label: "Resources" },
  { href: "/practice-interviews", label: "Practice Interviews" },
  { href: "/blog", label: "Blog" },
  { href: "/#faq", label: "FAQ", anchor: true },
];

export function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}
