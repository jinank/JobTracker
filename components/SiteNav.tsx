"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { LogoMark } from "@/components/LogoMark";
import {
  APP_NAV_LINKS,
  MARKETING_NAV_LINKS,
  isNavLinkActive,
  type NavLinkItem,
} from "@/lib/siteNav";

function NavPill({
  links,
  pathname,
  onLinkClick,
  className = "",
}: {
  links: NavLinkItem[];
  pathname: string;
  onLinkClick?: () => void;
  className?: string;
}) {
  return (
    <nav
      className={`inline-flex flex-wrap items-center justify-center gap-0.5 rounded-full bg-slate-100/90 p-1 ring-1 ring-slate-200/70 shadow-sm ${className}`}
      aria-label="Main"
    >
      {links.map((item) => {
        const active = isNavLinkActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}
            className={`rounded-full px-3 py-2 text-sm font-medium transition-all whitespace-nowrap ${
              active
                ? "bg-white text-scale-purple shadow-sm ring-1 ring-slate-200/80"
                : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
            }`}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Marketing site header — landing, resources, practice interviews, blog, etc. */
export function SiteNavMarketing({
  onSignIn,
}: {
  onSignIn?: () => void;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2"
          aria-label="RethinkJobs home"
          onClick={closeMenu}
        >
          <LogoMark />
          <span className="text-lg font-bold tracking-tight text-slate-900 hidden sm:inline">
            RethinkJobs
          </span>
        </Link>

        <div className="hidden lg:flex flex-1 justify-center px-4">
          <NavPill links={MARKETING_NAV_LINKS} pathname={pathname} />
        </div>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {onSignIn ? (
            <button
              type="button"
              onClick={onSignIn}
              className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-scale-purple/40 hover:bg-scale-mist hover:text-scale-purple"
            >
              Track Jobs
            </button>
          ) : (
            <Link
              href="/"
              className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-scale-purple/40 hover:bg-scale-mist hover:text-scale-purple"
            >
              Track Jobs
            </Link>
          )}
          {onSignIn ? (
            <button
              type="button"
              onClick={onSignIn}
              className="rounded-full bg-scale-purple px-5 py-2.5 text-sm font-semibold text-white shadow-scale-soft transition-all hover:bg-scale-purple-dark hover:shadow-lg active:scale-[0.98]"
            >
              Get started free
            </button>
          ) : (
            <Link
              href="/"
              className="rounded-full bg-scale-purple px-5 py-2.5 text-sm font-semibold text-white shadow-scale-soft transition-all hover:bg-scale-purple-dark"
            >
              Get started free
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden shrink-0">
          {onSignIn && (
            <button
              type="button"
              onClick={onSignIn}
              className="rounded-full bg-scale-purple px-3 py-2 text-xs font-semibold text-white"
            >
              Track Jobs
            </button>
          )}
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm hover:bg-slate-50"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden animate-fade-in">
          <NavPill
            links={MARKETING_NAV_LINKS}
            pathname={pathname}
            onLinkClick={closeMenu}
            className="w-full flex-col !rounded-2xl !p-2 !gap-1"
          />
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
            {onSignIn ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    onSignIn();
                  }}
                  className="w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-800"
                >
                  Track Jobs
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    onSignIn();
                  }}
                  className="w-full rounded-xl bg-scale-purple py-3 text-sm font-semibold text-white"
                >
                  Get started free
                </button>
              </>
            ) : (
              <Link
                href="/"
                onClick={closeMenu}
                className="w-full rounded-xl bg-scale-purple py-3 text-center text-sm font-semibold text-white"
              >
                Track Jobs
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

/** Logged-in app header shell with nav pill + action slot. */
export function SiteNavApp({
  activeCount,
  children,
}: {
  activeCount: number;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center justify-between gap-3 min-w-0">
            <Link href="/" className="flex items-center gap-3 min-w-0 shrink-0">
              <LogoMark />
              <div className="min-w-0">
                <p className="text-base font-bold text-slate-900 truncate">RethinkJobs</p>
                <p className="text-xs text-slate-500">
                  {activeCount} active application{activeCount !== 1 ? "s" : ""}
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-2 xl:hidden shrink-0">{children}</div>
          </div>

          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-center xl:justify-center">
            <NavPill links={APP_NAV_LINKS} pathname={pathname} className="w-full sm:w-auto" />
          </div>

          <div className="hidden xl:flex items-center gap-2 sm:gap-3 shrink-0 justify-end">
            {children}
          </div>
        </div>
      </div>
    </header>
  );
}
