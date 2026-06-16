import { PRODUCT_NAV_LINKS } from "@/lib/productFeatures";

export type NavLinkItem = {
  href: string;
  label: string;
  /** In-page anchor on the home page (e.g. #features). */
  anchor?: boolean;
};

/** Primary portal navigation — four product areas. */
export { PRODUCT_NAV_LINKS };

export const APP_NAV_LINKS: NavLinkItem[] = PRODUCT_NAV_LINKS;

export const MARKETING_NAV_LINKS: NavLinkItem[] = [
  ...PRODUCT_NAV_LINKS,
  { href: "/blog", label: "Blog" },
];

export function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}
