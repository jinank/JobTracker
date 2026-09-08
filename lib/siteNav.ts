import { PRODUCT_NAV_LINKS } from "@/lib/productFeatures";

export type NavLinkItem = {
  href: string;
  label: string;
  /** In-page anchor on the home page (e.g. #features). */
  anchor?: boolean;
};

/** Primary portal navigation — four product areas. */
export { PRODUCT_NAV_LINKS };

const HEADER_NAV_LINKS = PRODUCT_NAV_LINKS.filter(
  (item) => item.href !== "/find-mentors"
);

export const APP_NAV_LINKS: NavLinkItem[] = HEADER_NAV_LINKS;

export const MARKETING_NAV_LINKS: NavLinkItem[] = HEADER_NAV_LINKS;

export function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}
