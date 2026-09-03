"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { loginUrl } from "@/lib/loginUrl";

/** Link to the dedicated login page (email + Google, no Gmail). */
export function LoginLink({
  className = "",
  label = "Get started",
  callbackUrl,
  href: hrefOverride,
  children,
}: {
  className?: string;
  label?: string;
  callbackUrl?: string;
  /** Full login URL (e.g. from loginUrl()). Overrides callbackUrl. */
  href?: string;
  children?: ReactNode;
}) {
  const pathname = usePathname();
  const href = hrefOverride ?? loginUrl(callbackUrl ?? pathname);

  return (
    <Link href={href} className={className}>
      {children ?? label}
    </Link>
  );
}
