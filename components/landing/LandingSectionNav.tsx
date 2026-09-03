"use client";

import { useCallback, useEffect, useState } from "react";

/** Fallback when sticky bars cannot be measured. */
export const LANDING_SCROLL_OFFSET = 120;

function getLandingScrollOffset(): number {
  if (typeof document === "undefined") return LANDING_SCROLL_OFFSET;
  const header = document.querySelector("header")?.getBoundingClientRect().height ?? 64;
  const sectionNav = document
    .querySelector('[aria-label="On this page"]')
    ?.getBoundingClientRect().height;
  return header + (sectionNav ?? 0) + 8;
}

export const LANDING_SECTIONS = [
  { id: "about", label: "About" },
  { id: "features", label: "Features" },
  { id: "how-it-works", label: "How it works" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
] as const;

export function smoothScrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = el.getBoundingClientRect().top + window.scrollY - getLandingScrollOffset();

  window.scrollTo({ top: Math.max(0, top), behavior: reduced ? "auto" : "smooth" });

  if (history.replaceState) {
    history.replaceState(null, "", `#${id}`);
  } else {
    window.location.hash = id;
  }
}

export function LandingSectionNav() {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && document.getElementById(hash)) {
      window.requestAnimationFrame(() => smoothScrollToSection(hash));
    }
  }, []);

  useEffect(() => {
    const sectionEls = LANDING_SECTIONS.map(({ id }) => document.getElementById(id)).filter(
      Boolean
    ) as HTMLElement[];

    if (!sectionEls.length) return;

    const offset = getLandingScrollOffset();

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: `-${offset}px 0px -55% 0px`,
        threshold: [0, 0.15, 0.35, 0.55],
      }
    );

    sectionEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const onSectionClick = useCallback((id: string) => {
    smoothScrollToSection(id);
  }, []);

  return (
    <nav
      className="sticky top-16 z-40 border-b border-slate-200/60 bg-white/90 backdrop-blur-md sm:top-[4.5rem]"
      aria-label="On this page"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2.5 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {LANDING_SECTIONS.map(({ id, label }) => {
          const active = activeId === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSectionClick(id)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all sm:text-sm ${
                active
                  ? "bg-scale-purple text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
              aria-current={active ? "true" : undefined}
            >
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
