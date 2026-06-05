"use client";

import { signOut } from "next-auth/react";

/** Email + sign out — shared across app headers. */
export function AppNavAccountMenu({ email }: { email?: string | null }) {
  return (
    <div className="flex items-center gap-2 border-l border-slate-200 pl-2">
      {email ? (
        <span className="hidden max-w-[8.75rem] truncate text-xs text-slate-500 md:inline">
          {email}
        </span>
      ) : (
        <span className="hidden h-4 w-20 md:inline" aria-hidden />
      )}
      <button
        type="button"
        onClick={() => signOut()}
        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
        title="Sign out"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
          />
        </svg>
      </button>
    </div>
  );
}
