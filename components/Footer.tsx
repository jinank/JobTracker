import type { ReactNode } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";
import { PRODUCT_FEATURES } from "@/lib/productFeatures";
import {
  getFooterFeaturedStatePages,
  INTERNSHIP_LOCATION_INDEX_PATH,
} from "@/lib/internshipLocationPages";
import { SITE_NAME } from "@/lib/site";

const COMPANY_LINKS = [
  { href: "/blog", label: "Blog" },
  { href: "/contact-us", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
] as const;

const FOOTER_TAGLINE =
  "Find US internships from company career pages, track every application, and prep for interviews, free for students.";

const footerLinkClass =
  "inline-flex min-h-11 items-center text-sm text-slate-600 transition-colors hover:text-scale-purple sm:min-h-0";

function FooterColumn({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={footerLinkClass}>
      {children}
    </Link>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 bg-slate-50 text-slate-500 transition-all hover:border-scale-purple/30 hover:bg-scale-lavender hover:text-scale-purple"
    >
      {children}
    </a>
  );
}

function stateShortLabel(title: string): string {
  return title.replace(/ Summer 2027 Internships$/, "");
}

export function Footer() {
  const year = new Date().getFullYear();
  const featuredStates = getFooterFeaturedStatePages();

  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white">
      <div
        className="h-1 bg-gradient-to-r from-scale-purple via-violet-500 to-scale-purple-deep"
        aria-hidden
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-10">
          <div className="sm:col-span-2 lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 rounded-lg transition-opacity hover:opacity-90"
              aria-label={`${SITE_NAME} home`}
            >
              <LogoMark />
              <span className="text-base font-bold tracking-tight text-slate-900">
                {SITE_NAME}
              </span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600">
              {FOOTER_TAGLINE}
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              <SocialIcon href="https://twitter.com" label={`${SITE_NAME} on X`}>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://www.linkedin.com" label={`${SITE_NAME} on LinkedIn`}>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://github.com" label={`${SITE_NAME} on GitHub`}>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.202 2.398.1 2.651.64.699 1.028 1.59 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                  />
                </svg>
              </SocialIcon>
            </div>
          </div>

          <FooterColumn title="Product" className="lg:col-span-2">
            <ul className="space-y-1">
              {PRODUCT_FEATURES.map((feature) => (
                <li key={feature.id}>
                  <FooterLink href={feature.href}>{feature.label}</FooterLink>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Company" className="lg:col-span-2">
            <ul className="space-y-1">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Browse by location" className="lg:col-span-2">
            <ul className="space-y-1">
              {featuredStates.map((page) => (
                <li key={page.slug}>
                  <FooterLink href={page.path}>{stateShortLabel(page.title)}</FooterLink>
                </li>
              ))}
              <li>
                <FooterLink href={INTERNSHIP_LOCATION_INDEX_PATH}>
                  See all Statewise Internships
                </FooterLink>
              </li>
            </ul>
          </FooterColumn>

          <FooterColumn title="Get started" className="lg:col-span-2">
            <p className="text-sm leading-relaxed text-slate-600">
              Browse fresh internships and set up your tracker in under a minute.
            </p>
            <Link
              href="/find-internships"
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-scale-purple px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-scale-purple-dark active:scale-[0.98] sm:min-h-0"
            >
              Find internships
            </Link>
          </FooterColumn>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-slate-200/80 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            © {year} {SITE_NAME}. All rights reserved.
          </p>
          <p className="text-xs font-medium text-slate-400">
            Free for students · Synced daily from company career pages
          </p>
        </div>
      </div>
    </footer>
  );
}
