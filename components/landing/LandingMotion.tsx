"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** Milliseconds before animation starts after entering viewport. */
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale";
  duration?: number;
};

const HIDDEN: Record<NonNullable<ScrollRevealProps["direction"]>, string> = {
  up: "translate-y-10 opacity-0",
  down: "-translate-y-10 opacity-0",
  left: "-translate-x-10 opacity-0",
  right: "translate-x-10 opacity-0",
  scale: "scale-[0.96] opacity-0",
};

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 700,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      setVisible(true);
      return;
    }

    const reveal = () => setVisible(true);
    const fallback = window.setTimeout(reveal, 800);

    if (typeof IntersectionObserver === "undefined") {
      reveal();
      return () => clearTimeout(fallback);
    }

    const ob = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          ob.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    ob.observe(el);
    return () => {
      clearTimeout(fallback);
      ob.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`will-change-transform motion-reduce:translate-none motion-reduce:scale-100 motion-reduce:opacity-100 ${
        visible
          ? "translate-x-0 translate-y-0 scale-100 opacity-100"
          : HIDDEN[direction]
      } ${className}`}
      style={
        {
          transitionProperty: "transform, opacity",
          transitionDuration: `${duration}ms`,
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          transitionDelay: visible ? `${delay}ms` : "0ms",
        } satisfies CSSProperties
      }
    >
      {children}
    </div>
  );
}

/** Ambient orbs and light beams behind the hero. */
export function HeroVisuals() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="landing-orb landing-float absolute -left-16 top-16 h-72 w-72 rounded-full bg-violet-400/30 blur-3xl sm:-left-24 sm:h-96 sm:w-96" />
      <div className="landing-orb landing-float-slow absolute -right-12 top-24 h-64 w-64 rounded-full bg-amber-300/25 blur-3xl sm:-right-20 sm:h-80 sm:w-80" />
      <div className="landing-orb landing-float-delay absolute bottom-8 left-1/4 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />
      <div className="landing-hero-beam absolute left-1/2 top-0 h-[min(520px,70vh)] w-px -translate-x-1/2 bg-gradient-to-b from-scale-purple/25 via-violet-400/10 to-transparent" />
      <div className="landing-hero-beam landing-float-delay absolute left-[18%] top-0 h-[min(360px,50vh)] w-px bg-gradient-to-b from-emerald-400/15 to-transparent opacity-60" />
      <div className="landing-hero-beam landing-float-slow absolute right-[22%] top-0 h-[min(400px,55vh)] w-px bg-gradient-to-b from-rose-400/15 to-transparent opacity-50" />
    </div>
  );
}

/** Thin progress bar fixed to the top of the viewport while scrolling. */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? (doc.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent"
      aria-hidden
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-scale-purple via-violet-500 to-indigo-400 transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export function useScrollParallax<T extends HTMLElement>(
  speed = 0.1
): RefObject<T> {
  const ref = useRef<T>(null!);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let raf = 0;
    const update = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      if (rect.bottom < -100 || rect.top > viewH + 100) return;
      const progress = (viewH - rect.top) / (viewH + rect.height);
      const y = (progress - 0.5) * 60 * speed;
      el.style.transform = `translate3d(0, ${y}px, 0)`;
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      if (el) el.style.transform = "";
    };
  }, [speed]);

  return ref;
}
