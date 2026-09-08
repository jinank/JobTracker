"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { AppHeaderActions } from "@/components/AppHeaderActions";
import { LoginLink } from "@/components/LoginLink";
import { SiteNavApp, SiteNavMarketing } from "@/components/SiteNav";
import { useChains } from "@/hooks/useChains";
import { countUniqueApplications } from "@/lib/uniqueApplications";

interface MentorContact {
  id: string;
  firstName: string;
  lastName: string;
  title: string | null;
  organizationName: string;
  linkedinUrl?: string;
}

const SUGGESTED_COMPANIES = ["Google", "Stripe", "Figma", "Shopify", "Airbnb", "Notion"];

function contactInitials(p: MentorContact): string {
  const a = (p.firstName || "").trim();
  const b = (p.lastName || "").trim();
  return ((a[0] ?? "?") + (b[0] ?? "")).toUpperCase();
}

function MentorCard({ person }: { person: MentorContact }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-scale-purple text-sm font-bold text-white"
            aria-hidden
          >
            {contactInitials(person)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">
              {person.firstName} {person.lastName}
            </p>
            {person.title ? (
              <p className="mt-0.5 text-xs text-slate-600">{person.title}</p>
            ) : (
              <p className="mt-0.5 text-xs text-slate-400">Role not listed</p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 sm:items-center sm:justify-end">
          {person.linkedinUrl ? (
            <a
              href={person.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0A66C2] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#004182] sm:w-auto sm:py-2"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Connect on LinkedIn
            </a>
          ) : (
            <span className="text-xs text-slate-400">No LinkedIn listed</span>
          )}
        </div>
      </div>
    </div>
  );
}

function MentorsSearch() {
  const searchParams = useSearchParams();
  const initialCompany = searchParams.get("company") ?? "";

  const [companyInput, setCompanyInput] = useState(initialCompany);
  const [searchedCompany, setSearchedCompany] = useState(initialCompany);
  const [people, setPeople] = useState<MentorContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [domain, setDomain] = useState<string | null>(null);

  const runSearch = useCallback((company: string) => {
    const trimmed = company.trim();
    if (!trimmed) return;
    setSearchedCompany(trimmed);
    setLoading(true);
    setError(null);
    setInfo(null);

    fetch(`/api/recruiters?company=${encodeURIComponent(trimmed)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setPeople([]);
          return;
        }
        const found: MentorContact[] = data.people ?? [];
        setPeople(found);
        setDomain(data.domain ?? null);
        if (found.length === 0 && data.message) {
          setError(data.message);
        } else {
          setInfo(found.length > 0 && data.message ? data.message : null);
        }
      })
      .catch(() => {
        setError("Failed to load contacts. Please try again.");
        setPeople([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (initialCompany) runSearch(initialCompany);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    runSearch(companyInput);
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-semibold text-rose-600">Find Mentors</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Meet the people who can open doors
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Search any company to find recruiters, campus hiring teams, and people-team
          contacts, then reach out on LinkedIn for advice, referrals, or a coffee chat.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="search"
            value={companyInput}
            onChange={(e) => setCompanyInput(e.target.value)}
            placeholder="Search a company, e.g. Google"
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/20"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !companyInput.trim()}
          className="rounded-2xl bg-scale-purple px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-scale-purple-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Searching…" : "Find people"}
        </button>
      </form>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400">Try:</span>
        {SUGGESTED_COMPANIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              setCompanyInput(c);
              runSearch(c);
            }}
            className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200 transition hover:bg-rose-50 hover:text-rose-700 hover:ring-rose-200"
          >
            {c}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-900">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-scale-purple border-t-transparent" />
        </div>
      ) : people.length > 0 ? (
        <>
          <div className="mb-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">
              {people.length} contact{people.length !== 1 ? "s" : ""} at {searchedCompany}
              {domain && <span className="font-normal text-slate-500"> ({domain})</span>}
            </p>
            {info && <p className="mt-2 text-sm leading-relaxed text-slate-600">{info}</p>}
          </div>
          <ul className="space-y-3" aria-label="Mentor and hiring contacts">
            {people.map((p) => (
              <li key={p.id}>
                <MentorCard person={p} />
              </li>
            ))}
          </ul>
          <p className="mt-6 rounded-2xl bg-scale-mist px-4 py-3 text-xs leading-relaxed text-slate-600">
            <span className="font-semibold text-slate-800">Tip:</span> a short, specific
            message works best, mention your school, what you&apos;re studying, and one
            thing you admire about their team. Ask for advice before asking for a referral.
          </p>
        </>
      ) : searchedCompany && !error ? (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50">
            <svg className="h-8 w-8 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          </div>
          <h3 className="mb-1 text-lg font-semibold text-slate-800">No contacts found</h3>
          <p className="mx-auto max-w-sm text-sm text-slate-500">
            We couldn&apos;t find hiring contacts at {searchedCompany}. Try another company
            or double-check the spelling.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function SignedInMentors({ email }: { email?: string | null }) {
  const { chains } = useChains();
  const activeCount = countUniqueApplications(
    chains.filter((c) => !["REJECTED", "GHOSTED", "WITHDRAWN"].includes(c.status))
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteNavApp activeCount={activeCount}>
        <AppHeaderActions email={email} />
      </SiteNavApp>
      <main className="flex-1">
        <MentorsSearch />
      </main>
    </div>
  );
}

export function FindMentorsApp() {
  const { data: session, status } = useSession();

  if (status === "loading" && !session) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <SiteNavMarketing />
        <main className="flex-1">
          <section className="landing-hero-mesh">
            <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:py-28">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-rose-600 shadow-sm">
                <span className="flex h-1.5 w-1.5 rounded-full bg-rose-500" aria-hidden />
                Free for students
              </p>
              <h1 className="text-[2rem] font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
                Find <span className="text-hero-gradient">mentors</span> for your
                Summer 2027 internship search
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Search any company and we&apos;ll surface recruiters, campus hiring teams,
                and people-team contacts you can message on LinkedIn.
              </p>
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <SiteNavMarketing />
        <main className="flex-1">
          <section className="landing-hero-mesh">
            <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:py-28">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-rose-600 shadow-sm">
                <span className="flex h-1.5 w-1.5 rounded-full bg-rose-500" aria-hidden />
                Free for students
              </p>
              <h1 className="text-[2rem] font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
                Find <span className="text-hero-gradient">mentors</span> for your
                Summer 2027 internship search
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Search any company and we&apos;ll surface recruiters, campus hiring teams,
                and people-team contacts you can message on LinkedIn, for advice,
                referrals, or a quick coffee chat.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <LoginLink
                  callbackUrl="/find-mentors"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-scale-purple px-8 py-4 text-sm font-semibold text-white shadow-scale-soft transition-all hover:bg-scale-purple-dark active:scale-[0.98] sm:w-auto"
                  label="Sign in to find mentors"
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return <SignedInMentors email={session.user?.email} />;
}
