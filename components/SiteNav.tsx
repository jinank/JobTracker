"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { LogoMark } from "@/components/LogoMark";
import { NavAuthAction } from "@/components/NavAuthAction";
import {
  APP_NAV_LINKS,
  MARKETING_NAV_LINKS,
  isNavLinkActive,
  type NavLinkItem,
} from "@/lib/siteNav";

/** Shared sticky header height (app + marketing). */
const HEADER_BAR_CLASS = "h-16 sm:h-[4.5rem]";

function NavPill({
  links,
  pathname,
  onLinkClick,
  className = "",
  nowrap = false,
}: {
  links: NavLinkItem[];
  pathname: string;
  onLinkClick?: () => void;
  className?: string;
  nowrap?: boolean;
}) {
  return (
    <nav
      className={`inline-flex items-center justify-center gap-0.5 rounded-full bg-slate-100/90 p-0.5 ring-1 ring-slate-200/70 shadow-sm sm:p-1 ${
        nowrap ? "flex-nowrap" : "flex-wrap"
      } ${className}`}
      aria-label="Main"
    >
      {links.map((item) => {
        const active = isNavLinkActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}
            className={`whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs font-medium transition-all sm:px-3 sm:py-2 sm:text-sm ${
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

function AppLogoBlock({ activeCount }: { activeCount?: number }) {
  return (
    <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3">
      <LogoMark />
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-slate-900 sm:text-base">RethinkJobs</p>
        {activeCount != null ? (
          <p className="truncate text-[11px] text-slate-500 sm:text-xs">
            {activeCount} active application{activeCount !== 1 ? "s" : ""}
          </p>
        ) : (
          <p className="hidden text-[11px] text-slate-500 sm:block sm:text-xs sm:opacity-0" aria-hidden>
            &nbsp;
          </p>
        )}
      </div>
    </Link>
  );
}

/** Marketing site header — landing, resources, practice interviews, blog, etc. */
export function SiteNavMarketing() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 ${HEADER_BAR_CLASS}`}
      >
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2"
          aria-label="RethinkJobs home"
          onClick={closeMenu}
        >
          <LogoMark />
          <span className="hidden text-lg font-bold tracking-tight text-slate-900 sm:inline">
            RethinkJobs
          </span>
        </Link>

        <div className="hidden min-w-0 flex-1 justify-center px-2 lg:flex">
          <NavPill links={MARKETING_NAV_LINKS} pathname={pathname} nowrap />
        </div>

        <div className="hidden w-[10.5rem] shrink-0 justify-end lg:flex">
          <NavAuthAction
            callbackUrl={pathname}
            className="rounded-full bg-scale-purple px-5 py-2.5 text-sm font-semibold text-white shadow-scale-soft transition-all hover:bg-scale-purple-dark hover:shadow-lg active:scale-[0.98]"
          />
        </div>

        <div className="flex shrink-0 items-center lg:hidden">
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
            className="w-full flex-col !gap-1 !rounded-2xl !p-2"
          />
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
            <NavAuthAction
              callbackUrl={pathname}
              className="w-full rounded-xl bg-scale-purple py-3 text-center text-sm font-semibold text-white"
            />
          </div>
        </div>
      )}
    </header>
  );
}

/** Logged-in app header — fixed bar height + reserved action column. */
export function SiteNavApp({
  activeCount,
  children,
}: {
  activeCount: number;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      {/* Desktop */}
      <div
        className={`mx-auto hidden max-w-7xl grid-cols-[11.5rem_minmax(0,1fr)_21.5rem] items-center gap-x-4 px-4 sm:px-6 xl:grid ${HEADER_BAR_CLASS}`}
      >
        <AppLogoBlock activeCount={activeCount} />

        <div className="flex min-w-0 justify-center">
          <NavPill links={APP_NAV_LINKS} pathname={pathname} nowrap />
        </div>

        <div className="flex w-full items-center justify-end">{children}</div>
      </div>

      {/* Mobile / tablet */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 xl:hidden">
        <div className={`flex items-center justify-between gap-3 ${HEADER_BAR_CLASS}`}>
          <AppLogoBlock activeCount={activeCount} />
          <div className="flex shrink-0 items-center justify-end">{children}</div>
        </div>
        <div className="flex justify-center border-t border-slate-100 px-1 py-2">
          <NavPill links={APP_NAV_LINKS} pathname={pathname} nowrap className="max-w-full overflow-x-auto" />
        </div>
      </div>
    </header>
  );
}
