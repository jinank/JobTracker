"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { LoginLink } from "@/components/LoginLink";

type NavAuthActionProps = {
  className?: string;
  /** Where to send the user after sign-in (logged-out only). */
  callbackUrl?: string;
  /** Label when logged out. */
  signInLabel?: string;
  /** Label when logged in. */
  signedInLabel?: string;
  /** Dashboard link when logged in (default Track Jobs). */
  dashboardHref?: string;
};

/** Header CTA: sign-in link when logged out, dashboard link when logged in. */
export function NavAuthAction({
  className = "",
  callbackUrl,
  signInLabel = "Get started free",
  signedInLabel = "Open dashboard",
  dashboardHref = "/",
}: NavAuthActionProps) {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <span
        className={`inline-flex h-10 w-[10.5rem] items-center justify-center rounded-full bg-slate-100 animate-pulse ${className}`}
        aria-hidden
      />
    );
  }

  if (status === "authenticated") {
    return (
      <Link href={dashboardHref} className={className}>
        {signedInLabel}
      </Link>
    );
  }

  return (
    <LoginLink callbackUrl={callbackUrl} label={signInLabel} className={className} />
  );
}
